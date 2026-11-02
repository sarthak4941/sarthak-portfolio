"use client";

import { useState } from "react";
import { personalData } from "@/data/personal";
import { NotebookCard } from "@/components/common/NotebookCard";
import { AbilityCardModal } from "@/components/3d/AbilityCardModal";
import { InteractivePortrait } from "@/components/common/InteractivePortrait";
import { ArrowRight } from "lucide-react";
import { sound } from "@/lib/sound";

export function Hero() {
  const [abilityModalOpen, setAbilityModalOpen] = useState(false);

  const handleScrollTo = (id: string) => {
    sound.playClick();
    const elem = document.querySelector(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <section
        id="hero"
        className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden pt-28 md:pt-32 pb-8 bg-[#0c0d12]"
      >
        {/* Ambient Top Subtle Aura (Reference Lighting) */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-subtle-grid opacity-50 pointer-events-none" />

        {/* Main 2-Column Hero Stage */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center min-h-[580px]">
            
            {/* ================= LEFT COLUMN: HERO HEADLINE & NOTEBOOK CARD (6 cols) ================= */}
            <div className="lg:col-span-6 flex flex-col items-start text-left space-y-7 pt-4">
              
              {/* Institution Sub-Badge (Reference: • College Student @ PW Institute of Innovation) */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-onest text-white/70 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                <span>College Student @ PW Institute of Innovation</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-1">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white font-onest leading-[1.05]">
                  Hi, I&apos;m {personalData.name}.
                </h1>
                <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white/60 tracking-tight font-onest">
                  I am an
                </div>
              </div>

              {/* Physical Notebook-Style Title Card */}
              <div className="w-full pt-1">
                <NotebookCard />
              </div>

              {/* Action Buttons (Refined: Honest & Student-Friendly) */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* Primary Pill Button with Inline Circle Arrow */}
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollTo("#contact");
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className="inline-flex items-center gap-3 pl-6 pr-2 py-2.5 rounded-full bg-white text-black font-onest font-bold text-xs sm:text-sm tracking-wide hover:bg-slate-200 transition-all shadow-[0_10px_25px_rgba(255,255,255,0.15)] group hover:scale-[1.02]"
                >
                  <span>Let&apos;s connect</span>
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </a>

                {/* Secondary Ghost Button */}
                <a
                  href="#doors"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollTo("#doors");
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className="inline-flex items-center px-6 py-3.5 rounded-full bg-white/[0.04] border border-white/15 hover:border-white/40 text-white font-onest font-semibold text-xs sm:text-sm tracking-wide transition-all hover:bg-white/[0.08]"
                >
                  <span>My learning journey</span>
                </a>
              </div>

            </div>

            {/* ================= RIGHT COLUMN: INTERACTIVE B&W / COLOR SPOTLIGHT PORTRAIT (6 cols) ================= */}
            <div className="lg:col-span-6 relative flex flex-col items-center justify-end h-[500px] sm:h-[580px] md:h-[620px] w-full">
              <InteractivePortrait
                name={personalData.name}
                onOpenAbilityModal={() => setAbilityModalOpen(true)}
              />
            </div>

          </div>
        </div>

        {/* ================= BOTTOM TELEMETRY BAR ================= */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 w-full pt-6 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono tracking-widest uppercase text-white/50">
            <div>
              <span>CURRENTLY LEARNING &amp; BUILDING</span>
            </div>

            <div className="hidden sm:block">
              <span>PW INSTITUTE OF INNOVATION</span>
            </div>

            <button
              onClick={() => handleScrollTo("#doors")}
              onMouseEnter={() => sound.playHover()}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group"
            >
              <span>SCROLL TO EXPLORE</span>
              <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= CINEMATIC 3D ABILITY CARD OVERLAY ================= */}
      <AbilityCardModal
        isOpen={abilityModalOpen}
        onClose={() => setAbilityModalOpen(false)}
      />
    </>
  );
}
