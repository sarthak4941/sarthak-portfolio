"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { sound } from "@/lib/sound";

interface InteractivePortraitProps {
  name: string;
  onOpenAbilityModal: () => void;
}

export function InteractivePortrait({ name, onOpenAbilityModal }: InteractivePortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [pos, setPos] = useState({ x: 250, y: 300 });

  // Damped smooth cursor following via requestAnimationFrame
  const targetPosRef = useRef({ x: 250, y: 300 });
  const currentPosRef = useRef({ x: 250, y: 300 });
  const rafRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    const dx = targetPosRef.current.x - currentPosRef.current.x;
    const dy = targetPosRef.current.y - currentPosRef.current.y;

    currentPosRef.current.x += dx * 0.22;
    currentPosRef.current.y += dy * 0.22;

    setPos({
      x: Math.round(currentPosRef.current.x),
      y: Math.round(currentPosRef.current.y),
    });

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    targetPosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    if (!isRevealed) setIsRevealed(true);
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    targetPosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    currentPosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsRevealed(true);
  };

  const handlePointerLeave = () => {
    setIsRevealed(false);
  };

  // Mobile Touch Support
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    targetPosRef.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
    setIsRevealed(true);
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      setIsRevealed(false);
    }, 1200);
  };

  // Spotlight reveal radius in pixels
  const revealRadius = 140;

  return (
    <div
      ref={containerRef}
      onClick={(e) => {
        // Only trigger modal if not clicking on the floating button (which handles its own click)
        if ((e.target as HTMLElement).closest("button")) return;
        sound.playClick();
        onOpenAbilityModal();
      }}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full max-w-[500px] flex items-end justify-center cursor-pointer group select-none"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "500px",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      title="Click to open 3D Ability Card"
    >
      {/* LAYER 1: Default Monochrome (Black & White) Portrait */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
        <Image
          src="/portrait-cutout.png"
          alt={`${name} — Monochrome Portrait`}
          fill
          priority
          quality={95}
          className="object-contain object-bottom drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)] filter grayscale contrast-[1.08] brightness-[0.96]"
        />
      </div>

      {/* LAYER 2: Original Full-Colour Reveal Layer (masked radially around cursor) */}
      <div
        className="absolute inset-0 flex items-end justify-center pointer-events-none transition-opacity duration-300 ease-out"
        style={{
          opacity: isRevealed ? 1 : 0,
          maskImage: `radial-gradient(circle ${revealRadius}px at ${pos.x}px ${pos.y}px, black 0%, black 45%, rgba(0,0,0,0.5) 75%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle ${revealRadius}px at ${pos.x}px ${pos.y}px, black 0%, black 45%, rgba(0,0,0,0.5) 75%, transparent 100%)`,
        }}
      >
        <Image
          src="/portrait-cutout.png"
          alt={`${name} — Full Color Reveal`}
          fill
          priority
          quality={95}
          className="object-contain object-bottom drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)] filter contrast-[1.04] saturate-[1.05]"
        />
      </div>

      {/* Subtle Circular Reveal Ring Border Cursor Feedback */}
      <div
        className="absolute rounded-full pointer-events-none transition-opacity duration-300 border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        style={{
          width: `${revealRadius * 2}px`,
          height: `${revealRadius * 2}px`,
          left: `${pos.x - revealRadius}px`,
          top: `${pos.y - revealRadius}px`,
          opacity: isRevealed ? 0.4 : 0,
          transition: "opacity 0.3s ease-out",
        }}
      />

      {/* Interactive Tooltip Hint on Hover */}
      <div
        className={`absolute top-10 right-4 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-[#e5be58]/40 text-[10px] font-onest text-[#ffe699] tracking-wider uppercase pointer-events-none transition-all duration-300 flex items-center gap-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.6)] ${
          isRevealed ? "opacity-95 translate-y-0" : "opacity-0 translate-y-1"
        }`}
      >
        <Sparkles className="w-3 h-3 text-[#e5be58]" />
        <span>Click photo to open 3D Ability Card</span>
      </div>

      {/* Floating "My ability card" Pill Button */}
      <div className="absolute bottom-14 sm:bottom-16 z-20 pointer-events-auto">
        <button
          onClick={() => {
            sound.playClick();
            onOpenAbilityModal();
          }}
          onMouseEnter={() => sound.playHover()}
          className="px-5 py-2.5 rounded-full bg-black/60 hover:bg-black/85 border border-white/20 hover:border-white/50 backdrop-blur-md text-xs font-onest font-semibold tracking-wider text-white shadow-[0_12px_30px_rgba(0,0,0,0.7)] hover:scale-105 transition-all flex items-center gap-2 group/btn"
          title="Open 3D Ability Card"
        >
          <Sparkles className="w-3.5 h-3.5 text-white/80 group-hover/btn:text-amber-300 transition-colors" />
          <span>My ability card</span>
        </button>
      </div>
    </div>
  );
}
