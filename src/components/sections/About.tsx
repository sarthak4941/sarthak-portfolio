"use client";

import { useState } from "react";
import { personalData } from "@/data/personal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { TiltCard } from "@/components/common/TiltCard";
import { Copy, Check, Cpu } from "lucide-react";
import { sound } from "@/lib/sound";

export function About() {
  const [copied, setCopied] = useState(false);

  const developerSpecs = `{
  "developer": "${personalData.name}",
  "institution": "${personalData.institution}",
  "focus": "AI/ML Engineering & Software Development",
  "philosophy": "Learn by building, experimenting & challenging boundaries",
  "specialties": [
    "Machine Learning & Python Foundations",
    "Modern Full-Stack Web Development",
    "Interactive 3D & Creative Prototypes",
    "Algorithmic Problem Solving"
  ],
  "ambition": "Build transformative AI technology that makes a meaningful difference."
}`;

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(developerSpecs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="about" className="relative py-28 md:py-36 bg-[#050508] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionHeading
          badge="01 // NARRATIVE"
          title="Driven by Innovation, Powered by Building"
          subtitle="College student at Physics Wallah's Institute of Innovation — learning computer science, programming, and AI through constant experimentation."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Narrative Story & Metrics (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="glass-panel p-8 md:p-10 rounded-2xl border-white/5 space-y-6">
              <div className="flex items-center gap-3 text-cyan-400">
                <Cpu className="w-5 h-5" />
                <span className="font-mono text-xs uppercase tracking-widest font-semibold">
                  Engineering Philosophy
                </span>
              </div>

              <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light">
                {personalData.about}
              </p>

              <p className="text-slate-400 text-sm md:text-base leading-relaxed font-light">
                Every line of shader math and every DOM component is meticulously engineered to ensure zero visual jitter, responsive fluid layouts, and accessible interaction across every screen size.
              </p>
            </div>

            {/* Stats Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {personalData.stats.map((stat, idx) => (
                <TiltCard key={idx} className="p-5 text-center border-white/5">
                  <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white mb-1">
                    <span className="text-gradient-cyan">{stat.value}</span>
                    <span className="text-cyan-400 text-sm font-normal">{stat.suffix}</span>
                  </div>
                  <div className="font-mono text-[11px] tracking-wider text-slate-400 uppercase">
                    {stat.label}
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Code Terminal (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="glass-panel rounded-2xl border-white/10 overflow-hidden flex flex-col h-full shadow-2xl">
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="font-mono text-xs text-slate-400 ml-2">
                    developer.spec.json
                  </span>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md glass-panel text-[11px] font-mono text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
                  title="Copy JSON specs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Terminal Code Body */}
              <div className="p-6 font-mono text-xs md:text-sm text-slate-300 overflow-x-auto flex-1 leading-relaxed bg-black/40">
                <pre>
                  <code>
                    <span className="text-violet-400">&#123;</span>
                    {"\n"}  <span className="text-cyan-300">&quot;developer&quot;</span>: <span className="text-emerald-300">&quot;{personalData.name}&quot;</span>,
                    {"\n"}  <span className="text-cyan-300">&quot;institution&quot;</span>: <span className="text-emerald-300">&quot;{personalData.institution}&quot;</span>,
                    {"\n"}  <span className="text-cyan-300">&quot;focus&quot;</span>: <span className="text-emerald-300">&quot;AI/ML Engineering &amp; Software Dev&quot;</span>,
                    {"\n"}  <span className="text-cyan-300">&quot;philosophy&quot;</span>: <span className="text-emerald-300">&quot;Learn by building &amp; experimenting&quot;</span>,
                    {"\n"}  <span className="text-cyan-300">&quot;specialties&quot;</span>: [
                    {"\n"}    <span className="text-amber-300">&quot;Machine Learning Foundations&quot;</span>,
                    {"\n"}    <span className="text-amber-300">&quot;Python &amp; Programming Logic&quot;</span>,
                    {"\n"}    <span className="text-amber-300">&quot;Modern Web Development (Next.js/React)&quot;</span>,
                    {"\n"}    <span className="text-amber-300">&quot;Algorithmic Problem Solving&quot;</span>
                    {"\n"}  ],
                    {"\n"}  <span className="text-cyan-300">&quot;ambition&quot;</span>: <span className="text-emerald-300">&quot;Build transformative AI technology with real impact.&quot;</span>
                    {"\n"}<span className="text-violet-400">&#125;</span>
                  </code>
                </pre>
              </div>

              {/* Terminal Footer Status */}
              <div className="px-4 py-2 bg-black/60 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  UTF-8
                </span>
                <span>JSON VALIDATED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
