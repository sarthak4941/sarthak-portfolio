"use client";

import { useEffect } from "react";
import { X, ArrowUpRight, Sparkles, Mail } from "lucide-react";
import { personalData } from "@/data/personal";
import { sound } from "@/lib/sound";
import { GithubIcon, InstagramIcon, TwitterXIcon } from "@/components/common/Icons";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection?: string;
}

const navLinks = [
  { number: "01", name: "HOME & ABILITY", href: "#hero", desc: "Identity & 3D Holographic Card" },
  { number: "02", name: "SKILL DOORS", href: "#doors", desc: "Swipe along the wall • One door per skill" },
  { number: "03", name: "MY STORY", href: "#story", desc: "Education & Career Timeline" },
  { number: "04", name: "CONTACT", href: "#contact", desc: "Collaborations & Direct Frequency" },
];

export function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleLinkClick = (href: string) => {
    sound.playClick();
    onClose();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#020204]/95 backdrop-blur-2xl transition-all duration-500 animate-fadeIn p-6 sm:p-12 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="font-onest text-xs tracking-widest uppercase text-white font-semibold">
            {personalData.name} — NAVIGATION
          </span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-white/10 hover:border-white/30 text-xs font-onest font-medium text-slate-300 hover:text-white transition-all group"
        >
          <span>CLOSE</span>
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Main Editorial Nav Links */}
      <div className="max-w-6xl mx-auto w-full py-10 my-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {navLinks.map((link) => (
            <div
              key={link.number}
              onClick={() => handleLinkClick(link.href)}
              onMouseEnter={() => sound.playHover()}
              className="group cursor-pointer p-6 sm:p-8 rounded-3xl glass-panel border-white/5 hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex items-baseline gap-4 sm:gap-6">
                <span className="font-onest text-sm text-slate-400 font-bold tracking-wider">
                  {link.number}
                </span>
                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white group-hover:text-slate-200 transition-colors tracking-tight font-onest">
                    {link.name}
                  </h3>
                  <p className="font-garamond italic text-sm text-slate-400 group-hover:text-slate-300 transition-colors mt-1">
                    {link.desc}
                  </p>
                </div>
              </div>

              <div className="w-10 h-10 rounded-full glass-panel border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-white/30 group-hover:scale-110 transition-all">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Info & Telemetry */}
      <div className="max-w-6xl mx-auto w-full border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-onest text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-slate-300" />
          <span>{personalData.institution} • {personalData.status}</span>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/sarthak4941"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-all hover:scale-110"
            aria-label="Sarthak on GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com/sarthak_4941/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition-all hover:scale-110"
            aria-label="Sarthak on Instagram"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>
          <a
            href="https://x.com/SARTHAK_4941"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-all hover:scale-110"
            aria-label="Sarthak on X (Twitter)"
          >
            <TwitterXIcon className="w-4 h-4" />
          </a>
          <a
            href="mailto:sarthakp514@gmail.com"
            className="hover:text-white transition-all hover:scale-110"
            aria-label="Email Sarthak"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
