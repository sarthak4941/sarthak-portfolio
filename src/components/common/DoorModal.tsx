"use client";

import { useEffect } from "react";
import { SkillDoor } from "@/data/doors";
import { X, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { sound } from "@/lib/sound";

interface DoorModalProps {
  door: SkillDoor | null;
  onClose: () => void;
}

export function DoorModal({ door, onClose }: DoorModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (door) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [door, onClose]);

  if (!door) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-2xl animate-fadeIn">
      {/* Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl border border-white/15 shadow-2xl p-6 sm:p-10 bg-[#06070b]/98">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: door.accentColor }}
              />
              <span className="font-onest text-xs uppercase tracking-widest text-slate-300 font-semibold">
                DOOR // {door.number} • {door.doorSign}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-onest">
              {door.title}
            </h2>
            <p className="font-editorial italic text-base text-slate-400 mt-1">
              {door.subtitle}
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2.5 rounded-full glass-panel border-white/10 hover:border-white/40 text-slate-400 hover:text-white transition-all group"
            title="Step back to corridor"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Narrative Description */}
        <div className="mb-8">
          <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-light">
            {door.description}
          </p>
        </div>

        {/* Focus Areas & Tool Arsenal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Key Checklist & Study Areas */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="flex items-center gap-2 font-onest text-xs uppercase tracking-widest text-slate-400 mb-2 font-semibold">
              <Sparkles className="w-4 h-4 text-white" />
              <span>Core Study &amp; Practice Areas</span>
            </div>
            <div className="space-y-2.5">
              {door.checklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: door.accentColor }}
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tools & Concepts */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="font-onest text-xs uppercase tracking-widest text-slate-400 mb-2 font-semibold">
              Technologies &amp; Concepts
            </div>
            <div className="flex flex-wrap gap-2">
              {door.tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-onest text-slate-200"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Highlighted Work Behind the Door */}
        <div className="space-y-4 mb-8">
          <div className="font-onest text-xs uppercase tracking-widest text-slate-400 flex items-center justify-between font-semibold">
            <span>Work &amp; Exploration Behind Door {door.number}</span>
            <span className="text-white font-editorial italic text-xs">{door.projects.length} Projects &amp; Practice</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {door.projects.map((proj, pIdx) => (
              <div
                key={pIdx}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-editorial italic text-xs text-slate-300">
                      {proj.category}
                    </span>
                    <span className="font-onest text-[10px] text-slate-400 uppercase px-2 py-0.5 rounded-md bg-white/5">
                      {proj.metrics}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2 font-onest">{proj.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {proj.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                  {proj.tech.map((t, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full glass-panel border-white/10 hover:border-white/30 text-xs font-onest text-slate-300 hover:text-white transition-all"
          >
            <span>Step Back to Wall</span>
          </button>

          <a
            href="#contact"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-onest text-xs uppercase tracking-wider bg-white text-black font-bold hover:bg-slate-200 transition-all"
          >
            <span>Get in Touch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
