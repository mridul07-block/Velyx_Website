# Velyx Labs — Agency Website

> Agentic systems & AI-native SaaS for ambitious founders.

A clean, fast, conversion-focused agency site in a Kargul-style light design. One goal: book a free 30-minute call (Cal.com).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + Vite 8 |
| **Routing** | React Router v7 |
| **Styling** | Plain CSS with design tokens (`src/styles.css`) |
| **Font** | Geist |
| **Booking** | Cal.com embed |
| **Forms** | Web3Forms (`VITE_WEB3FORMS_KEY`) |
| **Tests** | Vitest + Testing Library |

## Getting Started

```bash
npm install
cp .env.example .env   # add VITE_WEB3FORMS_KEY
npm run dev
npm test
npm run build
```

## Project Structure

```
src/
├── components/     # Layout, Nav, Footer, CalButton, Section, FAQ, FinalCTA, …
├── sections/home/  # Home-only sections (Hero, ServicesGrid, Testimonials, About)
├── pages/          # Home, Work, CaseStudy, SwipeFile, StartProject, Start (ads), Privacy, Terms, NotFound
├── data/           # Services, FAQ, clients, process, testimonials
├── lib/            # Cal constants, analytics, useInView
└── styles.css      # Design system
scripts/            # routes.mjs (single route list), sitemap, prerender, indexnow
```

Old URLs (/portfolio, /case-studies, /services, /contact, /blog, /testimonials) 301-redirect via vercel.json.

## License

© 2026 Velyx Labs. All rights reserved.
