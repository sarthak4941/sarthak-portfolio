export interface SkillCategory {
  title: string;
  description: string;
  skills: {
    name: string;
    level: number; // 0 - 100
    tag: string;
  }[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "3D & Creative Engineering",
    description: "Designing real-time shaders, procedural geometries, and spatial canvases.",
    skills: [
      { name: "Three.js / WebGL", level: 96, tag: "Graphics" },
      { name: "React Three Fiber (R3F)", level: 94, tag: "Ecosystem" },
      { name: "GLSL / Shaders", level: 88, tag: "Rendering" },
      { name: "GSAP & ScrollTrigger", level: 95, tag: "Motion" },
      { name: "Blender 3D Modeling", level: 82, tag: "Asset Prep" },
      { name: "Framer Motion", level: 92, tag: "UI Transitions" },
    ],
  },
  {
    title: "Frontend Architecture",
    description: "Crafting fluid, type-safe, and responsive enterprise-grade interfaces.",
    skills: [
      { name: "Next.js 14 / 15", level: 98, tag: "Core Framework" },
      { name: "React 18 / 19", level: 98, tag: "Component Architecture" },
      { name: "TypeScript", level: 95, tag: "Type Safety" },
      { name: "Tailwind CSS", level: 96, tag: "Design Systems" },
      { name: "State Management (Zustand)", level: 90, tag: "State" },
      { name: "Performance Profiling (Lighthouse)", level: 95, tag: "Optimization" },
    ],
  },
  {
    title: "Backend, Cloud & APIs",
    description: "Building scalable backend microservices, real-time channels, and pipelines.",
    skills: [
      { name: "Node.js & Express", level: 90, tag: "Runtime" },
      { name: "Python / FastAPI", level: 85, tag: "AI / Data" },
      { name: "PostgreSQL & Prisma", level: 88, tag: "Databases" },
      { name: "GraphQL & REST APIs", level: 92, tag: "Networking" },
      { name: "Docker & Containerization", level: 84, tag: "DevOps" },
      { name: "Vercel & AWS Edge", level: 90, tag: "Deployment" },
    ],
  },
];
