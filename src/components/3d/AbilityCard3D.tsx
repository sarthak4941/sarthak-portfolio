"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { abilityCardData } from "@/data/ability";
import { sound } from "@/lib/sound";
import { RotateCw } from "lucide-react";

interface AbilityCard3DProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function AbilityCard3D({ onClose }: AbilityCard3DProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [dragRotation, setDragRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const cardRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0, time: 0 });
  const springFrameRef = useRef<number | null>(null);

  // Damped pointer tilt when hovering
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) return;
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Tilt limits: ±14 degrees
    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;

    setTilt({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.85,
    });
  };

  const handlePointerLeave = () => {
    if (isDragging) return;
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  const toggleFlip = useCallback(() => {
    sound.playCardFlip();
    setIsFlipped((prev) => !prev);
  }, []);

  // Pointer drag to rotate freely in 3D
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Left mouse button or single touch
    if (e.button !== 0 && e.pointerType === "mouse") return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    if (springFrameRef.current) {
      cancelAnimationFrame(springFrameRef.current);
      springFrameRef.current = null;
    }

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: dragRotation.x,
      rotY: dragRotation.y,
      time: performance.now(),
    };
    setIsDragging(true);
  };

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    const newRotY = dragStartRef.current.rotY + deltaX * 0.45;
    const newRotX = dragStartRef.current.rotX - deltaY * 0.45;

    setDragRotation({
      x: Math.max(Math.min(newRotX, 40), -40),
      y: Math.max(Math.min(newRotY, 50), -50),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
    setIsDragging(false);

    const deltaX = Math.abs(e.clientX - dragStartRef.current.x);
    const deltaY = Math.abs(e.clientY - dragStartRef.current.y);
    const duration = performance.now() - dragStartRef.current.time;

    // If movement was small and quick, treat as a flip click
    if (deltaX < 6 && deltaY < 6 && duration < 320) {
      toggleFlip();
      return;
    }

    // Otherwise, smoothly spring dragRotation back to 0
    let startSpringTime: number | null = null;
    const initialX = dragRotation.x;
    const initialY = dragRotation.y;
    const springDuration = 450;

    const springStep = (now: number) => {
      if (!startSpringTime) startSpringTime = now;
      const progress = Math.min((now - startSpringTime) / springDuration, 1);
      // Damped harmonic easing
      const eased = 1 - Math.pow(1 - progress, 3);

      setDragRotation({
        x: initialX * (1 - eased),
        y: initialY * (1 - eased),
      });

      if (progress < 1) {
        springFrameRef.current = requestAnimationFrame(springStep);
      } else {
        setDragRotation({ x: 0, y: 0 });
        springFrameRef.current = null;
      }
    };

    springFrameRef.current = requestAnimationFrame(springStep);
  };

  // Keyboard shortcut: Space or Enter to flip card, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggleFlip();
      }
      if (e.key === "Escape" && onClose) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleFlip, onClose]);

  // Combined rotation: tilt + dragRotation + flip angle
  const totalRotateX = tilt.x + dragRotation.x;
  const totalRotateY = tilt.y + dragRotation.y + (isFlipped ? 180 : 0);

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[380px]">
      {/* 3D Perspective Card Container */}
      <div
        className="relative w-full max-w-[330px] sm:max-w-[360px] md:max-w-[370px] h-[520px] sm:h-[570px] md:h-[590px] cursor-grab active:cursor-grabbing"
        style={{ perspective: "1400px" }}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerMoveCapture={handleDragMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => setIsDragging(false)}
        onPointerLeave={handlePointerLeave}
        onMouseEnter={() => sound.playHover()}
      >
        {/* 3D Card Object (Preserve-3D with both Faces) */}
        <div
          ref={cardRef}
          className="relative w-full h-full rounded-[26px] transition-transform shadow-[0_30px_70px_rgba(0,0,0,0.95)]"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${totalRotateX}deg) rotateY(${totalRotateY}deg)`,
            transition: isDragging ? "none" : "transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          {/* ========================================================================= */}
          {/* FRONT SIDE: ORNATE VINTAGE GOLDEN COLLECTIBLE CARD (Reference Image 1)   */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 rounded-[26px] overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 border border-[#e5c158]/70 bg-gradient-to-b from-[#f8f3ea] via-[#f5ede3] to-[#ede3d5]"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              boxShadow:
                "0 0 0 1px #805814, 0 0 0 2.5px #e5c158, 0 0 0 4px #5e3f0c, 0 0 35px rgba(229,193,88,0.38), 0 25px 60px rgba(0,0,0,0.85)",
            }}
          >
            {/* Dynamic Specular / Holographic Foil Reflection */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30 mix-blend-overlay"
              style={{
                opacity: glare.opacity * 0.65,
                background: `radial-gradient(circle 280px at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.9) 0%, rgba(255,230,150,0.4) 40%, transparent 80%)`,
              }}
            />

            {/* Vintage Ornate Metallic Gold Border Frame SVG with Intricate Corner Filigrees */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
              viewBox="0 0 370 590"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient id="goldBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff8cf" />
                  <stop offset="20%" stopColor="#ebd085" />
                  <stop offset="45%" stopColor="#b58728" />
                  <stop offset="70%" stopColor="#ffd978" />
                  <stop offset="90%" stopColor="#d4a337" />
                  <stop offset="100%" stopColor="#6e4d14" />
                </linearGradient>

                <linearGradient id="goldFiligreeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#61420b" />
                  <stop offset="25%" stopColor="#d4a337" />
                  <stop offset="50%" stopColor="#fff4bd" />
                  <stop offset="75%" stopColor="#e5be58" />
                  <stop offset="100%" stopColor="#8c6014" />
                </linearGradient>

                <filter id="goldEmbossShadow" x="-25%" y="-25%" width="150%" height="150%">
                  <feDropShadow dx="0.5" dy="1" stdDeviation="0.8" floodColor="#362205" floodOpacity="0.55" />
                </filter>
              </defs>

              {/* Multi-Tier Double Metallic Gold Border Frame */}
              {/* 1. Outer Polished Gold Rim */}
              <rect
                x="7"
                y="7"
                width="356"
                height="576"
                rx="20"
                stroke="url(#goldBorderGrad)"
                strokeWidth="2.2"
                fill="none"
              />
              {/* 2. Secondary Fine Hairline Inset */}
              <rect
                x="11"
                y="11"
                width="348"
                height="568"
                rx="16"
                stroke="#9c7224"
                strokeWidth="0.8"
                fill="none"
              />
              {/* 3. Inner Decorative Beaded/Dashed Hairline */}
              <rect
                x="14"
                y="14"
                width="342"
                height="562"
                rx="13"
                stroke="url(#goldBorderGrad)"
                strokeWidth="0.65"
                strokeDasharray="3 2"
                fill="none"
                opacity="0.85"
              />

              {/* Corner Filigree Ornaments (Ornate Baroque Scrolls & Corner Gemstones) */}
              {/* Top-Left Corner */}
              <g transform="translate(13, 13)" filter="url(#goldEmbossShadow)">
                <path
                  d="M0,32 C4,20 18,5 32,0 C24,10 20,20 22,30 C15,26 8,26 0,32 Z"
                  fill="url(#goldFiligreeGrad)"
                />
                <path
                  d="M0,20 C8,15 15,8 20,0"
                  stroke="#fff4cf"
                  strokeWidth="0.9"
                  fill="none"
                />
                <path
                  d="M10,26 C16,22 22,16 26,10"
                  stroke="#6e4d14"
                  strokeWidth="0.6"
                  fill="none"
                />
                {/* Corner Faceted Diamond Rosette */}
                <polygon points="28,24 32,28 28,32 24,28" fill="#ffe28a" stroke="#6e4d14" strokeWidth="0.5" />
                <circle cx="28" cy="28" r="1.2" fill="#ffffff" />
              </g>

              {/* Top-Right Corner */}
              <g transform="translate(357, 13) scale(-1, 1)" filter="url(#goldEmbossShadow)">
                <path
                  d="M0,32 C4,20 18,5 32,0 C24,10 20,20 22,30 C15,26 8,26 0,32 Z"
                  fill="url(#goldFiligreeGrad)"
                />
                <path
                  d="M0,20 C8,15 15,8 20,0"
                  stroke="#fff4cf"
                  strokeWidth="0.9"
                  fill="none"
                />
                <path
                  d="M10,26 C16,22 22,16 26,10"
                  stroke="#6e4d14"
                  strokeWidth="0.6"
                  fill="none"
                />
                <polygon points="28,24 32,28 28,32 24,28" fill="#ffe28a" stroke="#6e4d14" strokeWidth="0.5" />
                <circle cx="28" cy="28" r="1.2" fill="#ffffff" />
              </g>

              {/* Bottom-Left Corner */}
              <g transform="translate(13, 577) scale(1, -1)" filter="url(#goldEmbossShadow)">
                <path
                  d="M0,32 C4,20 18,5 32,0 C24,10 20,20 22,30 C15,26 8,26 0,32 Z"
                  fill="url(#goldFiligreeGrad)"
                />
                <path
                  d="M0,20 C8,15 15,8 20,0"
                  stroke="#fff4cf"
                  strokeWidth="0.9"
                  fill="none"
                />
                <path
                  d="M10,26 C16,22 22,16 26,10"
                  stroke="#6e4d14"
                  strokeWidth="0.6"
                  fill="none"
                />
                <polygon points="28,24 32,28 28,32 24,28" fill="#ffe28a" stroke="#6e4d14" strokeWidth="0.5" />
                <circle cx="28" cy="28" r="1.2" fill="#ffffff" />
              </g>

              {/* Bottom-Right Corner */}
              <g transform="translate(357, 577) scale(-1, -1)" filter="url(#goldEmbossShadow)">
                <path
                  d="M0,32 C4,20 18,5 32,0 C24,10 20,20 22,30 C15,26 8,26 0,32 Z"
                  fill="url(#goldFiligreeGrad)"
                />
                <path
                  d="M0,20 C8,15 15,8 20,0"
                  stroke="#fff4cf"
                  strokeWidth="0.9"
                  fill="none"
                />
                <path
                  d="M10,26 C16,22 22,16 26,10"
                  stroke="#6e4d14"
                  strokeWidth="0.6"
                  fill="none"
                />
                <polygon points="28,24 32,28 28,32 24,28" fill="#ffe28a" stroke="#6e4d14" strokeWidth="0.5" />
                <circle cx="28" cy="28" r="1.2" fill="#ffffff" />
              </g>

              {/* Center Top Ornamental Cartouche Flourish */}
              <g transform="translate(185, 11)" filter="url(#goldEmbossShadow)">
                <path
                  d="M-18,0 C-10,3 -4,5 0,1 C4,5 10,3 18,0 C12,-2 6,-3 0,-1 C-6,-3 -12,-2 -18,0 Z"
                  fill="url(#goldFiligreeGrad)"
                />
                <circle cx="0" cy="1" r="1.8" fill="#ffe49e" stroke="#6e4d14" strokeWidth="0.4" />
              </g>

              {/* Center Bottom Ornamental Cartouche Flourish */}
              <g transform="translate(185, 579) scale(1, -1)" filter="url(#goldEmbossShadow)">
                <path
                  d="M-18,0 C-10,3 -4,5 0,1 C4,5 10,3 18,0 C12,-2 6,-3 0,-1 C-6,-3 -12,-2 -18,0 Z"
                  fill="url(#goldFiligreeGrad)"
                />
                <circle cx="0" cy="1" r="1.8" fill="#ffe49e" stroke="#6e4d14" strokeWidth="0.4" />
              </g>

              {/* Side Waist Accent Diamond Rosettes */}
              <g transform="translate(11, 295)" filter="url(#goldEmbossShadow)">
                <polygon points="0,-4 3,0 0,4 -3,0" fill="#ffd978" stroke="#6e4d14" strokeWidth="0.4" />
              </g>
              <g transform="translate(359, 295)" filter="url(#goldEmbossShadow)">
                <polygon points="0,-4 3,0 0,4 -3,0" fill="#ffd978" stroke="#6e4d14" strokeWidth="0.4" />
              </g>
            </svg>

            {/* 1. Header Plaque: "Sarthak" (Embossed Golden Cartouche Ribbon) */}
            <div className="relative z-20 pt-1 pb-1 flex flex-col items-center">
              <div
                className="relative px-6 sm:px-8 py-1 rounded-md border border-[#8f661a] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_2px_6px_rgba(0,0,0,0.18)]"
                style={{
                  background:
                    "linear-gradient(180deg, #fff9e6 0%, #f4e1b5 50%, #e2be79 100%)",
                }}
              >
                {/* Side Ribbon Fishtail Notch Ornaments */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-4 bg-[#b58b32] rounded-l-sm" />
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-4 bg-[#b58b32] rounded-r-sm" />

                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-[0.22em] text-[#3d2708] drop-shadow-[0_1px_0_rgba(255,255,255,0.8)] uppercase">
                  {abilityCardData.name}
                </h3>
              </div>
            </div>

            {/* 2. Photograph Frame with Sarthak's Real Portrait */}
            <div className="relative z-20 flex justify-center py-1">
              <div
                className="relative w-[240px] sm:w-[260px] h-[165px] sm:h-[185px] rounded-lg overflow-hidden border-2 border-[#b58b32] shadow-[inset_0_0_12px_rgba(0,0,0,0.4),0_6px_16px_rgba(0,0,0,0.22)]"
                style={{
                  boxShadow:
                    "0 0 0 1px #6b4c13, 0 0 0 3px #d6a940, 0 6px 16px rgba(0,0,0,0.25)",
                }}
              >
                {/* Photographic Warm Studio Bokeh Aura Backdrop */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a1d12] via-[#1c1510] to-[#0d0a08]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(240,180,60,0.35)_0%,rgba(160,95,20,0.15)_45%,transparent_75%)]" />

                {/* Fine Vignette Border */}
                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 pointer-events-none z-10" />

                {/* Sarthak's Real Cutout Portrait */}
                <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
                  <Image
                    src="/portrait-cutout.png"
                    alt={`${abilityCardData.name} — Real Portrait`}
                    fill
                    priority
                    quality={95}
                    className="object-contain object-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] filter contrast-[1.04] saturate-[1.05]"
                  />
                </div>

                {/* Subtle Inner Filigree Corner Rosettes */}
                <div className="absolute top-1 left-1 text-[9px] text-[#e8c362] opacity-80 pointer-events-none z-10">✦</div>
                <div className="absolute top-1 right-1 text-[9px] text-[#e8c362] opacity-80 pointer-events-none z-10">✦</div>
                <div className="absolute bottom-1 left-1 text-[9px] text-[#e8c362] opacity-80 pointer-events-none z-10">✦</div>
                <div className="absolute bottom-1 right-1 text-[9px] text-[#e8c362] opacity-80 pointer-events-none z-10">✦</div>
              </div>
            </div>

            {/* 3. Honest Learning Areas Section (No fake ratings!) */}
            <div className="relative z-20 px-2 sm:px-3 pt-1 flex-1 flex flex-col justify-center">
              <div
                className="rounded-lg p-2.5 sm:p-3 border border-[#c49a3c]/70 shadow-[inset_0_1px_3px_rgba(255,255,255,0.6),0_2px_8px_rgba(0,0,0,0.06)]"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,252,245,0.85) 0%, rgba(246,238,227,0.85) 100%)",
                }}
              >
                {/* Learning Areas List */}
                <div className="space-y-1.5 sm:space-y-2">
                  {abilityCardData.learningAreas.map((area) => (
                    <div
                      key={area.name}
                      className="flex items-baseline justify-between text-xs sm:text-[13px] leading-tight"
                    >
                      {/* Left: Skill / Topic Name */}
                      <span className="font-serif font-bold text-[#32210d] tracking-wide whitespace-nowrap">
                        {area.name}
                      </span>

                      {/* Middle: Ornamental Dotted Leader */}
                      <span className="mx-2 flex-1 border-b border-dotted border-[#b38830]/60 h-0 translate-y-[-3px]" />

                      {/* Right: Honest Learning Status Badge */}
                      <span className="font-serif italic text-[10px] sm:text-[11px] text-[#7a5317] font-semibold tracking-wide whitespace-nowrap">
                        {area.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Bottom Ribbon / Cartouche Footer */}
            <div className="relative z-20 pt-1 pb-1 flex flex-col items-center">
              {/* Filigree Knot Divider Line */}
              <div className="w-full flex items-center justify-center gap-2 mb-1 opacity-70">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#b58b32] to-transparent" />
                <span className="text-[#a87e2b] text-xs">❖</span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#b58b32] to-transparent" />
              </div>

              {/* Subtitle Details */}
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-serif text-[#634517] tracking-wider uppercase font-semibold">
                <span>{abilityCardData.footerInfo.institution}</span>
                <span>•</span>
                <span>{abilityCardData.footerInfo.focus}</span>
                <span>•</span>
                <span>{abilityCardData.footerInfo.location}</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BACK SIDE: GLOWING GOLDEN COMPASS (Reference Image 2)                     */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 rounded-[26px] overflow-hidden flex flex-col justify-between p-4 sm:p-5 border border-[#e5c158]/50 bg-gradient-to-b from-[#0d0e14] via-[#08090d] to-[#040407] text-center"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              boxShadow:
                "0 0 0 1px #42300d, 0 0 0 2.5px #ba8d32, 0 0 0 4px #261b07, 0 0 35px rgba(229,193,88,0.32), 0 25px 60px rgba(0,0,0,0.9)",
            }}
          >
            {/* Dynamic Specular Sheen for Back */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30 mix-blend-screen"
              style={{
                opacity: glare.opacity * 0.7,
                background: `radial-gradient(circle 280px at ${glare.x}% ${glare.y}%, rgba(255,235,160,0.5) 0%, rgba(220,165,40,0.15) 50%, transparent 80%)`,
              }}
            />

            {/* Refined Double Golden Metallic Borders with Beveled Corners & Celestial Stars */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
              viewBox="0 0 370 590"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient id="backGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff2ba" />
                  <stop offset="25%" stopColor="#dfaa35" />
                  <stop offset="55%" stopColor="#875e18" />
                  <stop offset="80%" stopColor="#ebd085" />
                  <stop offset="100%" stopColor="#573a0c" />
                </linearGradient>

                <filter id="compassGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 1. Outer Golden Border with Beveled Corners */}
              <polygon
                points="24,8 346,8 362,24 362,566 346,582 24,582 8,566 8,24"
                stroke="url(#backGoldGrad)"
                strokeWidth="2"
                fill="none"
              />

              {/* 2. Middle Golden Hairline Inset */}
              <polygon
                points="27,13 343,13 357,27 357,563 343,577 27,577 13,563 13,27"
                stroke="#a67c2e"
                strokeWidth="0.8"
                fill="none"
              />

              {/* 3. Inner Decorative Beaded Hairline */}
              <polygon
                points="31,18 339,18 352,31 352,559 339,572 31,572 18,559 18,31"
                stroke="url(#backGoldGrad)"
                strokeWidth="0.65"
                strokeDasharray="3 2"
                fill="none"
                opacity="0.85"
              />

              {/* Corner Celestial Rosette Star Accents */}
              {/* Top-Left */}
              <g transform="translate(27, 27)">
                <circle cx="0" cy="0" r="4.5" stroke="#a67c2e" strokeWidth="0.6" fill="none" />
                <circle cx="0" cy="0" r="2" fill="#ffe28a" />
                <line x1="-6" y1="0" x2="6" y2="0" stroke="#ffe28a" strokeWidth="0.5" />
                <line x1="0" y1="-6" x2="0" y2="6" stroke="#ffe28a" strokeWidth="0.5" />
              </g>

              {/* Top-Right */}
              <g transform="translate(343, 27)">
                <circle cx="0" cy="0" r="4.5" stroke="#a67c2e" strokeWidth="0.6" fill="none" />
                <circle cx="0" cy="0" r="2" fill="#ffe28a" />
                <line x1="-6" y1="0" x2="6" y2="0" stroke="#ffe28a" strokeWidth="0.5" />
                <line x1="0" y1="-6" x2="0" y2="6" stroke="#ffe28a" strokeWidth="0.5" />
              </g>

              {/* Bottom-Left */}
              <g transform="translate(27, 563)">
                <circle cx="0" cy="0" r="4.5" stroke="#a67c2e" strokeWidth="0.6" fill="none" />
                <circle cx="0" cy="0" r="2" fill="#ffe28a" />
                <line x1="-6" y1="0" x2="6" y2="0" stroke="#ffe28a" strokeWidth="0.5" />
                <line x1="0" y1="-6" x2="0" y2="6" stroke="#ffe28a" strokeWidth="0.5" />
              </g>

              {/* Bottom-Right */}
              <g transform="translate(343, 563)">
                <circle cx="0" cy="0" r="4.5" stroke="#a67c2e" strokeWidth="0.6" fill="none" />
                <circle cx="0" cy="0" r="2" fill="#ffe28a" />
                <line x1="-6" y1="0" x2="6" y2="0" stroke="#ffe28a" strokeWidth="0.5" />
                <line x1="0" y1="-6" x2="0" y2="6" stroke="#ffe28a" strokeWidth="0.5" />
              </g>
            </svg>

            {/* Radiant Ambient Core Glow Behind Compass */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(235,175,50,0.25)_0%,rgba(180,120,30,0.08)_50%,transparent_75%)] rounded-full blur-[45px] pointer-events-none" />

            {/* 1. Back Header Quote */}
            <div className="relative z-20 pt-2 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1.5 opacity-70">
                <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#e5be58]" />
                <span className="text-[#e5be58] text-[10px]">✦</span>
                <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#e5be58]" />
              </div>

              <h4 className="font-serif text-base sm:text-lg font-bold tracking-wider text-[#ffe49e] drop-shadow-[0_2px_8px_rgba(235,180,50,0.4)]">
                {abilityCardData.backQuote.heading}
              </h4>
            </div>

            {/* 2. CENTERPIECE: Intricate Glowing Golden Compass SVG (Reference Image 2) */}
            <div className="relative z-20 flex-1 flex items-center justify-center py-2">
              <div className="relative w-[215px] sm:w-[235px] h-[215px] sm:h-[235px] flex items-center justify-center">
                <svg
                  viewBox="0 0 260 260"
                  className="w-full h-full overflow-visible drop-shadow-[0_0_20px_rgba(235,175,50,0.5)]"
                >
                  <defs>
                    {/* Metallic Golden Facet Gradients for 3D Compass Needles */}
                    <linearGradient id="needleLightGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="30%" stopColor="#fff0b8" />
                      <stop offset="65%" stopColor="#e8bf56" />
                      <stop offset="100%" stopColor="#b38220" />
                    </linearGradient>

                    <linearGradient id="needleDarkBronze" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8c6218" />
                      <stop offset="50%" stopColor="#54390b" />
                      <stop offset="100%" stopColor="#291a04" />
                    </linearGradient>

                    <linearGradient id="compassRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fff0ba" />
                      <stop offset="25%" stopColor="#caa038" />
                      <stop offset="50%" stopColor="#7a5518" />
                      <stop offset="75%" stopColor="#f5cf6d" />
                      <stop offset="100%" stopColor="#94671e" />
                    </linearGradient>
                  </defs>

                  {/* Outer Graduation Ring with Tick Marks */}
                  <circle cx="130" cy="130" r="120" stroke="url(#compassRingGrad)" strokeWidth="2" fill="none" opacity="0.95" />
                  <circle cx="130" cy="130" r="114" stroke="#caa038" strokeWidth="0.8" strokeDasharray="1.5 2.5" fill="none" opacity="0.8" />
                  <circle cx="130" cy="130" r="104" stroke="url(#compassRingGrad)" strokeWidth="1.2" fill="none" />

                  {/* Cardinal & Degree Ticks (72 markings around circle, every 5 degrees) */}
                  {Array.from({ length: 72 }).map((_, i) => {
                    const angle = (i * 5 * Math.PI) / 180;
                    const isCardinal = i % 18 === 0;
                    const isMajor = i % 6 === 0;
                    const r1 = isCardinal ? 101 : isMajor ? 104 : 108;
                    const r2 = 114;
                    const x1 = 130 + r1 * Math.sin(angle);
                    const y1 = 130 - r1 * Math.cos(angle);
                    const x2 = 130 + r2 * Math.sin(angle);
                    const y2 = 130 - r2 * Math.cos(angle);
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isCardinal ? "#fff4cf" : isMajor ? "#ffd978" : "#9e7424"}
                        strokeWidth={isCardinal ? "1.8" : isMajor ? "1.1" : "0.55"}
                        opacity={isCardinal ? 1 : isMajor ? 0.85 : 0.55}
                      />
                    );
                  })}

                  {/* Cardinal Direction Letters: N, E, S, W */}
                  <text x="130" y="99" textAnchor="middle" fill="#ffe28a" fontSize="9" fontFamily="serif" fontWeight="bold" letterSpacing="0.1em">N</text>
                  <text x="130" y="167" textAnchor="middle" fill="#ffe28a" fontSize="9" fontFamily="serif" fontWeight="bold" letterSpacing="0.1em">S</text>
                  <text x="164" y="133" textAnchor="middle" fill="#ffe28a" fontSize="9" fontFamily="serif" fontWeight="bold" letterSpacing="0.1em">E</text>
                  <text x="96" y="133" textAnchor="middle" fill="#ffe28a" fontSize="9" fontFamily="serif" fontWeight="bold" letterSpacing="0.1em">W</text>

                  {/* Astrolabe Circular Arcs & Inner Bands */}
                  <circle cx="130" cy="130" r="88" stroke="url(#compassRingGrad)" strokeWidth="1" fill="none" opacity="0.65" />
                  <circle cx="130" cy="130" r="74" stroke="url(#compassRingGrad)" strokeWidth="1.4" fill="none" opacity="0.8" />
                  <circle cx="130" cy="130" r="54" stroke="#a67c2e" strokeWidth="0.8" strokeDasharray="3 3" fill="none" opacity="0.6" />

                  {/* 16-Ray Delicate Sunburst Background behind Needles */}
                  {Array.from({ length: 16 }).map((_, i) => {
                    const angle = (i * 22.5 * Math.PI) / 180;
                    const x2 = 130 + 58 * Math.sin(angle);
                    const y2 = 130 - 58 * Math.cos(angle);
                    return (
                      <line
                        key={`ray-${i}`}
                        x1="130"
                        y1="130"
                        x2={x2}
                        y2={y2}
                        stroke="#dfaa35"
                        strokeWidth="0.6"
                        opacity="0.35"
                      />
                    );
                  })}

                  {/* 8-POINT FACETED GOLDEN COMPASS STAR */}
                  {/* --- Secondary Intercardinal Points (NE, SE, SW, NW) --- */}
                  <g transform="rotate(45, 130, 130)">
                    {/* North-East facet pair */}
                    <polygon points="130,130 130,68 138,130" fill="url(#needleLightGold)" opacity="0.9" />
                    <polygon points="130,130 130,68 122,130" fill="url(#needleDarkBronze)" opacity="0.9" />
                    {/* South-East facet pair */}
                    <polygon points="130,130 192,130 130,138" fill="url(#needleLightGold)" opacity="0.9" />
                    <polygon points="130,130 192,130 130,122" fill="url(#needleDarkBronze)" opacity="0.9" />
                    {/* South-West facet pair */}
                    <polygon points="130,130 130,192 122,130" fill="url(#needleLightGold)" opacity="0.9" />
                    <polygon points="130,130 130,192 138,130" fill="url(#needleDarkBronze)" opacity="0.9" />
                    {/* North-West facet pair */}
                    <polygon points="130,130 68,130 130,122" fill="url(#needleLightGold)" opacity="0.9" />
                    <polygon points="130,130 68,130 130,138" fill="url(#needleDarkBronze)" opacity="0.9" />
                  </g>

                  {/* --- Primary Cardinal Points (N, E, S, W) --- */}
                  {/* North Point (Elongated Spearhead reaching r=92) */}
                  <polygon points="130,130 130,38 143,130" fill="url(#needleLightGold)" />
                  <polygon points="130,130 130,38 117,130" fill="url(#needleDarkBronze)" />

                  {/* South Point */}
                  <polygon points="130,130 130,222 117,130" fill="url(#needleLightGold)" />
                  <polygon points="130,130 130,222 143,130" fill="url(#needleDarkBronze)" />

                  {/* East Point */}
                  <polygon points="130,130 222,130 130,143" fill="url(#needleLightGold)" />
                  <polygon points="130,130 222,130 130,117" fill="url(#needleDarkBronze)" />

                  {/* West Point */}
                  <polygon points="130,130 38,130 130,117" fill="url(#needleLightGold)" />
                  <polygon points="130,130 38,130 130,143" fill="url(#needleDarkBronze)" />

                  {/* Central Metallic Astrolabe Hub & Glowing Jewel */}
                  <circle cx="130" cy="130" r="23" fill="url(#compassRingGrad)" stroke="#52380d" strokeWidth="1.2" />
                  <circle cx="130" cy="130" r="16" fill="#140f09" stroke="#ffe28a" strokeWidth="0.9" />
                  <circle cx="130" cy="130" r="7" fill="#ffe28a" />
                  <circle cx="128" cy="128" r="2.5" fill="#ffffff" />
                </svg>
              </div>
            </div>

            {/* 3. Back Meaningful Subtitle Message */}
            <div className="relative z-20 pb-2 px-3 flex flex-col items-center">
              <p className="font-serif italic text-xs sm:text-[13px] text-[#e8cfa0]/90 leading-relaxed max-w-[280px]">
                &ldquo;{abilityCardData.backQuote.subheading}&rdquo;
              </p>

              {/* Ornamental Divider with Institutional Crest Monogram */}
              <div className="w-full flex items-center justify-center gap-2 mt-2 pt-2 border-t border-[#b58b32]/30">
                <span className="text-[10px] font-mono tracking-widest text-[#d4a737] uppercase">
                  ✦ {abilityCardData.name} • {abilityCardData.institution} ✦
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Flip Hint & Interactive Controls */}
      <div className="mt-5 flex items-center gap-3 z-30">
        <button
          onClick={toggleFlip}
          onMouseEnter={() => sound.playHover()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-[#e5c158]/40 hover:border-[#e5c158] backdrop-blur-md text-xs font-serif tracking-wider text-[#ffe899] shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-all hover:scale-105 group"
          title="Flip Card (or click card)"
        >
          <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500 text-[#e5c158]" />
          <span>{isFlipped ? "View Front Attributes" : "Flip to Golden Compass"}</span>
        </button>
      </div>
    </div>
  );
}
