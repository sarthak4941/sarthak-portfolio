"use client";

import { useState } from "react";
import { projectsData } from "@/data/projects";
import { SectionHeading } from "@/components/common/SectionHeading";
import { TiltCard } from "@/components/common/TiltCard";
import { ExternalLink, Sparkles, Code2, Globe } from "lucide-react";
import { GithubIcon } from "@/components/common/Icons";
import { sound } from "@/lib/sound";

export function Projects() {
  const [filter, setFilter] = useState<"all" | "featured" | "3d">("all");

  const filteredProjects = projectsData.filter((proj) => {
    if (filter === "featured") return proj.featured;
    if (filter === "3d")
      return proj.tags.some(
        (t) =>
          t.includes("Three.js") ||
          t.includes("WebGL") ||
          t.includes("R3F") ||
          t.includes("Shaders")
      );
    return true;
  });

  return (
    <section id="projects" className="relative py-28 md:py-36 bg-[#050508] overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionHeading
          badge="03 // SHOWCASE"
          title="Featured Architectural Works"
          subtitle="Curated collection of spatial interfaces, real-time WebGL engines, and high-frequency digital systems."
        />

        {/* Filter Navigation */}
        <div className="flex items-center justify-center gap-2 mb-14">
          <div className="glass-panel p-1 rounded-full border-white/5 flex items-center gap-1">
            <button
              onClick={() => {
                sound.playClick();
                setFilter("all");
              }}
              className={`px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all ${
                filter === "all"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Systems ({projectsData.length})
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setFilter("featured");
              }}
              className={`px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all ${
                filter === "featured"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Featured Works
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setFilter("3d");
              }}
              className={`px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all ${
                filter === "3d"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              3D &amp; WebGL Only
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <TiltCard
              key={project.id}
              className="p-7 border-white/5 flex flex-col justify-between group hover:border-cyan-400/30"
              glowColor="rgba(0, 240, 255, 0.18)"
            >
              <div>
                {/* Visual Header / Mockup Banner */}
                <div className="relative h-44 rounded-xl bg-gradient-to-br from-[#0e101f] to-[#151930] border border-white/5 overflow-hidden p-5 flex flex-col justify-between mb-6 group-hover:border-cyan-500/30 transition-colors">
                  {/* Subtle Grid overlay in card header */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

                  {/* Top Bar: Metric Badge & Featured Pill */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/50 text-cyan-400 border border-cyan-500/30">
                      {project.metrics}
                    </span>
                    {project.featured && (
                      <span className="flex items-center gap-1 font-mono text-[10px] tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        <Sparkles className="w-2.5 h-2.5" />
                        FLAGSHIP
                      </span>
                    )}
                  </div>

                  {/* Center Visual Symbol */}
                  <div className="relative z-10 flex items-center justify-center my-auto">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-400/40 transition-all duration-300 shadow-glass">
                      <Code2 className="w-7 h-7 text-cyan-400" />
                    </div>
                  </div>

                  {/* Bottom System ID */}
                  <div className="relative z-10 font-mono text-[10px] text-slate-500 tracking-widest uppercase">
                    ID // {project.id}
                  </div>
                </div>

                {/* Subtitle & Title */}
                <p className="font-mono text-xs uppercase tracking-widest text-cyan-400 mb-1">
                  {project.subtitle}
                </p>
                <h3 className="text-xl font-bold text-white tracking-tight mb-3 group-hover:text-cyan-300 transition-colors">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-xs leading-relaxed mb-6 font-light line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mb-8">
                  {project.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-[11px] font-mono text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.playClick()}
                  onMouseEnter={() => sound.playHover()}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-mono text-xs transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Live System</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.playClick()}
                  onMouseEnter={() => sound.playHover()}
                  className="p-2 rounded-xl glass-panel border-white/10 hover:border-cyan-400/40 text-slate-400 hover:text-white transition-all"
                  title="View Source on GitHub"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
