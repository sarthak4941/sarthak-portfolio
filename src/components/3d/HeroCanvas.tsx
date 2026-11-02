"use client";

import React, { Suspense, useState, useEffect, Component } from "react";
import { Canvas } from "@react-three/fiber";
import { HeroCore } from "./HeroCore";
import { ParticleField } from "./ParticleField";

class CanvasErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("WebGL Canvas error caught gracefully:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 blur-3xl animate-pulse" />
        </div>
      );
    }
    return this.props.children;
  }
}

export function HeroCanvas() {
  const [isMobile, setIsMobile] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    // Check if WebGL is supported
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 blur-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <CanvasErrorBoundary>
      <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
        <Canvas
          camera={{
            position: [0, 0, isMobile ? 9 : 7],
            fov: 45,
            near: 0.1,
            far: 100,
          }}
          dpr={[1, 1.8]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <Suspense fallback={null}>
            {/* Ambient & Directional Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[5, 8, 5]}
              intensity={1.8}
              color="#ffffff"
            />
            <directionalLight
              position={[-5, -4, -2]}
              intensity={1.2}
              color="#00f0ff"
            />
            <pointLight position={[0, 4, 3]} intensity={1.5} color="#a855f7" />

            {/* Core 3D Centerpiece */}
            <HeroCore />

            {/* Ambient Stardust Field */}
            <ParticleField count={isMobile ? 350 : 700} color="#00f0ff" />
          </Suspense>
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}
