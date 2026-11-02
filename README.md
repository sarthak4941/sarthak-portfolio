# 🌌 Cinematic 3D Developer Portfolio — Rishi Thakor Edition

A premium, dark obsidian-themed personal developer portfolio inspired by the visual direction, spatial architecture, and interactive mastery of **[therishithakor.com](https://therishithakor.com/)**.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Three.js** via **React Three Fiber**.

---

## ⚡ Signature Features & Upgrades

### 1. 🚪 Interactive 3D Skill Doors Wall (`SkillDoorsWall.tsx`)
* *"One door per skill. Magic happens behind the doors. Swipe along the wall."*
* A 3D horizontal corridor wall containing 4 architectural skill doors:
  - **Door 01 — Web & Spatial Apps**: Full-stack Next.js, real-time spatial web desktops.
  - **Door 02 — 3D & Creative Shaders**: Custom GLSL vertex/fragment shaders, WebGL particle systems.
  - **Door 03 — UI/UX & Design Systems**: Figma tokens, atomic components, micro-interactions.
  - **Door 04 — Cloud & Microservices**: Dockerized APIs, PostgreSQL, real-time WebSocket pipelines.
* **Realistic 3D Hinge Physics**: Clicking any door plays an authentic door swing animation (`rotateY(-110deg)`) and reveals a radiant light portal.
* **Behind the Door Drawer**: Unlocks a deep-dive modal featuring core deliverables, tool inventory, and live flagship project demos.

### 2. 🃏 Interactive 3D Ability Card (`AbilityCard3D.tsx`)
* *"My ability card"* — Collectible 3D holographic card with cursor tilt physics, drag-to-spin, and a 180° flip animation:
  - **Front Face**: Class category (`LEGENDARY // ARCHITECT`), Developer Name, **OVR 99** rating badge, dynamic holographic rainbow sheen reflection, and 4 ability progress bars.
  - **Back Face**: Full technical weaponry breakdown (Frontend, 3D Graphics, Backend, Design), verified combat traits, and certified digital signature.
  - **Interactivity**: Tap the card or click the `"FLIP TO BACK SPEC SHEET"` button with synthesized whoosh audio!

### 3. 📸 Hero Section with Personal Portrait
* High-contrast editorial hero layout with:
  - Personal photograph frame with glassmorphic border and cyan rim lighting.
  - Pre-configured asset at `/public/portrait.svg` (easily swappable with your own photo at `/public/portrait.jpg`).
  - Availability status pill (*"Available for work • Replies in < 5h"*).
  - Dynamic typewriter role rotator (*Creative Developer*, *3D Web Architect*, *WebGL & Shader Specialist*).
  - Centered interactive 3D WebGL core canvas in the background.

### 4. 🧭 Fullscreen Editorial Navigation Drawer (`MenuDrawer.tsx`)
* Top navbar includes a dedicated `"MENU"` trigger button.
* Expands a fullscreen dark obsidian overlay (`backdrop-blur-2xl`) with large editorial navigation links, telemetry status, and quick social links.

### 5. ⏱️ "My Story" Animated Timeline (`MyStory.tsx`)
* Scroll-scrubbed career journey and education milestones with dynamic line draw animation.
* Pulsing LED milestone nodes marking career progression, agencies, and computer science degrees.

### 6. 🔊 Futuristic Web Audio Synthesizer (`src/lib/sound.ts`)
* Zero-network browser audio synthesis for UI feedback:
  - Hover blips
  - Click snaps
  - 3D door swing resonant whoosh
  - Ability card 3D flip whoosh

---

## 🚀 Quick Start Guide

### 1. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Build for Production
```bash
npm run build
```

---

## 🛠️ Personalizing Your Portfolio

All personal information, doors, and ability stats are centralized in `src/data/`:

| File | What to Customize |
| :--- | :--- |
| `src/data/personal.ts` | Your name, title, bio, stats, location, email, and social profiles. |
| `src/data/doors.ts` | Your 4 skill doors, door numbers, deliverables, tools, and showcased projects. |
| `src/data/ability.ts` | Your 3D ability card OVR score, ability ratings, weapons, and combat traits. |
| `src/data/experience.ts` | Your career timeline, roles, companies, and achievements. |
| `src/data/projects.ts` | Your featured architectural works, live demo links, and GitHub repositories. |
| `public/portrait.svg` | Drop your own image here as `portrait.jpg` or `portrait.svg` to personalize your portrait. |

---

## 📁 Updated Architecture

```plaintext
src/
├── app/
│   ├── layout.tsx              # Root layout with fonts, metadata, Lenis & CustomCursor
│   ├── page.tsx                # Single-page journey integrating all sections
│   └── globals.css             # Obsidian dark theme, glassmorphic utilities
├── components/
│   ├── 3d/
│   │   ├── SkillDoorsWall.tsx  # 3D Corridor Wall with opening hinge doors
│   │   ├── AbilityCard3D.tsx   # 3D Holographic Ability Card with Tilt & Flip
│   │   ├── HeroCanvas.tsx      # Ambient 3D canvas with dynamic lighting
│   │   ├── HeroCore.tsx        # Morphing 3D core with orbital rings
│   │   └── GeometricGrid.tsx   # Floating background polyhedrons
│   ├── common/
│   │   ├── DoorModal.tsx       # 'Behind the Door' project deep-dive drawer
│   │   ├── CustomCursor.tsx    # Fluid magnetic follower
│   │   ├── MagneticButton.tsx  # Magnetic attraction CTA button
│   │   ├── TiltCard.tsx        # 3D card tilt with mouse spotlight
│   │   ├── SoundToggle.tsx     # Web Audio SFX controller
│   │   └── Icons.tsx           # Clean SVG brand icons
│   ├── layout/
│   │   ├── Navbar.tsx          # Floating dock with menu button
│   │   ├── MenuDrawer.tsx      # Fullscreen editorial menu overlay
│   │   └── Footer.tsx          # Live clock, telemetry, copyright
│   └── sections/
│       ├── Hero.tsx            # Personal portrait & availability telemetry
│       ├── About.tsx           # Narrative story, stats & developer spec terminal
│       ├── SkillDoors.tsx      # 'One door per skill' 3D corridor section
│       ├── AbilitySection.tsx  # 'My ability card' 3D hologram section
│       ├── MyStory.tsx         # Scroll-scrubbed animated timeline
│       ├── Projects.tsx        # Filterable showcase cards with 3D tilt
│       └── Contact.tsx         # Glassmorphic form with confetti feedback
└── data/                       # Centralized configuration data
```
