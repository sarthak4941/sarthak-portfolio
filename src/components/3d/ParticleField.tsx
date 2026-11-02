"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  color?: string;
}

export function ParticleField({ count = 800, color = "#00f0ff" }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate randomized particle positions across a 3D volume
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spread in a spherical or cylindrical distribution
      const r = THREE.MathUtils.randFloat(15, 60);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(-Math.PI / 2, Math.PI / 2);

      pos[i * 3] = r * Math.cos(phi) * Math.sin(theta);
      pos[i * 3 + 1] = r * Math.sin(phi);
      pos[i * 3 + 2] = r * Math.cos(phi) * Math.cos(theta);
    }

    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    // Gentle ambient drifting rotation
    pointsRef.current.rotation.y += delta * 0.03;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color={color}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
