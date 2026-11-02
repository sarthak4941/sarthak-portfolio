"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FloatingPolyhedrons() {
  const mesh1 = useRef<THREE.Mesh>(null);
  const mesh2 = useRef<THREE.Mesh>(null);
  const mesh3 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (mesh1.current) {
      mesh1.current.rotation.x += delta * 0.3;
      mesh1.current.rotation.y += delta * 0.4;
      mesh1.current.position.y = Math.sin(t * 0.8) * 0.4 - 0.2;
    }

    if (mesh2.current) {
      mesh2.current.rotation.y -= delta * 0.35;
      mesh2.current.rotation.z += delta * 0.25;
      mesh2.current.position.y = Math.cos(t * 0.7) * 0.5 + 0.3;
    }

    if (mesh3.current) {
      mesh3.current.rotation.x -= delta * 0.2;
      mesh3.current.rotation.z -= delta * 0.3;
      mesh3.current.position.y = Math.sin(t * 0.6) * 0.3;
    }
  });

  return (
    <group>
      {/* 1. Icosahedron wireframe */}
      <mesh ref={mesh1} position={[-2.8, 0, -1]}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={0.4}
          roughness={0.2}
        />
      </mesh>

      {/* 2. Dodecahedron */}
      <mesh ref={mesh2} position={[2.8, 0.5, -1.5]}>
        <dodecahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial
          color="#a855f7"
          wireframe
          transparent
          opacity={0.45}
          roughness={0.2}
        />
      </mesh>

      {/* 3. Octahedron in center background */}
      <mesh ref={mesh3} position={[0, -1.5, -2]}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.3}
          roughness={0.3}
        />
      </mesh>

      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2, 2]} intensity={2} color="#00f0ff" />
    </group>
  );
}

export function GeometricCanvas() {
  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none opacity-40">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <FloatingPolyhedrons />
      </Canvas>
    </div>
  );
}
