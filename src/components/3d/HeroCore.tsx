"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export function HeroCore() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const sat1Ref = useRef<THREE.Mesh>(null);
  const sat2Ref = useRef<THREE.Mesh>(null);

  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Target values for smooth interpolation (spring feel)
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const speedMultiplier = clicked ? 2.5 : hovered ? 1.4 : 1.0;

    // Follow mouse pointer with smooth dampening
    targetRotation.current.x = state.pointer.y * 0.4;
    targetRotation.current.y = state.pointer.x * 0.6;

    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        delta * 3
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y,
        delta * 3
      );
    }

    // Inner Core continuous morph & rotation
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.4 * speedMultiplier;
      coreRef.current.rotation.y += delta * 0.6 * speedMultiplier;
      const scale = 1 + Math.sin(t * 2) * 0.05;
      coreRef.current.scale.set(scale, scale, scale);
    }

    // Outer Wireframe Cage counter-rotation
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x -= delta * 0.25 * speedMultiplier;
      wireframeRef.current.rotation.y += delta * 0.35 * speedMultiplier;
    }

    // Orbital Rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.5 * speedMultiplier;
      ring1Ref.current.rotation.x = Math.sin(t * 0.8) * 0.4 + 0.8;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 0.6 * speedMultiplier;
      ring2Ref.current.rotation.z = Math.cos(t * 0.7) * 0.5 - 0.6;
    }

    // Satellites orbiting in 3D paths
    if (sat1Ref.current) {
      const radius = 3.6;
      sat1Ref.current.position.x = Math.cos(t * 1.2) * radius;
      sat1Ref.current.position.z = Math.sin(t * 1.2) * radius;
      sat1Ref.current.position.y = Math.sin(t * 2.4) * 0.8;
    }

    if (sat2Ref.current) {
      const radius = 4.2;
      sat2Ref.current.position.x = Math.cos(-t * 0.9 + 2) * radius;
      sat2Ref.current.position.z = Math.sin(-t * 0.9 + 2) * radius;
      sat2Ref.current.position.y = Math.cos(t * 1.8) * 1.1;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.6}
      floatIntensity={0.8}
      floatingRange={[-0.2, 0.2]}
    >
      <group
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked((prev) => !prev)}
      >
        {/* Core Torus Knot */}
        <mesh ref={coreRef} castShadow receiveShadow>
          <torusKnotGeometry args={[1.2, 0.38, 128, 32, 2, 3]} />
          <meshStandardMaterial
            color={hovered ? "#00f0ff" : "#1a1c2e"}
            emissive={hovered ? "#00f0ff" : "#0d1124"}
            emissiveIntensity={hovered ? 0.8 : 0.3}
            roughness={0.2}
            metalness={0.9}
            wireframe={false}
          />
        </mesh>

        {/* Outer Wireframe Polyhedron */}
        <mesh ref={wireframeRef}>
          <icosahedronGeometry args={[2.2, 1]} />
          <meshStandardMaterial
            color="#a855f7"
            wireframe
            transparent
            opacity={0.35}
            roughness={0.4}
            metalness={0.8}
          />
        </mesh>

        {/* Cyber Ring 1 (Cyan) */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[2.7, 0.025, 16, 100]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={1.5}
            roughness={0.1}
          />
        </mesh>

        {/* Cyber Ring 2 (Violet) */}
        <mesh ref={ring2Ref}>
          <torusGeometry args={[3.1, 0.02, 16, 100]} />
          <meshStandardMaterial
            color="#c084fc"
            emissive="#a855f7"
            emissiveIntensity={1.2}
            roughness={0.1}
          />
        </mesh>

        {/* Orbiting Satellite Node 1 */}
        <mesh ref={sat1Ref}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={2}
          />
        </mesh>

        {/* Orbiting Satellite Node 2 */}
        <mesh ref={sat2Ref}>
          <octahedronGeometry args={[0.15]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={2}
          />
        </mesh>

        {/* Center Glow Light */}
        <pointLight
          color={hovered ? "#00f0ff" : "#7c3aed"}
          intensity={hovered ? 4 : 2.5}
          distance={8}
        />
      </group>
    </Float>
  );
}
