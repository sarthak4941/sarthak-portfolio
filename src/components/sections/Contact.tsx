"use client";

import { useState } from "react";
import { personalData } from "@/data/personal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Send, Mail, Copy, Check, FileDown, ArrowUpRight, AlertCircle } from "lucide-react";
import { GithubIcon, InstagramIcon, TwitterXIcon } from "@/components/common/Icons";
import confetti from "canvas-confetti";
import { sound } from "@/lib/sound";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    hp_website: "",
  });

  const handleCopyEmail = () => {
    sound.playClick();
    navigator.clipboard.writeText(personalData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setErrorMessage(null);
    setFormStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setFormStatus("error");
        setErrorMessage(
          data.error || "Unable to send message. Please verify your connection or email directly."
        );
        return;
      }

      // Successful delivery
      setFormStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        hp_website: "",
      });

      // Trigger celebratory cinematic confetti
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#FFFFFF", "#E2E8F0", "#94A3B8", "#64748B"],
        });
      } catch {
        // Fallback
      }

      // Re-enable form after 8 seconds
      setTimeout(() => {
        setFormStatus("idle");
      }, 8000);
    } catch (err: unknown) {
      setFormStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Network connection error. Please verify your internet and try again."
      );
    }
  };

  return (
    <section id="contact" className="relative py-28 md:py-36 bg-[#040406] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-white/[0.02] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionHeading
          badge="03 // CONNECT"
          title="Get In Touch"
          subtitle="Have a question, feedback on my learning projects, or want to connect with a fellow student? Feel free to reach out."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Links & Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="glass-panel p-8 rounded-2xl border-white/10 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-onest">
                Let&apos;s connect &amp; <span className="font-editorial italic font-normal text-slate-400">grow together</span>.
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed font-light">
                I&apos;m always eager to learn, receive feedback, and connect with other learners, developers, and mentors. Whether you want to discuss programming, share advice on AI/ML, or collaborate on student projects, my inbox is always open.
              </p>

              {/* Copy Email Button Pill */}
              <div className="pt-2">
                <button
                  onClick={handleCopyEmail}
                  onMouseEnter={() => sound.playHover()}
                  className="w-full flex items-center justify-between p-4 rounded-xl glass-panel border-white/15 hover:border-white/40 hover:bg-white/[0.04] transition-all group"
                  title="Click to copy email"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 text-white group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="text-left font-onest">
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                        DIRECT EMAIL
                      </div>
                      <div className="text-sm text-slate-200 group-hover:text-white transition-colors">
                        {personalData.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 font-onest text-xs text-slate-300 group-hover:text-white border border-white/10">
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-3 pt-2 text-xs font-onest text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
                <span>Response Time: Typically &lt; 24 Hours</span>
              </div>
            </div>

            {/* Verified Channels Card */}
            <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-4">
              <div className="font-onest text-xs text-slate-400 uppercase tracking-widest font-semibold">
                CHANNELS &amp; PROFILES
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://github.com/sarthak4941"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  onMouseEnter={() => sound.playHover()}
                  className="flex items-center justify-between p-3 rounded-xl glass-panel hover:border-white/30 text-xs font-onest text-slate-300 hover:text-white transition-all group"
                  aria-label="Sarthak on GitHub"
                >
                  <div className="flex items-center gap-2">
                    <GithubIcon className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    <span>GitHub</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                </a>

                <a
                  href="https://www.instagram.com/sarthak_4941/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  onMouseEnter={() => sound.playHover()}
                  className="flex items-center justify-between p-3 rounded-xl glass-panel hover:border-white/30 text-xs font-onest text-slate-300 hover:text-white transition-all group"
                  aria-label="Sarthak on Instagram"
                >
                  <div className="flex items-center gap-2">
                    <InstagramIcon className="w-4 h-4 text-slate-400 group-hover:text-pink-400 transition-colors" />
                    <span>Instagram</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                </a>

                <a
                  href="https://x.com/SARTHAK_4941"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  onMouseEnter={() => sound.playHover()}
                  className="flex items-center justify-between p-3 rounded-xl glass-panel hover:border-white/30 text-xs font-onest text-slate-300 hover:text-white transition-all group"
                  aria-label="Sarthak on X (Twitter)"
                >
                  <div className="flex items-center gap-2">
                    <TwitterXIcon className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    <span>X (Twitter)</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    alert("Resume download can be linked directly to your resume.pdf file in /public.");
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className="flex items-center justify-between p-3 rounded-xl glass-panel hover:border-white/30 text-xs font-onest text-slate-300 hover:text-white transition-all group text-left"
                >
                  <div className="flex items-center gap-2">
                    <FileDown className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    <span>Resume (CV)</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 sm:p-10 rounded-2xl border-white/10 shadow-2xl relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field (hidden from legitimate users, catches spam bots) */}
                <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
                  <label htmlFor="hp_website">Leave this empty</label>
                  <input
                    id="hp_website"
                    type="text"
                    name="hp_website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.hp_website}
                    onChange={(e) =>
                      setFormData({ ...formData, hp_website: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block font-onest text-xs uppercase tracking-wider text-slate-400 font-semibold"
                    >
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      disabled={formStatus === "sending"}
                      placeholder="e.g. Alex Mercer"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/40 text-sm text-white placeholder-slate-600 transition-all font-onest disabled:opacity-50"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block font-onest text-xs uppercase tracking-wider text-slate-400 font-semibold"
                    >
                      Your Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      disabled={formStatus === "sending"}
                      placeholder="you@domain.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/40 text-sm text-white placeholder-slate-600 transition-all font-onest disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="block font-onest text-xs uppercase tracking-wider text-slate-400 font-semibold"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    disabled={formStatus === "sending"}
                    placeholder="Project Inquiry / Opportunity"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/40 text-sm text-white placeholder-slate-600 transition-all font-onest disabled:opacity-50"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block font-onest text-xs uppercase tracking-wider text-slate-400 font-semibold"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    disabled={formStatus === "sending"}
                    placeholder="Tell me about what you have in mind..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/40 text-sm text-white placeholder-slate-600 transition-all font-onest resize-none disabled:opacity-50"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={formStatus === "sending"}
                    onMouseEnter={() => sound.playHover()}
                    className="w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-onest text-xs uppercase tracking-widest bg-white text-black font-bold hover:bg-slate-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                  >
                    {formStatus === "sending" ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : formStatus === "success" ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Message Sent</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-black" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Success Feedback Alert */}
                {formStatus === "success" && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-onest text-xs sm:text-sm flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-200">
                        Message sent successfully! I&apos;ll get back to you soon.
                      </p>
                      <p className="text-[11px] text-emerald-300/80 mt-0.5">
                        Your message was delivered directly to sarthakp514@gmail.com with your reply-to address.
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Feedback Alert */}
                {formStatus === "error" && errorMessage && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-onest text-xs sm:text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold text-rose-200">Delivery Alert</p>
                      <p className="text-xs text-rose-300/90 leading-relaxed">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Elegant Direct Fallback Note */}
                <p className="pt-2 text-center text-xs text-slate-400 font-onest leading-relaxed">
                  Didn&apos;t hear back from me? Feel free to email me directly at{" "}
                  <a
                    href="mailto:sarthakp514@gmail.com"
                    className="text-white underline underline-offset-4 hover:text-slate-200 transition-colors font-medium"
                  >
                    sarthakp514@gmail.com
                  </a>
                  . I might occasionally miss a message, but I&apos;ll do my best to get back to you!
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
