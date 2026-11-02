import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

// HTML entity sanitization to prevent Email HTML Injection / XSS
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// In-memory rate limiting cache (IP / email -> timestamp)
const rateLimitMap = new Map<string, { count: number; firstAttempt: number; lastSubmission: number }>();

// Periodic pruning to prevent unbounded memory growth
function pruneRateLimitMap() {
  const now = Date.now();
  if (rateLimitMap.size > 200) {
    rateLimitMap.forEach((rec, k) => {
      if (now - rec.lastSubmission > 300000) {
        rateLimitMap.delete(k);
      }
    });
  }
}

function isRateLimited(key: string): { limited: boolean; message?: string } {
  pruneRateLimitMap();
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record) {
    rateLimitMap.set(key, { count: 1, firstAttempt: now, lastSubmission: now });
    return { limited: false };
  }

  // Prevent duplicate submissions within 15 seconds
  if (now - record.lastSubmission < 15000) {
    return {
      limited: true,
      message: "Please wait a moment before sending another message.",
    };
  }

  // Window: 1 minute max 4 attempts
  if (now - record.firstAttempt < 60000) {
    if (record.count >= 4) {
      return {
        limited: true,
        message: "Too many messages sent. Please wait 1 minute before trying again.",
      };
    }
    record.count += 1;
    record.lastSubmission = now;
    return { limited: false };
  }

  // Reset window after 1 minute
  rateLimitMap.set(key, { count: 1, firstAttempt: now, lastSubmission: now });
  return { limited: false };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message, hp_website } = body;

    // 1. Basic Spam Honeypot Check: bots auto-fill hidden fields
    if (hp_website && typeof hp_website === "string" && hp_website.trim().length > 0) {
      // Silently return success to bot without sending email
      return NextResponse.json({
        success: true,
        message: "Message sent successfully! I'll get back to you soon.",
      });
    }

    // 2. Server-side validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter your name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { success: false, error: "Name must not exceed 100 characters." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (email.trim().length > 150) {
      return NextResponse.json(
        { success: false, error: "Email must not exceed 150 characters." },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string" || subject.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide a subject for your message." },
        { status: 400 }
      );
    }

    if (subject.trim().length > 200) {
      return NextResponse.json(
        { success: false, error: "Subject must not exceed 200 characters." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Please write a message (minimum 5 characters)." },
        { status: 400 }
      );
    }

    if (message.trim().length > 5000) {
      return NextResponse.json(
        { success: false, error: "Message must not exceed 5000 characters." },
        { status: 400 }
      );
    }

    // 3. Rate limiting check
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown-ip";
    const rateCheck = isRateLimited(`${clientIp}-${email.trim().toLowerCase()}`);
    if (rateCheck.limited) {
      return NextResponse.json(
        { success: false, error: rateCheck.message },
        { status: 429 }
      );
    }

    // 4. Check for Resend API Key in environment
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === "re_your_actual_api_key_here") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Email service is not configured yet. Please add your RESEND_API_KEY to .env.local to enable real message delivery.",
        },
        { status: 503 }
      );
    }

    // 5. Initialize Resend
    const resend = new Resend(apiKey);
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "sarthakp514@gmail.com";
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();
    const timestamp = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });

    const safeName = escapeHtml(cleanName);
    const safeEmail = escapeHtml(cleanEmail);
    const safeSubject = escapeHtml(cleanSubject);
    const safeMessage = escapeHtml(cleanMessage);
    const safeTimestamp = escapeHtml(timestamp);

    // 6. Send email via Resend
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [receiverEmail],
      replyTo: cleanEmail, // Visitors email is set as Reply-To!
      subject: `[Portfolio Inquiry] ${cleanSubject} — from ${cleanName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0d12; color: #f8fafc; margin: 0; padding: 30px 15px; }
            .container { max-width: 600px; margin: 0 auto; background: #13141d; border: 1px solid #232533; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            .header { background: linear-gradient(135deg, #181b28 0%, #0e1018 100%); padding: 24px 30px; border-bottom: 1px solid #232533; }
            .badge { display: inline-block; padding: 4px 10px; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 20px; color: #60a5fa; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
            .title { margin: 12px 0 0 0; font-size: 20px; font-weight: 700; color: #ffffff; }
            .body { padding: 30px; }
            .meta-box { background: #0c0d12; border: 1px solid #1f212e; border-radius: 10px; padding: 18px; margin-bottom: 24px; }
            .meta-row { margin: 6px 0; font-size: 14px; }
            .meta-label { color: #94a3b8; font-weight: 600; width: 80px; display: inline-block; }
            .meta-value { color: #f8fafc; }
            .meta-value a { color: #38bdf8; text-decoration: none; }
            .message-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 8px; }
            .message-content { background: #0c0d12; border: 1px solid #1f212e; border-radius: 10px; padding: 20px; font-size: 15px; line-height: 1.6; color: #f1f5f9; white-space: pre-wrap; word-break: break-word; }
            .reply-button { display: inline-block; margin-top: 24px; padding: 12px 28px; background: #ffffff; color: #000000; font-weight: 700; font-size: 13px; text-decoration: none; border-radius: 50px; }
            .footer { background: #0c0d12; padding: 20px 30px; border-top: 1px solid #1f212e; text-align: center; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="badge">New Inquiry</span>
              <h1 class="title">${safeSubject}</h1>
            </div>
            <div class="body">
              <div class="meta-box">
                <div class="meta-row"><span class="meta-label">From:</span> <span class="meta-value"><strong>${safeName}</strong></span></div>
                <div class="meta-row"><span class="meta-label">Email:</span> <span class="meta-value"><a href="mailto:${safeEmail}">${safeEmail}</a></span></div>
                <div class="meta-row"><span class="meta-label">Date:</span> <span class="meta-value">${safeTimestamp}</span></div>
              </div>

              <div class="message-label">Message Payload:</div>
              <div class="message-content">${safeMessage}</div>

              <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(cleanSubject)}" class="reply-button">Reply Directly to ${safeName} &rarr;</a>
            </div>
            <div class="footer">
              This message was delivered via Resend from your personal developer portfolio.
            </div>
          </div>
        </body>
        </html>
      `,
      text: `NEW PORTFOLIO INQUIRY\n=================================\nFrom: ${cleanName}\nEmail: ${cleanEmail}\nSubject: ${cleanSubject}\nDate: ${timestamp}\n\nMESSAGE:\n---------------------------------\n${cleanMessage}\n\n=================================\nDirect Reply: mailto:${cleanEmail}`,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to deliver email through service. Please try again or reach out directly.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
      id: data?.id,
    });
  } catch (err: unknown) {
    console.error("Contact API Exception:", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred while sending your message. Please try again or reach out directly.",
      },
      { status: 500 }
    );
  }
}
