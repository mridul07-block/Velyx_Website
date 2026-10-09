# Kargul-Style Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild velyxlabs.in in kargul.studio's light visual system and section structure. The result is an 11-section Home, Recent Work with case studies, Swipe File and Start a Project, all with Velyx's real services, clients and team.

**Architecture:** Same React 19 + Vite + React Router app on branch `revamp/clean-site`. A new token stylesheet (light page, dark rounded panels, Geist) replaces the current one. Each Kargul block becomes a small component fed by a data file in `src/data/`. Animation is CSS plus IntersectionObserver (no animation library). Routes, redirects, sitemap and prerender all derive from `scripts/routes.mjs`. The existing Cal.com, Web3Forms, Seo, GA4 and test infrastructure is reused.

**Tech Stack:** React 19, Vite 8, React Router 7, react-helmet-async, @calcom/embed-react, plain CSS, Vitest + Testing Library, Web3Forms, macOS `sips` (one-time image export).

**Spec:** `docs/superpowers/specs/2026-10-09-kargul-style-revamp-design.md`

## Global Constraints

- **Light theme tokens:** `--page: #efefef; --card: #ffffff; --panel: #232323; --panel-card: #2b2b2b; --ink: #171717; --muted: #6b6b6b; --on-panel: #fafafa; --on-panel-muted: #a3a3a3`. Monochrome. The only color is the green status dot `#22c55e`.
- **Font:** Geist 400/500/600 only, loaded non-blocking. No Inter, Instrument Serif or Playfair.
- **Radii:** panel 40px (inset 12px from the viewport), card 24px, pill 999px. Container max 1120px.
- **Motion:** CSS and IntersectionObserver only. No new animation library; Framer Motion and Three.js stay removed. Everything is disabled under `prefers-reduced-motion: reduce`.
- **Conversion:** primary CTA "Start a project" → `/start-a-project`. Booking stays on Cal.com `velyx-labs/30min`. Trial copy: "Start with a trial week for only $1500".
- **No fabricated content:** only real clients, projects, people, quotes and numbers. Kargul's figures ($1B+, 210M+, 75+, 95%) and project names never appear. Northwind, Sable Health and Halcyon AI never appear. Quotes are verbatim; bold highlights only emphasize existing words.
- **TO CONFIRM items** ship with the spec's stated defaults and are listed for the user in Task 9.
- **Lighthouse mobile:** Performance ≥ 90 and Accessibility ≥ 95 on `/` and `/work`. No horizontal scroll at 375px.
- **No inline style objects**, except where a third-party API requires them (the Cal embed `style`).

## Review Focus

1. Old links from ads, Google or bookmarks (`/contact`, `/services`, `/portfolio/x`, `/case-studies/x`) must land on the new pages via permanent redirects (Task 8 test).
2. A shared `/work?type=nonsense` link must fall back to "All", not an empty grid (Task 5 test).
3. An unknown project URL `/work/does-not-exist` must show the 404 page (Task 5 test).
4. Brief form network failure or Web3Forms rejection → a visible error with an email fallback, never a fake "sent". `?plan=trial` pre-selects the trial budget (Task 7 tests).
5. Lightbox: Escape closes it and returns focus to the clicked thumbnail; arrows wrap around (Task 6 test). Reduced-motion visitors never get looping illustrations (Task 3 test).

---

## File Map

**Create:**
- **Images:** `public/work/*.jpg` (project screenshots), plus `public/swipe/` (same files, referenced).
- **Data:** `src/data/{projects,stats,team,tools,swipe}.js`. Rewrite `src/data/{services,faq}.js`. Add `highlights` to `src/data/testimonials.js`.
- **Lib:** `src/lib/brand.js` (logo URL), `src/lib/useReducedMotion.js`.
- **Components (`src/components/`):**
  - `PillNav`, `SiteFooter`, `Panel`, `Tag`, `Marquee`
  - `ServiceCard`, `illustrations/{Agents,Saas,WhatsApp,Web,Mobile}Art.jsx`
  - `Stats`, `ProjectCover`, `ProjectSpotlight`, `ProjectCard`
  - `TeamGrid`, `TestimonialCarousel`, `ToolsStrip`, `TrialCard`
  - `FilterPills`, `Lightbox`, `BriefForm`, `ClosingCTA`
- **Home sections (`src/sections/home/`):** `Hero`, `TrustedBy`, `ServicesPanel`, `ProjectsPanel`.
- **Pages (`src/pages/`):** `Work`, `CaseStudy`, `SwipeFile`, `StartProject`.
- **Tests (`src/test/`):** `data.test.js`, `shell.test.jsx`, `home-top.test.jsx`, `home.test.jsx` (rewrite), `work.test.jsx`, `swipe.test.jsx`, `start-project.test.jsx`.

**Rewrite:** `src/styles.css`, `src/pages/Home.jsx`, `src/pages/Start.jsx`, `src/components/Layout.jsx`, `src/components/Logo.jsx`, `src/AppRoutes.jsx`, `scripts/routes.mjs`, `vercel.json`, `index.html` (font + theme-color), `src/test/{config,routes}.test.*`, `README.md`.

**Delete (Task 8):**
- Components: `Nav`, `Footer`, `StickyCta`, `ClientStrip`, `ProcessSteps`, `FinalCTA`
- Old home sections: `sections/home/{About,Testimonials}.jsx` (`ServicesGrid.jsx` already removed in Task 1)
- Pages: `Contact.jsx` (`Services.jsx` already removed in Task 1)
- Data: `data/process.js`
- Tests: `layout.test.jsx`, `blocks.test.jsx`, `contact.test.jsx` (`services.test.jsx` already removed in Task 1)

**Keep:** `Seo`, `seoConfig`, `CalButton`, `CalEmbed`, `FAQ`, `FadeIn`, `useInView`, `ScrollManager`, `Section`, `SectionHeader`, `LegalPage`, `Privacy`, `Terms`, `NotFound`, `lib/{cal,analytics}.js`, `scripts/{meta,prerender-meta,gen-sitemap,indexnow}.mjs`.

**Class-name convention:** the button classes stay `btn btn--primary` (dark pill) and `btn btn--secondary` (white pill), so `CalButton` keeps working unchanged. `btn--panel` is the full-width pill used on dark panels.

---

### Task 1: Assets and data

**Files:**
- Create: `public/work/*.jpg`, `src/data/{projects,stats,team,tools,swipe}.js`, `src/test/data.test.js`
- Rewrite: `src/data/services.js`, `src/data/faq.js`
- Modify: `src/data/testimonials.js` (add `highlights`)

**Interfaces:**
- Produces:
  - `SERVICES: { id, title, copy, tags: string[], art: "agents"|"saas"|"whatsapp"|"web"|"mobile", wide?: boolean }[]` (5 items, ids `agents, saas, whatsapp, web, mobile`)
  - `STATS: { value: string, label: string }[]`
  - `PROJECTS: { slug, name, summary, industry, audience, types: ("ai"|"saas"|"web"|"mobile")[], featured: boolean, cover: {src,w,h}|null, gallery: {src,w,h}[], brief, built, stack: string[], result: string|null, quoteName: string|null }[]`
  - `TEAM: { name, role, initials, linkedin? }[]`
  - `TOOLS: { name, icon: string|null }[]` (icon is a Simple Icons slug)
  - `SWIPE: { src, w, h, type: "product"|"web"|"brand" }[]`
  - `FAQ_ITEMS: { q, a }[]` (7 items)
  - `TESTIMONIAL_QUOTES[i].highlights: string[]`

- [ ] **Step 1: Export the screenshots** (one-time; the source folder name ends with a space)

```bash
SRC=~/"VelyxLabs "; OUT=public/work; mkdir -p "$OUT"
conv() { sips -s format jpeg -s formatOptions 80 --resampleWidth 1600 "$SRC/$1" --out "$OUT/$2" >/dev/null; }
conv "Landy Meet .png" landy-1.jpg
conv "landy meet 2.png" landy-2.jpg
conv "Landy meet 3.png" landy-3.jpg
conv "landy Meet 4.png" landy-4.jpg
conv "Jon stewarts.png" yorkscreenplay.jpg
conv "Kettler .png" kettler-1.jpg
conv "Kettler 1.png" kettler-2.jpg
conv "Kettler 2.png" kettler-3.jpg
conv "Kettler.png" kettler-4.jpg
conv "Priya meet .png" priya-1.jpg
sips -s format jpeg -s formatOptions 85 "$SRC/Sacred Basil.png" --out "$OUT/sacred-basil.jpg" >/dev/null
for f in "$OUT"/*.jpg; do printf "%s " "$(basename "$f")"; sips -g pixelWidth -g pixelHeight "$f" | awk '/pixel/{printf "%s ", $2}'; du -k "$f" | cut -f1; done
```

Expected: 11 files. The 1600-wide ones are `1600 1041`, `sacred-basil.jpg` is `619 549`, and each file is ≤ 400 KB. If any height differs from 1041, use the printed value in the data files below.

- [ ] **Step 2: Write the failing data test** — `src/test/data.test.js`

```js
import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { SERVICES } from "../data/services";
import { STATS } from "../data/stats";
import { PROJECTS } from "../data/projects";
import { TEAM } from "../data/team";
import { TOOLS } from "../data/tools";
import { SWIPE } from "../data/swipe";
import { FAQ_ITEMS } from "../data/faq";
import { CLIENTS } from "../data/clients";
import { TESTIMONIAL_QUOTES } from "../data/testimonials";

const BANNED = /\$1B|210M|75\+|95%|SideShift|ZeroLeaks|Agent Arcade|Kargul|Northwind|Sable Health|Halcyon/i;

describe("content data", () => {
  it("has the five Velyx services in Kargul's 3 + 2 layout", () => {
    expect(SERVICES.map((s) => s.id)).toEqual(["agents", "saas", "whatsapp", "web", "mobile"]);
    expect(SERVICES.filter((s) => s.wide).map((s) => s.id)).toEqual(["web", "mobile"]);
    for (const s of SERVICES) expect(s.tags.length).toBeGreaterThanOrEqual(4);
  });

  it("derives counted stats from real data", () => {
    expect(STATS[0].value).toBe(`${CLIENTS.length}+`);
    expect(STATS[1].value).toBe(String(SERVICES.length));
  });

  it("features exactly three projects, all with covers that exist on disk", () => {
    const featured = PROJECTS.filter((p) => p.featured);
    expect(featured.map((p) => p.slug)).toEqual(["getlandy", "sacred-basil", "yorkscreenplay"]);
    for (const p of PROJECTS) {
      for (const img of [p.cover, ...p.gallery].filter(Boolean)) {
        expect(existsSync(`public${img.src}`), img.src).toBe(true);
      }
    }
  });

  it("project slugs are unique and quotes refer to real testimonials", () => {
    expect(new Set(PROJECTS.map((p) => p.slug)).size).toBe(PROJECTS.length);
    const names = TESTIMONIAL_QUOTES.map((t) => t.name);
    for (const p of PROJECTS) if (p.quoteName) expect(names).toContain(p.quoteName);
  });

  it("testimonial highlights only emphasise words already in the quote", () => {
    for (const t of TESTIMONIAL_QUOTES) {
      expect(t.highlights.length).toBeGreaterThan(0);
      for (const h of t.highlights) expect(t.q).toContain(h);
    }
  });

  it("swipe images exist on disk with dimensions", () => {
    expect(SWIPE.length).toBeGreaterThanOrEqual(10);
    for (const s of SWIPE) {
      expect(existsSync(`public${s.src}`), s.src).toBe(true);
      expect(s.w).toBeGreaterThan(0);
      expect(["product", "web", "brand"]).toContain(s.type);
    }
  });

  it("has seven FAQs, the team and tools", () => {
    expect(FAQ_ITEMS).toHaveLength(7);
    expect(TEAM.map((t) => t.name)).toEqual(["Atharv Golait", "Mridul"]);
    expect(TOOLS.length).toBeGreaterThanOrEqual(10);
  });

  it("contains no borrowed or fabricated claims", () => {
    const all = JSON.stringify([SERVICES, STATS, PROJECTS, TEAM, TOOLS, FAQ_ITEMS, CLIENTS]);
    expect(all).not.toMatch(BANNED);
  });
});
```

- [ ] **Step 3: Run to verify failure**

Run: `npx vitest run src/test/data.test.js`
Expected: FAIL. `stats`, `projects`, `team`, `tools` and `swipe` can't be resolved.

- [ ] **Step 4: Write the data files**

`src/data/services.js` (replace the whole file):

```js
/* The five Velyx services, shown in Kargul's 3 + 2 card layout.
   TO CONFIRM: tag lists must match the stack Velyx actually uses. */
export const SERVICES = [
  {
    id: "agents",
    title: "Agentic AI automation",
    copy: "AI agents that answer, qualify, follow up and file — wired into your CRM, inbox and WhatsApp, with human approval where it matters.",
    tags: ["OPENAI", "CLAUDE", "LANGGRAPH", "N8N", "CRM", "EVALS"],
    art: "agents",
  },
  {
    id: "saas",
    title: "AI SaaS & MVPs",
    copy: "From idea to paying users. Production apps with auth, billing, admin and AI features built on your data — made to grow, not to be rebuilt.",
    tags: ["NEXT.JS", "REACT", "NODE.JS", "SUPABASE", "POSTGRES", "STRIPE"],
    art: "saas",
  },
  {
    id: "whatsapp",
    title: "WhatsApp automation + CRM",
    copy: "Bookings, reminders, lead follow-up and re-engagement running on WhatsApp, with a simple CRM so your team sees every conversation.",
    tags: ["WHATSAPP API", "CRM", "WEBHOOKS", "DASHBOARDS"],
    art: "whatsapp",
  },
  {
    id: "web",
    title: "Websites & landing pages",
    copy: "Fast, conversion-focused websites and landing pages with custom visuals and interactions — built to turn visitors into booked calls.",
    tags: ["FIGMA", "REACT", "NEXT.JS", "FRAMER", "SEO", "ANALYTICS"],
    art: "web",
    wide: true,
  },
  {
    id: "mobile",
    title: "Mobile apps",
    copy: "Cross-platform iOS and Android apps from one codebase — designed, built and shipped to the stores.",
    tags: ["REACT NATIVE", "EXPO", "FIREBASE", "APP STORE"],
    art: "mobile",
    wide: true,
  },
];
```

`src/data/stats.js`:

```js
import { CLIENTS } from "./clients";
import { SERVICES } from "./services";

/* Numbers section. Counted values are derived from real data so they
   never drift. TO CONFIRM: replace with the user's real figures. */
export const STATS = [
  { value: `${CLIENTS.length}+`, label: "Clients and partners" },
  { value: String(SERVICES.length), label: "Services under one roof" },
  { value: "100%", label: "Founder-led projects" },
  { value: "30 min", label: "Free first call" },
];
```

`src/data/projects.js`:

