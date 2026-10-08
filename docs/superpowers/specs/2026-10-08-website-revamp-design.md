# Velyx Labs Website Revamp — Design Spec

Date: 2026-10-08
Status: Draft for review

## 1. Goal

Turn velyxlabs.in from a cinematic showcase into a clean, fast, conversion-focused agency site. The single conversion is **booking a free 30-min call** (Cal.com, `velyx-labs/30min`). The secondary conversion is the contact form.

Success criteria:
- Every page has a visible "Book a free call" CTA above the fold and at the end.
- No decorative animation beyond a subtle one-time fade-in and hover states.
- Lighthouse mobile Performance ≥ 90, Accessibility ≥ 95.
- Readable at 375px and 1440px with no horizontal scroll.
- No fabricated content anywhere on the site (see §8).

Inspiration (structure and tone, not visuals copied): orgbuild.co, leftclick.ai, morningside.ai, distyl.ai, invisibletech.ai, tribe.ai, artkai.io, markovate.com. Common patterns adopted: one repeated CTA, outcome headline, client names under hero, services → process → proof → FAQ → CTA, large type, generous whitespace, one accent color, near-zero motion.

## 2. Decisions (from user)

| Topic | Decision |
|---|---|
| Theme | Keep the current warm dark theme; amber accent used only for CTAs / key highlights |
| Font | Inter only (drop Geist, Geist Mono, Instrument Serif, Playfair Display; no italic serif accent words) |
| Animations | Remove nearly all |
| Pages removed | Case Studies, Blog, Testimonials (page) |
| Portfolio | Merged into Services; `/portfolio` removed |
| Testimonials | Page removed; 3 real quotes kept on Home |
| Pricing | **Not shown anywhere** |
| Northwind / Sable Health / Halcyon AI | Not real clients → removed everywhere |
| Navbar | Remove clock ("BLR" time), sound toggle |
| Voice agent ("talk to guide") | Removed |

## 3. Removed

Components / code:
- `Preloader`, `CustomCursor`, `VoiceAgent`, `audio/ambientEngine.js`, `NavIndex`, `ProgressUpdater`, `Reveal` (replaced), `CaseViz`, `caseVizMap`, `offeringViz`, `offeringVizMap`, `IndustryIcon` (if unused after rewrite)
- Sections: `Hero` (Three.js), `ShipScroll`, `Sections.jsx`, `ExtraSections.jsx`, `Founders.jsx` (rewritten)
- Pages: `Portfolio`, `OfferingDetail`, `CaseStudies`, `CaseStudyDetail`, `Testimonials`, `Blog`, `BlogPost`
- Data/content: `data/caseStudies.js`, `lib/blog.js`, `content/blog/*`, `public/uploads/portfolio-*.png`
- CSS: film-grain overlay, all keyframe/scroll effects; `styles.css` replaced wholesale
- Dependencies: `three`, `marked`. `framer-motion` removed (fade-in done with CSS + IntersectionObserver)
- Fabricated claims in current copy: "Cohort '26 — 3 seats remain", "LIVE · 20 AGENTS DEPLOYED", fake terminal/telemetry, fake location coordinates, the non-functional newsletter form

Kept: React 19, Vite, React Router, `react-helmet-async` + `Seo`/`seoConfig`, `@calcom/embed-react`, `lib/analytics.js` (GA4 `book_call_click` tracking), `prerender-meta.mjs`, `indexnow.mjs`, `data/offerings.js` (as source for service examples), `data/testimonials.js` (quotes + engagements), Privacy, Terms, `/start`.

## 4. Site map & redirects

Routes:
- `/` Home
- `/services` Services
- `/contact` Contact
- `/start` Ads landing page (no nav links, restyled)
- `/privacy`, `/terms`
- `*` → simple 404 with CTA back home

Permanent (301) redirects in `vercel.json` (placed before the SPA rewrite) to preserve SEO:
- `/portfolio`, `/portfolio/:slug*` → `/services`
- `/case-studies`, `/case-studies/:slug*` → `/services`
- `/blog`, `/blog/:slug*` → `/`
- `/testimonials` → `/`

`scripts/gen-sitemap.mjs` updated to list only the kept routes (no case study / blog / offering slugs). `prerender-meta.mjs` and `seoConfig` route entries updated to match. `robots.txt` reviewed for stale paths.

## 5. Global layout

