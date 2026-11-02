"use client";

import { Preloader } from "@/components/common/Preloader";
import { PullRope } from "@/components/common/PullRope";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { SkillDoors } from "@/components/sections/SkillDoors";
import { MyStory } from "@/components/sections/MyStory";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      {/* Cinematic Startup Preloader */}
      <Preloader />

      {/* Realistic Hanging Pull Rope (Dark/Light Mode Switch) */}
      <PullRope />

      {/* Main Single Page Experience */}
      <main className="relative min-h-screen bg-[#030305] text-slate-100 selection:bg-white/20">
        <Navbar />
        <Hero />
        <SkillDoors />
        <MyStory />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
