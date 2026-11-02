"use client";

import { useEffect, useState } from "react";
import { personalData } from "@/data/personal";
import { Mail, ArrowUp } from "lucide-react";
import { GithubIcon, InstagramIcon, TwitterXIcon } from "@/components/common/Icons";
import { sound } from "@/lib/sound";

export function Footer() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZoneName: "short",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#020204] pt-16 pb-12 overflow-hidden">
      {/* Background accent glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-white/[0.02] blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Status */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
              <span className="font-onest text-sm tracking-widest uppercase text-white font-bold">
                {personalData.name}
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed font-light">
              College student at Physics Wallah – Institute of Innovation. Currently learning programming and web development, building my foundation, and exploring AI and Machine Learning.
            </p>
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full glass-panel border-emerald-500/30 text-xs font-onest text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{personalData.status}</span>
            </div>
          </div>

          {/* Col 2: Telemetry / Live Time */}
          <div>
            <h4 className="font-onest text-xs uppercase tracking-widest text-slate-400 mb-4 font-semibold">
              Location &amp; Time
            </h4>
            <div className="space-y-2 font-onest text-xs text-slate-300">
              <div>
                <span className="text-slate-500">CAMPUS: </span>
                <span>PW IOI Campus, India</span>
              </div>
              <div>
                <span className="text-slate-500">SYS_TIME: </span>
                <span className="text-white font-mono">{time || "SYNCING..."}</span>
              </div>
              <div>
                <span className="text-slate-500">STATUS: </span>
                <span className="text-emerald-400">STUDENT @ PW IOI</span>
              </div>
            </div>
          </div>

          {/* Col 3: Social Connectivity */}
          <div>
            <h4 className="font-onest text-xs uppercase tracking-widest text-slate-400 mb-4 font-semibold">
              Connect
            </h4>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://github.com/sarthak4941"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="p-2.5 rounded-full glass-panel border-white/10 hover:border-white/40 text-slate-300 hover:text-white transition-all hover:scale-110"
                aria-label="Sarthak on GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/sarthak_4941/"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="p-2.5 rounded-full glass-panel border-white/10 hover:border-white/40 text-slate-300 hover:text-pink-400 transition-all hover:scale-110"
                aria-label="Sarthak on Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/SARTHAK_4941"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="p-2.5 rounded-full glass-panel border-white/10 hover:border-white/40 text-slate-300 hover:text-white transition-all hover:scale-110"
                aria-label="Sarthak on X (Twitter)"
              >
                <TwitterXIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:sarthakp514@gmail.com"
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="p-2.5 rounded-full glass-panel border-white/10 hover:border-white/40 text-slate-300 hover:text-white transition-all hover:scale-110"
                aria-label="Email Sarthak"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-onest text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {personalData.name}. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="font-editorial italic text-slate-400">Physics Wallah&apos;s Institute of Innovation</span>
            <button
              onClick={scrollToTop}
              onMouseEnter={() => sound.playHover()}
              className="flex items-center gap-1.5 p-2 rounded-full glass-panel hover:text-white hover:border-white/40 transition-colors"
              title="Return to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
