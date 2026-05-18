# Velyx Labs — Agency Website

> Agentic systems & AI-native SaaS for ambitious founders.

A cinematic, dark-mode agency website built with React, Three.js, and Framer Motion. Features a custom preloader with boot sequence animation, scroll-driven 3D particle morphing, custom cursor, and a fully responsive design system.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + Vite 8 |
| **3D** | Three.js (custom shaders, particle systems) |
| **Animation** | Framer Motion + CSS keyframes |
| **Routing** | React Router v7 |
| **Styling** | Vanilla CSS with oklch color system |
| **Fonts** | Geist, Geist Mono, Instrument Serif |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI (Nav, Footer, Cursor, Preloader)
├── pages/          # Route-level pages (Home, Services, Portfolio, etc.)
├── sections/       # Home page sections (Hero, ShipScroll, etc.)
├── App.jsx         # Router + preloader orchestration
├── main.jsx        # Entry point
└── styles.css      # Full design system + component styles
```

## Pages

- **Home** — Hero with interactive 3D icosahedron, scroll-pinned service showcase, stats, testimonials, FAQ, CTA
- **Services** — Five practice areas with animated deliverables
- **Portfolio** — Filterable case study grid with SVG data visualizations
- **Testimonials** — Featured founder testimonials with metrics
- **Contact** — Briefing form + direct contact details

## Key Features

- 🎬 **Cinematic preloader** — 5-act boot sequence with terminal streaming, progress bar, and agent telemetry panel
- 🌐 **Custom Three.js scenes** — GLSL noise-deformed icosahedron hero, morphing particle fields, wireframe backgrounds
- 🎯 **Custom cursor** — Smooth-following ring + dot with interactive element detection
- 📊 **Scroll-driven animations** — Pinned sections with phase-based content swapping
- 📱 **Fully responsive** — Mobile menu with staggered animations, touch-optimized layouts
- 🎨 **oklch color system** — Perceptually uniform warm amber palette

## License

© 2026 Velyx Labs. All rights reserved.
