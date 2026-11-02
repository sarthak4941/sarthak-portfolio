"use client";

import dynamic from "next/dynamic";
import { skillCategories } from "@/data/skills";
import { SectionHeading } from "@/components/common/SectionHeading";
import { TiltCard } from "@/components/common/TiltCard";
import { Sparkles, Layers, Box, Cpu } from "lucide-react";

// Dynamically import the 3D Geometric background
const GeometricCanvas = dynamic(
  () => import("@/components/3d/GeometricGrid").then((mod) => mod.GeometricCanvas),
  { ssr: false }
);

export function Skills() {
  const getCategoryIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Box className="w-5 h-5 text-cyan-400" />;
      case 1:
        return <Layers className="w-5 h-5 text-violet-400" />;
      default:
        return <Cpu className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <section id="skills" className="relative py-28 md:py-36 bg-[#040407] overflow-hidden">
      {/* 3D Background Objects */}
      <GeometricCanvas />

      {/* Radial vignette mask */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#040407]/70 to-[#040407] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionHeading
          badge="02 // ARSENAL"
          title="Technical Capabilities & Weaponry"
          subtitle="Specialized in building low-latency 3D graphics, robust component architectures, and resilient backends."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((category, catIdx) => (
            <TiltCard
              key={catIdx}
              className="p-8 border-white/5 flex flex-col justify-between"
              glowColor={
                catIdx === 0
                  ? "rgba(0, 240, 255, 0.2)"
                  : catIdx === 1
                  ? "rgba(168, 85, 247, 0.2)"
                  : "rgba(16, 185, 129, 0.2)"
              }
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl glass-panel border-white/5">
                    {getCategoryIcon(catIdx)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {category.title}
                    </h3>
                  </div>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed mb-6 font-light">
                  {category.description}
                </p>

                {/* Skills list */}
                <div className="space-y-4">
                  {category.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-200 font-medium">
                          {skill.name}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          {skill.level}%
                        </span>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            catIdx === 0
                              ? "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_8px_#00f0ff]"
                              : catIdx === 1
                              ? "bg-gradient-to-r from-violet-500 to-pink-500 shadow-[0_0_8px_#a855f7]"
                              : "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_#10b981]"
                          }`}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Telemetry Tag */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>CATEGORY // 0{catIdx + 1}</span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <Sparkles className="w-3 h-3" />
                  TUNED FOR 60FPS
                </span>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