```js
/* Real projects only. Facts come from the client engagements and quotes
   already on the site (src/data/testimonials.js). `stack` and `result`
   stay empty until the user confirms them, and empty sections don't
   render. TO CONFIRM: Kettler and Priya, once described. */
const img = (src, w = 1600, h = 1041) => ({ src, w, h });

export const PROJECTS = [
  {
    slug: "getlandy",
    name: "Getlandy AI",
    summary: "An AI-powered personal brand studio and career operating system for high-signal professionals.",
    industry: "AI",
    audience: "B2C SaaS",
    types: ["ai", "saas"],
    featured: true,
    cover: img("/work/landy-1.jpg"),
    gallery: [img("/work/landy-2.jpg"), img("/work/landy-3.jpg"), img("/work/landy-4.jpg")],
    brief: "Landy helps professionals design their career strategy, hold a credible online presence and build long-term career leverage — beyond job searching.",
    built: "Built by Velyx Labs: the Landy product, from its AI-powered studio to the subscription experience.",
    stack: [],
    result: null,
    quoteName: null,
  },
  {
    slug: "sacred-basil",
    name: "Sacred Basil",
    summary: "A complete e-commerce brand, built alongside a deep audit of the business behind it.",
    industry: "E-commerce",
    audience: "B2C",
    types: ["web"],
    featured: true,
    cover: img("/work/sacred-basil.jpg", 619, 549),
    gallery: [],
    brief: "Sacred Basil needed its full e-commerce brand built — and a clear look at how the business itself was running.",
    built: "Velyx Labs built Sacred Basil's complete e-commerce brand and conducted a deep audit of its business operations.",
    stack: [],
    result: null,
    quoteName: "Dr. Parita",
  },
  {
    slug: "yorkscreenplay",
    name: "YorkScreenPlay",
    summary: "An online auction and bidding platform.",
    industry: "Marketplace",
    audience: "B2C",
    types: ["saas", "web"],
    featured: true,
    cover: img("/work/yorkscreenplay.jpg"),
    gallery: [],
    brief: "Jon Stewart needed an online platform where buyers could browse lots and bid live.",
    built: "Velyx Labs built YorkScreenPlay, an online auction and bidding platform, for Jon Stewart.",
    stack: [],
    result: null,
    quoteName: null,
  },
  {
    slug: "overshoot",
    name: "Overshoot Newsletter",
    summary: "A complete, production-ready web application built from the ground up.",
    industry: "Media",
    audience: "B2C",
    types: ["web", "saas"],
    featured: false,
    cover: null,
    gallery: [],
    brief: "Overshoot needed a production-ready web application, built from scratch.",
    built: "Velyx Labs built a complete, production-ready web application for Overshoot from the ground up.",
    stack: [],
    result: null,
    quoteName: "Prasannata",
  },
  {
    slug: "narayankripa",
    name: "NarayanKripa",
    summary: "A robust, AI-integrated web application for a growing business.",
    industry: "Business services",
    audience: "B2B",
    types: ["ai", "web"],
    featured: false,
    cover: null,
    gallery: [],
    brief: "NarayanKripa needed a web application with AI built in, ready to scale with its operations.",
    built: "Velyx Labs delivered a robust, AI-integrated web application for NarayanKripa.",
    stack: [],
    result: null,
    quoteName: "Nishant",
  },
  {
    slug: "sparklingtimes",
    name: "SparklingTimes",
    summary: "A custom web application.",
    industry: "Web app",
    audience: "B2C",
    types: ["web"],
    featured: false,
    cover: null,
    gallery: [],
    brief: "Elise Q Rao needed a custom web application.",
    built: "Velyx Labs built SparklingTimes, a custom web application, for Elise Q Rao.",
    stack: [],
    result: null,
    quoteName: null,
  },
];
```

`src/data/team.js`:

```js
/* TO CONFIRM: other team members and avatar style (monograms until supplied). */
export const TEAM = [
  { name: "Atharv Golait", role: "CEO & Co-founder", initials: "AG", linkedin: "https://www.linkedin.com/in/atharv-golait-9048772ab/" },
  { name: "Mridul", role: "Founder", initials: "M" },
];
```

`src/data/tools.js`:

```js
/* Tools strip. `icon` is a Simple Icons slug (cdn.simpleicons.org); null shows the name only.
   TO CONFIRM: the list. */
export const TOOLS = [
  { name: "Figma", icon: "figma" },
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextdotjs" },
  { name: "Node.js", icon: "nodedotjs" },
  { name: "Supabase", icon: "supabase" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "OpenAI", icon: null },
  { name: "Claude", icon: "anthropic" },
  { name: "n8n", icon: "n8n" },
  { name: "WhatsApp", icon: "whatsapp" },
  { name: "Stripe", icon: "stripe" },
  { name: "Vercel", icon: "vercel" },
];
```

`src/data/swipe.js`:

```js
/* Swipe file: raw design shots, no captions. TO CONFIRM: the category of
   each image, and more images. */
const s = (file, type, w = 1600, h = 1041) => ({ src: `/work/${file}`, w, h, type });

export const SWIPE = [
  s("landy-1.jpg", "product"),
  s("kettler-1.jpg", "web"),
  s("yorkscreenplay.jpg", "web"),
  s("landy-2.jpg", "product"),
  s("sacred-basil.jpg", "brand", 619, 549),
  s("kettler-2.jpg", "web"),
  s("landy-3.jpg", "product"),
  s("priya-1.jpg", "web"),
  s("kettler-3.jpg", "web"),
  s("landy-4.jpg", "product"),
  s("kettler-4.jpg", "web"),
];
```

`src/data/faq.js` (replace the whole file):

```js
export const FAQ_ITEMS = [
  {
    q: "Why Velyx Labs?",
    a: "Most agencies hand you off to juniors or split design, AI and engineering across vendors. With us, the founders work on your project end to end — strategy, design, AI and code — so nothing gets lost between teams.",
  },
  {
    q: "Who will we work with?",
    a: "The founders, on every project. You talk directly to the people building your system — no account managers in between.",
  },
  {
    q: "How do we work together?",
    a: "We start with a free call, then a written plan with scope and timeline. We build in short cycles and share progress as we go, so you always know where things stand.",
  },
  {
    q: "How does the trial week work?",
    a: "For $1500 you work with us for one week: a kickoff call, a scoped plan and a first deliverable. It's the easiest way to see how we work before committing to the full project.",
  },
  {
    q: "What if priorities change?",
    a: "That's normal. We re-plan with you, and you always know what a change means for scope and timeline before we make it.",
  },
  {
    q: "Can you work with our existing tools and team?",
    a: "Yes. We build on top of what you already use — your CRM, WhatsApp, email and spreadsheets — and work alongside your team instead of replacing everything.",
  },
  {
    q: "Who owns the work?",
    a: "You do. The code, designs and accounts are yours at handover.",
  },
];
```

`src/data/testimonials.js`: add a `highlights` array to each of the three `TESTIMONIAL_QUOTES` entries, directly after its `q:` line:
- Prasannata: `highlights: ["production-ready web application"],`
- Dr. Parita: `highlights: ["deep audit of our business operations"],`
- Nishant: `highlights: ["immediately scaled our operations"],`

- [ ] **Step 5: Run the test**

Run: `npx vitest run src/test/data.test.js`
Expected: PASS (8 tests).

- [ ] **Step 6: Retire the old consumers of the old `SERVICES` / `FAQ_ITEMS` shape** so the suite stays green. The old Services page and the old Home services grid read `summary`, `description`, `deliverables` and `examples`, which no longer exist. `/services` is replaced by a redirect anyway (spec §4).
  - `git rm src/pages/Services.jsx src/sections/home/ServicesGrid.jsx src/test/services.test.jsx`
  - `src/AppRoutes.jsx`: delete the `Services` import and the `<Route path="/services" … />` line.
  - `src/pages/Home.jsx` (old): delete the `ServicesGrid` import and the `<ServicesGrid />` element.
  - `src/test/home.test.jsx` (old): remove `"services"` from the expected ids array. Delete the cases `it("links each service card to its section on /services"…)` and `it("contains no pricing, fake clients or fake live claims"…)`, because the FAQ now mentions the $1500 trial. The whole file is rewritten in Task 4.
  - `src/test/blocks.test.jsx`: delete the cases `it("has the four services with stable anchor ids"…)` and `it("has six FAQs and no pricing or fabricated clients"…)`.
  - `src/test/routes.test.jsx`: delete the `["/services", /What we build for founders/]` row.

- [ ] **Step 7: Full suite, commit**

Run: `npm test && npm run build`
Expected: all pass.

```bash
git add -A
git commit -m "feat: project screenshots and content data for Kargul-style revamp"
```

---

### Task 2: Design system and site shell

**Files:**
- Rewrite: `src/styles.css`, `src/components/Logo.jsx`, `src/components/Layout.jsx`
- Modify: `index.html` (font + theme-color)
- Create: `src/lib/brand.js`, `src/components/{PillNav,SiteFooter,Panel,Tag,Marquee}.jsx`, `src/test/shell.test.jsx`

**Interfaces:**
- Produces:
  - `LOGO_ICON` (string URL) from `src/lib/brand.js`
  - `<PillNav />` (nav `aria-label="Main"`; links Recent Work → `/work`, Swipe file → `/swipe-file`; CTA link "Start a project" → `/start-a-project`; mobile menu button "Open menu" / "Close menu")
  - `<SiteFooter />`
  - `<Layout>` = skip link + PillNav + `<main id="main">` + SiteFooter
  - `<Panel id className>` → `<section class="panel">` with a `.container` inside
  - `<Tag>{text}</Tag>` → `<span class="tag">`
  - `<Marquee label>{items}</Marquee>`, which renders its children twice (the second copy `aria-hidden`)

- [ ] **Step 1: Write the failing test** — `src/test/shell.test.jsx`

```jsx
import { describe, it, expect } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import PillNav from "../components/PillNav";
import SiteFooter from "../components/SiteFooter";
import Marquee from "../components/Marquee";
import Panel from "../components/Panel";

describe("PillNav", () => {
  it("has Recent Work, Swipe file and the Start a project CTA", () => {
    renderWithProviders(<PillNav />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getAllByRole("link", { name: "Recent Work" })[0]).toHaveAttribute("href", "/work");
    expect(within(nav).getAllByRole("link", { name: "Swipe file" })[0]).toHaveAttribute("href", "/swipe-file");
    expect(within(nav).getAllByRole("link", { name: "Start a project" })[0]).toHaveAttribute("href", "/start-a-project");
    expect(within(nav).getByRole("link", { name: "Velyx Labs home" })).toHaveAttribute("href", "/");
  });

  it("opens and closes the mobile menu", () => {
    renderWithProviders(<PillNav />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("mobile-menu")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(document.getElementById("mobile-menu")).toBeNull();
  });
});

describe("SiteFooter", () => {
  it("has email, socials and legal links", () => {
    renderWithProviders(<SiteFooter />);
    expect(screen.getByRole("link", { name: "velyxlabs@gmail.com" })).toHaveAttribute("href", "mailto:velyxlabs@gmail.com");
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/company/velyx-labs/");
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  });
});

describe("Marquee and Panel", () => {
  it("duplicates marquee items for a seamless loop, hiding the copy from assistive tech", () => {
    render(<Marquee label="Clients"><span>Acme</span></Marquee>);
    const items = screen.getAllByText("Acme", { ignore: false });
    expect(items).toHaveLength(2);
    expect(items[1].closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("renders a dark panel section with its id", () => {
    const { container } = render(<Panel id="services"><p>x</p></Panel>);
    expect(container.querySelector("section#services.panel .container")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/test/shell.test.jsx`
Expected: FAIL. `../components/PillNav` can't be resolved.

- [ ] **Step 3: Create the shell components**

`src/lib/brand.js`:

```js
export const LOGO_ICON =
  "https://res.cloudinary.com/dmhabztbf/image/upload/w_96,f_auto,q_auto/v1779688104/ChatGPT_Image_May_25__2026__11_15_18_AM-removebg-preview_hy48ex.png";
```

`src/components/Logo.jsx` (replace the whole file):

```jsx
import { LOGO_ICON } from "../lib/brand";

export default function Logo() {
  return (
    <span className="logo">
      <img src={LOGO_ICON} alt="" width="28" height="28" className="logo__icon" />
      <span className="logo__word">velyx labs</span>
    </span>
  );
}
```

`src/components/PillNav.jsx`:

```jsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LOGO_ICON } from "../lib/brand";

const LINKS = [
  { label: "Recent Work", to: "/work" },
  { label: "Swipe file", to: "/swipe-file" },
];

export default function PillNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="pnav">
      <nav className="pnav__inner" aria-label="Main">
        <Link to="/" className="pnav__logo" aria-label="Velyx Labs home" onClick={close}>
          <img src={LOGO_ICON} alt="" width="28" height="28" />
        </Link>
        <ul className="pnav__links">
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to}>{l.label}</NavLink>
            </li>
          ))}
        </ul>
        <Link to="/start-a-project" className="pnav__cta" onClick={close}>Start a project</Link>
        <button
          type="button"
          className="pnav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
        {open && (
          <ul id="mobile-menu" className="pnav__menu">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} onClick={close}>{l.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
```

`src/components/SiteFooter.jsx`:

```jsx
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function SiteFooter() {
  return (
    <footer className="sfoot">
      <div className="container sfoot__inner">
        <Link to="/" aria-label="Velyx Labs home"><Logo /></Link>
        <nav className="sfoot__links" aria-label="Footer">
          <a href="mailto:velyxlabs@gmail.com">velyxlabs@gmail.com</a>
          <a href="https://x.com/VelyxLabs" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://www.linkedin.com/company/velyx-labs/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
        <p className="sfoot__copy">© {new Date().getFullYear()} Velyx Labs</p>
      </div>
    </footer>
  );
}
```

`src/components/Layout.jsx` (replace the whole file):

```jsx
import PillNav from "./PillNav";
import SiteFooter from "./SiteFooter";

export default function Layout({ children }) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <PillNav />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
```

`src/components/Panel.jsx`:

```jsx
export default function Panel({ id, className = "", children }) {
  return (
    <section id={id} className={["panel", className].filter(Boolean).join(" ")}>
      <div className="container">{children}</div>
    </section>
  );
}
```

`src/components/Tag.jsx`:

```jsx
export default function Tag({ children }) {
  return <span className="tag">{children}</span>;
}
```

`src/components/Marquee.jsx`:

```jsx
/* Seamless CSS loop: children render twice; the copy is hidden from
   assistive tech. On wide screens CSS shows a static wrapped row instead. */
export default function Marquee({ label, children }) {
  return (
    <div className="marquee" role="region" aria-label={label}>
      <div className="marquee__track">
        <div className="marquee__group">{children}</div>
        <div className="marquee__group marquee__dup" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test**

Run: `npx vitest run src/test/shell.test.jsx`
Expected: PASS (5 tests).

- [ ] **Step 5: Replace `src/styles.css`** with the Kargul design system. Later tasks append their component sections.

```css
/* ============================================
   VELYX LABS — Kargul-style design system
   ============================================ */

:root {
  --page: #efefef;
  --card: #ffffff;
  --panel: #232323;
  --panel-card: #2b2b2b;
  --ink: #171717;
  --muted: #6b6b6b;
  --line: #e3e3e3;
  --on-panel: #fafafa;
  --on-panel-muted: #a3a3a3;
  --panel-line: #ffffff14;
  --tag-dark: #1f1f1f;
  --ok: #22c55e;

  --font: "Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;

  --radius-panel: 40px;
  --radius-card: 24px;
  --radius-pill: 999px;
  --container: 1120px;
  --gutter: clamp(16px, 4vw, 40px);
  --section-y: clamp(64px, 9vw, 112px);
  --nav-h: 88px;
}

