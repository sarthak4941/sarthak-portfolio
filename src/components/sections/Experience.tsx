"use client";

import { experiencesData } from "@/data/experience";
import { SectionHeading } from "@/components/common/SectionHeading";
import { MapPin, Calendar } from "lucide-react";

export function Experience() {
  return (
    <section id="experience" className="relative py-28 md:py-36 bg-[#040407] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <SectionHeading
          badge="04 // JOURNEY"
          title="Career Trajectory & Milestones"
          subtitle="A track record of engineering ambitious products, leading frontend architecture, and pushing web graphic limits."
        />

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-cyan-500 before:via-violet-500 before:to-transparent">
          {experiencesData.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Pulsing Node */}
              <div className="absolute -left-[27px] sm:-left-[37px] top-1.5 w-6 h-6 rounded-full bg-[#050508] border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_12px_#00f0ff] group-hover:scale-125 transition-transform">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              {/* Card Container */}
              <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/5 group-hover:border-cyan-400/30 transition-all duration-300 shadow-glass">
                {/* Header: Period & Location */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>{item.period}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-xs">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.location}</span>
                  </div>
                </div>

                {/* Role & Company */}
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1">
                  {item.role}
                </h3>
                <div className="font-mono text-sm text-cyan-400 font-medium mb-4">
                  {item.organization}
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light mb-6">
                  {item.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  {item.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-md bg-white/[0.04] text-[11px] font-mono text-slate-400 border border-white/5"
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
