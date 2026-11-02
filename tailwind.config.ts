import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#020204",
        obsidian: {
          DEFAULT: "#06070a",
          surface: "#0c0d12",
          card: "#10121a",
          border: "rgba(255, 255, 255, 0.08)",
        },
        bone: "#f8fafc",
        silver: "#94a3b8",
        hologram: {
          cyan: "#00F0FF",
          violet: "#A855F7",
          gold: "#F59E0B",
          emerald: "#10B981",
        },
      },
      fontFamily: {
        sans: ["'Onest'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        onest: ["'Onest'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        garamond: ["'EB Garamond'", "Georgia", "serif"],
        serif: ["'EB Garamond'", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-particle": "floatParticle 7s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "spin-slow": "spin 25s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        floatParticle: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)", opacity: "0.2" },
          "50%": { transform: "translateY(-26px) translateX(10px)", opacity: "0.85" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
      boxShadow: {
        "card-3d": "0 25px 60px -15px rgba(0, 0, 0, 0.85)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
