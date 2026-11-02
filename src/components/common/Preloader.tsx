"use client";

import { useEffect, useState, useRef, useCallback } from "react";

export function Preloader({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("INITIALIZING CORE SYSTEMS");
  const [isFading, setIsFading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackRef = useRef<NodeJS.Timeout | null>(null);
  const isFinishedRef = useRef(false);

  const finishPreloader = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;

    if (timerRef.current) clearInterval(timerRef.current);
    if (fallbackRef.current) clearTimeout(fallbackRef.current);

    setProgress(100);
    setPhase("READY • SYSTEM ONLINE");
    setIsFading(true);

    setTimeout(() => {
      setIsFinished(true);
      onComplete?.();
    }, 280);
  }, [onComplete]);

  useEffect(() => {
    let currentProgress = 0;

    // Fast, smooth telemetry progress ticks (completes in ~800-1100ms)
    timerRef.current = setInterval(() => {
      if (isFinishedRef.current) {
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }

      // Increment by random 5% - 12% per 35ms
      const increment = Math.floor(Math.random() * 8) + 5;
      currentProgress = Math.min(currentProgress + increment, 100);

      setProgress(currentProgress);

      if (currentProgress > 30 && currentProgress <= 65) {
        setPhase("WARMING WEBGL SHADERS");
      } else if (currentProgress > 65 && currentProgress < 95) {
        setPhase("SYNCHRONIZING SCENE GRAPH");
      } else if (currentProgress >= 95) {
        setPhase("READY • SYSTEM ONLINE");
      }

      if (currentProgress >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        finishPreloader();
      }
    }, 35);

    // Hard fallback safety: finish after max 1.8s no matter what
    fallbackRef.current = setTimeout(() => {
      finishPreloader();
    }, 1800);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (fallbackRef.current) clearTimeout(fallbackRef.current);
    };
  }, [finishPreloader]);

  if (isFinished) return null;

  return (
    <div
      onClick={finishPreloader}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050508] transition-all duration-300 ease-out cursor-pointer select-none ${
        isFading ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100"
      }`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      title="Click or tap anywhere to skip preloader"
    >
      {/* Background radial glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Futuristic Telemetry HUD */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        {/* Animated Cyber Core Icon */}
        <div className="relative w-16 h-16 mb-8 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-spin-slow" />
          <div className="absolute inset-2 rounded-full border-t border-cyan-400 animate-spin" />
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f0ff]" />
        </div>

        {/* Counter with leading zero */}
        <div className="font-mono text-5xl md:text-6xl font-light tracking-tighter text-white mb-3 pointer-events-none">
          {progress < 10 ? `0${progress}` : progress}
          <span className="text-cyan-400 text-2xl font-normal">%</span>
        </div>

        {/* Phase subtitle */}
        <p className="font-mono text-xs tracking-[0.25em] text-slate-400 uppercase mb-6 pointer-events-none">
          {phase}
        </p>

        {/* Progress Line */}
        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400 transition-all duration-100 ease-out shadow-[0_0_10px_#00f0ff]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* System metadata & interactive TAP TO SKIP button */}
        <div className="mt-8 flex items-center justify-between w-full text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          <span>PORTFOLIO // 2026</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              finishPreloader();
            }}
            className="text-cyan-400/80 hover:text-cyan-300 font-mono text-[9px] px-2 py-1 rounded border border-cyan-500/20 hover:border-cyan-500/40 transition-colors pointer-events-auto"
            title="Skip loading screen immediately"
          >
            TAP TO SKIP
          </button>
        </div>
      </div>
    </div>
  );
}
