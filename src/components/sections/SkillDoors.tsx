"use client";

import { SkillDoorsWall } from "@/components/3d/SkillDoorsWall";

export function SkillDoors() {
  return (
    <section id="doors" className="relative py-24 md:py-32 bg-[#090a0f] overflow-hidden border-t border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-white/[0.015] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center mb-6">
        {/* Clean Headline (Reference Design: Magic happens behind the doors) */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white font-onest">
          Magic happens behind the doors
        </h2>
      </div>

      {/* The 4 Architectural 3D Arched Doors */}
      <SkillDoorsWall />
    </section>
  );
}