### Navbar (`Nav`)
- Left: logo (existing icon + "velyx labs" wordmark set in Inter; "x" in amber).
- Center/right links: Services · Process · About · Contact. Process and About are anchors on Home (`/#process`, `/#about`).
- Right: primary button **Book a free call** (Cal.com).
- Behaviour: fixed top, transparent at top, solid background + 1px bottom border after 20px scroll. No other effects.
- Mobile (<900px): logo + hamburger; menu is a plain full-width panel (no staggered animation) listing links + CTA.
- Mobile sticky CTA: a bottom bar "Book a free call" appears after scrolling past the hero (hidden on `/start` if redundant with its own bar).

### Footer (`Footer`)
- Logo + one-line description.
- Columns: Services (4 links to `/services#…`), Company (About, Process, Contact), Connect (X, LinkedIn, GitHub, email).
- Bottom row: © 2026 Velyx Labs · Privacy · Terms.
- Removed: newsletter form, giant wordmark, location coordinates, "BUILT BY HUMANS" line.

## 6. Pages

### 6.1 Home — 7 sections (only the essentials)

1. **Hero**
   - Headline (outcome, ≤ 10 words), e.g. "AI systems and software that grow your business."
   - Sub (1–2 lines): who we serve + what we build (agentic automation, AI SaaS, WhatsApp CRM, web & apps).
   - Primary CTA: **Book a free 30-min call**. Secondary: "See what we build" → `#services`.
   - Below CTAs: client strip — static row of real client names in muted text: Getlandy AI, Sacred Basil, Overshoot, NarayanKripa, YorkScreenPlay, SparklingTimes, Orange Production, Scanva & Co (plus others from `/start` PROOF list that are real). Label: "Trusted by founders at".
   - No 3D, no background video, no marquee motion. Optional: a very subtle static radial amber glow behind the headline.

2. **Services** (`#services`)
   - Header: "What we build".
   - 4 cards in a 2×2 grid (1 column on mobile):
     1. Agentic automation
     2. AI SaaS & MVPs
     3. WhatsApp automation + CRM
     4. Websites & mobile apps
   - Each card: title, one-sentence outcome, 3 example builds (pulled from `offerings.js` titles), link "Learn more" → `/services#<id>`.

3. **Process** (`#process`)
   - Header: "How we work".
   - 4 numbered steps in a row (stacked on mobile): Free call → Clear plan → Build → Launch & support. One line each.
   - CTA under steps: Book a free call.

4. **Testimonials**
   - Header: "What founders say".
   - 3 quote cards from `TESTIMONIAL_QUOTES` (Prasannata/Overshoot, Dr. Parita/Sacred Basil, Nishant/NarayanKripa). Name, role, initials avatar. Text verbatim.

5. **Why Velyx + Founders** (`#about`)
   - Left: header "Built by founders, not account managers" + 4 short points: founders on every project · built for production, not demos · you own the code · clear timeline and fixed scope.
   - Right: founder cards for Atharv Golait (CEO & Co-founder) and Mridul (Founder) — photo (if available, else initials), name, role, LinkedIn link.

6. **FAQ**
   - Accessible accordion (`<details>/<summary>`), 6 questions:
     - How long does a typical project take?
     - Do we own the code and IP?
     - We're not technical — is that a problem?
     - What happens after launch?
     - How do you work with our existing tools?
     - What happens on the free call?
   - Answers written with the user before launch; no invented stats.

7. **Final CTA**
   - Header: "Let's talk about what you want to build."
   - Sub: "30 minutes. No pitch deck. You'll leave with a clear next step."
   - Inline Cal.com month view embed + fallback button and email link (velyxlabs@gmail.com).

### 6.2 Services (`/services`)
- Page hero: title "Services", one-line sub, primary CTA.
- 4 service blocks (anchor ids: `agents`, `saas`, `whatsapp`, `web`), each using the same layout: title, 2–3 sentence description, "What you get" list (deliverables), "Example builds" list (from `offerings.js`, titles + taglines only, no detail pages).
- Process (shared component), FAQ (shared), Final CTA (shared).
- Old footer anchors (`#copilots`, `#workflows`, `#strategy`, `#apps`) map into these four.

### 6.3 Contact (`/contact`)
- Two columns: left — short form (name, email, company, "What do you want to build?" textarea); right — Cal.com embed + email + LinkedIn.
- **Known bug:** the current form only calls `setSent(true)`; submissions are never delivered. The revamp must send submissions somewhere real. **Open decision:** delivery method (e.g. Web3Forms/Formspree to velyxlabs@gmail.com, or remove the form and keep Cal.com + email only).
- Clear success and error states.