*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; padding: 0; }

html { scroll-behavior: smooth; scroll-padding-top: var(--nav-h); }

body {
  background: var(--page);
  color: var(--ink);
  font-family: var(--font);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

a { color: inherit; text-decoration: none; }
button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
img { display: block; max-width: 100%; height: auto; }
ul { list-style: none; }
::selection { background: var(--ink); color: var(--page); }
:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; border-radius: 8px; }
.panel :focus-visible { outline-color: var(--on-panel); }

/* ---------- Type ---------- */

h1, h2, h3 { font-weight: 600; letter-spacing: -0.03em; line-height: 1.1; text-wrap: balance; }
.h1 { font-size: clamp(40px, 6vw, 64px); letter-spacing: -0.035em; line-height: 1.05; }
.h2 { font-size: clamp(30px, 4vw, 44px); }
.h3 { font-size: clamp(18px, 1.6vw, 20px); letter-spacing: -0.02em; }
.eyebrow { display: block; font-size: 13px; font-weight: 500; color: var(--muted); }
.muted { color: var(--muted); }
.lead { font-size: clamp(16px, 1.4vw, 18px); color: var(--muted); max-width: 52ch; }
.center { text-align: center; }

/* ---------- Layout ---------- */

.container { width: 100%; max-width: var(--container); margin-inline: auto; padding-inline: var(--gutter); }
.section { padding-block: var(--section-y); }
.section--tight { padding-top: 0; }
.page-fallback { min-height: 100vh; background: var(--page); }

.section-header { max-width: 640px; margin-bottom: clamp(32px, 5vw, 56px); }
.section-header .eyebrow { margin-bottom: 12px; }
.section-header__sub { margin-top: 14px; color: var(--muted); font-size: clamp(15px, 1.3vw, 17px); }
.section-header--center { margin-inline: auto; text-align: center; }
.section-header--center .section-header__sub { margin-inline: auto; max-width: 44ch; }

/* ---------- Dark panels ---------- */

.panel {
  margin-inline: 12px;
  border-radius: var(--radius-panel);
  background: var(--panel);
  color: var(--on-panel);
  padding-block: clamp(56px, 8vw, 96px);
}
.panel .section-header__sub, .panel .muted { color: var(--on-panel-muted); }

/* ---------- Buttons & tags ---------- */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 46px;
  padding: 0 22px;
  border-radius: var(--radius-pill);
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  transition: transform 0.2s, background-color 0.2s, box-shadow 0.2s;
}
.btn--primary { background: var(--ink); color: var(--page); }
.btn--primary:hover { background: #000; }
.btn--secondary { background: var(--card); color: var(--ink); box-shadow: 0 1px 2px #0000000d; }
.btn--secondary:hover { box-shadow: 0 4px 14px #00000014; }
.btn--panel { background: var(--tag-dark); color: var(--on-panel); width: 100%; }
.btn--panel:hover { background: #000; }
.btn--sm { height: 38px; padding: 0 16px; font-size: 14px; }
.btn--block { width: 100%; }
.btn:disabled { opacity: 0.6; cursor: progress; }

.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: var(--radius-pill);
  background: var(--tag-dark);
  color: var(--on-panel);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.tags--light .tag { background: var(--card); color: var(--ink); }

.card { background: var(--card); border-radius: var(--radius-card); padding: clamp(24px, 3vw, 32px); }

/* ---------- Skip link ---------- */

.skip-link { position: absolute; left: -9999px; top: 12px; z-index: 300; }
.skip-link:focus { left: 16px; background: var(--ink); color: var(--page); padding: 8px 14px; border-radius: 8px; }

/* ---------- Logo ---------- */

.logo { display: inline-flex; align-items: center; gap: 10px; }
.logo__icon { width: 28px; height: 28px; object-fit: contain; }
.logo__word { font-size: 17px; font-weight: 600; letter-spacing: -0.02em; }

/* ---------- Pill nav ---------- */

.pnav { position: fixed; inset: 16px 0 auto 0; z-index: 100; display: flex; justify-content: center; pointer-events: none; }
.pnav__inner { display: flex; align-items: center; gap: 8px; pointer-events: auto; position: relative; }
.pnav__logo, .pnav__links, .pnav__cta, .pnav__toggle {
  background: var(--card);
  border-radius: var(--radius-pill);
  box-shadow: 0 1px 2px #0000000f, 0 6px 20px #0000000a;
}
.pnav__logo { display: grid; place-items: center; width: 44px; height: 44px; }
.pnav__logo img { width: 24px; height: 24px; object-fit: contain; }
.pnav__links { display: flex; gap: 4px; padding: 4px 6px; font-size: 14px; color: var(--muted); }
.pnav__links a { display: block; padding: 8px 10px; border-radius: var(--radius-pill); }
.pnav__links a:hover, .pnav__links a.active { color: var(--ink); }
.pnav__cta { display: inline-flex; align-items: center; height: 44px; padding: 0 18px; font-size: 14px; font-weight: 600; }
.pnav__cta:hover { box-shadow: 0 4px 14px #00000014; }
.pnav__toggle { display: none; width: 44px; height: 44px; flex-direction: column; justify-content: center; align-items: center; gap: 5px; }
.pnav__toggle span { display: block; width: 16px; height: 1.5px; background: var(--ink); }
.pnav__menu {
  position: absolute;
  top: 54px;
  right: 0;
  min-width: 200px;
  padding: 8px;
  background: var(--card);
  border-radius: 20px;
  box-shadow: 0 10px 30px #0000001a;
}
.pnav__menu a { display: block; padding: 12px 14px; border-radius: 12px; font-weight: 500; }
.pnav__menu a:hover { background: var(--page); }

@media (max-width: 560px) {
  .pnav__links { display: none; }
  .pnav__toggle { display: flex; }
}

/* ---------- Footer ---------- */

.sfoot { padding-block: 48px 40px; }
.sfoot__inner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px; }
.sfoot__links { display: flex; flex-wrap: wrap; gap: 8px 22px; font-size: 14px; color: var(--muted); }
.sfoot__links a:hover { color: var(--ink); }
.sfoot__copy { width: 100%; font-size: 13px; color: var(--muted); }

/* ---------- Marquee ---------- */

.marquee { overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
.marquee__track { display: flex; width: max-content; animation: marquee 40s linear infinite; }
.marquee:hover .marquee__track { animation-play-state: paused; }
.marquee__group { display: flex; gap: 40px; padding-right: 40px; align-items: center; }
@keyframes marquee { to { transform: translateX(-50%); } }

/* ---------- FAQ (pill accordions) ---------- */

.faq { max-width: 560px; margin-inline: auto; display: flex; flex-direction: column; gap: 10px; }
.faq__item { background: var(--card); border-radius: 20px; }
.faq__q {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  list-style: none;
}
.faq__q::-webkit-details-marker { display: none; }
.faq__q::after { content: "⌄"; color: var(--muted); transition: transform 0.2s; }
.faq__item[open] .faq__q::after { transform: rotate(180deg); }
.faq__a { padding: 0 18px 16px; font-size: 14px; color: var(--muted); }

/* ---------- Reveal ---------- */

.fade { opacity: 0; transform: translateY(12px); transition: opacity 0.4s ease, transform 0.4s ease; }
.fade.is-in { opacity: 1; transform: none; }
@media print { .fade { opacity: 1; transform: none; } }

/* ---------- Cal embed ---------- */

.cal-embed { height: 640px; max-width: 1000px; margin-inline: auto; border-radius: var(--radius-card); overflow: hidden; background: var(--card); }
.final-cta__alt { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px 12px; margin-top: 18px; font-size: 14px; color: var(--muted); }
.final-cta__alt a { color: var(--ink); text-decoration: underline; text-underline-offset: 3px; }

/* ---------- Reduced motion (keep last) ---------- */

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .fade { opacity: 1; transform: none; }
  .marquee__track { animation: none; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

Note: later tasks append CSS **above** the reduced-motion block. Insert each appended block just before the line `/* ---------- Reduced motion (keep last) ---------- */`.

- [ ] **Step 6: Update `index.html`**
  - In the three non-blocking font `<link>` tags (preload, stylesheet, noscript), replace `family=Inter:wght@400;500;600` with `family=Geist:wght@400;500;600`.
  - Change `<meta name="theme-color" content="#0d0b07" />` to `<meta name="theme-color" content="#efefef" />`.

- [ ] **Step 7: Full suite, build, commit**

Run: `npm test && npm run build`
Expected: all tests pass, because the old Nav, Footer and StickyCta tests import those components directly and are untouched. Build succeeds.

```bash
git add -A
git commit -m "feat: Kargul-style design system, pill nav, footer, panel, tag, marquee"
```

---

### Task 3: Home top: Hero, Trusted by, Services, Numbers

**Files:**
- Create: `src/lib/useReducedMotion.js`, `src/components/illustrations/{AgentsArt,SaasArt,WhatsAppArt,WebArt,MobileArt}.jsx`, `src/components/{ServiceCard,Stats}.jsx`, `src/sections/home/{Hero,TrustedBy,ServicesPanel}.jsx`, `src/test/home-top.test.jsx`
- Modify: `src/styles.css` (insert block)

**Interfaces:**
- Consumes: `Panel`, `Tag`, `Marquee`, `SectionHeader`, `useInView`, `SERVICES`, `STATS`, `CLIENTS`.
- Produces:
  - `useReducedMotion() → boolean`
  - `<ServiceCard service />`, whose art wrapper gets `is-playing` when in view and motion is allowed
  - `<Stats />` (section `id="numbers"`)
  - `<Hero />` (`id="hero"`), `<TrustedBy />` (`id="trusted"`), `<ServicesPanel />` (`id="services"`)
  - Named exports `AgentsArt`, `SaasArt`, `WhatsAppArt`, `WebArt`, `MobileArt` (each in its own file, default export)

- [ ] **Step 1: Write the failing test** — `src/test/home-top.test.jsx`

```jsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Hero from "../sections/home/Hero";
import TrustedBy from "../sections/home/TrustedBy";
import ServicesPanel from "../sections/home/ServicesPanel";
import ServiceCard from "../components/ServiceCard";
import Stats from "../components/Stats";
import { SERVICES } from "../data/services";
import { STATS } from "../data/stats";

describe("Hero", () => {
  it("has the status pill, h1 and both CTAs", () => {
    renderWithProviders(<Hero />);
    expect(screen.getByText("Now booking projects for Q4 2026")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/AI and engineering partner/);
    expect(screen.getByRole("link", { name: "Start a project" })).toHaveAttribute("href", "/start-a-project");
    expect(screen.getByRole("link", { name: "See our work" })).toHaveAttribute("href", "/work");
  });
});

describe("TrustedBy", () => {
  it("lists real clients under Kargul's heading", () => {
    renderWithProviders(<TrustedBy />);
    expect(screen.getByRole("heading", { name: "Trusted by startups and industry leaders" })).toBeInTheDocument();
    expect(screen.getAllByText("Sacred Basil").length).toBeGreaterThan(0);
  });
});

describe("ServicesPanel", () => {
  it("renders five service cards with tags inside the dark panel", () => {
    const { container } = renderWithProviders(<ServicesPanel />);
    expect(container.querySelector("section#services.panel")).not.toBeNull();
    expect(container.querySelectorAll(".svc-card")).toHaveLength(5);
    expect(container.querySelectorAll(".svc-card--wide")).toHaveLength(2);
    expect(screen.getByText("WHATSAPP API")).toBeInTheDocument();
  });
});

describe("ServiceCard motion", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("plays the illustration when motion is allowed", () => {
    vi.stubGlobal("matchMedia", (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
    const { container } = renderWithProviders(<ServiceCard service={SERVICES[0]} />);
    expect(container.querySelector(".svc-card__art")).toHaveClass("is-playing");
  });

  it("never plays the illustration for reduced-motion visitors", () => {
    vi.stubGlobal("matchMedia", (q) => ({ matches: q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} }));
    const { container } = renderWithProviders(<ServiceCard service={SERVICES[0]} />);
    expect(container.querySelector(".svc-card__art")).not.toHaveClass("is-playing");
  });
});

describe("Stats", () => {
  it("renders every stat from data", () => {
    renderWithProviders(<Stats />);
    for (const s of STATS) {
      expect(screen.getByText(s.value)).toBeInTheDocument();
      expect(screen.getByText(s.label)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/test/home-top.test.jsx`
Expected: FAIL. `../sections/home/Hero` can't be resolved, or the old Hero fails on the new expectations.

- [ ] **Step 3: Create `src/lib/useReducedMotion.js`**

```js
import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export default function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia(QUERY);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
```

- [ ] **Step 4: Create the five illustrations.** Line art: `stroke="currentColor"`, viewBox 320×180, `aria-hidden`. Animated parts carry `art__*` classes that only animate under `.is-playing`.

`src/components/illustrations/AgentsArt.jsx`:

```jsx
export default function AgentsArt() {
  return (
    <svg viewBox="0 0 320 180" className="art" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path className="art__draw" d="M160 90 80 50M160 90l80-40M160 90l-80 45M160 90l80 45" />
      <g className="art__float">
        <circle cx="160" cy="90" r="22" className="art__pulse" />
        <circle cx="160" cy="90" r="8" />
      </g>
      <g className="art__float art__float--2">
        <rect x="52" y="32" width="56" height="36" rx="10" />
        <path d="M62 45h30M62 54h18" />
      </g>
      <g className="art__float art__float--3">
        <rect x="212" y="32" width="56" height="36" rx="10" />
        <path d="M222 45h30M222 54h18" />
      </g>
      <g className="art__float art__float--3">
        <rect x="52" y="117" width="56" height="36" rx="10" />
        <path d="M62 130h30M62 139h18" />
      </g>
      <g className="art__float art__float--2">
        <rect x="212" y="117" width="56" height="36" rx="10" />
        <path d="M222 130h30M222 139h18" />
      </g>
    </svg>
  );
}
```

`src/components/illustrations/SaasArt.jsx`:

```jsx
export default function SaasArt() {
  return (
    <svg viewBox="0 0 320 180" className="art" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
      <g className="art__float art__float--3">
        <path d="M160 112l90-34-90-34-90 34z" />
        <path d="M70 78v10l90 34 90-34V78" />
      </g>
      <g className="art__float art__float--2">
        <path d="M160 92l70-26-70-26-70 26z" />
        <path className="art__draw" d="M120 66l40 15 40-15" />
      </g>
      <g className="art__float">
        <path d="M160 70l46-17-46-17-46 17z" />
        <circle cx="160" cy="53" r="5" className="art__pulse" />
      </g>
    </svg>
  );
}
```

`src/components/illustrations/WhatsAppArt.jsx`:

```jsx
export default function WhatsAppArt() {
  return (
    <svg viewBox="0 0 320 180" className="art" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
      <g className="art__float">
        <path d="M70 40h120a14 14 0 0 1 14 14v26a14 14 0 0 1-14 14H96l-18 14V94h-8a14 14 0 0 1-14-14V54a14 14 0 0 1 14-14z" />
        <path d="M80 60h90M80 72h60" />
      </g>
      <g className="art__float art__float--2">
        <path d="M250 98H150a14 14 0 0 0-14 14v14a14 14 0 0 0 14 14h76l18 14v-14h6a14 14 0 0 0 14-14v-14a14 14 0 0 0-14-14z" />
        <circle cx="176" cy="119" r="4" className="art__dot" />
        <circle cx="194" cy="119" r="4" className="art__dot" />
        <circle cx="212" cy="119" r="4" className="art__dot" />
      </g>
    </svg>
  );
}
```

`src/components/illustrations/WebArt.jsx`:

```jsx
export default function WebArt() {
  return (
    <svg viewBox="0 0 320 180" className="art" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
      <g className="art__float">
        <rect x="56" y="24" width="208" height="136" rx="12" />
        <path d="M56 46h208" />
        <circle cx="70" cy="35" r="3" />
        <circle cx="82" cy="35" r="3" />
        <circle cx="94" cy="35" r="3" />
        <path d="M80 70h110M80 84h80" />
        <rect x="80" y="100" width="64" height="20" rx="10" />
        <rect x="200" y="66" width="44" height="70" rx="8" className="art__draw" />
      </g>
      <path className="art__cursor" d="M150 118l0 22 6-6 5 11 5-2-5-11h8z" fill="currentColor" />
    </svg>
  );
}
```

`src/components/illustrations/MobileArt.jsx`:

```jsx
export default function MobileArt() {
  return (
    <svg viewBox="0 0 320 180" className="art" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
      <g className="art__float art__float--2">
        <rect x="104" y="20" width="70" height="140" rx="14" />
        <path d="M128 30h22M116 52h46M116 64h30" />
        <rect x="116" y="80" width="46" height="46" rx="8" />
      </g>
      <g className="art__float">
        <rect x="160" y="34" width="66" height="132" rx="14" />
        <path d="M182 44h22M172 66h42M172 78h26" />
        <circle cx="193" cy="120" r="16" className="art__pulse" />
      </g>
    </svg>
  );
}
```

- [ ] **Step 5: Create the components**

`src/components/ServiceCard.jsx`:

```jsx
import Tag from "./Tag";
import useInView from "../lib/useInView";
import useReducedMotion from "../lib/useReducedMotion";
import AgentsArt from "./illustrations/AgentsArt";
import SaasArt from "./illustrations/SaasArt";
import WhatsAppArt from "./illustrations/WhatsAppArt";
import WebArt from "./illustrations/WebArt";
import MobileArt from "./illustrations/MobileArt";

const ART = { agents: AgentsArt, saas: SaasArt, whatsapp: WhatsAppArt, web: WebArt, mobile: MobileArt };

/* The illustration starts looping the first time the card is seen and
   never plays for reduced-motion visitors. */
export default function ServiceCard({ service }) {
  const [ref, inView] = useInView("0px 0px -10% 0px", 2000);
  const reduced = useReducedMotion();
  const Art = ART[service.art];

  return (
    <article className={`svc-card${service.wide ? " svc-card--wide" : ""}`}>
      <div ref={ref} className={`svc-card__art${inView && !reduced ? " is-playing" : ""}`}>
        <Art />
      </div>
      <h3 className="h3">{service.title}</h3>
      <p className="svc-card__copy">{service.copy}</p>
      <div className="tags">
        {service.tags.map((t) => <Tag key={t}>{t}</Tag>)}
      </div>
    </article>
  );
}
```

`src/components/Stats.jsx`:

```jsx
import { STATS } from "../data/stats";

export default function Stats() {
  if (!STATS.length) return null;
  return (
    <section id="numbers" className="section stats">
      <dl className="container stats__grid">
        {STATS.map((s) => (
          <div key={s.label} className="stats__item">
            <dt className="stats__label">{s.label}</dt>
            <dd className="stats__value">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

`src/sections/home/Hero.jsx` (replace the whole file):

```jsx
import { Link } from "react-router-dom";
import { LOGO_ICON } from "../../lib/brand";

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="container hero__inner">
        <img src={LOGO_ICON} alt="" width="96" height="96" className="hero__mark" />
        {/* TO CONFIRM: a project count is allowed only if true. */}
        <p className="status"><span className="status__dot" aria-hidden="true" />Now booking projects for Q4 2026</p>
        <h1 className="h1 hero__title">An AI and engineering partner for founders and growing businesses.</h1>
        <p className="lead hero__sub">
          We design and build AI agents, SaaS products, WhatsApp systems, websites and apps — end to end,
          with the founders in the room.
        </p>
        <div className="hero__actions">
          <Link to="/start-a-project" className="btn btn--primary">Start a project</Link>
          <Link to="/work" className="btn btn--secondary">See our work</Link>
        </div>
      </div>
    </section>
  );
}
```

`src/sections/home/TrustedBy.jsx`:

```jsx
import Marquee from "../../components/Marquee";
import { CLIENTS } from "../../data/clients";

export default function TrustedBy() {
  return (
    <section id="trusted" className="trusted">
      <div className="container">
        <h2 className="trusted__title">Trusted by startups and industry leaders</h2>
        <Marquee label="Clients">
          {CLIENTS.map((c) => <span key={c} className="trusted__name">{c}</span>)}
        </Marquee>
      </div>
    </section>
  );
}
```

`src/sections/home/ServicesPanel.jsx`:

```jsx
import Panel from "../../components/Panel";
import SectionHeader from "../../components/SectionHeader";
import ServiceCard from "../../components/ServiceCard";
import { SERVICES } from "../../data/services";

export default function ServicesPanel() {
  return (
    <Panel id="services">
      <SectionHeader
        align="center"
        title="Services"
        sub="Everything you need to launch and scale — from AI agents to the product your customers use."
      />
      <div className="svc-grid">
        {SERVICES.map((s) => <ServiceCard key={s.id} service={s} />)}
      </div>
    </Panel>
  );
}
```

- [ ] **Step 6: Run test**

Run: `npx vitest run src/test/home-top.test.jsx`
Expected: PASS (7 tests).

- [ ] **Step 7: Insert styles** into `src/styles.css`, just before the reduced-motion block:

```css
/* ---------- Hero ---------- */

.hero { padding-top: calc(var(--nav-h) + clamp(56px, 9vw, 112px)); padding-bottom: clamp(40px, 6vw, 72px); }
.hero__inner { display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; }
.hero__mark { width: 96px; height: 96px; opacity: 0.08; filter: grayscale(1); margin-bottom: -40px; }
.status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  background: var(--card);
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 20px;
  position: relative;
}
.status__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ok); }
.hero__title { max-width: 18ch; }
.hero__sub { margin-top: 20px; }
.hero__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 32px; }

