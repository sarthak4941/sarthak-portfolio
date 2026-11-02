"use client";

import { useEffect, useState } from "react";
import { AbilityCard3D } from "./AbilityCard3D";
import { X, Sparkles } from "lucide-react";
import { sound } from "@/lib/sound";

interface AbilityCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Generate deterministic floating golden ember particles
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 37) % 96 + 2}%`,
  top: `${(i * 43) % 94 + 3}%`,
  size: (i % 3) * 1.5 + 2,
  duration: 4 + (i % 5) * 1.5,
  delay: (i % 7) * 0.4,
  opacity: 0.25 + (i % 4) * 0.18,
}));

export function AbilityCardModal({ isOpen, onClose }: AbilityCardModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        sound.playClick();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen && !mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 transition-all duration-500 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Sarthak's 3D Ability Card"
    >
      {/* 1. Cinematic Deep Dark Backdrop with Blur */}
      <div
        onClick={() => {
          sound.playClick();
          onClose();
        }}
        className="absolute inset-0 bg-[#040508]/92 backdrop-blur-2xl transition-opacity duration-500"
      />

      {/* 2. Floating Golden & Amber Ember Particles (Cinematic Atmosphere) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-t from-amber-500 to-yellow-200 animate-float-particle pointer-events-none shadow-[0_0_8px_rgba(245,185,55,0.7)]"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        {/* Soft Golden Radiant Aura Centered Behind the 3D Card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[650px] h-[520px] sm:h-[650px] bg-[radial-gradient(circle,rgba(218,165,32,0.18)_0%,rgba(180,115,20,0.06)_50%,transparent_75%)] rounded-full blur-[80px] pointer-events-none" />
      </div>

      {/* 3. Top Header: Subtitle & Elegant Close Button */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 z-50 flex items-center justify-between pointer-events-none">
        {/* Top-Left Title (Reference Style: "RISHI THAKOR / Ability card") */}
        <div className="flex items-center gap-2 pointer-events-auto select-none">
          <Sparkles className="w-4 h-4 text-[#e5be58] animate-pulse" />
          <div className="flex flex-col">
            <span className="font-serif text-xs sm:text-sm font-bold tracking-[0.2em] text-[#ffe699] uppercase">
              SARTHAK
            </span>
            <span className="font-mono text-[10px] tracking-widest text-white/50 uppercase">
              Collectible 3D Ability Card
            </span>
          </div>
        </div>

        {/* Top-Right Circular Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          onMouseEnter={() => sound.playHover()}
          className="pointer-events-auto p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 border border-[#e5be58]/40 hover:border-[#e5be58] text-[#ffe699] hover:text-white shadow-[0_0_20px_rgba(218,165,32,0.25)] transition-all hover:scale-105 active:scale-95 group cursor-pointer"
          title="Close (or press Esc)"
          aria-label="Close Ability Card"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* 4. Center 3D Collectible Card Experience */}
      <div
        className={`relative z-40 max-w-lg w-full flex flex-col items-center justify-center transform transition-all duration-700 ease-out ${
          isOpen
            ? "scale-100 rotate-0 translate-y-0 opacity-100"
            : "scale-90 -rotate-3 translate-y-8 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when interacting with the card
      >
        <AbilityCard3D onClose={onClose} isModal={true} />

        {/* 5. Bottom Reference Guide: "HOVER TO TILT • DRAG TO ROTATE • CLICK TO FLIP" */}
        <div className="mt-4 px-4 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-md select-none pointer-events-none text-center shadow-lg">
          <p className="font-mono text-[10px] sm:text-[11px] text-[#ffe899]/80 tracking-[0.18em] uppercase flex items-center justify-center gap-2">
            <span>Hover to tilt</span>
            <span>•</span>
            <span>Drag to rotate</span>
            <span>•</span>
            <span>Click to flip</span>
          </p>
        </div>
      </div>
    </div>
  );
}
