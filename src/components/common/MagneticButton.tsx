"use client";

import { useRef, useState } from "react";
import { sound } from "@/lib/sound";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  href?: string;
}

export function MagneticButton({
  children,
  variant = "primary",
  href,
  className = "",
  onClick,
  ...props
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.35;
    const y = (e.clientY - (top + height / 2)) * 0.35;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    sound.playHover();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    sound.playClick();
    if (onClick) onClick(e);
  };

  const baseStyle =
    "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-mono text-sm tracking-wider uppercase transition-all duration-300 overflow-hidden group";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] hover:scale-[1.03]",
    secondary:
      "bg-white/5 text-white border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 backdrop-blur-md shadow-glass hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]",
    outline:
      "border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]",
  };

  const content = (
    <div
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: "transform 0.15s cubic-bezier(0.2, 0, 0.1, 1)",
      }}
      className="inline-block"
    >
      <button
        onClick={handleClick}
        className={`${baseStyle} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {/* Glow overlay */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-700 pointer-events-none" />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        {content}
      </a>
    );
  }

  return content;
}
