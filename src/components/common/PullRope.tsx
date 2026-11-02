"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { sound } from "@/lib/sound";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// Generate smooth cubic Bézier SVG path from chain of points
function getSmoothSplinePath(points: Point[], anchorX: number): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;

  // Virtual point above ceiling mount ensures strictly vertical entry at top
  const extended = [{ x: anchorX, y: -35, vx: 0, vy: 0 }, ...points];

  for (let i = 1; i < extended.length - 1; i++) {
    const p0 = extended[i - 1];
    const p1 = extended[i];
    const p2 = extended[i + 1];
    const p3 = i + 2 < extended.length ? extended[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }
  return d;
}

const NODE_COUNT = 9;
const ANCHOR_X = 120;
const DEFAULT_L0 = 190;

const INITIAL_NODES: Point[] = Array.from({ length: NODE_COUNT }, (_, i) => ({
  x: ANCHOR_X,
  y: i * (DEFAULT_L0 / (NODE_COUNT - 1)),
  vx: 0,
  vy: 0,
}));
const INITIAL_PATH = getSmoothSplinePath(INITIAL_NODES, ANCHOR_X);

export function PullRope() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isThresholdExceeded, setIsThresholdExceeded] = useState(false);

  // SVG Render State (60fps reactive updates)
  const [pathString, setPathString] = useState(INITIAL_PATH);
  const [handleState, setHandleState] = useState({ x: ANCHOR_X, y: DEFAULT_L0, angle: 0 });

  // Physics Chain Nodes (Verlet + Spring Simulation)
  const restLengthRef = useRef(DEFAULT_L0);
  const nodesRef = useRef<Point[]>(INITIAL_NODES);
  const animFrameRef = useRef<number | null>(null);
  const hasAutoPulledRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);

  // Drag tracking refs
  const dragTracker = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    vx: 0,
    vy: 0,
    totalDist: 0,
    maxDownward: 0,
    startTime: 0,
    isThresholdMet: false,
  });

  // Handle spring physics state
  const handlePhysics = useRef({
    x: 120,
    y: 190,
    vx: 0,
    vy: 0,
  });

  // Theme Sync on Mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light") {
        setTheme("light");
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", "#f5f0e8");
      } else {
        setTheme("dark");
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", "#0c0d12");
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        prefersReducedMotionRef.current = true;
      }

      const updateDimensions = () => {
        const mobile = window.innerWidth < 768 || window.innerHeight < 700;
        setIsMobile(mobile);
        restLengthRef.current = mobile ? 155 : 195;
      };
      updateDimensions();
      window.addEventListener("resize", updateDimensions, { passive: true });
      return () => window.removeEventListener("resize", updateDimensions);
    } catch {
      // Ignore
    }
  }, []);

  // Initialize node chain & cleanup physics animation on unmount
  useEffect(() => {
    const L0 = restLengthRef.current;
    const seg = L0 / (NODE_COUNT - 1);
    const initialNodes: Point[] = Array.from({ length: NODE_COUNT }, (_, i) => ({
      x: ANCHOR_X,
      y: i * seg,
      vx: 0,
      vy: 0,
    }));
    nodesRef.current = initialNodes;
    handlePhysics.current = {
      x: ANCHOR_X,
      y: L0,
      vx: 0,
      vy: 0,
    };
    setHandleState({ x: ANCHOR_X, y: L0, angle: 0 });
    setPathString(getSmoothSplinePath(initialNodes, ANCHOR_X));

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", nextTheme);
        if (nextTheme === "light") {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
          const meta = document.querySelector('meta[name="theme-color"]');
          if (meta) meta.setAttribute("content", "#f5f0e8");
        } else {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
          const meta = document.querySelector('meta[name="theme-color"]');
          if (meta) meta.setAttribute("content", "#0c0d12");
        }
      } catch {
        // Fallback
      }
      sound.playLightSwitch(nextTheme === "light");
      return nextTheme;
    });
  }, []);

  // Smooth flexible curve and handle angle calculation
  const updateRopeGeometry = useCallback(() => {
    const nodes = nodesRef.current;
    if (nodes.length < 2) return;

    // Angle of handle at bottom node
    const bottom = nodes[nodes.length - 1];
    const prev = nodes[nodes.length - 2];
    const dx = bottom.x - prev.x;
    const dy = bottom.y - prev.y;
    const angle = (Math.atan2(dx, dy) * 180) / Math.PI;

    setHandleState({ x: bottom.x, y: bottom.y, angle });
    setPathString(getSmoothSplinePath(nodes, ANCHOR_X));
  }, []);

  // Continuous flexible physics simulation loop (Verlet chain + Spring Handle)
  const startSpringSimulation = useCallback(
    (initialVx: number = 0, initialVy: number = 0) => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      if (prefersReducedMotionRef.current) {
        const L0 = restLengthRef.current;
        const seg = L0 / (NODE_COUNT - 1);
        nodesRef.current.forEach((n, i) => {
          n.x = ANCHOR_X;
          n.y = i * seg;
          n.vx = 0;
          n.vy = 0;
        });
        handlePhysics.current = { x: ANCHOR_X, y: L0, vx: 0, vy: 0 };
        updateRopeGeometry();
        return;
      }

      handlePhysics.current.vx = initialVx;
      handlePhysics.current.vy = initialVy;

      // Spring & Damping constants
      const kY = 0.17; // vertical spring stiffness
      const dampingY = 0.81; // vertical damping
      const kX = 0.048; // pendulum lateral restoring torque
      const dampingX = 0.93; // lateral damping
      const gravity = 0.22; // node gravity sag

      let lastTimestamp = performance.now();

      const physicsStep = (now: number) => {
        const dt = Math.min((now - lastTimestamp) / 16.67, 2.0);
        lastTimestamp = now;

        const L0 = restLengthRef.current;
        const handle = handlePhysics.current;
        const nodes = nodesRef.current;

        // 1. Handle Spring Dynamics
        const forceY = -kY * (handle.y - L0);
        handle.vy = (handle.vy + forceY * dt) * Math.pow(dampingY, dt);
        handle.y += handle.vy * dt;

        const forceX = -kX * (handle.x - ANCHOR_X);
        handle.vx = (handle.vx + forceX * dt) * Math.pow(dampingX, dt);
        handle.x += handle.vx * dt;

        // Pin top node and set bottom node to handle
        nodes[0].x = ANCHOR_X;
        nodes[0].y = 0;
        nodes[NODE_COUNT - 1].x = handle.x;
        nodes[NODE_COUNT - 1].y = handle.y;

        // 2. Intermediate Nodes Wave Physics
        for (let i = 1; i < NODE_COUNT - 1; i++) {
          const ratio = i / (NODE_COUNT - 1);
          // Ideal resting target along curve
          const targetX = ANCHOR_X + (handle.x - ANCHOR_X) * Math.pow(ratio, 1.2);
          const targetY = handle.y * ratio + Math.sin(ratio * Math.PI) * 1.5; // subtle natural gravity sag

          // Smooth elastic follow
          nodes[i].vx = (nodes[i].vx + (targetX - nodes[i].x) * 0.38) * 0.76;
          nodes[i].vy = (nodes[i].vy + (targetY - nodes[i].y) * 0.38 + gravity) * 0.76;

          nodes[i].x += nodes[i].vx * dt;
          nodes[i].y += nodes[i].vy * dt;
        }

        updateRopeGeometry();

        // 3. Settlement check
        const isYSettled = Math.abs(handle.y - L0) < 0.12 && Math.abs(handle.vy) < 0.12;
        const isXSettled = Math.abs(handle.x - ANCHOR_X) < 0.12 && Math.abs(handle.vx) < 0.12;

        if (isYSettled && isXSettled) {
          handle.x = ANCHOR_X;
          handle.y = L0;
          handle.vx = 0;
          handle.vy = 0;
          const seg = L0 / (NODE_COUNT - 1);
          nodes.forEach((n, i) => {
            n.x = ANCHOR_X;
            n.y = i * seg;
            n.vx = 0;
            n.vy = 0;
          });
          updateRopeGeometry();
          animFrameRef.current = null;
        } else {
          animFrameRef.current = requestAnimationFrame(physicsStep);
        }
      };

      animFrameRef.current = requestAnimationFrame(physicsStep);
    },
    [updateRopeGeometry]
  );

  // Automatic Load Entrance Animation (Smooth pull-down and spring recoil once per page load)
  useEffect(() => {
    if (hasAutoPulledRef.current) return;
    hasAutoPulledRef.current = true;

    if (prefersReducedMotionRef.current) return;

    const timer = setTimeout(() => {
      let startTime: number | null = null;
      const duration = 440;
      const pullDownAmount = 30; // 30px gentle downward pull
      const L0 = restLengthRef.current;

      const entranceStep = (now: number) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = Math.sin(progress * (Math.PI / 2));

        const curY = L0 + eased * pullDownAmount;
        handlePhysics.current.y = curY;
        handlePhysics.current.x = ANCHOR_X;

        // Curve intermediate nodes smoothly
        const nodes = nodesRef.current;
        nodes[0].x = ANCHOR_X;
        nodes[0].y = 0;
        nodes[NODE_COUNT - 1].x = ANCHOR_X;
        nodes[NODE_COUNT - 1].y = curY;

        for (let i = 1; i < NODE_COUNT - 1; i++) {
          const ratio = i / (NODE_COUNT - 1);
          nodes[i].x = ANCHOR_X;
          nodes[i].y = curY * ratio;
        }

        updateRopeGeometry();

        if (progress < 1) {
          requestAnimationFrame(entranceStep);
        } else {
          // Release with spring recoil without changing theme!
          sound.playHover();
          startSpringSimulation(1.5, -12);
        }
      };

      requestAnimationFrame(entranceStep);
    }, 700);

    return () => clearTimeout(timer);
  }, [startSpringSimulation, updateRopeGeometry]);

  // Quick Click Pull Animation (smooth 120ms pull down + immediate theme toggle)
  const performQuickClick = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    if (prefersReducedMotionRef.current) {
      toggleTheme();
      return;
    }

    const L0 = restLengthRef.current;
    const clickPull = 26;
    let startTime: number | null = null;
    const duration = 110;

    const clickStep = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = Math.sin(progress * (Math.PI / 2));
      const curY = L0 + eased * clickPull;

      handlePhysics.current.y = curY;
      const nodes = nodesRef.current;
      nodes[NODE_COUNT - 1].y = curY;
      for (let i = 1; i < NODE_COUNT - 1; i++) {
        const ratio = i / (NODE_COUNT - 1);
        nodes[i].y = curY * ratio;
      }
      updateRopeGeometry();

      if (progress < 1) {
        requestAnimationFrame(clickStep);
      } else {
        // Toggle theme at maximum pull point
        toggleTheme();
        // Release into spring physics
        startSpringSimulation(2.0, -14);
      }
    };

    requestAnimationFrame(clickStep);
  }, [toggleTheme, startSpringSimulation, updateRopeGeometry]);

  // Pointer Drag Interaction: flexible bending along mouse/finger coordinates
  const handlePointerDown = (e: React.PointerEvent<SVGElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const now = performance.now();
    dragTracker.current = {
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      lastTime: now,
      vx: 0,
      vy: 0,
      totalDist: 0,
      maxDownward: 0,
      startTime: now,
      isThresholdMet: false,
    };

    setIsDragging(true);
    setIsThresholdExceeded(false);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragTracker.current.startX;
    const deltaY = e.clientY - dragTracker.current.startY;

    const now = performance.now();
    const dt = Math.max((now - dragTracker.current.lastTime) / 1000, 0.001);
    const stepDx = e.clientX - dragTracker.current.lastX;
    const stepDy = e.clientY - dragTracker.current.lastY;

    dragTracker.current.vx = stepDx / dt;
    dragTracker.current.vy = stepDy / dt;
    dragTracker.current.totalDist += Math.hypot(stepDx, stepDy);
    dragTracker.current.lastX = e.clientX;
    dragTracker.current.lastY = e.clientY;
    dragTracker.current.lastTime = now;

    const L0 = restLengthRef.current;

    // Calculate clamped physical handle coordinates
    let targetY = L0;
    if (deltaY > 0) {
      // Downward elastic pull: maximum +130px
      targetY = L0 + Math.min(deltaY * 0.78, 130);
    } else {
      // Upward push: gentle slack up to -35px
      targetY = L0 + Math.max(deltaY * 0.55, -35);
    }

    // Sideways deflection: up to ±95px
    const targetX = ANCHOR_X + Math.max(Math.min(deltaX * 0.75, 95), -95);

    handlePhysics.current.x = targetX;
    handlePhysics.current.y = targetY;

    // Check downward pull threshold for theme trigger (>= 36px past resting length)
    const downwardPull = targetY - L0;
    dragTracker.current.maxDownward = Math.max(dragTracker.current.maxDownward, downwardPull);
    const thresholdMet = downwardPull >= 36;
    dragTracker.current.isThresholdMet = thresholdMet;
    setIsThresholdExceeded(thresholdMet);

    // Update flexible node chain to form a physical curved shape
    const nodes = nodesRef.current;
    nodes[0].x = ANCHOR_X;
    nodes[0].y = 0;
    nodes[NODE_COUNT - 1].x = targetX;
    nodes[NODE_COUNT - 1].y = targetY;

    for (let i = 1; i < NODE_COUNT - 1; i++) {
      const ratio = i / (NODE_COUNT - 1);
      // Quadratic/catenary curve bending with lateral drag lag
      const bendFactor = Math.pow(ratio, 1.25);
      nodes[i].x = ANCHOR_X + (targetX - ANCHOR_X) * bendFactor;
      // Slight vertical gravity belly
      const belly = Math.sin(ratio * Math.PI) * (downwardPull > 0 ? downwardPull * 0.08 : 0);
      nodes[i].y = targetY * ratio + belly;
    }

    updateRopeGeometry();
  };

  const handlePointerUp = (e: React.PointerEvent<SVGElement>) => {
    if (!isDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    setIsDragging(false);
    setIsThresholdExceeded(false);

    const { totalDist, startTime, maxDownward, vx, vy, isThresholdMet } = dragTracker.current;
    const duration = performance.now() - startTime;

    // Case 1: Quick click/tap (less than 8px movement and short duration)
    if (totalDist < 8 && duration < 320) {
      performQuickClick();
      return;
    }

    // Case 2: Intentional downward pull beyond threshold -> TRIGGER THEME SWITCH ON RELEASE!
    if (isThresholdMet || maxDownward >= 36) {
      toggleTheme();
    }

    // Release into flexible spring simulation
    const releaseVx = Math.max(Math.min(vx * 0.025, 22), -22);
    const releaseVy = Math.max(Math.min(vy * 0.025, 22), -22);

    startSpringSimulation(releaseVx, releaseVy);
  };

  const handlePointerCancel = () => {
    if (isDragging) {
      setIsDragging(false);
      setIsThresholdExceeded(false);
      startSpringSimulation(0, 0);
    }
  };

  const isLight = theme === "light";

  return (
    <div
      className="fixed top-0 right-4 sm:right-6 md:right-8 lg:right-10 z-50 select-none pointer-events-none"
      style={{
        position: "fixed",
        top: 0,
        right: isMobile ? "1.2rem" : "2.2rem",
        zIndex: 50,
        touchAction: "none",
      }}
    >
      {/* ================= PURE VECTOR SVG CANVAS (FLEXIBLE CURVED ROPE + HANDLE) ================= */}
      <svg
        width="240"
        height="440"
        className="overflow-visible"
        style={{
          marginLeft: "-120px", // Centers anchor point (x=120) strictly at top-right coordinate
          display: "block",
          background: "transparent",
        }}
        aria-hidden="true"
      >
        <defs>
          {/* Base Tubular 3D Cylinder Shading Gradient */}
          <linearGradient id="ropeBraidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7a6d5a" />
            <stop offset="20%" stopColor="#ded5c5" />
            <stop offset="50%" stopColor="#faf5ec" />
            <stop offset="80%" stopColor="#d8cebc" />
            <stop offset="100%" stopColor="#6e604f" />
          </linearGradient>

          {/* Polished Metallic Golden Brass Gradient for Connector & Rosette */}
          <linearGradient id="brassRibbedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6e5012" />
            <stop offset="18%" stopColor="#b88b2c" />
            <stop offset="36%" stopColor="#ffe99e" />
            <stop offset="62%" stopColor="#dfaa35" />
            <stop offset="84%" stopColor="#966d1e" />
            <stop offset="100%" stopColor="#4a3309" />
          </linearGradient>

          {/* Lathe-Turned Walnut Wood Gradient */}
          <linearGradient id="walnutTeardropGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2b1206" />
            <stop offset="14%" stopColor="#52250f" />
            <stop offset="36%" stopColor="#964c20" />
            <stop offset="58%" stopColor="#733514" />
            <stop offset="84%" stopColor="#451c0a" />
            <stop offset="100%" stopColor="#220c04" />
          </linearGradient>

          {/* Polished Curved Specular Highlight on Knob */}
          <linearGradient id="teardropSpecularGloss" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#ffd8b3" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Soft Natural Ambient Shadow (Delicate and refined, no heavy dark smudges) */}
          <filter id="softNaturalShadow" x="-40%" y="-30%" width="180%" height="160%">
            <feDropShadow dx="1" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* 1. Ceiling Mount Brass Rosette Bracket (Fixed at x=120, y=0) */}
        <rect
          x="115"
          y="0"
          width="10"
          height="3.5"
          rx="1"
          fill="url(#brassRibbedGrad)"
          stroke="#382504"
          strokeWidth="0.4"
        />

        {/* 2. FLEXIBLE CURVED ROPE (Follows the Verlet physical curve path) */}
        {pathString && (
          <g>
            {/* Soft Ambient Shadow Layer */}
            <path
              d={pathString}
              fill="none"
              stroke="#000000"
              strokeWidth="4.5"
              strokeLinecap="round"
              opacity="0.18"
              filter="url(#softNaturalShadow)"
            />

            {/* Base 3D Cream/Ivory Cord Body */}
            <path
              d={pathString}
              fill="none"
              stroke="url(#ropeBraidGrad)"
              strokeWidth="5.2"
              strokeLinecap="round"
            />

            {/* Helical Twisted Cord Highlights (Cream/Ivory Dashes along curve) */}
            <path
              d={pathString}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeDasharray="4 6"
              strokeDashoffset="1"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Helical Twisted Cord Shadow Grooves (Dark Bronze Dashes along curve) */}
            <path
              d={pathString}
              fill="none"
              stroke="#685640"
              strokeWidth="4.8"
              strokeDasharray="2.5 7.5"
              strokeDashoffset="3.5"
              strokeLinecap="round"
              opacity="0.65"
            />
          </g>
        )}

        {/* 3. SEAMLESS WOODEN TEARDROP HANDLE & GOLDEN CONNECTOR */}
        {/* Attaches at handleState (x, y) and rotates along tangent angle */}
        <g
          transform={`translate(${handleState.x}, ${handleState.y}) rotate(${-handleState.angle})`}
          className="pointer-events-auto cursor-pointer group"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onMouseEnter={() => {
            setIsHovered(true);
            sound.playHover();
          }}
          onMouseLeave={() => setIsHovered(false)}
          role="button"
          tabIndex={0}
          aria-label="Interactive flexible pull rope: pull downward or click to toggle theme"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              performQuickClick();
            }
          }}
          style={{
            touchAction: "none",
          }}
        >
          <title>{isLight ? "Pull or click to switch to Dark Mode" : "Pull or click to switch to Beige Light Mode"}</title>
          {/* Knob Assembly with Soft Natural Shadow (centered horizontally at x=0) */}
          <g filter="url(#softNaturalShadow)" transform="translate(-16, 0)">
            {/* ================= GOLDEN METALLIC CONNECTOR (FERRULE) ================= */}
            {/* Top ribbed ring (width 7.6px, meets the flexible rope seamlessly) */}
            <rect
              x="12.2"
              y="0"
              width="7.6"
              height="3.2"
              rx="0.8"
              fill="url(#brassRibbedGrad)"
              stroke="#382504"
              strokeWidth="0.4"
            />
            <line x1="12.8" y1="1" x2="19.2" y2="1" stroke="#fff4cf" strokeWidth="0.5" opacity="0.85" />

            {/* Middle ribbed ring (width 8.6px) */}
            <rect
              x="11.7"
              y="3.4"
              width="8.6"
              height="3.4"
              rx="0.8"
              fill="url(#brassRibbedGrad)"
              stroke="#382504"
              strokeWidth="0.4"
            />
            <line x1="12.3" y1="4.5" x2="19.7" y2="4.5" stroke="#fff4cf" strokeWidth="0.5" opacity="0.85" />

            {/* Bottom ribbed ring (width 9.6px, meets wooden knob top flush) */}
            <rect
              x="11.2"
              y="7.1"
              width="9.6"
              height="3.6"
              rx="0.8"
              fill="url(#brassRibbedGrad)"
              stroke="#382504"
              strokeWidth="0.4"
            />
            <line x1="11.8" y1="8.3" x2="20.2" y2="8.3" stroke="#fff4cf" strokeWidth="0.5" opacity="0.85" />

            {/* Dark recessed groove lines between rings */}
            <line x1="12" y1="3.2" x2="20" y2="3.2" stroke="#221502" strokeWidth="0.5" />
            <line x1="11.5" y1="6.9" x2="20.5" y2="6.9" stroke="#221502" strokeWidth="0.5" />

            {/* ================= WOODEN TEARDROP PULL KNOB ================= */}
            {/* Symmetrical Teardrop Curve */}
            <path
              d="M 11.2,10.6 C 11.2,10.6 5.4,22 5.4,30.5 C 5.4,39.5 10.1,48 16,48 C 21.9,48 26.6,39.5 26.6,30.5 C 26.6,22 20.8,10.6 20.8,10.6 Z"
              fill="url(#walnutTeardropGrad)"
              stroke="#1a0802"
              strokeWidth="0.45"
            />

            {/* Lathe-Turned Woodgrain Lines curving with contour */}
            <path
              d="M 12.5,10.6 C 12.5,10.6 7.8,22.5 7.8,31 C 7.8,38.5 11.5,45.5 14,47.2"
              stroke="#1a0802"
              strokeWidth="0.55"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M 14,10.6 C 14,10.6 10.5,23.5 10.5,31.5 C 10.5,39.5 13.5,46 15,47.6"
              stroke="#7e3f19"
              strokeWidth="0.5"
              fill="none"
              opacity="0.25"
            />
            <path
              d="M 18,10.6 C 18,10.6 21.5,23.5 21.5,31.5 C 21.5,39.5 18.5,46 17,47.6"
              stroke="#7e3f19"
              strokeWidth="0.5"
              fill="none"
              opacity="0.25"
            />
            <path
              d="M 19.5,10.6 C 19.5,10.6 24.2,22.5 24.2,31 C 24.2,38.5 20.5,45.5 18,47.2"
              stroke="#1a0802"
              strokeWidth="0.55"
              fill="none"
              opacity="0.3"
            />

            {/* Specular Curved Highlight on Left Edge (lacquer shine) */}
            <path
              d="M 10.5,14.5 C 8.2,21 8,29 9.8,34.5 C 10.8,34.2 11.2,21.5 11.6,14.5 Z"
              fill="url(#teardropSpecularGloss)"
              opacity="0.8"
            />

            {/* Soft Ambient Sheen */}
            <ellipse
              cx="12.2"
              cy="29"
              rx="2.8"
              ry="8.5"
              fill="#ffffff"
              opacity="0.12"
              transform="rotate(-5 12.2 29)"
            />

            {/* Active Pull Threshold Indicator Glow (Lights up when pulled enough to switch) */}
            {isThresholdExceeded && (
              <circle
                cx="16"
                cy="30"
                r="18"
                fill="none"
                stroke="#ffd54f"
                strokeWidth="1.5"
                opacity="0.75"
                className="animate-pulse"
              />
            )}
          </g>

          {/* Reference Callout Arrow & Text: "Pull to change theme" */}
          <g
            transform="translate(-95, 20)"
            className="select-none pointer-events-none hidden xs:block"
          >
            {/* Hand cursor icon */}
            <text
              x="55"
              y="-4"
              fontSize="14"
              className="select-none"
            >
              👆
            </text>
            {/* Curved Arrow */}
            <path
              d="M10,25 C30,25 50,18 55,2 M55,2 L48,7 M55,2 L55,9"
              stroke={isLight ? "#292524" : "rgba(255,255,255,0.75)"}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Hint text */}
            <text
              x="5"
              y="38"
              fontSize="10"
              fontFamily="var(--font-onest), sans-serif"
              fontWeight="600"
              fill={isLight ? "#1c1917" : "rgba(255,255,255,0.85)"}
              textAnchor="middle"
            >
              Pull to
            </text>
            <text
              x="5"
              y="50"
              fontSize="10"
              fontFamily="var(--font-onest), sans-serif"
              fontWeight="600"
              fill={isLight ? "#1c1917" : "rgba(255,255,255,0.85)"}
              textAnchor="middle"
            >
              change theme
            </text>
          </g>
        </g>
      </svg>

      {/* Floating Mode Pill on Hover */}
      <div
        className={`absolute top-4 right-10 whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-onest font-medium tracking-wider uppercase transition-all duration-300 pointer-events-none shadow-xl border ${
          isHovered && !isDragging
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-2"
        } ${
          isLight
            ? "bg-[#23201c] text-[#f5f0e8] border-[#4a4237]"
            : "bg-white/95 text-black border-black/10"
        }`}
      >
        <span>{isLight ? "Switch to Dark" : "Switch to Beige"}</span>
        <span className="ml-1 text-[9px] opacity-70">↓</span>
      </div>
    </div>
  );
}
