export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  featured: boolean;
  tags: string[];
  metrics: string;
  liveUrl: string;
  githubUrl: string;
  accentColor: string;
}

export const projectsData: Project[] = [
  {
    id: "aether-os",
    title: "Aether OS",
    subtitle: "Spatial Computing Web Desktop",
    description: "An experimental web operating system featuring real-time 3D window physics, custom glassmorphism shaders, and neural agent automation workflows.",
    featured: true,
    tags: ["React Three Fiber", "Next.js", "WebAudio API", "TypeScript", "Tailwind CSS"],
    metrics: "60 FPS WebGL • 14k GitHub Stars",
    liveUrl: "https://example.com/aether",
    githubUrl: "https://github.com/sarthak4941",
    accentColor: "#00F0FF",
  },
  {
    id: "quantum-mesh",
    title: "Quantum Mesh",
    subtitle: "Generative Audio-Visual 3D Engine",
    description: "Interactive real-time audio visualizer utilizing custom GLSL noise displacement shaders, Fast Fourier Transform (FFT) analysis, and particle physics.",
    featured: true,
    tags: ["Three.js", "GLSL Shaders", "Web Audio API", "GSAP", "Canvas"],
    metrics: "100k+ Audio Tracks Rendered",
    liveUrl: "https://example.com/quantum",
    githubUrl: "https://github.com/sarthak4941",
    accentColor: "#A855F7",
  },
  {
    id: "chronos-analytics",
    title: "Chronos Telemetry",
    subtitle: "High-Frequency Data Visualization",
    description: "Institutional financial telemetry system rendering over 500,000 real-time tick events per second using WebGL instancing and WebWorkers.",
    featured: true,
    tags: ["WebGL", "Next.js", "WebSockets", "Rust / Wasm", "Tailwind"],
    metrics: "< 8ms Rendering Latency",
    liveUrl: "https://example.com/chronos",
    githubUrl: "https://github.com/sarthak4941",
    accentColor: "#10B981",
  },
  {
    id: "nexus-studio",
    title: "Nexus 3D Studio",
    subtitle: "Collaborative Browser 3D Scene Graph",
    description: "Cloud-native 3D workspace empowering cross-functional teams to compose Three.js scenes, animate lights, and export production GLTF models.",
    featured: false,
    tags: ["Three.js", "React", "CRDTs", "Zustand", "Tailwind CSS"],
    metrics: "Multiplayer Realtime Sync",
    liveUrl: "https://example.com/nexus",
    githubUrl: "https://github.com/sarthak4941",
    accentColor: "#38BDF8",
  },
  {
    id: "apex-motors",
    title: "Apex Hypercar Configurator",
    subtitle: "Photorealistic WebGL Vehicle Customizer",
    description: "Real-time automotive customizer featuring PBR material swapping, raymarching reflections, cinematic orbit camera cuts, and interior VR view.",
    featured: false,
    tags: ["Three.js", "PBR Shaders", "GSAP ScrollTrigger", "React", "Drei"],
    metrics: "Photorealistic 4K Raytraced Look",
    liveUrl: "https://example.com/apex",
    githubUrl: "https://github.com/sarthak4941",
    accentColor: "#F59E0B",
  },
  {
    id: "voxel-forge",
    title: "Voxel Forge",
    subtitle: "Procedural World Generation Engine",
    description: "Infinite procedural terrain engine running in the browser utilizing Simplex noise algorithms, greedy meshing, and dynamic level-of-detail chunking.",
    featured: false,
    tags: ["Three.js", "Web Workers", "TypeScript", "IndexedDB"],
    metrics: "Infinite Infinite Procedural Biomes",
    liveUrl: "https://example.com/voxelforge",
    githubUrl: "https://github.com/sarthak4941",
    accentColor: "#EC4899",
  },
];
