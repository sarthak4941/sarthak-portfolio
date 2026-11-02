"use client";

import { useState, useEffect } from "react";
import { sound } from "@/lib/sound";

const pages = [
  "Aspiring AI/ML Engineer",
  "Student @ PW IOI",
  "Currently Learning & Building",
  "Growing One Step at a Time",
];

export function NotebookCard() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const nextPage = () => {
    if (isFlipping) return;
    sound.playClick();
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => (prev + 1) % pages.length);
      setIsFlipping(false);
    }, 250);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((prev) => (prev + 1) % pages.length);
        setIsFlipping(false);
      }, 250);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  // Number of spiral rings
  const ringCount = 12;

  return (
    <div
      onClick={nextPage}
      className="relative cursor-pointer select-none group w-full max-w-[420px] transition-transform duration-300 hover:-translate-y-1"
      title="Click to flip page"
    >
      {/* Top Spiral Wire Binding Loops */}
      <div className="absolute -top-3.5 left-4 right-4 z-20 flex justify-between pointer-events-none">
        {Array.from({ length: ringCount }).map((_, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {/* The Metallic Spiral Ring */}
            <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-slate-200 via-white to-slate-400 border border-slate-500 shadow-[0_2px_4px_rgba(0,0,0,0.5)] transform -rotate-3" />
            {/* The punched hole behind the ring */}
            <div className="w-2 h-2 rounded-full bg-[#1a1a22] shadow-inner -mt-1" />
          </div>
        ))}
      </div>

      {/* Main Notebook Card Sheet */}
      <div className="relative pt-6 pb-5 px-6 sm:px-7 rounded-2xl bg-gradient-to-b from-[#ffffff] via-[#fbfbfc] to-[#f4f4f7] text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.1)] border border-slate-200/80 overflow-hidden">
        
        {/* Subtle Perforation Line below rings */}
        <div className="border-b border-dashed border-slate-300/80 -mt-1 mb-4" />

        {/* Paper Fine Texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#000 1px, transparent 1px), radial-gradient(#000 1px, #f4f4f7 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Card Headline Text with Smooth Flip Transition */}
        <div className="min-h-[46px] sm:min-h-[52px] flex items-center">
          <h2
            className={`font-onest font-black text-2xl sm:text-3xl text-slate-900 tracking-tight transition-all duration-300 transform ${
              isFlipping
                ? "opacity-0 -translate-y-2 scale-95"
                : "opacity-100 translate-y-0 scale-100"
            }`}
          >
            {pages[currentPage]}
          </h2>
        </div>

        {/* Card Footer: Page Index Counter */}
        <div className="mt-2 pt-2 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-100">
          <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
            CLICK TO FLIP
          </span>
          <span className="font-semibold text-slate-500">
            0{currentPage + 1} / 0{pages.length}
          </span>
        </div>
      </div>
    </div>
  );
}
