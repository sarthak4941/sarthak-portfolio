"use client";

import { useEffect, useState, useRef } from "react";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const requestRef = useRef<number>();

  useEffect(() => {
    // Only enable custom cursor on devices that support fine hover
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    let activeListeners: Array<{ el: Element; enter: () => void; leave: () => void }> = [];

    const attachHoverListeners = () => {
      // Remove old
      activeListeners.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
      activeListeners = [];

      const interactables = document.querySelectorAll(
        "a, button, input, textarea, [data-interactive='true'], .glass-panel"
      );

      interactables.forEach((el) => {
        const enter = () => setIsHovered(true);
        const leave = () => setIsHovered(false);
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        activeListeners.push({ el, enter, leave });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });

    attachHoverListeners();

    // Re-check periodically or on DOM changes
    const timer = setInterval(attachHoverListeners, 2000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      clearInterval(timer);
      activeListeners.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  // Smooth lerp for outer follower ring
  useEffect(() => {
    const loop = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18,
      }));
      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [pos]);

  if (!isVisible) return null;

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Outer Glow Ring */}
      <div
        className="fixed top-0 left-0 rounded-full border border-cyan-400/40 pointer-events-none transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${trailingPos.x - (isHovered ? 28 : 16)}px, ${
            trailingPos.y - (isHovered ? 28 : 16)
          }px, 0) scale(${isClicked ? 0.75 : 1})`,
          width: isHovered ? "56px" : "32px",
          height: isHovered ? "56px" : "32px",
          backgroundColor: isHovered
            ? "rgba(0, 240, 255, 0.08)"
            : "transparent",
          boxShadow: isHovered
            ? "0 0 25px rgba(0, 240, 255, 0.35)"
            : "0 0 10px rgba(0, 240, 255, 0.1)",
        }}
      />

      {/* Inner Dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-cyan-400 pointer-events-none shadow-[0_0_8px_#00f0ff]"
        style={{
          transform: `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0)`,
        }}
      />
    </div>
  );
}
