"use client";

import { SectionHeading } from "@/components/common/SectionHeading";
import { AbilityCard3D } from "@/components/3d/AbilityCard3D";

export function AbilitySection() {
  return (
    <section id="ability" className="relative py-28 md:py-36 bg-[#050508] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-violet-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
        <SectionHeading
          badge="03 // STATS & TRAITS"
          title="My Interactive Ability Card"
          subtitle="Tilt with your cursor or tap to flip. A collectible 3D holographic card detailing verified engineering ratings, combat traits, and technical inventory."
        />

        {/* 3D Ability Card Component */}
        <div className="mt-12 flex justify-center">
          <AbilityCard3D />
        </div>
      </div>
    </section>
  );
}