/* ---------- Trusted by ---------- */

.trusted { padding-block: clamp(40px, 6vw, 72px) clamp(56px, 8vw, 96px); }
.trusted__title { font-size: 16px; font-weight: 600; letter-spacing: -0.01em; text-align: center; margin-bottom: 28px; }
.trusted__name { font-size: 20px; font-weight: 600; letter-spacing: -0.02em; color: #a8a8a8; white-space: nowrap; }
@media (min-width: 761px) {
  .trusted .marquee { mask-image: none; }
  .trusted .marquee__track { animation: none; width: auto; }
  .trusted .marquee__group { flex-wrap: wrap; justify-content: center; gap: 28px 48px; padding: 0; width: 100%; }
  .trusted .marquee__dup { display: none; }
}

/* ---------- Services panel ---------- */

.svc-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 16px; }
.svc-card {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: var(--radius-card);
  background: var(--panel-card);
  transition: transform 0.2s;
}
.svc-card:hover { transform: translateY(-4px); }
.svc-card--wide { grid-column: span 3; }
.svc-card__art { color: var(--on-panel-muted); margin: -4px -4px 4px; }
.svc-card__copy { font-size: 14px; color: var(--on-panel-muted); }
.svc-card .tags { margin-top: auto; padding-top: 8px; }
@media (max-width: 900px) {
  .svc-card, .svc-card--wide { grid-column: span 3; }
}
@media (max-width: 640px) {
  .svc-grid { grid-template-columns: 1fr; }
  .svc-card, .svc-card--wide { grid-column: auto; }
}

/* ---------- Illustrations ---------- */

.art { width: 100%; height: auto; display: block; overflow: visible; }
.is-playing .art__draw { stroke-dasharray: 5 6; animation: art-dash 8s linear infinite; }
.is-playing .art__pulse { transform-box: fill-box; transform-origin: center; animation: art-pulse 2.6s ease-in-out infinite; }
.is-playing .art__float { animation: art-float 6s ease-in-out infinite; }
.is-playing .art__float--2 { animation-delay: -2s; }
.is-playing .art__float--3 { animation-delay: -4s; }
.is-playing .art__dot { animation: art-blink 1.2s ease-in-out infinite; }
.is-playing .art__dot:nth-of-type(2) { animation-delay: 0.2s; }
.is-playing .art__dot:nth-of-type(3) { animation-delay: 0.4s; }
.is-playing .art__cursor { animation: art-cursor 5s ease-in-out infinite; }
@keyframes art-dash { to { stroke-dashoffset: -110; } }
@keyframes art-pulse { 50% { transform: scale(1.15); opacity: 0.45; } }
@keyframes art-float { 50% { transform: translateY(-5px); } }
@keyframes art-blink { 50% { opacity: 0.2; } }
@keyframes art-cursor { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(56px, -36px); } }

/* ---------- Numbers ---------- */

.stats__grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; text-align: center; }
.stats__item { display: flex; flex-direction: column-reverse; gap: 6px; }
.stats__value { font-size: clamp(40px, 5.5vw, 64px); font-weight: 600; letter-spacing: -0.04em; line-height: 1; }
.stats__label { font-size: 14px; color: var(--muted); }
@media (max-width: 760px) {
  .stats__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 40px; }
}
```

- [ ] **Step 8: Keep the old Home tests consistent with the new Hero.** The old Home now renders this task's Hero.
  - `src/test/home.test.jsx`: delete the case `it("leads with the booking CTA and a link to services"…)`. The file is rewritten in Task 4.
  - `src/test/routes.test.jsx`: change the `"/"` row's regex from `/AI systems and software/` to `/AI and engineering partner/`.

- [ ] **Step 9: Full suite, commit**

Run: `npm test`
Expected: all pass.

```bash
git add -A
git commit -m "feat: hero, trusted-by, animated services panel and numbers"
```

---

### Task 4: Home bottom and Home assembly

**Files:**
- Create: `src/components/{ProjectCover,ProjectSpotlight,TeamGrid,TestimonialCarousel,ToolsStrip,TrialCard,ClosingCTA}.jsx`, `src/sections/home/ProjectsPanel.jsx`
- Rewrite: `src/pages/Home.jsx`, `src/test/home.test.jsx`
- Modify: `src/test/routes.test.jsx` (the "/" h1 regex), `src/styles.css`

**Interfaces:**
- Consumes: `Panel`, `Tag`, `Marquee`, `SectionHeader`, `Section`, `FAQ`, `useInView`, `PROJECTS`, `TEAM`, `TOOLS`, `TESTIMONIAL_QUOTES`, `FAQ_ITEMS`, the five illustrations.
- Produces:
  - `<ProjectCover project className />`: an `<img>` when `project.cover`, else a placeholder `div.cover--empty`
  - `<ProjectSpotlight project flip />`
  - `<ProjectsPanel />` (`id="projects"`)
  - `<TeamGrid />` (`id="team"`)
  - `<TestimonialCarousel items />` (`id="testimonials"`; buttons "Previous testimonial" / "Next testimonial")
  - `<ToolsStrip />` (`id="tools"`)
  - `<TrialCard />` (`id="trial"`; link "Start your trial week" → `/start-a-project?plan=trial`)
  - `<ClosingCTA />` (`id="closing"`; h2 accessible name "Let's build something amazing")

- [ ] **Step 1: Write the failing test** — replace `src/test/home.test.jsx`:

```jsx
import { describe, it, expect } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Home from "../pages/Home";
import TestimonialCarousel from "../components/TestimonialCarousel";
import { TESTIMONIAL_QUOTES } from "../data/testimonials";

describe("Home", () => {
  it("renders Kargul's 11 sections in the user's order", () => {
    const { container } = renderWithProviders(<Home />);
    const ids = [...container.querySelectorAll("main section[id]")].map((s) => s.id);
    expect(ids).toEqual(["hero", "trusted", "services", "numbers", "projects", "team", "testimonials", "tools", "trial", "faq", "closing"]);
  });

  it("spotlights the three featured projects with case-study links", () => {
    renderWithProviders(<Home />);
    const links = screen.getAllByRole("link", { name: /See case study/ }).map((a) => a.getAttribute("href"));
    expect(links).toEqual(["/work/getlandy", "/work/sacred-basil", "/work/yorkscreenplay"]);
  });

  it("offers the $1500 trial week linked to a pre-selected brief", () => {
    renderWithProviders(<Home />);
    const trial = document.getElementById("trial");
    expect(within(trial).getByText("$1500")).toBeInTheDocument();
    expect(within(trial).getByRole("link", { name: "Start your trial week" })).toHaveAttribute("href", "/start-a-project?plan=trial");
  });

  it("ends with the animated closing CTA", () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole("heading", { level: 2, name: "Let's build something amazing" })).toBeInTheDocument();
  });

  it("shows no borrowed or fabricated claims, and $1500 is the only price", () => {
    const { container } = renderWithProviders(<Home />);
    const text = container.textContent;
    expect(text).not.toMatch(/\$1B|210M|75\+|95%|SideShift|ZeroLeaks|Agent Arcade|Northwind|Sable Health|Halcyon/i);
    expect(text.match(/\$\d[\d,]*/g)).toEqual(["$1500", "$1500"]);
  });
});

