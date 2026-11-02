"use client";

import { useEffect, useRef } from "react";
import { experiencesData } from "@/data/experience";
import { SectionHeading } from "@/components/common/SectionHeading";
import { MapPin, Calendar, Briefcase } from "lucide-react";
import { sound } from "@/lib/sound";

export function MyStory() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!lineRef.current) return;
      const rect = lineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Progress calculation based on viewport entry
      const totalHeight = rect.height;
      if (totalHeight <= 0) return;
      const currentScroll = windowHeight - rect.top;
      const progress = Math.min(Math.max(currentScroll / totalHeight, 0), 1);

      lineRef.current.style.setProperty("--line-progress", `${progress * 100}%`);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="story" className="relative py-28 md:py-36 bg-[#030305] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <SectionHeading
          badge="02 // JOURNEY"
          title="My Learning Journey"
          subtitle="My journey as a college student at Physics Wallah's Institute of Innovation — building my foundation, learning by building, and growing one step at a time."
        />

        {/* Timeline Container with Dynamic Animated Line */}
        <div
          ref={lineRef}
          className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:left-2 sm:before:left-3 before:top-4 before:bottom-4 before:w-[2px] before:bg-white/10"
        >
          {/* Glowing Animated Progress Line Overlay */}
          <div
            className="absolute left-2 sm:left-3 top-4 w-[2px] bg-gradient-to-b from-white via-slate-300 to-white/40 transition-all duration-150 shadow-[0_0_10px_rgba(255,255,255,0.4)]"
            style={{ height: "var(--line-progress, 0%)" }}
          />

          {/* Timeline Milestones */}
          {experiencesData.map((item, idx) => (
            <div
              key={idx}
              className="relative group"
              onMouseEnter={() => sound.playHover()}
            >
              {/* Node Indicator */}
              <div className="absolute -left-[27px] sm:-left-[37px] top-1.5 w-6 h-6 rounded-full bg-[#050508] border-2 border-white/60 group-hover:border-white flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:scale-125 transition-transform duration-300">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>

              {/* Milestone Content Card */}
              <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 group-hover:border-white/30 transition-all duration-300 shadow-glass">
                {/* Header: Period & Location */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-onest text-xs">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{item.period}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400 font-onest text-xs">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.location}</span>
                  </div>
                </div>

                {/* Role & Company */}
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="w-4 h-4 text-white/80" />
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-onest">
                    {item.role}
                  </h3>
                </div>
                <div className="font-editorial italic text-base text-slate-300 mb-4">
                  {item.organization}
                </div>

                {/* Narrative Description */}
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light mb-6">
                  {item.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                  {item.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-md bg-white/[0.04] text-[11px] font-onest text-slate-300 border border-white/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
