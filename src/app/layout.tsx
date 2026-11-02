import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/common/SmoothScroll";
import { CustomCursor } from "@/components/common/CustomCursor";

export const metadata: Metadata = {
  title: "Sarthak — Student @ PW IOI | Aspiring AI/ML Engineer",
  description:
    "Personal portfolio and learning journey of Sarthak, college student at Physics Wallah's Institute of Innovation. Currently learning programming, web development, and exploring AI and Machine Learning.",
  keywords: [
    "Sarthak",
    "Physics Wallah Institute of Innovation",
    "PW IOI",
    "Aspiring AI/ML Engineer",
    "Learning Programming",
    "Web Development",
    "Learning by Building",
    "Brightloop",
  ],
  authors: [{ name: "Sarthak" }],
  openGraph: {
    title: "Sarthak — Student @ PW IOI | Aspiring AI/ML Engineer",
    description:
      "College student at Physics Wallah's Institute of Innovation. Currently learning programming and web development, building my foundation, and exploring AI and Machine Learning.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarthak — Student @ PW IOI | Aspiring AI/ML Engineer",
    description:
      "College student at Physics Wallah's Institute of Innovation. Currently learning programming and web development, building my foundation, and exploring AI and Machine Learning.",
  },
};

export const viewport: Viewport = {
  themeColor: "#020204",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("theme");if(s==="light"){document.documentElement.classList.remove("dark");document.documentElement.classList.add("light");}else{document.documentElement.classList.add("dark");document.documentElement.classList.remove("light");}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-onest bg-[#020204] text-bone antialiased selection:bg-white/20 selection:text-white">
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