### 6.4 `/start` (ads landing)
- Keep content and structure (no nav links), restyle with new components, remove Framer Motion.

### 6.5 Privacy / Terms
- Restyle only (readable prose width ~70ch, Inter, 17px).

## 7. Visual system

Tokens (CSS custom properties in new `styles.css`, ~600 lines target):
- Colors (keep current palette, simplified):
  - `--bg` oklch(0.14 0.01 60), `--bg-elev` oklch(0.17 0.012 60), `--border` oklch(0.26 0.01 60)
  - `--text` oklch(0.96 0.005 80), `--text-muted` oklch(0.72 0.01 70)
  - `--accent` oklch(0.78 0.16 65) (amber), `--accent-ink` #14110a (text on amber)
- Type: Inter 400/500/600 via Google Fonts, `display=swap`.
  - Body 17px desktop / 16px mobile, line-height 1.6
  - H1 clamp(40px, 6vw, 68px), weight 600, letter-spacing −0.03em, line-height 1.05
  - H2 clamp(30px, 4vw, 46px), weight 600, line-height 1.15
  - H3 20–22px, weight 600
  - Eyebrow 13px, weight 500, uppercase, letter-spacing 0.08em, muted
  - Body text max width ~65ch
- Layout: container max 1200px, side padding clamp(16px, 4vw, 40px); section vertical padding clamp(72px, 10vw, 128px).
- Components: cards = `--bg-elev` + 1px `--border`, radius 16px, padding 28–32px. Buttons: primary amber pill (48px height), secondary outline. Focus rings visible.
- Motion: one CSS fade-up (opacity + 12px translate, 400ms) applied once on scroll-in via a tiny IntersectionObserver hook; hover color/border transitions 150ms. All disabled under `prefers-reduced-motion`. Smooth scroll for anchors only.

## 8. Content rules

- Only real clients, real quotes, real people. Never write a quote or metric on a client's behalf.
- No stats unless the user supplies them and they are true.
- No scarcity claims ("3 seats remain") or fake live indicators.
- Copy drafted during implementation is reviewed by the user before deploy.

## 9. Components (new, `src/components/`)

| Component | Purpose |
|---|---|
| `Layout` | Nav + `<main>` + Footer + mobile sticky CTA; wraps all pages except `/start` |
| `Nav` | §5 navbar |
| `Footer` | §5 footer |
| `CalButton` | Button that opens Cal.com (`data-cal-*` attrs), variants primary/secondary, keeps GA4 tracking |
| `Section` | Container + vertical padding + optional id |
| `SectionHeader` | Eyebrow, title, optional sub, alignment |
| `ServiceCard` | Home service card |
| `ProcessSteps` | Shared 4-step process |
| `Testimonials` | 3 quote cards |
| `FAQ` | `<details>` accordion from a data array |
| `FinalCTA` | Shared closing CTA with Cal embed |
| `FadeIn` | IntersectionObserver fade-in wrapper |

Content lives in `src/data/` (`services.js` for the 4 services, `faq.js`, existing `testimonials.js`, trimmed `offerings.js`). Components stay small and single-purpose; no inline style objects (replace the current heavy inline styles with classes).

## 10. Analytics, SEO, performance

- GA4: keep `initClickTracking`; confirm `book_call_click` fires for every `CalButton` and the inline embed.
- SEO: update titles/descriptions per kept route in `seoConfig`; keep Organization/Person JSON-LD on Home (remove case-study/blog JSON-LD); regenerate sitemap; 301s per §4.
- Performance: dropping Three.js, Framer Motion, audio, preloader removes the main bundle weight and the forced loading delay. Lazy routes stay. Images get explicit width/height.

## 11. Verification

- `npm run lint` and `npm run build` pass (including prebuild sitemap + postbuild prerender).
- Manually check every route + each redirect in `vercel dev` or preview.
- Responsive check at 375, 768, 1440 widths; no horizontal scroll.
- Cal.com opens from every CTA; contact form success/error states work.
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.
- `grep` confirms no references remain to removed pages, Northwind/Sable/Halcyon, pricing, audio, or Three.js.

## 12. Out of scope

- Light theme, CMS, new backend, new blog, pricing, new case studies (can be added later once real results exist).