describe("TestimonialCarousel", () => {
  it("shows one quote with bold highlights and cycles with arrows", () => {
    renderWithProviders(<TestimonialCarousel items={TESTIMONIAL_QUOTES} />);
    expect(screen.getByText(TESTIMONIAL_QUOTES[0].name)).toBeInTheDocument();
    expect(screen.getByText(TESTIMONIAL_QUOTES[0].highlights[0]).tagName).toBe("STRONG");
    fireEvent.click(screen.getByRole("button", { name: "Next testimonial" }));
    expect(screen.getByText(TESTIMONIAL_QUOTES[1].name)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Previous testimonial" }));
    fireEvent.click(screen.getByRole("button", { name: "Previous testimonial" }));
    expect(screen.getByText(TESTIMONIAL_QUOTES[TESTIMONIAL_QUOTES.length - 1].name)).toBeInTheDocument();
  });
});
```

The "$1500" count is 2 because the price appears once in the trial card and once in the FAQ answer. If the FAQ wording changes, update the expected array to match.

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/test/home.test.jsx`
Expected: FAIL. `../components/TestimonialCarousel` can't be resolved.

- [ ] **Step 3: Create the components**

`src/components/ProjectCover.jsx`:

```jsx
export default function ProjectCover({ project, className = "" }) {
  const classes = ["cover", className].filter(Boolean).join(" ");
  if (!project.cover) {
    return (
      <div className={`${classes} cover--empty`} aria-hidden="true">
        <span>{project.name}</span>
      </div>
    );
  }
  return (
    <img
      src={project.cover.src}
      width={project.cover.w}
      height={project.cover.h}
      alt={`${project.name} — screenshot`}
      loading="lazy"
      className={classes}
    />
  );
}
```

`src/components/ProjectSpotlight.jsx`:

```jsx
import { Link } from "react-router-dom";
import Tag from "./Tag";
import ProjectCover from "./ProjectCover";

export default function ProjectSpotlight({ project, flip = false }) {
  return (
    <article className={`spot${flip ? " spot--flip" : ""}`}>
      <div className="spot__media">
        <ProjectCover project={project} />
      </div>
      <div className="spot__body">
        <h3 className="h3">{project.name}</h3>
        <p>{project.summary}</p>
        <p>{project.built}</p>
        <div className="tags">
          <Tag>{project.industry}</Tag>
          <Tag>{project.audience}</Tag>
          {project.stack.map((s) => <Tag key={s}>{s}</Tag>)}
        </div>
        <Link to={`/work/${project.slug}`} className="btn btn--panel">
          See case study <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
```

`src/sections/home/ProjectsPanel.jsx`:

```jsx
import Panel from "../../components/Panel";
import SectionHeader from "../../components/SectionHeader";
import ProjectSpotlight from "../../components/ProjectSpotlight";
import FadeIn from "../../components/FadeIn";
import { PROJECTS } from "../../data/projects";

export default function ProjectsPanel() {
  const featured = PROJECTS.filter((p) => p.featured);
  return (
    <Panel id="projects">
      <SectionHeader align="center" title="Project spotlights" sub="A closer look at some of the projects we've shipped." />
      <div className="spot-list">
        {featured.map((p, i) => (
          <FadeIn key={p.slug}>
            <ProjectSpotlight project={p} flip={i % 2 === 1} />
          </FadeIn>
        ))}
      </div>
    </Panel>
  );
}
```

`src/components/TeamGrid.jsx`:

```jsx
import SectionHeader from "./SectionHeader";
import { TEAM } from "../data/team";

export default function TeamGrid() {
  return (
    <section id="team" className="section">
      <div className="container">
        <SectionHeader align="center" title="Team" />
        <ul className="team">
          {TEAM.map((m) => (
            <li key={m.name} className="team__member">
              <span className="team__avatar" aria-hidden="true">{m.initials}</span>
              {m.linkedin ? (
                <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="team__name">{m.name}</a>
              ) : (
                <span className="team__name">{m.name}</span>
              )}
              <span className="team__role">{m.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

`src/components/TestimonialCarousel.jsx`:

```jsx
import { useState } from "react";

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* Bolds phrases that already exist in the quote. */
function Highlighted({ text, marks = [] }) {
  if (!marks.length) return text;
  const parts = text.split(new RegExp(`(${marks.map(escape).join("|")})`));
  return parts.map((part, i) => (marks.includes(part) ? <strong key={i}>{part}</strong> : part));
}

export default function TestimonialCarousel({ items }) {
  const [index, setIndex] = useState(0);
  const n = items.length;
  if (!n) return null;
  const t = items[index];
  const prev = () => setIndex((v) => (v - 1 + n) % n);
  const next = () => setIndex((v) => (v + 1) % n);
  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  return (
    <section id="testimonials" className="section">
      <div className="container">
        <div className="tcard" role="group" aria-roledescription="carousel" aria-label="Testimonials" onKeyDown={onKeyDown}>
          <div className="tcard__head">
            <h2 className="h3">Testimonials</h2>
            <div className="tcard__nav">
              <button type="button" aria-label="Previous testimonial" onClick={prev}>←</button>
              <button type="button" aria-label="Next testimonial" onClick={next}>→</button>
            </div>
          </div>
          <figure key={t.name} className="tcard__body" aria-live="polite">
            <span className="tcard__avatar" aria-hidden="true">{t.avatar}</span>
            <div>
              <blockquote className="tcard__quote">“<Highlighted text={t.q} marks={t.highlights} />”</blockquote>
              <figcaption className="tcard__who">
                <span className="tcard__name">{t.name}</span>
                <span className="tcard__role">{t.role}</span>
              </figcaption>
            </div>
          </figure>
          <p className="tcard__count" aria-hidden="true">{index + 1} / {n}</p>
        </div>
      </div>
    </section>
  );
}
```

`src/components/ToolsStrip.jsx`:

```jsx
import Marquee from "./Marquee";
import { TOOLS } from "../data/tools";

export default function ToolsStrip() {
  return (
    <section id="tools" className="section tools">
      <div className="container">
        <h2 className="h2 center tools__title">Tools we've mastered</h2>
        <div className="tools__pill">
          <Marquee label="Tools">
            {TOOLS.map((t) => (
              <span key={t.name} className="tools__item">
                {t.icon && (
                  <img src={`https://cdn.simpleicons.org/${t.icon}/6b6b6b`} alt="" width="18" height="18" loading="lazy" />
                )}
                {t.name}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
```

`src/components/TrialCard.jsx`:

```jsx
import { Link } from "react-router-dom";

/* TO CONFIRM: what the trial week includes. No conversion-rate claim. */
export default function TrialCard() {
  return (
    <section id="trial" className="trial">
      <div className="trial__card">
        <h2 className="h2 trial__title">
          Start with a trial week for only <span className="price-tag">$1500</span>
        </h2>
        <p className="muted">Work with the founders for one week: a kickoff call, a scoped plan and a first deliverable.</p>
        <p className="muted">If it's the right fit, we move into the full project. If not, you still walk away with a clear plan and a real sense of how we work.</p>
        <Link to="/start-a-project?plan=trial" className="btn btn--primary trial__cta">Start your trial week</Link>
      </div>
    </section>
  );
}
```

`src/components/ClosingCTA.jsx`:

```jsx
import { Link } from "react-router-dom";
import useInView from "../lib/useInView";
import AgentsArt from "./illustrations/AgentsArt";
import SaasArt from "./illustrations/SaasArt";
import WhatsAppArt from "./illustrations/WhatsAppArt";
import WebArt from "./illustrations/WebArt";
import MobileArt from "./illustrations/MobileArt";

const WORDS = ["Let's", "build", "something", "amazing"];

/* Words rise in sequence when scrolled into view; service illustrations
   drift behind. CSS stagger via nth-child; reduced motion shows it static. */
export default function ClosingCTA() {
  const [ref, inView] = useInView("0px 0px -15% 0px", 2000);
  return (
    <section id="closing" ref={ref} className={`closing${inView ? " is-in" : ""}`}>
      <div className="closing__art is-playing" aria-hidden="true">
        <AgentsArt />
        <SaasArt />
        <WhatsAppArt />
        <WebArt />
        <MobileArt />
      </div>
      <div className="container closing__inner">
        <h2 className="closing__title">
          {WORDS.map((w, i) => (
            <span key={w}>
              <span className="closing__word">{w}</span>
              {i < WORDS.length - 1 ? " " : ""}
            </span>
          ))}
        </h2>
        <p className="closing__sub">Tell us what you're building. We'll show you how we'd ship it.</p>
        <div className="hero__actions closing__actions">
          <Link to="/start-a-project" className="btn btn--primary">Start a project</Link>
          <Link to="/work" className="btn btn--secondary">See our work</Link>
        </div>
      </div>
    </section>
  );
}
```

`src/pages/Home.jsx` (replace the whole file; keep the existing JSON-LD object exactly as it is in the current file):

```jsx
import Seo from "../components/Seo";
import { SITE } from "../components/seoConfig";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import FAQ from "../components/FAQ";
import Stats from "../components/Stats";
import TeamGrid from "../components/TeamGrid";
import TestimonialCarousel from "../components/TestimonialCarousel";
import ToolsStrip from "../components/ToolsStrip";
import TrialCard from "../components/TrialCard";
import ClosingCTA from "../components/ClosingCTA";
import Hero from "../sections/home/Hero";
import TrustedBy from "../sections/home/TrustedBy";
import ServicesPanel from "../sections/home/ServicesPanel";
import ProjectsPanel from "../sections/home/ProjectsPanel";
import { FAQ_ITEMS } from "../data/faq";
import { TESTIMONIAL_QUOTES } from "../data/testimonials";

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${SITE.url}#org`, name: "Velyx Labs", url: SITE.url, logo: SITE.ogImage, description: SITE.defaultDescription, sameAs: ["https://x.com/VelyxLabs", "https://www.linkedin.com/company/velyx-labs/", "https://github.com/ATHARVISM2804"], founder: { "@id": `${SITE.url}#atharv` } },
    { "@type": "Person", "@id": `${SITE.url}#atharv`, name: "Atharv Golait", jobTitle: "CEO & Co-founder", worksFor: { "@id": `${SITE.url}#org` }, url: "https://atharvgolait.dev/", sameAs: ["https://atharvgolait.dev/", "https://www.linkedin.com/in/atharv-golait-9048772ab/", "https://x.com/Atharv_Golait"] },
    { "@type": "WebSite", "@id": `${SITE.url}#website`, url: SITE.url, name: "Velyx Labs", publisher: { "@id": `${SITE.url}#org` } },
  ],
};

export default function Home() {
  return (
    <Layout>
      <Seo path="/" jsonLd={JSON_LD} />
      <Hero />
      <TrustedBy />
      <ServicesPanel />
      <Stats />
      <ProjectsPanel />
      <TeamGrid />
      <TestimonialCarousel items={TESTIMONIAL_QUOTES} />
      <ToolsStrip />
      <TrialCard />
      <section id="faq" className="section">
        <div className="container">
          <SectionHeader align="center" title="FAQs" />
          <FAQ items={FAQ_ITEMS} />
        </div>
      </section>
      <ClosingCTA />
    </Layout>
  );
}
```

- [ ] **Step 4: (no-op)** — the routes "/" regex was already updated in Task 3.

- [ ] **Step 5: Run tests**

Run: `npx vitest run src/test/home.test.jsx src/test/routes.test.jsx`
Expected: PASS.

- [ ] **Step 6: Insert styles** before the reduced-motion block:

```css
/* ---------- Project spotlights ---------- */

.spot-list { display: flex; flex-direction: column; gap: 16px; max-width: 960px; margin-inline: auto; }
.spot {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: center;
  padding: 14px;
  border-radius: 32px;
  background: var(--panel-card);
}
.spot--flip .spot__media { order: 2; }
.spot__media { border-radius: 22px; overflow: hidden; background: #1a1a1a; }
.spot__body { display: flex; flex-direction: column; gap: 14px; padding: 10px; font-size: 14px; color: var(--on-panel-muted); }
.spot__body .h3 { color: var(--on-panel); }
.spot__body .btn--panel { margin-top: 6px; }
.cover { width: 100%; height: 100%; aspect-ratio: 16 / 10; object-fit: cover; object-position: top; }
.cover--empty { display: grid; place-items: center; background: #1f1f1f; color: #5a5a5a; font-size: 22px; font-weight: 600; letter-spacing: -0.02em; }
@media (max-width: 760px) {
  .spot { grid-template-columns: 1fr; }
  .spot--flip .spot__media { order: 0; }
}

/* ---------- Team ---------- */

.team { display: flex; flex-wrap: wrap; justify-content: center; gap: 28px 36px; }
.team__member { display: flex; flex-direction: column; align-items: center; gap: 4px; width: 120px; text-align: center; }
.team__avatar {
  display: grid;
  place-items: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--card);
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
  box-shadow: 0 1px 2px #0000000f;
}
.team__name { font-weight: 600; letter-spacing: -0.01em; }
a.team__name:hover { text-decoration: underline; text-underline-offset: 3px; }
.team__role { font-size: 13px; color: var(--muted); }

/* ---------- Testimonials ---------- */

.tcard { max-width: 860px; margin-inline: auto; background: var(--card); border-radius: 32px; padding: clamp(24px, 4vw, 40px); }
.tcard__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.tcard__nav { display: flex; gap: 8px; }
.tcard__nav button { width: 40px; height: 40px; border-radius: 50%; background: var(--page); font-size: 16px; }
.tcard__nav button:hover { background: var(--line); }
.tcard__body { display: grid; grid-template-columns: 96px 1fr; gap: 24px; align-items: start; animation: tfade 0.25s ease; }
.tcard__avatar { display: grid; place-items: center; width: 96px; height: 96px; border-radius: 24px; background: var(--page); font-size: 24px; font-weight: 600; }
.tcard__quote { font-size: clamp(17px, 1.8vw, 21px); line-height: 1.5; letter-spacing: -0.01em; color: #3a3a3a; }
.tcard__quote strong { color: var(--ink); font-weight: 600; }
.tcard__who { display: flex; flex-direction: column; margin-top: 18px; }
.tcard__name { font-weight: 600; }
.tcard__role { font-size: 13px; color: var(--muted); }
.tcard__count { margin-top: 20px; font-size: 13px; color: var(--muted); text-align: right; }
@keyframes tfade { from { opacity: 0; } }
@media (max-width: 640px) {
  .tcard__body { grid-template-columns: 1fr; }
}

/* ---------- Tools ---------- */

.tools__title { margin-bottom: 28px; }
.tools__pill { max-width: 860px; margin-inline: auto; background: var(--card); border-radius: var(--radius-pill); padding: 16px 0; }
.tools__item { display: inline-flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 500; color: var(--muted); white-space: nowrap; }

/* ---------- Trial ---------- */

.trial { padding-inline: 12px; }
.trial__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
  padding: clamp(48px, 7vw, 80px) var(--gutter);
  background: var(--card);
  border-radius: var(--radius-panel);
}
.trial__card .muted { max-width: 46ch; font-size: 15px; }
.trial__title { max-width: 16ch; margin-bottom: 8px; }
.price-tag { display: inline-block; padding: 2px 14px; border-radius: var(--radius-pill); background: var(--page); transform: rotate(-4deg); }
.trial__cta { margin-top: 12px; min-width: 220px; }

/* ---------- Closing CTA ---------- */

.closing { position: relative; overflow: hidden; padding-block: clamp(96px, 14vw, 180px); text-align: center; }
.closing__art {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  gap: 24px;
  padding-inline: 24px;
  color: #d6d6d6;
  opacity: 0.6;
  pointer-events: none;
  animation: closing-drift 30s ease-in-out infinite alternate;
}
.closing__inner { position: relative; display: flex; flex-direction: column; align-items: center; }
.closing__title { font-size: clamp(44px, 8vw, 104px); letter-spacing: -0.045em; line-height: 1; max-width: 12ch; }
.closing__word { display: inline-block; opacity: 0; transform: translateY(0.4em); transition: opacity 0.6s ease, transform 0.6s ease; }
.closing.is-in .closing__word { opacity: 1; transform: none; }
.closing__title > span:nth-child(2) .closing__word { transition-delay: 0.06s; }
.closing__title > span:nth-child(3) .closing__word { transition-delay: 0.12s; }
.closing__title > span:nth-child(4) .closing__word { transition-delay: 0.18s; }
.closing__sub { margin-top: 20px; color: var(--muted); opacity: 0; transition: opacity 0.6s ease 0.4s; }
.closing__actions { opacity: 0; transition: opacity 0.6s ease 0.5s; }
.closing.is-in .closing__sub, .closing.is-in .closing__actions { opacity: 1; }
@keyframes closing-drift { to { transform: translateX(-4%); } }
@media (max-width: 760px) {
  .closing__art { grid-template-columns: repeat(2, 1fr); opacity: 0.35; }
}
@media (prefers-reduced-motion: reduce) {
  .closing__word, .closing__sub, .closing__actions { opacity: 1; transform: none; }
}
```

- [ ] **Step 7: Full suite, commit**

Run: `npm test`
Expected: all pass. The old `services.test.jsx`, `contact.test.jsx`, `layout.test.jsx` and `blocks.test.jsx` still test files that still exist.

```bash
git add -A
git commit -m "feat: project spotlights, team, testimonial carousel, tools, trial week, closing CTA; new Home"
```

---

### Task 5: Recent Work and case studies

**Files:**
- Create: `src/components/{FilterPills,ProjectCard}.jsx`, `src/pages/{Work,CaseStudy}.jsx`, `src/test/work.test.jsx`
- Modify: `src/AppRoutes.jsx`, `src/styles.css`

**Interfaces:**
- Consumes: `Layout`, `Seo`, `SectionHeader`, `Tag`, `ProjectCover`, `ClosingCTA`, `NotFound`, `PROJECTS`, `TESTIMONIAL_QUOTES`.
- Produces:
  - `<FilterPills options={[key,label][]} value onChange label />`: buttons with `aria-pressed`
  - `<ProjectCard project />`
  - Routes `/work` (reads `?type=`, falls back to `all`) and `/work/:slug` (unknown slug → `NotFound`)
  - Exported `WORK_FILTERS` lives in `src/data/filters.js`: `[["all","All"],["ai","AI & Automation"],["saas","SaaS & Product"],["web","Websites"],["mobile","Mobile"]]`

- [ ] **Step 1: Write the failing test** — `src/test/work.test.jsx`

```jsx
import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import AppRoutes from "../AppRoutes";
import { PROJECTS } from "../data/projects";

const cards = (container) => [...container.querySelectorAll(".pcard")].map((a) => a.getAttribute("href"));

describe("/work", () => {
  it("lists every project by default", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/work" });
    expect(await screen.findByRole("heading", { level: 1, name: "Latest projects" })).toBeInTheDocument();
    expect(cards(container)).toHaveLength(PROJECTS.length);
  });

  it("filters by type and reflects it in the pressed pill", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/work" });
    await screen.findByRole("heading", { level: 1 });
    fireEvent.click(screen.getByRole("button", { name: "AI & Automation" }));
    expect(screen.getByRole("button", { name: "AI & Automation" })).toHaveAttribute("aria-pressed", "true");
    const ai = PROJECTS.filter((p) => p.types.includes("ai")).map((p) => `/work/${p.slug}`);
    expect(cards(container)).toEqual(ai);
  });

  it("an unknown ?type= falls back to All", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/work?type=nonsense" });
    await screen.findByRole("heading", { level: 1 });
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
    expect(cards(container)).toHaveLength(PROJECTS.length);
  });

  it("a filter with no projects says so", async () => {
    renderWithProviders(<AppRoutes />, { route: "/work?type=mobile" });
    await screen.findByRole("heading", { level: 1 });
    if (!PROJECTS.some((p) => p.types.includes("mobile"))) {
      expect(screen.getByText("No projects in this category yet.")).toBeInTheDocument();
    }
  });
});

describe("/work/:slug", () => {
  it("renders the case study with brief, build and the client quote", async () => {
    renderWithProviders(<AppRoutes />, { route: "/work/sacred-basil" });
    expect(await screen.findByRole("heading", { level: 1, name: "Sacred Basil" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The brief" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What we built" })).toBeInTheDocument();
    expect(screen.getByText(/deep audit of our business operations/)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Stack" })).toBeNull();
    expect(screen.getByRole("link", { name: "← All work" })).toHaveAttribute("href", "/work");
    expect(screen.getByRole("link", { name: /Next project/ })).toBeInTheDocument();
  });

  it("an unknown slug shows the 404 page", async () => {
    renderWithProviders(<AppRoutes />, { route: "/work/does-not-exist" });
    expect(await screen.findByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/test/work.test.jsx`
Expected: FAIL. `/work` renders the 404 page.

- [ ] **Step 3: Create the files**

`src/data/filters.js`:

```js
export const WORK_FILTERS = [
  ["all", "All"],
  ["ai", "AI & Automation"],
  ["saas", "SaaS & Product"],
  ["web", "Websites"],
  ["mobile", "Mobile"],
];

export const SWIPE_FILTERS = [
  ["all", "All"],
  ["product", "Product"],
  ["web", "Web"],
  ["brand", "Brand"],
];

/* Returns the ?type= value if it is a known filter key, else "all". */
export function pickFilter(filters, value) {
  return filters.some(([key]) => key === value) ? value : "all";
}
```

`src/components/FilterPills.jsx`:

```jsx
export default function FilterPills({ options, value, onChange, label }) {
  return (
    <div className="filters" role="group" aria-label={label}>
      {options.map(([key, text]) => (
        <button key={key} type="button" className="filter" aria-pressed={value === key} onClick={() => onChange(key)}>
          {text}
        </button>
      ))}
    </div>
  );
}
```

`src/components/ProjectCard.jsx`:

```jsx
import { Link } from "react-router-dom";
import Tag from "./Tag";
import ProjectCover from "./ProjectCover";

export default function ProjectCard({ project }) {
  return (
    <Link to={`/work/${project.slug}`} className="pcard">
      <div className="pcard__media">
        <ProjectCover project={project} />
      </div>
      <div className="pcard__meta">
        <h2 className="h3">{project.name}</h2>
        <div className="tags tags--light">
          <Tag>{project.industry}</Tag>
          <Tag>{project.audience}</Tag>
        </div>
      </div>
    </Link>
  );
}
```

`src/pages/Work.jsx`:

```jsx
import { useSearchParams } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import FilterPills from "../components/FilterPills";
import ProjectCard from "../components/ProjectCard";
import ClosingCTA from "../components/ClosingCTA";
import { PROJECTS } from "../data/projects";
import { WORK_FILTERS, pickFilter } from "../data/filters";

export default function Work() {
  const [params, setParams] = useSearchParams();
  const type = pickFilter(WORK_FILTERS, params.get("type"));
  const list = type === "all" ? PROJECTS : PROJECTS.filter((p) => p.types.includes(type));

  return (
    <Layout>
      <Seo
        title="Recent work"
        description="A selection of Velyx Labs' recent work across AI systems, SaaS products, websites and apps."
        path="/work"
      />
      <section className="page-head">
        <div className="container">
          <SectionHeader
            as="h1"
            align="center"
            title="Latest projects"
            sub="A selection of our recent work across AI systems, SaaS products, websites and apps."
          />
          <FilterPills
            label="Filter projects"
            options={WORK_FILTERS}
            value={type}
            onChange={(key) => setParams(key === "all" ? {} : { type: key }, { replace: true })}
          />
        </div>
      </section>
      <section className="section section--tight">
        <div className="container work-grid">
          {list.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
        {list.length === 0 && <p className="container muted center">No projects in this category yet.</p>}
      </section>
      <ClosingCTA />
    </Layout>
  );
}
```

`src/pages/CaseStudy.jsx`:

```jsx
import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import Tag from "../components/Tag";
import ProjectCover from "../components/ProjectCover";
import ClosingCTA from "../components/ClosingCTA";
import NotFound from "./NotFound";
import { PROJECTS } from "../data/projects";
import { TESTIMONIAL_QUOTES } from "../data/testimonials";

export default function CaseStudy() {
  const { slug } = useParams();
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  if (i < 0) return <NotFound />;
  const p = PROJECTS[i];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const quote = TESTIMONIAL_QUOTES.find((t) => t.name === p.quoteName);

  return (
    <Layout>
      <Seo title={`${p.name} — case study`} description={p.summary} path={`/work/${p.slug}`} />
      <article className="case">
        <header className="container case__head">
          <Link to="/work" className="case__back">← All work</Link>
          <h1 className="h1">{p.name}</h1>
          <p className="lead">{p.summary}</p>
          <div className="tags tags--light">
            <Tag>{p.industry}</Tag>
            <Tag>{p.audience}</Tag>
          </div>
        </header>
        <div className="container">
          <div className="case__hero"><ProjectCover project={p} /></div>
        </div>
        <div className="container case__body">
          <section>
            <h2 className="h3">The brief</h2>
            <p>{p.brief}</p>
          </section>
          <section>
            <h2 className="h3">What we built</h2>
            <p>{p.built}</p>
          </section>
          {p.stack.length > 0 && (
            <section>
              <h2 className="h3">Stack</h2>
              <div className="tags tags--light">{p.stack.map((s) => <Tag key={s}>{s}</Tag>)}</div>
            </section>
          )}
          {p.result && (
            <section>
              <h2 className="h3">Result</h2>
              <p>{p.result}</p>
            </section>
          )}
          {quote && (
            <figure className="case__quote">
              <blockquote>“{quote.q}”</blockquote>
              <figcaption>{quote.name} · {quote.role}</figcaption>
            </figure>
          )}
        </div>
        {p.gallery.length > 0 && (
          <div className="container case__gallery">
            {p.gallery.map((g) => (
              <img key={g.src} src={g.src} width={g.w} height={g.h} alt={`${p.name} — screenshot`} loading="lazy" />
            ))}
          </div>
        )}
        {next.slug !== p.slug && (
          <div className="container case__next">
            <Link to={`/work/${next.slug}`}>Next project: {next.name} <span aria-hidden="true">→</span></Link>
          </div>
        )}
      </article>
      <ClosingCTA />
    </Layout>
  );
}
```

`src/AppRoutes.jsx`: add these eager imports next to `Home`:

```jsx
import Work from "./pages/Work";
import CaseStudy from "./pages/CaseStudy";
```

and these routes before the `*` route:

```jsx
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
```

- [ ] **Step 4: Run test**

Run: `npx vitest run src/test/work.test.jsx`
Expected: PASS (6 tests).

- [ ] **Step 5: Insert styles** before the reduced-motion block:

```css
/* ---------- Page head + filters ---------- */

.page-head { padding-top: calc(var(--nav-h) + clamp(40px, 7vw, 80px)); padding-bottom: clamp(28px, 4vw, 44px); }
.page-head .section-header { margin-bottom: 28px; }
.filters { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
.filter { height: 38px; padding: 0 16px; border-radius: var(--radius-pill); background: var(--card); font-size: 14px; font-weight: 500; color: var(--muted); }
.filter:hover { color: var(--ink); }
.filter[aria-pressed="true"] { background: var(--ink); color: var(--page); }

/* ---------- Work grid ---------- */

.work-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.pcard { display: flex; flex-direction: column; gap: 14px; padding: 12px 12px 18px; background: var(--card); border-radius: 28px; transition: transform 0.2s, box-shadow 0.2s; }
.pcard:hover { transform: translateY(-4px); box-shadow: 0 12px 30px #0000000f; }
.pcard__media { border-radius: 20px; overflow: hidden; background: var(--page); }
.pcard .cover--empty { background: var(--page); color: #b5b5b5; }
.pcard__meta { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; padding-inline: 8px; }
@media (max-width: 700px) {
  .work-grid { grid-template-columns: 1fr; }
}

/* ---------- Case study ---------- */

.case__head { padding-top: calc(var(--nav-h) + clamp(32px, 6vw, 64px)); display: flex; flex-direction: column; align-items: flex-start; gap: 16px; max-width: 860px; }
.case__back { font-size: 14px; color: var(--muted); }
.case__back:hover { color: var(--ink); }
.case__hero { margin-top: 36px; border-radius: 28px; overflow: hidden; background: var(--card); max-width: 1080px; margin-inline: auto; }
.case__body { max-width: 720px; display: flex; flex-direction: column; gap: 32px; padding-block: clamp(40px, 6vw, 72px); }
.case__body .h3 { margin-bottom: 10px; }
.case__body p { color: #3a3a3a; }
.case__quote { background: var(--card); border-radius: var(--radius-card); padding: 28px; }
.case__quote blockquote { font-size: 18px; line-height: 1.55; }
.case__quote figcaption { margin-top: 14px; font-size: 14px; color: var(--muted); }
.case__gallery { display: grid; gap: 16px; max-width: 1080px; }
.case__gallery img { border-radius: 24px; }
.case__next { padding-block: 48px 0; text-align: center; font-weight: 600; }
.case__next a:hover { text-decoration: underline; text-underline-offset: 4px; }
```

- [ ] **Step 6: Full suite, commit**

Run: `npm test`
Expected: all pass.

```bash
git add -A
git commit -m "feat: Recent Work page with filters and per-project case studies"
```

---

### Task 6: Swipe File and lightbox

**Files:**
- Create: `src/components/Lightbox.jsx`, `src/pages/SwipeFile.jsx`, `src/test/swipe.test.jsx`
- Modify: `src/AppRoutes.jsx`, `src/styles.css`

**Interfaces:**
- Consumes: `Layout`, `Seo`, `SectionHeader`, `FilterPills`, `SWIPE`, `SWIPE_FILTERS`, `pickFilter`.
- Produces:
  - `<Lightbox items={SWIPE[]} index onIndex={(n)=>void} onClose={()=>void} />` (`role="dialog"`, `aria-label="Image viewer"`; buttons "Close", "Previous image", "Next image")
  - Route `/swipe-file` (lazy)

- [ ] **Step 1: Write the failing test** — `src/test/swipe.test.jsx`

```jsx
import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import AppRoutes from "../AppRoutes";
import { SWIPE } from "../data/swipe";

async function openSwipe(route = "/swipe-file") {
  const utils = renderWithProviders(<AppRoutes />, { route });
  await screen.findByRole("heading", { level: 1, name: "Swipe file" });
  return utils;
}

describe("/swipe-file", () => {
  it("shows every image and filters by category", async () => {
    const { container } = await openSwipe();
    expect(container.querySelectorAll(".swipe-item")).toHaveLength(SWIPE.length);
    fireEvent.click(screen.getByRole("button", { name: "Product" }));
    expect(container.querySelectorAll(".swipe-item")).toHaveLength(SWIPE.filter((s) => s.type === "product").length);
  });

  it("lightbox: opens on click, arrows wrap, Escape closes and returns focus", async () => {
    await openSwipe();
    const first = screen.getByRole("button", { name: "Open image 1" });
    first.focus();
    fireEvent.click(first);
    const dialog = screen.getByRole("dialog", { name: "Image viewer" });
    expect(dialog).toHaveTextContent(`1 / ${SWIPE.length}`);
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(dialog).toHaveTextContent(`${SWIPE.length} / ${SWIPE.length}`);
    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(dialog).toHaveTextContent(`1 / ${SWIPE.length}`);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(first).toHaveFocus();
  });

  it("an unknown ?type= falls back to All", async () => {
    const { container } = await openSwipe("/swipe-file?type=zzz");
    expect(container.querySelectorAll(".swipe-item")).toHaveLength(SWIPE.length);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/test/swipe.test.jsx`
Expected: FAIL. No "Swipe file" heading, because the route is missing.

- [ ] **Step 3: Create the files**

`src/components/Lightbox.jsx`:

```jsx
import { useEffect, useRef } from "react";

/* Modal image viewer: Esc closes, arrows navigate (wrapping), Tab is
   trapped inside, and focus returns to the opener on close. */
export default function Lightbox({ items, index, onIndex, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const n = items.length;

  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      if (opener && typeof opener.focus === "function") opener.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onIndex((index + 1) % n);
      else if (e.key === "ArrowLeft") onIndex((index - 1 + n) % n);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, n, onClose, onIndex]);

  const trapTab = (e) => {
    if (e.key !== "Tab") return;
    const focusables = [...dialogRef.current.querySelectorAll("button")];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const item = items[index];
  return (
    <div
      ref={dialogRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onKeyDown={trapTab}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button ref={closeRef} type="button" className="lightbox__close" aria-label="Close" onClick={onClose}>×</button>
      <button type="button" className="lightbox__nav lightbox__nav--prev" aria-label="Previous image" onClick={() => onIndex((index - 1 + n) % n)}>←</button>
      <img src={item.src} width={item.w} height={item.h} alt="" className="lightbox__img" />
      <button type="button" className="lightbox__nav lightbox__nav--next" aria-label="Next image" onClick={() => onIndex((index + 1) % n)}>→</button>
      <p className="lightbox__count">{index + 1} / {n}</p>
    </div>
  );
}
```

`src/pages/SwipeFile.jsx`:

```jsx
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import FilterPills from "../components/FilterPills";
import Lightbox from "../components/Lightbox";
import { SWIPE } from "../data/swipe";
import { SWIPE_FILTERS, pickFilter } from "../data/filters";

export default function SwipeFile() {
  const [params, setParams] = useSearchParams();
  const type = pickFilter(SWIPE_FILTERS, params.get("type"));
  const list = type === "all" ? SWIPE : SWIPE.filter((s) => s.type === type);
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <Layout>
      <Seo
        title="Swipe file"
        description="A raw look at recent Velyx Labs design work across products, websites and brands."
        path="/swipe-file"
      />
      <section className="page-head">
        <div className="container">
          <SectionHeader
            as="h1"
            align="center"
            title="Swipe file"
            sub="A raw look at recent design work across products, websites and brands."
          />
          <FilterPills
            label="Filter images"
            options={SWIPE_FILTERS}
            value={type}
            onChange={(key) => { setOpen(null); setParams(key === "all" ? {} : { type: key }, { replace: true }); }}
          />
        </div>
      </section>
      <section className="section section--tight">
        <div className="container swipe-grid">
          {list.map((s, i) => (
            <button key={s.src} type="button" className="swipe-item" aria-label={`Open image ${i + 1}`} onClick={() => setOpen(i)}>
              <img src={s.src} width={s.w} height={s.h} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </section>
      {open !== null && <Lightbox items={list} index={open} onIndex={setOpen} onClose={close} />}
    </Layout>
  );
}
```

`src/AppRoutes.jsx`: add the lazy import next to the other lazy ones, and the route before `*`:

```jsx
const SwipeFile = lazy(() => import("./pages/SwipeFile"));
```

```jsx
        <Route path="/swipe-file" element={<SwipeFile />} />
```

- [ ] **Step 4: Run test**

Run: `npx vitest run src/test/swipe.test.jsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Insert styles** before the reduced-motion block:

```css
/* ---------- Swipe file ---------- */

.swipe-grid { columns: 3 280px; column-gap: 14px; }
.swipe-item { display: block; width: 100%; margin-bottom: 14px; break-inside: avoid; border-radius: 20px; overflow: hidden; background: var(--card); transition: transform 0.2s; }
.swipe-item:hover { transform: translateY(-3px); }
.swipe-item img { width: 100%; }

/* ---------- Lightbox ---------- */

.lightbox { position: fixed; inset: 0; z-index: 200; display: grid; place-items: center; padding: 64px 72px; background: #0a0a0aeb; }
.lightbox__img { max-width: 100%; max-height: calc(100vh - 128px); width: auto; border-radius: 16px; }
.lightbox__close, .lightbox__nav { position: absolute; width: 44px; height: 44px; border-radius: 50%; background: #ffffff1a; color: #fff; font-size: 20px; }
.lightbox__close:hover, .lightbox__nav:hover { background: #ffffff33; }
.lightbox__close { top: 16px; right: 16px; }
.lightbox__nav--prev { left: 16px; top: 50%; transform: translateY(-50%); }
.lightbox__nav--next { right: 16px; top: 50%; transform: translateY(-50%); }
.lightbox__count { position: absolute; bottom: 20px; left: 0; right: 0; text-align: center; color: #bbb; font-size: 13px; }
.lightbox :focus-visible { outline-color: #fff; }
@media (max-width: 640px) {
  .lightbox { padding: 64px 12px; }
  .lightbox__nav { top: auto; bottom: 12px; transform: none; }
}
```

- [ ] **Step 6: Full suite, commit**

Run: `npm test`
Expected: all pass.

```bash
git add -A
git commit -m "feat: Swipe File with category filters and accessible lightbox"
```

---

### Task 7: Start a Project (brief form)

**Files:**
- Create: `src/components/BriefForm.jsx`, `src/pages/StartProject.jsx`, `src/test/start-project.test.jsx`
- Modify: `src/AppRoutes.jsx`, `src/styles.css`

**Interfaces:**
- Consumes: `Layout`, `Seo`, `SectionHeader`, `CalEmbed`, `CalButton`, `track`, `SERVICES`.
- Produces:
  - `<BriefForm formKey initialBudget />`: posts to `https://api.web3forms.com/submit` with JSON `{ access_key, subject, from_name, name, email, company, website, services, budget, timeline, message, botcheck? }`. Status is `idle | sending | sent | error`.
  - Route `/start-a-project` (eager); `?plan=trial` → `initialBudget="trial"`.

- [ ] **Step 1: Write the failing test** — `src/test/start-project.test.jsx`

```jsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import AppRoutes from "../AppRoutes";

async function openPage(route = "/start-a-project") {
  renderWithProviders(<AppRoutes />, { route });
  await screen.findByRole("heading", { level: 1, name: "Start a project" });
}

function fill() {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
  fireEvent.change(screen.getByLabelText("Tell us about the project"), { target: { value: "A WhatsApp CRM" } });
}

describe("/start-a-project", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("sends the brief with selected services, budget and timeline", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.stubGlobal("fetch", fetchMock);
    await openPage();
    fill();
    fireEvent.click(screen.getByRole("button", { name: "WhatsApp automation + CRM" }));
    fireEvent.click(screen.getByRole("button", { name: "Agentic AI automation" }));
    fireEvent.click(screen.getByRole("button", { name: "$10k–$25k" }));
    fireEvent.click(screen.getByRole("button", { name: "1–3 months" }));
    fireEvent.submit(screen.getByRole("form", { name: "Project brief" }));
    expect(await screen.findByText("Thanks — we got your brief.")).toBeInTheDocument();
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toMatchObject({
      access_key: "test-key",
      name: "Ada",
      email: "ada@example.com",
      message: "A WhatsApp CRM",
      services: "WhatsApp automation + CRM, Agentic AI automation",
      budget: "$10k–$25k",
      timeline: "1–3 months",
    });
  });

  it("?plan=trial pre-selects the trial budget", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    await openPage("/start-a-project?plan=trial");
    expect(screen.getByRole("button", { name: "Trial week ($1500)" })).toHaveAttribute("aria-pressed", "true");
  });

  it("shows an error with email fallback when sending fails", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await openPage();
    fill();
    fireEvent.submit(screen.getByRole("form", { name: "Project brief" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't send/i);
    expect(screen.queryByText("Thanks — we got your brief.")).toBeNull();
  });

  it("treats success: false as an error", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: false }) }));
    await openPage();
    fill();
    fireEvent.submit(screen.getByRole("form", { name: "Project brief" }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("without an access key, shows email instead of a form that can't send", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "");
    await openPage();
    expect(screen.queryByRole("form", { name: "Project brief" })).toBeNull();
    expect(screen.getAllByRole("link", { name: "velyxlabs@gmail.com" }).length).toBeGreaterThan(0);
  });

  it("offers the calendar for people who prefer to talk first", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    await openPage();
    expect(screen.getByRole("heading", { name: "Prefer to talk first?" })).toBeInTheDocument();
    expect(screen.getByTestId("cal-embed")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/test/start-project.test.jsx`
Expected: FAIL. No "Start a project" h1, because the route is missing.

- [ ] **Step 3: Create the files**

`src/components/BriefForm.jsx`:

```jsx
import { useState } from "react";
import CalEmbed from "./CalEmbed";
import { track } from "../lib/analytics";
import { SERVICES } from "../data/services";

const EMAIL = "velyxlabs@gmail.com";
/* TO CONFIRM: budget ranges. */
const BUDGETS = [["trial", "Trial week ($1500)"], ["3-10k", "$3k–$10k"], ["10-25k", "$10k–$25k"], ["25k+", "$25k+"]];
const TIMELINES = [["asap", "ASAP"], ["1-3m", "1–3 months"], ["exploring", "Exploring"]];

function Choices({ legend, options, selected, onToggle }) {
  return (
    <fieldset className="choices">
      <legend>{legend}</legend>
      <div className="choices__list">
        {options.map(([key, label]) => (
          <button key={key} type="button" className="filter" aria-pressed={selected.includes(key)} onClick={() => onToggle(key)}>
            {label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

const labelOf = (options, key) => options.find(([k]) => k === key)?.[1] ?? "";

export default function BriefForm({ formKey, initialBudget = "" }) {
  const [status, setStatus] = useState("idle");
  const [services, setServices] = useState([]);
  const [budget, setBudget] = useState(initialBudget);
  const [timeline, setTimeline] = useState("");
  const serviceOptions = SERVICES.map((s) => [s.id, s.title]);

  const toggleService = (id) => setServices((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: formKey,
          subject: "New project brief — velyxlabs.in",
          from_name: "Velyx Labs website",
          ...fields,
          services: services.map((id) => labelOf(serviceOptions, id)).join(", "),
          budget: labelOf(BUDGETS, budget),
          timeline: labelOf(TIMELINES, timeline),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Send failed");
      form.reset();
      setStatus("sent");
      track("brief_submit", { budget, location: "/start-a-project" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card brief-done" role="status">
        <h2 className="h3">Thanks — we got your brief.</h2>
        <p className="muted">Pick a time below for a kickoff call, or wait for our reply by email.</p>
        <CalEmbed />
      </div>
    );
  }

  return (
    <form className="card brief" aria-label="Project brief" onSubmit={onSubmit}>
      <div className="brief__row">
        <label className="field"><span>Name</span><input name="name" type="text" autoComplete="name" required /></label>
        <label className="field"><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
      </div>
      <div className="brief__row">
        <label className="field"><span>Company <span className="muted">(optional)</span></span><input name="company" type="text" autoComplete="organization" /></label>
        <label className="field"><span>Website <span className="muted">(optional)</span></span><input name="website" type="text" inputMode="url" autoComplete="url" /></label>
      </div>
      <Choices legend="What do you need?" options={serviceOptions} selected={services} onToggle={toggleService} />
      <Choices legend="Budget" options={BUDGETS} selected={[budget]} onToggle={(k) => setBudget((v) => (v === k ? "" : k))} />
      <Choices legend="Timeline" options={TIMELINES} selected={[timeline]} onToggle={(k) => setTimeline((v) => (v === k ? "" : k))} />
      <label className="field"><span>Tell us about the project</span><textarea name="message" rows="5" required /></label>
      <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {status === "error" && (
        <p className="form-error" role="alert">
          Sorry, we couldn't send that. Please email us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      )}
      <button type="submit" className="btn btn--primary btn--block" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send brief"}
      </button>
    </form>
  );
}
```

`src/pages/StartProject.jsx`:

```jsx
import { useSearchParams } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import BriefForm from "../components/BriefForm";
import CalEmbed from "../components/CalEmbed";
import CalButton from "../components/CalButton";

const EMAIL = "velyxlabs@gmail.com";

export default function StartProject() {
  const [params] = useSearchParams();
  const formKey = import.meta.env.VITE_WEB3FORMS_KEY;
  const initialBudget = params.get("plan") === "trial" ? "trial" : "";

  return (
    <Layout>
      <Seo
        title="Start a project"
        description="Tell Velyx Labs what you're building — send a brief or book a free 30-minute call."
        path="/start-a-project"
      />
      <section className="page-head">
        <div className="container intro">
          <div className="intro__copy">
            {/* TO CONFIRM: the reply-time promise. */}
            <SectionHeader as="h1" title="Start a project" sub="Tell us what you're building. We reply within one working day." />
            <p className="muted">
              Prefer email? <a href={`mailto:${EMAIL}`} className="intro__link">{EMAIL}</a>
            </p>
          </div>
          {formKey ? (
            <BriefForm formKey={formKey} initialBudget={initialBudget} />
          ) : (
            <div className="card">
              <h2 className="h3">Email us your brief</h2>
              <p className="muted">
                Write to <a href={`mailto:${EMAIL}`} className="intro__link">{EMAIL}</a> and we'll get back to you.
              </p>
            </div>
          )}
        </div>
      </section>
      <section id="book" className="section">
        <div className="container">
          <SectionHeader align="center" title="Prefer to talk first?" sub="Book a free 30-minute call with the founders." />
          <CalEmbed />
          <p className="final-cta__alt">
            Calendar not loading? <CalButton variant="secondary" size="sm">Open booking page</CalButton> or email{" "}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
        </div>
      </section>
    </Layout>
  );
}
```

`src/AppRoutes.jsx`: add the eager import `import StartProject from "./pages/StartProject";` and the route before `*`:

```jsx
        <Route path="/start-a-project" element={<StartProject />} />
```

- [ ] **Step 4: Run test**

Run: `npx vitest run src/test/start-project.test.jsx`
Expected: PASS (6 tests).

- [ ] **Step 5: Insert styles** before the reduced-motion block:

```css
/* ---------- Start a project ---------- */

.intro { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(28px, 5vw, 64px); align-items: start; }
.intro__copy .section-header { margin-bottom: 16px; }
.intro__link { color: var(--ink); text-decoration: underline; text-underline-offset: 3px; }
.brief { display: flex; flex-direction: column; gap: 20px; }
.brief__row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 8px; font-size: 14px; font-weight: 500; }
.field input, .field textarea {
  font: inherit;
  font-weight: 400;
  color: var(--ink);
  background: var(--page);
  border: 1px solid transparent;
  border-radius: 14px;
  padding: 12px 14px;
}
.field input:focus, .field textarea:focus { outline: none; border-color: var(--ink); background: var(--card); }
.field textarea { resize: vertical; }
.choices { border: 0; display: flex; flex-direction: column; gap: 10px; }
.choices legend { font-size: 14px; font-weight: 500; margin-bottom: 10px; }
.choices__list { display: flex; flex-wrap: wrap; gap: 6px; }
.choices .filter { background: var(--page); }
.choices .filter[aria-pressed="true"] { background: var(--ink); color: var(--page); }
.hp { position: absolute; left: -9999px; }
.form-error { color: #b42318; font-size: 14px; }
.form-error a { text-decoration: underline; }
.brief-done { display: flex; flex-direction: column; gap: 12px; }
@media (max-width: 860px) {
  .intro { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .brief__row { grid-template-columns: 1fr; }
}
```

- [ ] **Step 6: Full suite, commit**

Run: `npm test`
Expected: all pass.

```bash
git add -A
git commit -m "feat: Start a Project page with brief form, trial pre-selection and calendar"
```

---

### Task 8: Routes, redirects, /start, cleanup

**Files:**
- Rewrite: `scripts/routes.mjs`, `vercel.json`, `src/pages/Start.jsx`, `src/test/config.test.js`, `src/test/routes.test.jsx`, `README.md` (structure section)
- Modify: `src/AppRoutes.jsx`, `src/components/NotFound` only if it references removed components (it doesn't)
- Delete: the files listed under "Delete" in the File Map

**Interfaces:**
- Consumes: everything above.
- Produces: final route table `/`, `/work`, `/work/:slug`, `/swipe-file`, `/start-a-project`, `/start`, `/privacy`, `/terms`, `*`.

- [ ] **Step 1: Write the failing tests** — replace `src/test/config.test.js`:

```js
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { ROUTES } from "../../scripts/routes.mjs";
import { PROJECTS } from "../data/projects";

const vercel = JSON.parse(readFileSync("vercel.json", "utf8"));

describe("vercel redirects", () => {
  it.each([
    ["/portfolio", "/work"],
    ["/portfolio/:slug*", "/work"],
    ["/case-studies", "/work"],
    ["/case-studies/:slug*", "/work"],
    ["/services", "/#services"],
    ["/contact", "/start-a-project"],
    ["/blog", "/"],
    ["/blog/:slug*", "/"],
    ["/testimonials", "/"],
  ])("%s → %s (301)", (source, destination) => {
    const rule = (vercel.redirects || []).find((r) => r.source === source);
    expect(rule).toMatchObject({ destination, permanent: true });
  });

  it("keeps the SPA rewrite", () => {
    expect(vercel.rewrites).toEqual([{ source: "/(.*)", destination: "/index.html" }]);
  });
});

describe("public route list (sitemap + prerender)", () => {
  it("lists the kept pages and every case study", () => {
    expect(ROUTES.map((r) => r.path)).toEqual([
      "/",
      "/work",
      ...PROJECTS.map((p) => `/work/${p.slug}`),
      "/swipe-file",
      "/start-a-project",
      "/privacy",
      "/terms",
    ]);
  });

  it("every route has a description and sitemap fields", () => {
    for (const r of ROUTES) {
      expect(r.desc.length).toBeGreaterThan(20);
      expect(typeof r.priority).toBe("number");
      expect(r.changefreq).toMatch(/^(weekly|monthly|yearly)$/);
    }
  });
});
```

Replace `src/test/routes.test.jsx`:

```jsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import AppRoutes from "../AppRoutes";

describe("routes", () => {
  it.each([
    ["/", /AI and engineering partner/],
    ["/work", /Latest projects/],
    ["/work/getlandy", /Getlandy AI/],
    ["/swipe-file", /Swipe file/],
    ["/start-a-project", /Start a project/],
    ["/privacy", /Privacy/],
    ["/terms", /Terms/],
    ["/start", /AI and engineering partner/],
  ])("%s renders its h1", async (route, h1) => {
    renderWithProviders(<AppRoutes />, { route });
    expect(await screen.findByRole("heading", { level: 1, name: h1 })).toBeInTheDocument();
  });

  it("removed pages are gone from the app (redirects handle them)", async () => {
    for (const route of ["/services", "/contact"]) {
      const { unmount } = renderWithProviders(<AppRoutes />, { route });
      expect(await screen.findByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
      unmount();
    }
  });

  it("/start has no navigation exits", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/start" });
    await screen.findByRole("heading", { level: 1 });
    expect(container.querySelector('nav[aria-label="Main"]')).toBeNull();
    expect(container.querySelector('a[href="/work"]')).toBeNull();
  });

  it("unknown URLs show a 404 with a way home and a booking CTA", async () => {
    renderWithProviders(<AppRoutes />, { route: "/does-not-exist" });
    expect(await screen.findByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/");
    expect(screen.getAllByRole("link", { name: "Book a free call" }).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/test/config.test.js src/test/routes.test.jsx`
Expected: FAIL. The redirect destinations are still the old ones, the route list is the old one, and `/services` and `/contact` still render pages.

- [ ] **Step 3: Rewrite `scripts/routes.mjs`**

```js
/* Public, indexable routes — single source for sitemap + prerender-meta.
   /start is the noindex ads landing page and is intentionally absent. */
import { PROJECTS } from "../src/data/projects.js";

export const BASE = "https://www.velyxlabs.in";
export const DEFAULT_TITLE = "Velyx Labs — AI and engineering partner for founders";
export const DEFAULT_DESC =
  "Velyx Labs designs and builds AI agents, SaaS products, WhatsApp systems, websites and apps for founders and growing businesses — end to end, founder-led.";

export const ROUTES = [
  { path: "/", title: null, desc: DEFAULT_DESC, priority: 1.0, changefreq: "weekly" },
  { path: "/work", title: "Recent work", desc: "A selection of Velyx Labs' recent work across AI systems, SaaS products, websites and apps.", priority: 0.9, changefreq: "weekly" },
  ...PROJECTS.map((p) => ({ path: `/work/${p.slug}`, title: `${p.name} — case study`, desc: p.summary, priority: 0.7, changefreq: "monthly" })),
  { path: "/swipe-file", title: "Swipe file", desc: "A raw look at recent Velyx Labs design work across products, websites and brands.", priority: 0.6, changefreq: "monthly" },
  { path: "/start-a-project", title: "Start a project", desc: "Tell Velyx Labs what you're building — send a brief or book a free 30-minute call.", priority: 0.9, changefreq: "yearly" },
  { path: "/privacy", title: "Privacy Policy", desc: "How Velyx Labs collects, uses, and protects the information you share through this website.", priority: 0.3, changefreq: "yearly" },
  { path: "/terms", title: "Terms of Service", desc: "The terms that govern your use of the Velyx Labs website and the services offered through it.", priority: 0.3, changefreq: "yearly" },
];
```

Also update the defaults in `src/components/seoConfig.js` (`defaultTitle` and `defaultDescription`) to the same `DEFAULT_TITLE` and `DEFAULT_DESC` strings, and update the matching `<title>`, `<meta name="description">` and `og:*` defaults in `index.html`, so the prerendered and runtime defaults agree.

- [ ] **Step 4: Rewrite `vercel.json`**

```json
{
  "redirects": [
    { "source": "/portfolio", "destination": "/work", "permanent": true },
    { "source": "/portfolio/:slug*", "destination": "/work", "permanent": true },
    { "source": "/case-studies", "destination": "/work", "permanent": true },
    { "source": "/case-studies/:slug*", "destination": "/work", "permanent": true },
    { "source": "/services", "destination": "/#services", "permanent": true },
    { "source": "/contact", "destination": "/start-a-project", "permanent": true },
    { "source": "/blog", "destination": "/", "permanent": true },
    { "source": "/blog/:slug*", "destination": "/", "permanent": true },
    { "source": "/testimonials", "destination": "/", "permanent": true }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

- [ ] **Step 5: Final `src/AppRoutes.jsx`**

```jsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
// Main pages load eagerly so they paint without a second round-trip.
// Secondary routes stay lazy.
import Home from "./pages/Home";
import Work from "./pages/Work";
import CaseStudy from "./pages/CaseStudy";
import StartProject from "./pages/StartProject";

const SwipeFile = lazy(() => import("./pages/SwipeFile"));
const Start = lazy(() => import("./pages/Start"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Matches the site background so there is no flash between routes.
function PageFallback() {
  return <div className="page-fallback" />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/swipe-file" element={<SwipeFile />} />
        <Route path="/start-a-project" element={<StartProject />} />
        <Route path="/start" element={<Start />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
```

Note: `CaseStudy` imports `NotFound` eagerly for unknown slugs. That's fine; the lazy import above is only for the catch-all route.

- [ ] **Step 6: Rewrite `src/pages/Start.jsx`** (ads landing: logo + booking CTA, no nav exits)

```jsx
import Seo from "../components/Seo";
import Logo from "../components/Logo";
import CalButton from "../components/CalButton";
import SectionHeader from "../components/SectionHeader";
import FAQ from "../components/FAQ";
import TrustedBy from "../sections/home/TrustedBy";
import ServicesPanel from "../sections/home/ServicesPanel";
import TrialCard from "../components/TrialCard";
import { FAQ_ITEMS } from "../data/faq";

/* /start — dedicated ads landing page. No nav links (no exits); every
   CTA books a call or starts the trial. Cal clicks are tracked by GA4. */
export default function Start() {
  return (
    <>
      <Seo
        title="Build your AI system — free strategy call"
        description="Velyx Labs designs and builds AI agents, SaaS products, WhatsApp systems, websites and apps for founders. Book a free 30-minute call."
        path="/start"
        noindex
      />
      <header className="lp-head container">
        <Logo />
        <CalButton size="sm" />
      </header>
      <main>
        <section className="hero">
          <div className="container hero__inner">
            <p className="status"><span className="status__dot" aria-hidden="true" />Founder-led · Bangalore, India</p>
            <h1 className="h1 hero__title">An AI and engineering partner for founders and growing businesses.</h1>
            <p className="lead hero__sub">
              We design and build AI agents, SaaS products, WhatsApp systems, websites and apps that take repetitive
              work off your team — so you scale in revenue, not headcount.
            </p>
            <div className="hero__actions">
              <CalButton>Book a free 30-min call</CalButton>
            </div>
          </div>
        </section>
        <TrustedBy />
        <ServicesPanel />
        <div className="section"><TrialCard /></div>
        <section className="section">
          <div className="container">
            <SectionHeader align="center" title="FAQs" />
            <FAQ items={FAQ_ITEMS} />
          </div>
        </section>
      </main>
      <footer className="container lp-foot">
        © {new Date().getFullYear()} Velyx Labs · <a href="mailto:velyxlabs@gmail.com">velyxlabs@gmail.com</a> · <a href="/privacy">Privacy</a>
      </footer>
    </>
  );
}
```

Then insert this CSS before the reduced-motion block, together with the legal and 404 styles carried over from the previous design:

```css
/* ---------- /start landing, legal, 404 ---------- */

.lp-head { display: flex; justify-content: space-between; align-items: center; padding-block: 20px; }
.lp-foot { padding-block: 32px; font-size: 14px; color: var(--muted); text-align: center; }
.lp-foot a { text-decoration: underline; text-underline-offset: 3px; }
.page-hero { padding-top: calc(var(--nav-h) + clamp(48px, 8vw, 96px)); padding-bottom: clamp(32px, 5vw, 56px); }
.not-found { min-height: 70vh; }
.legal { max-width: calc(70ch + 2 * var(--gutter)); }
.legal__title { margin-block: 14px 20px; }
.legal__updated { margin-top: 16px; font-size: 14px; color: var(--muted); }
.legal__body { padding-bottom: var(--section-y); }
.legal__block { padding-block: 24px; border-top: 1px solid var(--line); }
.legal__block .h3 { margin-bottom: 10px; }
.legal__block p + p, .legal__block p + ul, .legal__block ul + p { margin-top: 12px; }
.legal__block p, .legal__list { color: #3a3a3a; }
.legal__list { list-style: disc; padding-left: 22px; display: flex; flex-direction: column; gap: 6px; }
```

Note: `NotFound` uses `.hero__actions`, `.page-hero` and `.not-found`, all of which are defined by now.

- [ ] **Step 7: Delete replaced code and its tests**

```bash
git rm src/components/Nav.jsx src/components/Footer.jsx src/components/StickyCta.jsx \
  src/components/ClientStrip.jsx src/components/ProcessSteps.jsx src/components/FinalCTA.jsx \
  src/sections/home/About.jsx src/sections/home/Testimonials.jsx \
  src/pages/Contact.jsx src/data/process.js \
  src/test/layout.test.jsx src/test/blocks.test.jsx src/test/contact.test.jsx
```

`layout.test.jsx` also holds the `ScrollManager` tests. Before deleting it, move its `describe("ScrollManager", …)` block, together with its imports (`vi`, `act`, `fireEvent`, `screen`, `Link`, `ScrollManager`, `renderWithProviders`), into a new file `src/test/scroll.test.jsx`, unchanged.

Then confirm nothing references the removed files:

Run: `grep -rnE "components/(Nav|Footer|StickyCta|ClientStrip|ProcessSteps|FinalCTA)\"|sections/home/(About|ServicesGrid|Testimonials)|pages/(Services|Contact)\"|data/process" src`
Expected: no output.

- [ ] **Step 8: Update `README.md`.** In the Project Structure block, replace the `pages/` line with `pages/  # Home, Work, CaseStudy, SwipeFile, StartProject, Start (ads), Privacy, Terms, NotFound`. Replace the "Removed pages…" line with: `Old URLs (/portfolio, /case-studies, /services, /contact, /blog, /testimonials) 301-redirect via vercel.json.`

- [ ] **Step 9: Run everything**

Run: `npm run lint && npm test && npm run build`
Expected: 0 lint errors. All tests pass. The build logs `sitemap.xml written — 12 URLs` (`/`, `/work`, 6 case studies, `/swipe-file`, `/start-a-project`, `/privacy`, `/terms`) and `prerender-meta: wrote 12 route HTML files`.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: final routes, redirects and sitemap; restyle /start; remove replaced pages"
```

---

### Task 9: Verification and content hand-off

**Files:** none, unless a check fails.

- [ ] **Step 1: Preview build**

Run: `npm run build && npx vite preview --port 4317 --strictPort`. Open `/`, `/work`, `/work/getlandy`, `/work/overshoot` (no cover), `/swipe-file`, `/start-a-project?plan=trial`, `/start`, `/privacy` and `/nope`.

- [ ] **Step 2: Visual check against Kargul** at 1440px and 390px:
  - Light gray page, dark rounded panels for Services and Projects, white cards, pill nav centered.
  - Service illustrations animate. The logo strip loops on mobile and wraps statically on desktop.
  - The closing words rise in when scrolled into view.
  - No horizontal scroll (measure `scrollWidth === clientWidth` in a 375px iframe).
  - The nav fits at 375px: logo, Start a project, menu.

- [ ] **Step 3: Interactions:**
  - Work filters update the `?type=` URL.
  - The case-study "Next project" link works.
  - Lightbox works with mouse and keyboard.
  - Trial CTA → the brief opens with the trial budget selected.
  - "Open booking page" opens Cal.
  - With a real `VITE_WEB3FORMS_KEY`, one test brief arrives at velyxlabs@gmail.com.

- [ ] **Step 4: Reduced motion.** Emulate `prefers-reduced-motion: reduce` in DevTools Rendering: no loops, everything visible.

- [ ] **Step 5: Lighthouse mobile** on `/` and `/work`.
Expected: Performance ≥ 90 and Accessibility ≥ 95. If Performance falls short, check image weight first (`public/work/*.jpg`; the first spotlight image is below the fold and lazy) and the Simple Icons requests (lazy-loaded).

- [ ] **Step 6: Content hand-off.** List every **TO CONFIRM** default for the user:
  - Hero badge
  - Service tags
  - Stats
  - Kettler and Priya projects
  - Project briefs and builds (written from existing facts)
  - Stack and results (empty)
  - Team and avatars
  - Logo files
  - Swipe categories and more images
  - Trial-week contents
  - Budget ranges
  - Reply-time promise
  - FAQ answers

Apply their edits to the data files, re-run `npm test`, and commit.

- [ ] **Step 7: Finish the branch** with superpowers:finishing-a-development-branch.
