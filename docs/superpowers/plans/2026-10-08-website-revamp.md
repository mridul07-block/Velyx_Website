# Velyx Labs Website Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the cinematic, animation-heavy Velyx Labs site with a clean, fast, dark, conversion-focused site whose single conversion is booking a free 30-min Cal.com call.

**Architecture:** Same React 19 + Vite + React Router app. Delete the removed pages and all decorative systems (Three.js, preloader, audio, voice agent, cursor, Framer Motion), replace the 5,400-line `styles.css` with a small token-based stylesheet, and rebuild every kept page from a handful of small shared components (`Layout`, `Nav`, `Footer`, `CalButton`, `Section`, `SectionHeader`, `FAQ`, `ProcessSteps`, `FinalCTA`, …). Content lives in `src/data/*.js`. Old URLs 301 to kept pages via `vercel.json`.

**Tech Stack:** React 19, Vite 8, React Router 7, react-helmet-async, @calcom/embed-react, plain CSS, Vitest + Testing Library (added in Task 1), Web3Forms (contact form delivery).

**Spec:** `docs/superpowers/specs/2026-10-08-website-revamp-design.md`

## Global Constraints

- Single conversion: Cal.com, namespace `30min`, link `velyx-labs/30min`, config `{"layout":"month_view"}`. Primary CTA label: "Book a free call" (nav/sticky) or "Book a free 30-min call" (hero).
- Theme: keep current warm dark palette; amber accent used only for CTAs / key highlights.
- Font: Inter only (400/500/600). No Geist, Geist Mono, Instrument Serif, Playfair Display, no italic serif accent words.
- Body 17px desktop / 16px mobile, line-height 1.6; H1 clamp(40px, 6vw, 68px); H2 clamp(30px, 4vw, 46px).
- Container max 1200px; side padding clamp(16px, 4vw, 40px); section padding clamp(72px, 10vw, 128px).
- Motion: only a one-time CSS fade-up (opacity + 12px, 400ms) and 150ms hover transitions; all disabled under `prefers-reduced-motion`.
- **No pricing anywhere.**
- **No fabricated content:** only real clients, real quotes (verbatim), real people. Northwind, Sable Health, Halcyon AI are not clients and must not appear. No invented stats, no scarcity claims ("3 seats remain"), no fake live indicators.
- Removed: Case Studies, Blog, Testimonials page, Portfolio (merged into Services), navbar clock, sound toggle, voice agent ("talk to guide").
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95. No horizontal scroll at 375px.
- No inline style objects except where a third-party API requires them (Cal embed `style`).

## Review Focus

1. A visitor arriving from Google/ads on an old URL (`/blog/agentic-systems-replace-sdr-team`, `/portfolio/wa-health`, `/case-studies/x`, `/testimonials`) expects to land on a relevant live page, not a 404 → permanent redirects (Task 2 test).
2. Contact form submission when the network fails, Web3Forms rejects, or no access key is configured → visible error / email fallback, never a fake "sent" (Task 8 tests).
3. Cal.com script blocked (ad blocker, slow network) → the visitor still sees a working email fallback next to every inline calendar (Task 5 test).
4. Unknown URL typed by hand → a 404 page with a way home and a booking CTA, not a blank screen (Task 9 test).
5. IntersectionObserver missing or never firing → content wrapped in `FadeIn` must still be visible (Task 3 test). Also: nav anchors `/#process` and `/#about` clicked from another page must scroll to the section after the lazy page loads (Task 4 test).

---

## File Map

Create:
- `src/test/setup.js` — test setup (jest-dom, cleanup, Cal mock)
- `src/test/renderWithProviders.jsx` — render helper (HelmetProvider + MemoryRouter)
- `src/test/*.test.js(x)` — tests (one file per task area)
- `src/AppRoutes.jsx` — route table (testable without BrowserRouter)
- `scripts/routes.mjs` — single list of public routes for sitemap + prerender
- `src/lib/cal.js` — Cal constants
- `src/lib/useInView.js` — IntersectionObserver hook
- `src/components/` — `CalButton`, `Section`, `SectionHeader`, `FadeIn`, `FAQ`, `Logo`, `Nav`, `Footer`, `StickyCta`, `Layout`, `ScrollManager`, `ClientStrip`, `ProcessSteps`, `CalEmbed`, `FinalCTA`
- `src/sections/home/` — `Hero`, `ServicesGrid`, `Testimonials`, `About`
- `src/data/` — `clients.js`, `services.js`, `process.js`, `faq.js`
- `src/pages/NotFound.jsx`

Rewrite: `src/App.jsx`, `src/styles.css`, `src/pages/Home.jsx`, `src/pages/Services.jsx`, `src/pages/Contact.jsx`, `src/pages/Start.jsx`, `src/pages/LegalPage.jsx`, `scripts/gen-sitemap.mjs`, `scripts/prerender-meta.mjs`, `vercel.json`, `index.html` (fonts + viewport), `README.md`, `.env.example`

Delete (Tasks 2 and 10): pages `Portfolio`, `OfferingDetail`, `CaseStudies`, `CaseStudyDetail`, `Testimonials`, `Blog`, `BlogPost`; components `Preloader`, `CustomCursor`, `VoiceAgent`, `NavIndex`, `ProgressUpdater`, `Reveal`, `CaseViz`, `caseVizMap`, `offeringViz`, `offeringVizMap`, `IndustryIcon`, `BrandMark`, `CineNav`, `CineFooter`; sections `Hero`, `ShipScroll`, `Sections`, `ExtraSections`, `Founders`; `src/audio/`, `src/lib/blog.js`, `src/content/blog/`, `src/data/caseStudies.js`, `src/data/offerings.js`, `public/uploads/portfolio-*.png`.

Keep untouched: `src/components/Seo.jsx`, `src/components/seoConfig.js`, `src/lib/analytics.js`, `src/data/testimonials.js`, `src/pages/Privacy.jsx`, `src/pages/Terms.jsx`, `scripts/indexnow.mjs`.

Note: the spec says Services examples come from `offerings.js`. The plan copies the needed titles/taglines into `src/data/services.js` and deletes `offerings.js`, since nothing else will use it.

---

### Task 1: Branch + test tooling

**Files:**
- Modify: `package.json` (scripts + devDependencies)
- Modify: `vite.config.js`, `eslint.config.js`
- Create: `src/test/setup.js`, `src/test/renderWithProviders.jsx`, `src/test/smoke.test.jsx`

**Interfaces:**
- Produces: `npm test` (Vitest, jsdom); `renderWithProviders(ui, { route = "/" } = {})` returning Testing Library's render result; global mock of `@calcom/embed-react` where `default` renders `<div data-testid="cal-embed" />` and `getCalApi` resolves to a no-op function.

- [ ] **Step 1: Create the branch**

```bash
git checkout -b revamp/clean-site
```

- [ ] **Step 2: Install test dependencies**

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

Expected: install succeeds. If npm reports a peer conflict between `vitest` and `vite@8`, install the newest vitest major that lists vite 8 in its peers (`npm view vitest peerDependencies`).

- [ ] **Step 3: Add the test script**

In `package.json` `"scripts"`, add after `"lint"`:

```json
    "test": "vitest run",
```

- [ ] **Step 4: Configure Vitest** — replace `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
```

- [ ] **Step 5: Create `src/test/setup.js`**

```js
import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { createElement } from "react";

afterEach(() => cleanup());

// Cal.com loads a remote script + iframe; replace it in tests.
vi.mock("@calcom/embed-react", () => ({
  default: () => createElement("div", { "data-testid": "cal-embed" }),
  getCalApi: async () => () => {},
}));
```

- [ ] **Step 6: Create `src/test/renderWithProviders.jsx`**

```jsx
import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";

export function renderWithProviders(ui, { route = "/" } = {}) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </HelmetProvider>
  );
}
```

- [ ] **Step 7: Write a smoke test** — `src/test/smoke.test.jsx`

```jsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";

describe("test setup", () => {
  it("renders inside the providers", () => {
    renderWithProviders(<h1>hello</h1>);
    expect(screen.getByRole("heading", { name: "hello" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 8: Let test files skip the Fast Refresh lint rule** — in `eslint.config.js`, add this object as the last entry of the `defineConfig([...])` array:

```js
  {
    files: ['src/test/**'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
```

- [ ] **Step 8b: Run tests and lint**

Run: `npm test && npm run lint`
Expected: 1 test passes. Lint may show pre-existing errors in old files; record the count and do not fix old files here. The new files must add no lint errors.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vite.config.js eslint.config.js src/test
git commit -m "chore: add Vitest + Testing Library"
```

---

### Task 2: Remove pages, add redirects, single route list

**Files:**
- Create: `src/AppRoutes.jsx`, `scripts/routes.mjs`, `src/test/config.test.js`
- Rewrite: `src/App.jsx`, `scripts/gen-sitemap.mjs`, `scripts/prerender-meta.mjs`, `vercel.json`
- Delete: `src/pages/{Portfolio,OfferingDetail,CaseStudies,CaseStudyDetail,Testimonials,Blog,BlogPost}.jsx`, `src/lib/blog.js`, `src/content/blog/`, `src/data/caseStudies.js`, `src/components/{Preloader,VoiceAgent}.jsx`, `src/audio/`

**Interfaces:**
- Produces: `ROUTES` (array of `{ path, title, desc, priority, changefreq }`), `BASE`, `DEFAULT_TITLE`, `DEFAULT_DESC` from `scripts/routes.mjs`; default export `AppRoutes` (a `<Suspense><Routes/></Suspense>` tree, rendered inside any router).

- [ ] **Step 1: Write failing tests** — `src/test/config.test.js`

```js
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { ROUTES } from "../../scripts/routes.mjs";

const vercel = JSON.parse(readFileSync("vercel.json", "utf8"));

describe("vercel redirects for removed pages", () => {
  it.each([
    ["/portfolio", "/services"],
    ["/portfolio/:slug*", "/services"],
    ["/case-studies", "/services"],
    ["/case-studies/:slug*", "/services"],
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
  it("contains exactly the kept, indexable pages", () => {
    expect(ROUTES.map((r) => r.path)).toEqual(["/", "/services", "/contact", "/privacy", "/terms"]);
  });

  it("every route has a description and sitemap fields", () => {
    for (const r of ROUTES) {
      expect(r.desc.length).toBeGreaterThan(40);
      expect(typeof r.priority).toBe("number");
      expect(r.changefreq).toMatch(/^(weekly|monthly|yearly)$/);
    }
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/test/config.test.js`
Expected: FAIL — `Cannot find module '../../scripts/routes.mjs'`.

- [ ] **Step 3: Create `scripts/routes.mjs`**

```js
/* Public, indexable routes — single source for sitemap + prerender-meta.
   /start is the noindex ads landing page and is intentionally absent. */
export const BASE = "https://www.velyxlabs.in";
export const DEFAULT_TITLE = "Velyx Labs — Agentic systems & AI-native SaaS for founders";
export const DEFAULT_DESC =
  "We partner with founders to build agentic systems, AI-native SaaS, and bespoke automation that compound — so your company scales in revenue, not headcount.";

export const ROUTES = [
  { path: "/", title: null, desc: DEFAULT_DESC, priority: 1.0, changefreq: "weekly" },
  {
    path: "/services",
    title: "Services — AI systems, SaaS & apps",
    desc: "Agentic automation, AI SaaS and MVPs, WhatsApp automation with CRM, and websites and mobile apps — designed and built by Velyx Labs.",
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/contact",
    title: "Contact — book a free call",
    desc: "Book a free 30-minute call with Velyx Labs, or send us a message about what you want to build.",
    priority: 0.8,
    changefreq: "yearly",
  },
  { path: "/privacy", title: "Privacy Policy", desc: "How Velyx Labs collects, uses, and protects the information you share through this website.", priority: 0.3, changefreq: "yearly" },
  { path: "/terms", title: "Terms of Service", desc: "The terms that govern your use of the Velyx Labs website and the services offered through it.", priority: 0.3, changefreq: "yearly" },
];
```

- [ ] **Step 4: Rewrite `vercel.json`**

```json
{
  "redirects": [
    { "source": "/portfolio", "destination": "/services", "permanent": true },
    { "source": "/portfolio/:slug*", "destination": "/services", "permanent": true },
    { "source": "/case-studies", "destination": "/services", "permanent": true },
    { "source": "/case-studies/:slug*", "destination": "/services", "permanent": true },
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

- [ ] **Step 5: Rewrite `scripts/gen-sitemap.mjs`**

```js
/* Generates public/sitemap.xml from scripts/routes.mjs. */
import { writeFileSync } from "node:fs";
import { BASE, ROUTES } from "./routes.mjs";

const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(
  (r) => `  <url>
    <loc>${BASE}${r.path === "/" ? "" : r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`
).join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap.xml written — ${ROUTES.length} URLs`);
```

- [ ] **Step 6: Rewrite `scripts/prerender-meta.mjs`** (same render logic, routes from `routes.mjs`)

```js
/* ------------------------------------------------------------------
   PRERENDER META — writes a static HTML file per route with the
   correct <title>, description, canonical and Open Graph baked in.
   The body still hydrates the SPA normally. Runs as postbuild.
------------------------------------------------------------------ */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { BASE, DEFAULT_TITLE, ROUTES } from "./routes.mjs";

const SITE = "Velyx Labs";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fullTitle = (t) => (t ? `${t} · ${SITE}` : DEFAULT_TITLE);
const canon = (p) => `${BASE}${p === "/" ? "" : p}`;

const template = readFileSync("dist/index.html", "utf8");

function render(route) {
  const t = esc(fullTitle(route.title));
  const d = esc(route.desc);
  const url = canon(route.path);
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[\s\S]*?("\s*\/>)/, `$1${d}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[\s\S]*?("\s*\/>)/, `$1${t}$2`)
    .replace(/(<meta property="og:description" content=")[\s\S]*?("\s*\/>)/, `$1${d}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
}

for (const route of ROUTES) {
  const outDir = route.path === "/" ? "dist" : join("dist", route.path);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), render(route));
}
console.log(`prerender-meta: wrote ${ROUTES.length} route HTML files`);
```

- [ ] **Step 7: Create `src/AppRoutes.jsx`**

```jsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const Start = lazy(() => import("./pages/Start"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

// Matches the site background so there is no white flash between routes.
function PageFallback() {
  return <div className="page-fallback" />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/start" element={<Start />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Suspense>
  );
}
```

- [ ] **Step 8: Rewrite `src/App.jsx`** (no preloader, no voice agent)

```jsx
import { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { getCalApi } from "@calcom/embed-react";
import AppRoutes from "./AppRoutes";
import { initClickTracking } from "./lib/analytics";

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  // GA4 conversion + outbound click tracking
  useEffect(() => initClickTracking(), []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}
```

- [ ] **Step 9: Delete removed pages and systems**

```bash
git rm src/pages/Portfolio.jsx src/pages/OfferingDetail.jsx src/pages/CaseStudies.jsx \
  src/pages/CaseStudyDetail.jsx src/pages/Testimonials.jsx src/pages/Blog.jsx src/pages/BlogPost.jsx \
  src/lib/blog.js src/data/caseStudies.js src/components/Preloader.jsx src/components/VoiceAgent.jsx
git rm -r src/content/blog src/audio
```

Then check for imports of deleted files:

Run: `grep -rnE "Preloader|VoiceAgent|ambientEngine|caseStudies|lib/blog|pages/(Portfolio|OfferingDetail|CaseStudies|CaseStudyDetail|Testimonials|Blog|BlogPost)" src scripts`
Expected: only hits in files that later tasks rewrite or delete (`CineNav.jsx` imports `ambientEngine`; `ExtraSections.jsx`/`Sections.jsx`/`CaseViz.jsx` may import `caseStudies`). For each hit, fix it so the build passes. In `CineNav.jsx`, delete the `getAmbient` import, the audio `useEffect`, `toggleAudio`, the `audioOn` state, the clock `setInterval` and `time` state, the `nav__audio` button and the `nav__time` span. Remove any other import of a deleted file together with the JSX that used it. `CineNav` is deleted in Task 10; this only keeps the build green until then.

- [ ] **Step 10: Run tests + build**

Run: `npm test && npm run build`
Expected: tests pass. Build passes and logs `sitemap.xml written — 5 URLs` and `prerender-meta: wrote 5 route HTML files`.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: remove case studies, blog, testimonials, portfolio; add 301s and shared route list"
```

---

### Task 3: Design system + primitives

**Files:**
- Rewrite: `src/styles.css` (wholesale replacement — old pages look unstyled until Tasks 6–9 rebuild them; expected on this branch)
- Modify: `index.html` (font link + viewport)
- Create: `src/lib/cal.js`, `src/lib/useInView.js`, `src/components/{CalButton,Section,SectionHeader,FadeIn,FAQ}.jsx`, `src/test/primitives.test.jsx`

**Interfaces:**
- Produces:
  - `src/lib/cal.js`: `CAL_NAMESPACE = "30min"`, `CAL_LINK = "velyx-labs/30min"`, `CAL_CONFIG = { layout: "month_view" }`, `CAL_ATTRS` (object of the three `data-cal-*` attributes).
  - `useInView(rootMargin = "0px") → [ref, inView]`; `inView` starts `true` when `IntersectionObserver` is undefined, and stays `true` once seen.
  - `<CalButton variant="primary"|"secondary" size="md"|"sm" block={false} className>{children = "Book a free call"}</CalButton>` renders a `<button type="button" class="btn btn--…">` with `CAL_ATTRS`.
  - `<Section id className alt={false}>` renders `<section class="section [section--alt]"><div class="container">…`.
  - `<SectionHeader eyebrow title sub align="left"|"center" as="h2"|"h1">`
  - `<FadeIn className>` renders a wrapper `div.fade`, which gains `is-in` when in view.
  - `<FAQ items={[{ q, a }]}>` renders `<details>` per item.

- [ ] **Step 1: Write failing tests** — `src/test/primitives.test.jsx`

```jsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import CalButton from "../components/CalButton";
import FAQ from "../components/FAQ";
import FadeIn from "../components/FadeIn";
import SectionHeader from "../components/SectionHeader";

describe("CalButton", () => {
  it("opens the 30-min Cal.com booking with the default label", () => {
    render(<CalButton />);
    const btn = screen.getByRole("button", { name: "Book a free call" });
    expect(btn).toHaveAttribute("data-cal-link", "velyx-labs/30min");
    expect(btn).toHaveAttribute("data-cal-namespace", "30min");
    expect(btn).toHaveAttribute("data-cal-config", '{"layout":"month_view"}');
    expect(btn).toHaveAttribute("type", "button");
    expect(btn).toHaveClass("btn", "btn--primary");
  });

  it("supports variant, size, block and custom label", () => {
    render(<CalButton variant="secondary" size="sm" block>Open booking</CalButton>);
    expect(screen.getByRole("button", { name: "Open booking" })).toHaveClass("btn--secondary", "btn--sm", "btn--block");
  });
});

describe("FAQ", () => {
  it("renders each question as a collapsible details element", () => {
    const { container } = render(<FAQ items={[{ q: "Q one?", a: "A one." }, { q: "Q two?", a: "A two." }]} />);
    expect(container.querySelectorAll("details")).toHaveLength(2);
    expect(screen.getByText("Q one?").tagName).toBe("SUMMARY");
    expect(screen.getByText("A two.")).toBeInTheDocument();
  });
});

describe("SectionHeader", () => {
  it("renders eyebrow, h2 title and sub", () => {
    render(<SectionHeader eyebrow="Process" title="How we work" sub="Four steps." />);
    expect(screen.getByRole("heading", { level: 2, name: "How we work" })).toBeInTheDocument();
    expect(screen.getByText("Process")).toBeInTheDocument();
    expect(screen.getByText("Four steps.")).toBeInTheDocument();
  });

  it("can render the page h1", () => {
    render(<SectionHeader as="h1" title="Services" />);
    expect(screen.getByRole("heading", { level: 1, name: "Services" })).toBeInTheDocument();
  });
});

describe("FadeIn", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("is visible immediately when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<FadeIn><p>content</p></FadeIn>);
    expect(screen.getByText("content").parentElement).toHaveClass("fade", "is-in");
  });

  it("reveals when the observer reports intersection", () => {
    let fire;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb) { fire = cb; }
        observe() {}
        disconnect() {}
      }
    );
    render(<FadeIn><p>later</p></FadeIn>);
    const wrap = screen.getByText("later").parentElement;
    expect(wrap).not.toHaveClass("is-in");
    act(() => fire([{ isIntersecting: true }]));
    expect(wrap).toHaveClass("is-in");
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/test/primitives.test.jsx`
Expected: FAIL — cannot resolve `../components/CalButton`.

- [ ] **Step 3: Create `src/lib/cal.js`**

```js
/* Cal.com booking — the site's single conversion. */
export const CAL_NAMESPACE = "30min";
export const CAL_LINK = "velyx-labs/30min";
export const CAL_CONFIG = { layout: "month_view" };

export const CAL_ATTRS = {
  "data-cal-namespace": CAL_NAMESPACE,
  "data-cal-link": CAL_LINK,
  "data-cal-config": JSON.stringify(CAL_CONFIG),
};
```

- [ ] **Step 4: Create `src/lib/useInView.js`**

```js
import { useEffect, useRef, useState } from "react";

/* True once the element has entered the viewport (never flips back).
   Without IntersectionObserver support, content is shown immediately. */
export default function useInView(rootMargin = "0px") {
  const ref = useRef(null);
  const [inView, setInView] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    if (inView || !ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [inView, rootMargin]);

  return [ref, inView];
}
```

- [ ] **Step 5: Create the primitives**

`src/components/CalButton.jsx`:

```jsx
import { CAL_ATTRS } from "../lib/cal";

export default function CalButton({ children = "Book a free call", variant = "primary", size = "md", block = false, className = "" }) {
  const classes = ["btn", `btn--${variant}`, size === "sm" && "btn--sm", block && "btn--block", className]
    .filter(Boolean)
    .join(" ");
  return (
    <button type="button" className={classes} {...CAL_ATTRS}>
      {children}
    </button>
  );
}
```

`src/components/Section.jsx`:

```jsx
export default function Section({ id, className = "", alt = false, children }) {
  const classes = ["section", alt && "section--alt", className].filter(Boolean).join(" ");
  return (
    <section id={id} className={classes}>
      <div className="container">{children}</div>
    </section>
  );
}
```

`src/components/SectionHeader.jsx`:

```jsx
export default function SectionHeader({ eyebrow, title, sub, align = "left", as: Heading = "h2" }) {
  return (
    <header className={`section-header section-header--${align}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Heading className={Heading === "h1" ? "h1" : "h2"}>{title}</Heading>
      {sub && <p className="section-header__sub">{sub}</p>}
    </header>
  );
}
```

`src/components/FadeIn.jsx`:

```jsx
import useInView from "../lib/useInView";

export default function FadeIn({ className = "", children }) {
  const [ref, inView] = useInView("0px 0px -10% 0px");
  return (
    <div ref={ref} className={["fade", inView && "is-in", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
```

`src/components/FAQ.jsx`:

```jsx
export default function FAQ({ items }) {
  return (
    <div className="faq">
      {items.map(({ q, a }) => (
        <details key={q} className="faq__item">
          <summary className="faq__q">{q}</summary>
          <p className="faq__a">{a}</p>
        </details>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Run tests**

Run: `npx vitest run src/test/primitives.test.jsx`
Expected: PASS (7 tests).

- [ ] **Step 7: Replace `src/styles.css`** with the base design system. Later tasks append their component sections below this.

```css
/* ============================================
   VELYX LABS — design tokens + base
   ============================================ */

:root {
  --bg: oklch(0.14 0.01 60);
  --bg-elev: oklch(0.17 0.012 60);
  --border: oklch(0.26 0.01 60);
  --text: oklch(0.96 0.005 80);
  --text-muted: oklch(0.72 0.01 70);
  --accent: oklch(0.78 0.16 65);
  --accent-hover: oklch(0.84 0.15 70);
  --accent-ink: #14110a;

  --font: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;

  --container: 1200px;
  --gutter: clamp(16px, 4vw, 40px);
  --section-y: clamp(72px, 10vw, 128px);
  --radius: 16px;
  --nav-h: 72px;
}

*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; padding: 0; }

html {
  scroll-behavior: smooth;
  scroll-padding-top: calc(var(--nav-h) + 16px);
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  font-size: 17px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

@media (max-width: 640px) {
  body { font-size: 16px; }
}

a { color: inherit; text-decoration: none; }
button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
img { display: block; max-width: 100%; height: auto; }
ul { list-style: none; }

::selection { background: var(--accent); color: var(--accent-ink); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 6px; }

/* ---------- Type ---------- */

h1, h2, h3 { font-weight: 600; letter-spacing: -0.02em; line-height: 1.15; text-wrap: balance; }
.h1 { font-size: clamp(40px, 6vw, 68px); letter-spacing: -0.03em; line-height: 1.05; }
.h2 { font-size: clamp(30px, 4vw, 46px); }
.h3 { font-size: clamp(19px, 1.6vw, 22px); }
.eyebrow {
  display: block;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.muted { color: var(--text-muted); }
.lead { font-size: clamp(17px, 1.5vw, 20px); color: var(--text-muted); max-width: 60ch; }

/* ---------- Layout ---------- */

.container { width: 100%; max-width: var(--container); margin-inline: auto; padding-inline: var(--gutter); }
.section { padding-block: var(--section-y); }
.section--alt { background: var(--bg-elev); border-block: 1px solid var(--border); }
.page-fallback { min-height: 100vh; background: var(--bg); }

.section-header { max-width: 720px; margin-bottom: clamp(36px, 5vw, 56px); }
.section-header .eyebrow { margin-bottom: 14px; }
.section-header__sub { margin-top: 16px; font-size: clamp(17px, 1.4vw, 19px); color: var(--text-muted); max-width: 60ch; }
.section-header--center { margin-inline: auto; text-align: center; }
.section-header--center .section-header__sub { margin-inline: auto; }

.grid-2, .grid-3, .grid-4 { display: grid; gap: 20px; }
.grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
@media (max-width: 900px) {
  .grid-3, .grid-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
}

/* ---------- Buttons ---------- */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  padding: 0 22px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}
.btn--primary { background: var(--accent); color: var(--accent-ink); }
.btn--primary:hover { background: var(--accent-hover); }
.btn--secondary { border: 1px solid var(--border); color: var(--text); }
.btn--secondary:hover { border-color: var(--text-muted); }
.btn--sm { height: 40px; padding: 0 18px; font-size: 15px; }
.btn--block { width: 100%; }

/* ---------- Cards ---------- */

.card {
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: clamp(24px, 3vw, 32px);
}

/* ---------- FAQ ---------- */

.faq { max-width: 820px; margin-inline: auto; border-top: 1px solid var(--border); }
.faq__item { border-bottom: 1px solid var(--border); }
.faq__q {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 22px 0;
  font-size: clamp(17px, 1.5vw, 19px);
  font-weight: 500;
  cursor: pointer;
  list-style: none;
}
.faq__q::-webkit-details-marker { display: none; }
.faq__q::after { content: "+"; color: var(--text-muted); font-weight: 400; }
.faq__item[open] .faq__q::after { content: "–"; }
.faq__a { padding-bottom: 22px; color: var(--text-muted); max-width: 65ch; }

/* ---------- Motion ---------- */

.fade { opacity: 0; transform: translateY(12px); transition: opacity 0.4s ease, transform 0.4s ease; }
.fade.is-in { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .fade { opacity: 1; transform: none; }
  *, *::before, *::after { transition: none !important; }
}
```

- [ ] **Step 8: Update `index.html`** — make two edits:

Replace the viewport meta (`maximum-scale=1` blocks zoom and fails Lighthouse accessibility):

```html
  <meta name="viewport" content="width=device-width, initial-scale=1" />
```

Replace the Google Fonts `<link href=…Geist…>` element with:

```html
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
    rel="stylesheet" />
```

- [ ] **Step 9: Run tests, lint, build**

Run: `npm test && npm run build`
Expected: all tests pass; build succeeds (old pages render unstyled — expected).

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: new design system (Inter, tokens) and UI primitives"
```

---

### Task 4: Nav, Footer, StickyCta, Layout, ScrollManager

**Files:**
- Create: `src/components/{Logo,Nav,Footer,StickyCta,Layout,ScrollManager}.jsx`, `src/test/layout.test.jsx`
- Modify: `src/App.jsx` (replace `ScrollToTop` with `ScrollManager`)
- Modify: `src/styles.css` (append nav/footer/sticky styles)

**Interfaces:**
- Consumes: `CalButton` (Task 3).
- Produces: `<Layout>{page}</Layout>` (skip link + Nav + `<main id="main">` + Footer + StickyCta); `<Logo />`; `<ScrollManager />` (scrolls to `#hash` target once it exists, otherwise to top).

- [ ] **Step 1: Write failing tests** — `src/test/layout.test.jsx`

```jsx
import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import StickyCta from "../components/StickyCta";
import ScrollManager from "../components/ScrollManager";

describe("Nav", () => {
  it("shows the four links and the booking CTA", () => {
    renderWithProviders(<Nav />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    for (const [name, href] of [["Services", "/services"], ["Process", "/#process"], ["About", "/#about"], ["Contact", "/contact"]]) {
      expect(within(nav).getAllByRole("link", { name })[0]).toHaveAttribute("href", href);
    }
    expect(within(nav).getAllByRole("button", { name: "Book a free call" })[0]).toHaveAttribute("data-cal-link", "velyx-labs/30min");
  });

  it("has no clock, no sound toggle, no removed pages", () => {
    const { container } = renderWithProviders(<Nav />);
    expect(container.textContent).not.toMatch(/\d{2}:\d{2}:\d{2}/);
    expect(screen.queryByRole("button", { name: /sound/i })).toBeNull();
    expect(container.textContent).not.toMatch(/Blog|Case Studies|Testimonials|Portfolio/);
  });

  it("toggles the mobile menu", () => {
    renderWithProviders(<Nav />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("mobile-menu")).toBeInTheDocument();
  });
});

describe("Footer", () => {
  it("links to kept pages and legal, with no newsletter form", () => {
    const { container } = renderWithProviders(<Footer />);
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
    expect(screen.getByRole("link", { name: "velyxlabs@gmail.com" })).toHaveAttribute("href", "mailto:velyxlabs@gmail.com");
    expect(container.querySelector("form")).toBeNull();
    expect(container.textContent).not.toMatch(/Blog|Case studies|Testimonials|Portfolio/);
  });
});

describe("StickyCta", () => {
  it("appears only after scrolling past the hero", () => {
    renderWithProviders(<StickyCta />);
    expect(screen.queryByRole("button", { name: "Book a free call" })).toBeNull();
    act(() => {
      window.scrollY = 700;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.getByRole("button", { name: "Book a free call" })).toBeInTheDocument();
    window.scrollY = 0;
  });
});

describe("ScrollManager", () => {
  it("scrolls to the hash target once it exists", () => {
    const target = document.createElement("div");
    target.id = "process";
    target.scrollIntoView = vi.fn();
    document.body.appendChild(target);
    renderWithProviders(<ScrollManager />, { route: "/#process" });
    expect(target.scrollIntoView).toHaveBeenCalled();
    target.remove();
  });

  it("scrolls to top when there is no hash", () => {
    const spy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    renderWithProviders(<ScrollManager />, { route: "/services" });
    expect(spy).toHaveBeenCalledWith(0, 0);
    spy.mockRestore();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/test/layout.test.jsx`
Expected: FAIL — cannot resolve `../components/Nav`.

- [ ] **Step 3: Create `src/components/Logo.jsx`**

```jsx
const ICON =
  "https://res.cloudinary.com/dmhabztbf/image/upload/v1779688104/ChatGPT_Image_May_25__2026__11_15_18_AM-removebg-preview_hy48ex.png";

export default function Logo() {
  return (
    <span className="logo">
      <img src={ICON} alt="" width="36" height="36" className="logo__icon" />
      <span className="logo__word">
        vely<span className="logo__x">x</span> labs
      </span>
    </span>
  );
}
```

- [ ] **Step 4: Create `src/components/Nav.jsx`**

```jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import CalButton from "./CalButton";

const LINKS = [
  { label: "Services", to: "/services" },
  { label: "Process", to: "/#process" },
  { label: "About", to: "/#about" },
  { label: "Contact", to: "/contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(() => typeof window !== "undefined" && window.scrollY > 20);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${scrolled || open ? "nav--solid" : ""}`}>
      <nav className="nav__inner container" aria-label="Main">
        <Link to="/" className="nav__brand" aria-label="Velyx Labs home" onClick={close}>
          <Logo />
        </Link>
        <ul className="nav__links">
          {LINKS.map((l) => (
            <li key={l.label}>
              <Link to={l.to}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <div className="nav__actions">
          <CalButton size="sm" className="nav__cta" />
          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
        {open && (
          <div id="mobile-menu" className="nav__mobile">
            <ul>
              {LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} onClick={close}>{l.label}</Link>
                </li>
              ))}
            </ul>
            <CalButton block />
          </div>
        )}
      </nav>
    </header>
  );
}
```

- [ ] **Step 5: Create `src/components/Footer.jsx`**

```jsx
import { Link } from "react-router-dom";
import Logo from "./Logo";

const COLUMNS = [
  {
    title: "Services",
    links: [
      { label: "Agentic automation", to: "/services#agents" },
      { label: "AI SaaS & MVPs", to: "/services#saas" },
      { label: "WhatsApp automation + CRM", to: "/services#whatsapp" },
      { label: "Websites & mobile apps", to: "/services#web" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/#about" },
      { label: "Process", to: "/#process" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

const SOCIAL = [
  { label: "X / Twitter", href: "https://x.com/VelyxLabs" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/velyx-labs/" },
  { label: "GitHub", href: "https://github.com/ATHARVISM2804" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo />
          <p className="muted">
            We design and build agentic systems, AI-native SaaS and automation for founders.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h2 className="footer__title">{col.title}</h2>
            <ul className="footer__list">
              {col.links.map((l) => (
                <li key={l.label}><Link to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="footer__title">Connect</h2>
          <ul className="footer__list">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
              </li>
            ))}
            <li><a href="mailto:velyxlabs@gmail.com">velyxlabs@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Velyx Labs</span>
        <span className="footer__legal">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Create `src/components/StickyCta.jsx`**

```jsx
import { useEffect, useState } from "react";
import CalButton from "./CalButton";

/* Mobile-only bottom booking bar (hidden ≥900px via CSS). */
export default function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;
  return (
    <div className="sticky-cta">
      <CalButton block />
    </div>
  );
}
```

- [ ] **Step 7: Create `src/components/Layout.jsx`**

```jsx
import Nav from "./Nav";
import Footer from "./Footer";
import StickyCta from "./StickyCta";

export default function Layout({ children }) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
      <StickyCta />
    </>
  );
}
```

- [ ] **Step 8: Create `src/components/ScrollManager.jsx`**

```jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* On navigation: scroll to the #hash target (waiting for lazy pages to
   render it, up to ~30 frames), otherwise to the top. */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    let tries = 0;
    let frame;
    const find = () => {
      const el = document.getElementById(hash.slice(1));
      if (el) el.scrollIntoView();
      else if (tries++ < 30) frame = requestAnimationFrame(find);
    };
    find();
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}
```

- [ ] **Step 9: Use it in `src/App.jsx`** — delete the `ScrollToTop` function and the `useLocation` import, add `import ScrollManager from "./components/ScrollManager";`, and replace `<ScrollToTop />` with `<ScrollManager />`.

- [ ] **Step 10: Run tests**

Run: `npx vitest run src/test/layout.test.jsx`
Expected: PASS (7 tests).

- [ ] **Step 11: Append styles to `src/styles.css`**

```css
/* ---------- Skip link ---------- */

.skip-link { position: absolute; left: -9999px; top: 12px; z-index: 200; }
.skip-link:focus { left: 16px; background: var(--accent); color: var(--accent-ink); padding: 8px 14px; border-radius: 8px; }

/* ---------- Logo ---------- */

.logo { display: inline-flex; align-items: center; gap: 10px; }
.logo__icon { width: 36px; height: 36px; object-fit: contain; }
.logo__word { font-size: 20px; font-weight: 600; letter-spacing: -0.02em; white-space: nowrap; }
.logo__x { color: var(--accent); }

/* ---------- Nav ---------- */

.nav {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 100;
  border-bottom: 1px solid transparent;
  transition: background-color 0.15s, border-color 0.15s;
}
.nav--solid { background: oklch(0.14 0.01 60 / 0.92); backdrop-filter: blur(12px); border-bottom-color: var(--border); }
.nav__inner { height: var(--nav-h); display: flex; align-items: center; gap: 32px; position: relative; }
.nav__brand { margin-right: auto; }
.nav__links { display: flex; gap: 32px; font-size: 15px; font-weight: 500; color: var(--text-muted); }
.nav__links a:hover { color: var(--text); }
.nav__actions { display: flex; align-items: center; gap: 12px; }
.nav__toggle { display: none; width: 40px; height: 40px; flex-direction: column; justify-content: center; align-items: center; gap: 6px; }
.nav__toggle span { display: block; width: 20px; height: 2px; background: var(--text); }
.nav__mobile {
  position: absolute;
  top: var(--nav-h);
  left: 0;
  right: 0;
  padding: 8px var(--gutter) 24px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}
.nav__mobile ul { margin-bottom: 16px; }
.nav__mobile a { display: block; padding: 14px 0; font-size: 18px; font-weight: 500; border-bottom: 1px solid var(--border); }

@media (max-width: 900px) {
  .nav__links, .nav__cta { display: none; }
  .nav__toggle { display: flex; }
}
@media (min-width: 901px) {
  .nav__mobile { display: none; }
}

/* ---------- Footer ---------- */

.footer { border-top: 1px solid var(--border); padding-top: 64px; }
.footer__grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }
.footer__brand p { margin-top: 16px; max-width: 34ch; font-size: 15px; }
.footer__title { font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 16px; }
.footer__list { display: flex; flex-direction: column; gap: 10px; font-size: 15px; }
.footer__list a:hover, .footer__legal a:hover { color: var(--accent); }
.footer__bottom {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 56px;
  padding-block: 24px;
  border-top: 1px solid var(--border);
  font-size: 14px;
  color: var(--text-muted);
}
.footer__legal { display: flex; gap: 20px; }

@media (max-width: 900px) {
  .footer__grid { grid-template-columns: 1fr 1fr; }
  .footer__brand { grid-column: 1 / -1; }
}
@media (max-width: 900px) {
  .footer { padding-bottom: 88px; } /* room for the sticky CTA */
}

/* ---------- Sticky mobile CTA ---------- */

.sticky-cta {
  position: fixed;
  inset: auto 0 0 0;
  z-index: 90;
  padding: 12px var(--gutter) max(12px, env(safe-area-inset-bottom));
  background: oklch(0.14 0.01 60 / 0.95);
  border-top: 1px solid var(--border);
}
@media (min-width: 901px) {
  .sticky-cta { display: none; }
}
```

- [ ] **Step 12: Run all tests and build, commit**

Run: `npm test && npm run build`
Expected: all pass.

```bash
git add -A
git commit -m "feat: clean Nav, Footer, sticky mobile CTA, Layout and hash-aware scrolling"
```

---

### Task 5: Shared conversion blocks + content data

**Files:**
- Create: `src/data/{clients,services,process,faq}.js`
- Create: `src/components/{ClientStrip,ProcessSteps,CalEmbed,FinalCTA}.jsx`, `src/test/blocks.test.jsx`
- Modify: `src/App.jsx` (track completed bookings), `src/styles.css` (append)

**Interfaces:**
- Consumes: `Section`, `SectionHeader`, `CalButton`, `FadeIn`, `useInView`, `CAL_*` (Task 3); `track(name, params)` from `src/lib/analytics.js`.
- Produces:
  - `CLIENTS: string[]`
  - `SERVICES: { id, title, summary, description, deliverables: string[], examples: [title, tagline][] }[]` with ids `agents`, `saas`, `whatsapp`, `web`
  - `PROCESS: [title, text][]` (4 steps)
  - `FAQ_ITEMS: { q, a }[]` (6 items)
  - `<ClientStrip label="Trusted by founders at" />`, `<ProcessSteps />` (section `id="process"`), `<CalEmbed />`, `<FinalCTA />` (section `id="book"`).

- [ ] **Step 1: Write failing tests** — `src/test/blocks.test.jsx`

```jsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import FinalCTA from "../components/FinalCTA";
import ProcessSteps from "../components/ProcessSteps";
import ClientStrip from "../components/ClientStrip";
import { SERVICES } from "../data/services";
import { FAQ_ITEMS } from "../data/faq";
import { CLIENTS } from "../data/clients";

describe("FinalCTA", () => {
  it("shows the inline calendar plus an email fallback", () => {
    renderWithProviders(<FinalCTA />);
    expect(screen.getByRole("heading", { level: 2, name: /what you want to build/i })).toBeInTheDocument();
    expect(screen.getByTestId("cal-embed")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "velyxlabs@gmail.com" })).toHaveAttribute("href", "mailto:velyxlabs@gmail.com");
    expect(screen.getByRole("button", { name: "Open booking page" })).toHaveAttribute("data-cal-link", "velyx-labs/30min");
  });
});

describe("ProcessSteps", () => {
  it("renders four numbered steps in the #process section", () => {
    const { container } = renderWithProviders(<ProcessSteps />);
    expect(container.querySelector("section#process")).not.toBeNull();
    expect(container.querySelectorAll(".step")).toHaveLength(4);
    expect(screen.getByText("Free call")).toBeInTheDocument();
  });
});

describe("content data", () => {
  it("has the four services with stable anchor ids", () => {
    expect(SERVICES.map((s) => s.id)).toEqual(["agents", "saas", "whatsapp", "web"]);
    for (const s of SERVICES) {
      expect(s.examples.length).toBeGreaterThanOrEqual(3);
      expect(s.deliverables.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("has six FAQs and no pricing or fabricated clients", () => {
    expect(FAQ_ITEMS).toHaveLength(6);
    const all = JSON.stringify([SERVICES, FAQ_ITEMS, CLIENTS]);
    expect(all).not.toMatch(/\$|₹|Northwind|Sable|Halcyon|seats remain/i);
  });

  it("renders the client strip", () => {
    renderWithProviders(<ClientStrip />);
    expect(screen.getByText("Sacred Basil")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/test/blocks.test.jsx`
Expected: FAIL — cannot resolve `../components/FinalCTA`.

- [ ] **Step 3: Create the data files**

`src/data/clients.js`:

```js
/* Real clients and products we've built for — names only. Never add a
   name here without a real engagement behind it. */
export const CLIENTS = [
  "Getlandy AI",
  "Sacred Basil",
  "Overshoot",
  "NarayanKripa",
  "YorkScreenPlay",
  "SparklingTimes",
  "Eavesdrop",
  "GetCredentialingDone",
  "Estatico",
  "Orange Production",
  "Scanva & Co",
];
```

`src/data/services.js`:

```js
/* The four services. `id` is the anchor on /services (#agents …). */
export const SERVICES = [
  {
    id: "agents",
    title: "Agentic automation",
    summary: "AI agents that answer, qualify, follow up and file — the repetitive work your team shouldn't be doing.",
    description:
      "We map the work that repeats every day and build AI agents that do it inside the tools you already use. People stay in control where it matters, with approval steps for anything sensitive.",
    deliverables: [
      "A map of the process we automate",
      "Agents connected to your CRM, email, WhatsApp and docs",
      "Human approval steps where it matters",
      "Monitoring and handover documentation",
    ],
    examples: [
      ["Inbound qualification agent", "Only the conversations worth your hour."],
      ["Outbound research & outreach", "SDR-team leverage, without the SDR team."],
      ["Customer support copilot", "Support that scales as fast as you sign."],
      ["Finance & back-office ops agent", "Clear the work that eats your week."],
    ],
  },
  {
    id: "saas",
    title: "AI SaaS & MVPs",
    summary: "From idea to a production product — auth, billing, AI features and analytics included.",
    description:
      "We take your product from idea to paying users. You get a real, production-ready app built to grow, not a prototype that has to be rebuilt later.",
    deliverables: [
      "Product scoping and UX design",
      "Production app with auth, billing and admin",
      "AI features built on your data",
      "Deployment, analytics and handover",
    ],
    examples: [
      ["AI-native vertical SaaS", "Zero to paying customers, built for year three."],
      ["“Chat with your data” product", "Your knowledge, turned into an answer engine."],
      ["Embedded AI copilot", "Drop an AI copilot into the product you already have."],
      ["Document intelligence platform", "Turn documents into structured, trusted data."],
    ],
  },
  {
    id: "whatsapp",
    title: "WhatsApp automation + CRM",
    summary: "Bookings, reminders, lead follow-up and re-engagement, running on WhatsApp.",
    description:
      "Your customers already live on WhatsApp. We automate the conversations that win and keep them — bookings, reminders, follow-ups — with a simple CRM so your team sees every lead.",
    deliverables: [
      "WhatsApp Business API setup",
      "Automated booking, reminder and follow-up flows",
      "CRM with lead and conversation history",
      "Team training and handover",
    ],
    examples: [
      ["WhatsApp CRM for clinics", "Fewer no-shows, fuller chairs."],
      ["WhatsApp CRM for real estate", "Every lead answered in seconds."],
      ["Lead nurture & re-engagement", "Bring past enquiries back automatically."],
    ],
  },
  {
    id: "web",
    title: "Websites & mobile apps",
    summary: "Fast, modern websites and cross-platform apps that look like the company you're becoming.",
    description:
      "We design and build websites and apps that load fast, read clearly and turn visitors into customers — from marketing sites to full custom platforms.",
    deliverables: [
      "UX and visual design",
      "Responsive build, fast and SEO-ready",
      "Analytics and forms connected",
      "Launch and ongoing support",
    ],
    examples: [
      ["Marketing websites", "Clear, fast sites built to convert."],
      ["Custom web applications", "Portals, dashboards and platforms around your workflow."],
      ["Cross-platform mobile apps", "One codebase for iOS and Android."],
    ],
  },
];
```

`src/data/process.js`:

```js
export const PROCESS = [
  ["Free call", "30 minutes. You talk, we listen. No pitch deck."],
  ["Clear plan", "We tell you honestly what to build — and what not to."],
  ["Build", "Design to deployment, with the founders in the room."],
  ["Launch & support", "We ship to production and stay on to keep it running."],
];
```

`src/data/faq.js` (answers make no numeric or factual claims; the user reviews them in Task 11):

```js
export const FAQ_ITEMS = [
  {
    q: "How long does a typical project take?",
    a: "It depends on scope. After the free call we send a written plan with a timeline, so you know exactly what you're getting and when.",
  },
  {
    q: "Do we own the code and IP?",
    a: "Yes. The code, designs and accounts are yours at handover.",
  },
  {
    q: "We're not technical — is that a problem?",
    a: "Not at all. We explain everything in plain language and handle the technical side end to end.",
  },
  {
    q: "What happens after launch?",
    a: "We monitor, fix and improve what we built. Ongoing support is agreed up front, so nothing is left hanging.",
  },
  {
    q: "Can you work with the tools we already use?",
    a: "Yes. We build on top of what you already use — your CRM, WhatsApp, email and spreadsheets — instead of replacing everything.",
  },
  {
    q: "What happens on the free call?",
    a: "You tell us about your business and where you're stuck. We tell you honestly what we'd build, roughly how, and whether we're the right fit.",
  },
];
```

- [ ] **Step 4: Create the components**

`src/components/ClientStrip.jsx`:

```jsx
import { CLIENTS } from "../data/clients";

export default function ClientStrip({ label = "Trusted by founders at" }) {
  return (
    <div className="clients">
      <p className="eyebrow">{label}</p>
      <ul className="clients__list">
        {CLIENTS.map((c) => <li key={c}>{c}</li>)}
      </ul>
    </div>
  );
}
```

`src/components/ProcessSteps.jsx`:

```jsx
import Section from "./Section";
import SectionHeader from "./SectionHeader";
import CalButton from "./CalButton";
import FadeIn from "./FadeIn";
import { PROCESS } from "../data/process";

export default function ProcessSteps() {
  return (
    <Section id="process">
      <SectionHeader eyebrow="Process" title="How we work" sub="A simple path from first call to a system running in production." />
      <FadeIn>
        <ol className="steps grid-4">
          {PROCESS.map(([title, text], i) => (
            <li key={title} className="step card">
              <span className="step__num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="h3">{title}</h3>
              <p className="muted">{text}</p>
            </li>
          ))}
        </ol>
      </FadeIn>
      <div className="section-cta">
        <CalButton />
      </div>
    </Section>
  );
}
```

`src/components/CalEmbed.jsx`:

```jsx
import Cal from "@calcom/embed-react";
import useInView from "../lib/useInView";
import { CAL_CONFIG, CAL_LINK, CAL_NAMESPACE } from "../lib/cal";

/* Inline Cal.com calendar. Mounts only when near the viewport so the
   iframe doesn't slow down first load. */
export default function CalEmbed() {
  const [ref, inView] = useInView("300px");
  return (
    <div ref={ref} className="cal-embed">
      {inView && (
        <Cal
          namespace={CAL_NAMESPACE}
          calLink={CAL_LINK}
          config={CAL_CONFIG}
          style={{ width: "100%", height: "100%", overflow: "auto" }}
        />
      )}
    </div>
  );
}
```

`src/components/FinalCTA.jsx`:

```jsx
import Section from "./Section";
import SectionHeader from "./SectionHeader";
import CalEmbed from "./CalEmbed";
import CalButton from "./CalButton";

export default function FinalCTA() {
  return (
    <Section id="book" alt>
      <SectionHeader
        align="center"
        eyebrow="Book a call"
        title="Let's talk about what you want to build."
        sub="30 minutes. No pitch deck. You'll leave with a clear next step."
      />
      <CalEmbed />
      <p className="final-cta__alt">
        Calendar not loading? <CalButton variant="secondary" size="sm">Open booking page</CalButton> or email{" "}
        <a href="mailto:velyxlabs@gmail.com">velyxlabs@gmail.com</a>
      </p>
    </Section>
  );
}
```

- [ ] **Step 5: Track completed bookings in `src/App.jsx`** — in the Cal `useEffect`, after the `cal("ui", …)` line add:

```jsx
      cal("on", {
        action: "bookingSuccessful",
        callback: () => track("call_booked", { location: window.location.pathname }),
      });
```

and change the analytics import to `import { initClickTracking, track } from "./lib/analytics";`.

- [ ] **Step 6: Run tests**

Run: `npx vitest run src/test/blocks.test.jsx`
Expected: PASS (5 tests).

- [ ] **Step 7: Append styles to `src/styles.css`**

```css
/* ---------- Client strip ---------- */

.clients { margin-top: clamp(56px, 8vw, 88px); }
.clients .eyebrow { margin-bottom: 18px; }
.clients__list { display: flex; flex-wrap: wrap; gap: 12px 32px; font-size: 17px; font-weight: 500; color: var(--text-muted); }

/* ---------- Process ---------- */

.steps { list-style: none; }
.step { display: flex; flex-direction: column; gap: 10px; }
.step__num { font-size: 14px; font-weight: 600; color: var(--accent); }
.section-cta { margin-top: 40px; display: flex; justify-content: center; }

/* ---------- Final CTA ---------- */

.cal-embed {
  height: 640px;
  max-width: 1000px;
  margin-inline: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--bg);
}
.final-cta__alt {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 12px;
  margin-top: 20px;
  font-size: 15px;
  color: var(--text-muted);
}
.final-cta__alt a { color: var(--text); text-decoration: underline; text-underline-offset: 3px; }
```

- [ ] **Step 8: Run all tests, commit**

Run: `npm test`
Expected: all pass.

```bash
git add -A
git commit -m "feat: shared process, client strip, final CTA with inline Cal embed; content data"
```

---

### Task 6: Home page (7 sections)

**Files:**
- Create: `src/sections/home/{Hero,ServicesGrid,Testimonials,About}.jsx`, `src/test/home.test.jsx`
- Rewrite: `src/pages/Home.jsx`
- Modify: `src/styles.css` (append)

**Interfaces:**
- Consumes: `Layout`, `Section`, `SectionHeader`, `CalButton`, `FadeIn`, `FAQ`, `ClientStrip`, `ProcessSteps`, `FinalCTA`, `SERVICES`, `FAQ_ITEMS`, `TESTIMONIAL_QUOTES` (`{ name, role, avatar, q }` from `src/data/testimonials.js`), `Seo`, `SITE`.
- Produces: Home page with section ids `services`, `process`, `about`, `book`.

- [ ] **Step 1: Write failing test** — `src/test/home.test.jsx`

```jsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Home from "../pages/Home";

describe("Home", () => {
  it("renders the 7 essential sections in order", () => {
    const { container } = renderWithProviders(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    const ids = [...container.querySelectorAll("main section[id]")].map((s) => s.id);
    expect(ids).toEqual(["hero", "services", "process", "testimonials", "about", "faq", "book"]);
  });

  it("leads with the booking CTA and a link to services", () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole("button", { name: "Book a free 30-min call" })).toHaveAttribute("data-cal-link", "velyx-labs/30min");
    expect(screen.getByRole("link", { name: "See what we build" })).toHaveAttribute("href", "#services");
  });

  it("shows the three real quotes verbatim and both founders", () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/built a complete, production-ready web application/)).toBeInTheDocument();
    expect(screen.getByText("Dr. Parita")).toBeInTheDocument();
    expect(screen.getByText("Nishant")).toBeInTheDocument();
    expect(screen.getByText("Atharv Golait")).toBeInTheDocument();
    expect(screen.getByText("Mridul")).toBeInTheDocument();
  });

  it("links each service card to its section on /services", () => {
    renderWithProviders(<Home />);
    const links = screen.getAllByRole("link", { name: /^Learn more/ }).map((a) => a.getAttribute("href"));
    expect(links).toEqual(["/services#agents", "/services#saas", "/services#whatsapp", "/services#web"]);
  });

  it("contains no pricing, fake clients or fake live claims", () => {
    const { container } = renderWithProviders(<Home />);
    expect(container.textContent).not.toMatch(/\$|₹|Northwind|Sable Health|Halcyon|seats remain|AGENTS DEPLOYED/i);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/test/home.test.jsx`
Expected: FAIL (old Home imports Three.js / old sections, or section ids don't match).

- [ ] **Step 3: Create `src/sections/home/Hero.jsx`**

```jsx
import CalButton from "../../components/CalButton";
import ClientStrip from "../../components/ClientStrip";

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="container">
        <p className="eyebrow hero__eyebrow">Founder-led AI studio · Bangalore, India</p>
        <h1 className="h1 hero__title">AI systems and software that grow your business.</h1>
        <p className="lead hero__sub">
          We design and build agentic automation, AI-native SaaS, WhatsApp systems, websites and apps —
          so your team spends less time on repetitive work and more on growth.
        </p>
        <div className="hero__actions">
          <CalButton>Book a free 30-min call</CalButton>
          <a href="#services" className="btn btn--secondary">See what we build</a>
        </div>
        <p className="hero__note">30 minutes · No obligation · Talk directly to the builders</p>
        <ClientStrip />
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `src/sections/home/ServicesGrid.jsx`**

```jsx
import { Link } from "react-router-dom";
import Section from "../../components/Section";
import SectionHeader from "../../components/SectionHeader";
import FadeIn from "../../components/FadeIn";
import { SERVICES } from "../../data/services";

export default function ServicesGrid() {
  return (
    <Section id="services" alt>
      <SectionHeader eyebrow="Services" title="What we build" sub="Four ways we help founders put AI and software to work." />
      <FadeIn className="grid-2">
        {SERVICES.map((s) => (
          <article key={s.id} className="card service-card">
            <h3 className="h3">{s.title}</h3>
            <p className="muted">{s.summary}</p>
            <ul className="service-card__examples">
              {s.examples.slice(0, 3).map(([title]) => <li key={title}>{title}</li>)}
            </ul>
            <Link to={`/services#${s.id}`} className="service-card__link">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </FadeIn>
    </Section>
  );
}
```

- [ ] **Step 5: Create `src/sections/home/Testimonials.jsx`**

```jsx
import Section from "../../components/Section";
import SectionHeader from "../../components/SectionHeader";
import FadeIn from "../../components/FadeIn";
import { TESTIMONIAL_QUOTES } from "../../data/testimonials";

export default function Testimonials() {
  return (
    <Section id="testimonials" alt>
      <SectionHeader eyebrow="Testimonials" title="What founders say" />
      <FadeIn className="grid-3">
        {TESTIMONIAL_QUOTES.map((t) => (
          <figure key={t.name} className="card quote">
            <blockquote className="quote__text">“{t.q}”</blockquote>
            <figcaption className="quote__who">
              <span className="quote__avatar" aria-hidden="true">{t.avatar}</span>
              <span>
                <span className="quote__name">{t.name}</span>
                <span className="quote__role">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </FadeIn>
    </Section>
  );
}
```

- [ ] **Step 6: Create `src/sections/home/About.jsx`**

```jsx
import Section from "../../components/Section";
import SectionHeader from "../../components/SectionHeader";
import FadeIn from "../../components/FadeIn";

const FOUNDERS_PHOTO =
  "https://res.cloudinary.com/dmhabztbf/image/upload/v1784752931/Founders_Profile_VelyxLabs_ywryqa.jpg";

const POINTS = [
  ["Founders on every project", "You talk to the people who build your system — not an account manager."],
  ["Built for production, not demos", "We ship systems your team relies on every day."],
  ["You own the code", "Code, designs and accounts are yours at handover."],
  ["Clear scope and timeline", "A written plan before we start, so there are no surprises."],
];

const FOUNDERS = [
  { name: "Atharv Golait", role: "CEO & Co-founder", linkedin: "https://www.linkedin.com/in/atharv-golait-9048772ab/" },
  { name: "Mridul", role: "Founder" },
];

export default function About() {
  return (
    <Section id="about">
      <div className="about">
        <div>
          <SectionHeader eyebrow="Why Velyx" title="Built by founders, not account managers" />
          <FadeIn>
            <ul className="about__points">
              {POINTS.map(([title, text]) => (
                <li key={title}>
                  <h3 className="h3">{title}</h3>
                  <p className="muted">{text}</p>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
        <FadeIn className="about__founders card">
          <img src={FOUNDERS_PHOTO} alt="Atharv Golait and Mridul, founders of Velyx Labs" width="640" height="480" loading="lazy" className="about__photo" />
          <ul className="about__people">
            {FOUNDERS.map((f) => (
              <li key={f.name}>
                <span className="about__name">{f.name}</span>
                <span className="muted">{f.role}</span>
                {f.linkedin && (
                  <a href={f.linkedin} target="_blank" rel="noopener noreferrer" className="about__link">LinkedIn</a>
                )}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </Section>
  );
}
```

Note: confirm the real aspect ratio of `FOUNDERS_PHOTO` (open the URL) and set `width`/`height` to match, so the page doesn't shift as the image loads.

- [ ] **Step 7: Rewrite `src/pages/Home.jsx`**

```jsx
import Seo from "../components/Seo";
import { SITE } from "../components/seoConfig";
import Layout from "../components/Layout";
import Section from "../components/Section";
import SectionHeader from "../components/SectionHeader";
import FAQ from "../components/FAQ";
import ProcessSteps from "../components/ProcessSteps";
import FinalCTA from "../components/FinalCTA";
import Hero from "../sections/home/Hero";
import ServicesGrid from "../sections/home/ServicesGrid";
import Testimonials from "../sections/home/Testimonials";
import About from "../sections/home/About";
import { FAQ_ITEMS } from "../data/faq";

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
      <ServicesGrid />
      <ProcessSteps />
      <Testimonials />
      <About />
      <Section id="faq">
        <SectionHeader align="center" eyebrow="FAQ" title="Questions founders ask" />
        <FAQ items={FAQ_ITEMS} />
      </Section>
      <FinalCTA />
    </Layout>
  );
}
```

Note: `ServicesGrid` and `Testimonials` both use `alt`, and `FinalCTA` is also `alt`. The resulting background order is hero (plain) → services (alt) → process (plain) → testimonials (alt) → about (plain) → faq (plain) → book (alt).

- [ ] **Step 8: Run test**

Run: `npx vitest run src/test/home.test.jsx`
Expected: PASS (5 tests).

- [ ] **Step 9: Append styles to `src/styles.css`**

```css
/* ---------- Home: hero ---------- */

.hero {
  padding-top: calc(var(--nav-h) + clamp(64px, 10vw, 128px));
  padding-bottom: var(--section-y);
  background: radial-gradient(60% 50% at 20% 0%, oklch(0.78 0.16 65 / 0.10), transparent 70%);
}
.hero__eyebrow { margin-bottom: 20px; }
.hero__title { max-width: 16ch; }
.hero__sub { margin-top: 24px; }
.hero__actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 36px; }
.hero__note { margin-top: 16px; font-size: 14px; color: var(--text-muted); }

/* ---------- Home: services ---------- */

.service-card { display: flex; flex-direction: column; gap: 14px; }
.service-card__examples { display: flex; flex-direction: column; gap: 8px; font-size: 15px; }
.service-card__examples li::before { content: "—"; color: var(--accent); margin-right: 10px; }
.service-card__link { margin-top: auto; padding-top: 8px; font-weight: 600; color: var(--accent); }
.service-card__link:hover { text-decoration: underline; text-underline-offset: 3px; }

/* ---------- Home: testimonials ---------- */

.quote { display: flex; flex-direction: column; justify-content: space-between; gap: 28px; }
.quote__text { font-size: 17px; line-height: 1.65; }
.quote__who { display: flex; align-items: center; gap: 14px; }
.quote__avatar {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--bg);
  border: 1px solid var(--border);
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
}
.quote__name { display: block; font-weight: 600; }
.quote__role { display: block; font-size: 14px; color: var(--text-muted); }

/* ---------- Home: about ---------- */

.about { display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(32px, 6vw, 80px); align-items: start; }
.about__points { display: flex; flex-direction: column; gap: 28px; }
.about__points .h3 { margin-bottom: 6px; }
.about__founders { padding: 0; overflow: hidden; }
.about__photo { width: 100%; object-fit: cover; }
.about__people { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 24px; }
.about__people li { display: flex; flex-direction: column; gap: 2px; }
.about__name { font-weight: 600; }
.about__link { font-size: 14px; color: var(--accent); margin-top: 4px; }

@media (max-width: 900px) {
  .about { grid-template-columns: 1fr; }
}
```

- [ ] **Step 10: Visual check in the browser**

Run: `npm run dev`. Open the printed URL and check `/` at 375px and 1440px (DevTools device toolbar). Expected: no horizontal scroll, all 7 sections readable, the nav goes solid on scroll, and Process/About in the nav scroll to their sections.

- [ ] **Step 11: Run all tests, commit**

Run: `npm test`
Expected: all pass.

```bash
git add -A
git commit -m "feat: rebuild Home as 7 conversion-focused sections"
```

---

### Task 7: Services page

**Files:**
- Rewrite: `src/pages/Services.jsx`
- Create: `src/test/services.test.jsx`
- Modify: `src/styles.css` (append)

**Interfaces:**
- Consumes: `Layout`, `SectionHeader`, `CalButton`, `FAQ`, `ProcessSteps`, `FinalCTA`, `Section`, `SERVICES`, `FAQ_ITEMS`, `Seo`.
- Produces: `/services` with anchors `#agents`, `#saas`, `#whatsapp`, `#web`.

- [ ] **Step 1: Write failing test** — `src/test/services.test.jsx`

```jsx
import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Services from "../pages/Services";

describe("Services page", () => {
  it("has one h1 and a block per service with its anchor", () => {
    const { container } = renderWithProviders(<Services />, { route: "/services" });
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    for (const id of ["agents", "saas", "whatsapp", "web"]) {
      const block = container.querySelector(`#${id}`);
      expect(block).not.toBeNull();
      expect(within(block).getByText("What you get")).toBeInTheDocument();
      expect(within(block).getByText("Example builds")).toBeInTheDocument();
    }
  });

  it("ends with process, FAQ and the booking section", () => {
    const { container } = renderWithProviders(<Services />, { route: "/services" });
    expect(container.querySelector("#process")).not.toBeNull();
    expect(container.querySelector("#faq details")).not.toBeNull();
    expect(container.querySelector("#book")).not.toBeNull();
  });

  it("has no pricing or old portfolio detail links", () => {
    const { container } = renderWithProviders(<Services />, { route: "/services" });
    expect(container.textContent).not.toMatch(/\$|₹/);
    expect(container.querySelector('a[href^="/portfolio"]')).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/test/services.test.jsx`
Expected: FAIL (old Services page markup).

- [ ] **Step 3: Rewrite `src/pages/Services.jsx`**

```jsx
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import Section from "../components/Section";
import SectionHeader from "../components/SectionHeader";
import CalButton from "../components/CalButton";
import FadeIn from "../components/FadeIn";
import FAQ from "../components/FAQ";
import ProcessSteps from "../components/ProcessSteps";
import FinalCTA from "../components/FinalCTA";
import { SERVICES } from "../data/services";
import { FAQ_ITEMS } from "../data/faq";

export default function Services() {
  return (
    <Layout>
      <Seo
        title="Services — AI systems, SaaS & apps"
        description="Agentic automation, AI SaaS and MVPs, WhatsApp automation with CRM, and websites and mobile apps — designed and built by Velyx Labs."
        path="/services"
      />
      <section className="page-hero">
        <div className="container">
          <SectionHeader
            as="h1"
            eyebrow="Services"
            title="What we build for founders"
            sub="Four services, one goal: systems and software that take work off your team and help you grow."
          />
          <CalButton>Book a free 30-min call</CalButton>
        </div>
      </section>

      {SERVICES.map((s, i) => (
        <section key={s.id} id={s.id} className={`section svc ${i % 2 === 0 ? "section--alt" : ""}`}>
          <div className="container svc__inner">
            <div className="svc__intro">
              <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="h2">{s.title}</h2>
              <p className="lead">{s.description}</p>
              <CalButton variant="secondary">Talk to us about this</CalButton>
            </div>
            <FadeIn className="svc__lists">
              <div>
                <h3 className="h3">What you get</h3>
                <ul className="checklist">
                  {s.deliverables.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="h3">Example builds</h3>
                <ul className="examples">
                  {s.examples.map(([title, tagline]) => (
                    <li key={title}>
                      <span className="examples__title">{title}</span>
                      <span className="muted">{tagline}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </section>
      ))}

      <ProcessSteps />
      <Section id="faq">
        <SectionHeader align="center" eyebrow="FAQ" title="Questions founders ask" />
        <FAQ items={FAQ_ITEMS} />
      </Section>
      <FinalCTA />
    </Layout>
  );
}
```

- [ ] **Step 4: Run test**

Run: `npx vitest run src/test/services.test.jsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Append styles to `src/styles.css`**

```css
/* ---------- Page hero (inner pages) ---------- */

.page-hero { padding-top: calc(var(--nav-h) + clamp(56px, 8vw, 104px)); padding-bottom: clamp(48px, 7vw, 88px); }
.page-hero .section-header { margin-bottom: 28px; }

/* ---------- Services page ---------- */

.svc__inner { display: grid; grid-template-columns: 1fr 1.2fr; gap: clamp(32px, 6vw, 80px); }
.svc__intro { display: flex; flex-direction: column; align-items: flex-start; gap: 18px; }
.svc__lists { display: grid; gap: 36px; }
.svc__lists .h3 { margin-bottom: 14px; }
.checklist { display: flex; flex-direction: column; gap: 10px; }
.checklist li { padding-left: 28px; position: relative; }
.checklist li::before { content: "✓"; position: absolute; left: 0; color: var(--accent); font-weight: 600; }
.examples { display: grid; gap: 12px; }
.examples li { display: flex; flex-direction: column; padding: 16px 18px; border: 1px solid var(--border); border-radius: 12px; }
.examples__title { font-weight: 600; }

@media (max-width: 900px) {
  .svc__inner { grid-template-columns: 1fr; }
}
```

- [ ] **Step 6: Run all tests, commit**

Run: `npm test`
Expected: all pass.

```bash
git add -A
git commit -m "feat: Services page merges portfolio offerings into four service blocks"
```

---

### Task 8: Contact page with real form delivery (Web3Forms)

The current form only calls `setSent(true)`, so every lead is lost. Web3Forms emails each submission to the address the access key is registered to (velyxlabs@gmail.com). The user creates a free key at web3forms.com and sets `VITE_WEB3FORMS_KEY` in Vercel (Production + Preview) and in a local `.env`. The key is meant to be public, so exposing it client-side is fine. Without a key, the form is replaced by the email link, so no lead is ever lost to a fake success.

**Files:**
- Rewrite: `src/pages/Contact.jsx`, `.env.example`
- Create: `src/test/contact.test.jsx`
- Modify: `src/styles.css` (append)

**Interfaces:**
- Consumes: `Layout`, `SectionHeader`, `CalEmbed`, `Seo`, `track`.
- Produces: `/contact`, which POSTs JSON to `https://api.web3forms.com/submit` with `access_key`, `subject`, `from_name`, `name`, `email`, `company`, `message`, `botcheck`. Status states: `idle | sending | sent | error`.

- [ ] **Step 1: Write failing tests** — `src/test/contact.test.jsx`

```jsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Contact from "../pages/Contact";

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
  fireEvent.change(screen.getByLabelText("What do you want to build?"), { target: { value: "A WhatsApp CRM" } });
  fireEvent.submit(screen.getByRole("form", { name: "Contact form" }));
}

describe("Contact page", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("shows the booking calendar", () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    renderWithProviders(<Contact />, { route: "/contact" });
    expect(screen.getByTestId("cal-embed")).toBeInTheDocument();
  });

  it("sends the message to Web3Forms and confirms on success", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.stubGlobal("fetch", fetchMock);
    renderWithProviders(<Contact />, { route: "/contact" });
    fillAndSubmit();
    expect(await screen.findByText(/Thanks — we got your message/)).toBeInTheDocument();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.web3forms.com/submit");
    expect(JSON.parse(init.body)).toMatchObject({ access_key: "test-key", name: "Ada", email: "ada@example.com", message: "A WhatsApp CRM" });
  });

  it("shows an error with an email fallback when sending fails", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    renderWithProviders(<Contact />, { route: "/contact" });
    fillAndSubmit();
    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't send/i);
    expect(screen.queryByText(/Thanks — we got your message/)).toBeNull();
  });

  it("treats a rejected submission (success: false) as an error", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: false, message: "bad key" }) }));
    renderWithProviders(<Contact />, { route: "/contact" });
    fillAndSubmit();
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("without an access key, shows email instead of a form that can't send", () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "");
    renderWithProviders(<Contact />, { route: "/contact" });
    expect(screen.queryByRole("form", { name: "Contact form" })).toBeNull();
    expect(screen.getAllByRole("link", { name: "velyxlabs@gmail.com" }).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/test/contact.test.jsx`
Expected: FAIL (old page has no labelled form or fetch).

- [ ] **Step 3: Rewrite `src/pages/Contact.jsx`**

```jsx
import { useState } from "react";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import CalEmbed from "../components/CalEmbed";
import { track } from "../lib/analytics";

const EMAIL = "velyxlabs@gmail.com";

function ContactForm({ formKey }) {
  const [status, setStatus] = useState("idle");

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
          subject: "New enquiry — velyxlabs.in",
          from_name: "Velyx Labs website",
          ...fields,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Send failed");
      form.reset();
      setStatus("sent");
      track("contact_submit", { location: "/contact" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card form-done" role="status">
        <h2 className="h3">Thanks — we got your message.</h2>
        <p className="muted">We reply within one working day. Want to talk sooner? Book a time on the calendar.</p>
      </div>
    );
  }

  return (
    <form className="card form" aria-label="Contact form" onSubmit={onSubmit}>
      <label className="field">
        <span>Name</span>
        <input name="name" type="text" autoComplete="name" required />
      </label>
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label className="field">
        <span>Company <span className="muted">(optional)</span></span>
        <input name="company" type="text" autoComplete="organization" />
      </label>
      <label className="field">
        <span>What do you want to build?</span>
        <textarea name="message" rows="5" required />
      </label>
      <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {status === "error" && (
        <p className="form-error" role="alert">
          Sorry, we couldn't send that. Please email us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      )}
      <button type="submit" className="btn btn--primary btn--block" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

export default function Contact() {
  const formKey = import.meta.env.VITE_WEB3FORMS_KEY;

  return (
    <Layout>
      <Seo
        title="Contact — book a free call"
        description="Book a free 30-minute call with Velyx Labs, or send us a message about what you want to build."
        path="/contact"
      />
      <section className="page-hero">
        <div className="container">
          <SectionHeader
            as="h1"
            eyebrow="Contact"
            title="Tell us what you want to build"
            sub="Book a free 30-minute call, or send a message and we'll get back to you."
          />
        </div>
      </section>
      <section className="section contact">
        <div className="container contact__grid">
          <div className="contact__form">
            {formKey ? (
              <ContactForm formKey={formKey} />
            ) : (
              <div className="card">
                <h2 className="h3">Email us</h2>
                <p className="muted">
                  Write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and we'll get back to you.
                </p>
              </div>
            )}
            <p className="contact__direct muted">
              Prefer email? <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              {" · "}
              <a href="https://www.linkedin.com/company/velyx-labs/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </p>
          </div>
          <CalEmbed />
        </div>
      </section>
    </Layout>
  );
}
```

Note: "We reply within one working day" is a commitment. Confirm it with the user in Task 11, or change it to "We'll get back to you soon."

- [ ] **Step 4: Update `.env.example`**

```bash
# Velyx Labs — Environment Variables
# Copy this file to .env and fill in your values.

# Contact form delivery (https://web3forms.com — free; key is public by design).
# Submissions are emailed to the address the key was created with.
# Without it, /contact shows the email address instead of the form.
VITE_WEB3FORMS_KEY=
```

- [ ] **Step 5: Run test**

Run: `npx vitest run src/test/contact.test.jsx`
Expected: PASS (5 tests).

- [ ] **Step 6: Append styles to `src/styles.css`**

```css
/* ---------- Contact ---------- */

.contact { padding-top: 0; }
.contact__grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 32px; align-items: start; }
.contact__direct { margin-top: 16px; font-size: 15px; }
.contact__direct a, .form-error a, .contact .card a { color: var(--text); text-decoration: underline; text-underline-offset: 3px; }
.form { display: flex; flex-direction: column; gap: 18px; }
.field { display: flex; flex-direction: column; gap: 8px; font-size: 15px; font-weight: 500; }
.field input, .field textarea {
  font: inherit;
  font-weight: 400;
  color: var(--text);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
}
.field input:focus, .field textarea:focus { outline: none; border-color: var(--accent); }
.field textarea { resize: vertical; }
.hp { position: absolute; left: -9999px; }
.form-error { color: oklch(0.75 0.15 30); font-size: 15px; }
.form-done { display: flex; flex-direction: column; gap: 10px; }
.btn:disabled { opacity: 0.6; cursor: progress; }

@media (max-width: 900px) {
  .contact__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 7: Run all tests, commit**

Run: `npm test`
Expected: all pass.

```bash
git add -A
git commit -m "fix: contact form now delivers leads via Web3Forms; clean Contact page"
```

---

### Task 9: `/start`, legal pages, 404, route tests

**Files:**
- Rewrite: `src/pages/Start.jsx`, `src/pages/LegalPage.jsx`
- Create: `src/pages/NotFound.jsx`, `src/test/routes.test.jsx`
- Modify: `src/AppRoutes.jsx` (add `*` route), `src/styles.css` (append)

**Interfaces:**
- Consumes: `Layout`, `Logo`, `Section`, `SectionHeader`, `CalButton`, `ClientStrip`, `ProcessSteps`, `FinalCTA`, `SERVICES`, `Seo`, `AppRoutes`.
- Produces: `NotFound` page; `LegalPage({ kicker, title, titleSerif, updated, intro, sections })` with the same props as before, so `Privacy.jsx` and `Terms.jsx` stay unchanged.

- [ ] **Step 1: Write failing tests** — `src/test/routes.test.jsx`

```jsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import AppRoutes from "../AppRoutes";

describe("routes", () => {
  it.each([
    ["/", /AI systems and software/],
    ["/services", /What we build for founders/],
    ["/contact", /Tell us what you want to build/],
    ["/privacy", /Privacy/],
    ["/terms", /Terms/],
    ["/start", /Put AI to work in your business/],
  ])("%s renders its h1", async (route, h1) => {
    renderWithProviders(<AppRoutes />, { route });
    expect(await screen.findByRole("heading", { level: 1, name: h1 })).toBeInTheDocument();
  });

  it("unknown URLs show a 404 with a way home and a booking CTA", async () => {
    renderWithProviders(<AppRoutes />, { route: "/does-not-exist" });
    expect(await screen.findByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/");
    expect(screen.getAllByRole("button", { name: "Book a free call" }).length).toBeGreaterThan(0);
  });

  it("/start has no navigation links that leak traffic", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/start" });
    await screen.findByRole("heading", { level: 1 });
    expect(container.querySelector('nav[aria-label="Main"]')).toBeNull();
    expect(container.querySelector('a[href="/services"]')).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/test/routes.test.jsx`
Expected: FAIL (404 route missing; old `/start` and legal markup).

- [ ] **Step 3: Create `src/pages/NotFound.jsx`**

```jsx
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import CalButton from "../components/CalButton";

export default function NotFound() {
  return (
    <Layout>
      <Seo title="Page not found" path="/404" noindex />
      <section className="page-hero not-found">
        <div className="container">
          <SectionHeader as="h1" eyebrow="404" title="Page not found" sub="The page you're looking for doesn't exist or has moved." />
          <div className="hero__actions">
            <Link to="/" className="btn btn--secondary">Back to home</Link>
            <CalButton />
          </div>
        </div>
      </section>
    </Layout>
  );
}
```

- [ ] **Step 4: Add the catch-all route in `src/AppRoutes.jsx`**

Add `const NotFound = lazy(() => import("./pages/NotFound"));` with the other lazy imports, and add this as the last `<Route>`:

```jsx
        <Route path="*" element={<NotFound />} />
```

- [ ] **Step 5: Rewrite `src/pages/LegalPage.jsx`**

```jsx
import Layout from "../components/Layout";

/* ------------------------------------------------------------------
   Shared layout for legal pages (Privacy, Terms).
   `sections`: [{ h, body: [string | {list:[...]}] }]
------------------------------------------------------------------ */
export default function LegalPage({ kicker, title, titleSerif, updated, intro, sections }) {
  return (
    <Layout>
      <section className="page-hero">
        <div className="container legal">
          <span className="eyebrow">{kicker}</span>
          <h1 className="h1 legal__title">{[title, titleSerif].filter(Boolean).join(" ")}</h1>
          <p className="lead">{intro}</p>
          <p className="legal__updated">Last updated · {updated}</p>
        </div>
      </section>
      <div className="container legal legal__body">
        {sections.map((s) => (
          <section key={s.h} className="legal__block">
            <h2 className="h3">{s.h}</h2>
            {s.body.map((b, j) =>
              typeof b === "string" ? (
                <p key={j}>{b}</p>
              ) : (
                <ul key={j} className="legal__list">
                  {b.list.map((li) => <li key={li}>{li}</li>)}
                </ul>
              )
            )}
          </section>
        ))}
      </div>
    </Layout>
  );
}
```

- [ ] **Step 6: Rewrite `src/pages/Start.jsx`** (ads landing — logo + CTA only, no exits)

```jsx
import Seo from "../components/Seo";
import Logo from "../components/Logo";
import Section from "../components/Section";
import SectionHeader from "../components/SectionHeader";
import CalButton from "../components/CalButton";
import ClientStrip from "../components/ClientStrip";
import ProcessSteps from "../components/ProcessSteps";
import FinalCTA from "../components/FinalCTA";
import { SERVICES } from "../data/services";

/* ------------------------------------------------------------------
   /start — dedicated ads landing page.
   Minimal header (no nav links = no exits), one message, one action.
   Every Cal.com click is tracked as book_call_click by the GA4 listener.
------------------------------------------------------------------ */
export default function Start() {
  return (
    <>
      <Seo
        title="Build your AI system — free strategy call"
        description="Velyx Labs designs and builds agentic automation, AI SaaS, WhatsApp CRM systems, and apps for founders. Book a free 30-minute strategy call."
        path="/start"
        noindex
      />
      <header className="nav nav--solid">
        <div className="nav__inner container">
          <span className="nav__brand"><Logo /></span>
          <CalButton size="sm" />
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <p className="eyebrow hero__eyebrow">Founder-led AI studio · Bangalore, India</p>
            <h1 className="h1 hero__title">Put AI to work in your business, properly.</h1>
            <p className="lead hero__sub">
              We design and build agentic automation, AI-native SaaS and WhatsApp systems that take the
              repetitive work off your team — so you scale in revenue, not headcount.
            </p>
            <div className="hero__actions">
              <CalButton>Book a free strategy call</CalButton>
            </div>
            <p className="hero__note">30 minutes · No obligation · Talk directly to the builders</p>
            <ClientStrip label="Products & teams we've built for" />
          </div>
        </section>

        <Section alt>
          <SectionHeader eyebrow="Services" title="What we build" />
          <div className="grid-2">
            {SERVICES.map((s) => (
              <article key={s.id} className="card service-card">
                <h3 className="h3">{s.title}</h3>
                <p className="muted">{s.summary}</p>
              </article>
            ))}
          </div>
        </Section>

        <ProcessSteps />
        <FinalCTA />
      </main>

      <footer className="container lp-foot">
        © {new Date().getFullYear()} Velyx Labs · Bangalore, India · <a href="mailto:velyxlabs@gmail.com">velyxlabs@gmail.com</a> · <a href="/privacy">Privacy</a>
      </footer>
    </>
  );
}
```

Note: the Privacy link uses a plain `<a>` (as before), so the "no exits" test only bans in-app nav links like `/services`.

- [ ] **Step 7: Run tests**

Run: `npx vitest run src/test/routes.test.jsx`
Expected: PASS (8 tests).

- [ ] **Step 8: Append styles to `src/styles.css`**

```css
/* ---------- Legal ---------- */

.legal { max-width: calc(70ch + 2 * var(--gutter)); }
.legal__title { margin-block: 14px 20px; }
.legal__updated { margin-top: 16px; font-size: 14px; color: var(--text-muted); }
.legal__body { padding-bottom: var(--section-y); }
.legal__block { padding-block: 28px; border-top: 1px solid var(--border); }
.legal__block .h3 { margin-bottom: 12px; }
.legal__block p + p, .legal__block p + ul, .legal__block ul + p { margin-top: 12px; }
.legal__block p, .legal__list { color: var(--text-muted); }
.legal__list { list-style: disc; padding-left: 22px; display: flex; flex-direction: column; gap: 6px; }

/* ---------- 404 + landing footer ---------- */

.not-found { min-height: 70vh; }
.lp-foot { padding-block: 32px; font-size: 14px; color: var(--text-muted); text-align: center; }
.lp-foot a { text-decoration: underline; text-underline-offset: 3px; }
```

- [ ] **Step 9: Run all tests + build, commit**

Run: `npm test && npm run build`
Expected: all pass.

```bash
git add -A
git commit -m "feat: clean /start landing, legal pages and 404"
```

---

### Task 10: Delete dead code and dependencies

**Files:**
- Delete: `src/components/{CineNav,CineFooter,CustomCursor,ProgressUpdater,NavIndex,Reveal,CaseViz,caseVizMap,offeringViz,offeringVizMap,IndustryIcon,BrandMark}.*`, `src/sections/{Hero,ShipScroll,Sections,ExtraSections,Founders}.jsx`, `src/data/offerings.js`, `public/uploads/portfolio-*.png`
- Modify: `package.json` (remove `three`, `marked`, `framer-motion`), `README.md`

- [ ] **Step 1: Confirm nothing live imports the old files**

Run: `grep -rnE "CineNav|CineFooter|CustomCursor|ProgressUpdater|NavIndex|Reveal|CaseViz|caseVizMap|offeringViz|IndustryIcon|BrandMark|sections/(Hero|ShipScroll|Sections|ExtraSections|Founders)|data/offerings|framer-motion|from \"three\"|from 'three'|marked" src scripts --include=*.js --include=*.jsx --include=*.mjs | grep -v "^src/components/\(CineNav\|CineFooter\|CustomCursor\|ProgressUpdater\|NavIndex\|Reveal\|CaseViz\|caseVizMap\|offeringViz\|offeringVizMap\|IndustryIcon\|BrandMark\)\|^src/sections/\(Hero\|ShipScroll\|Sections\|ExtraSections\|Founders\)\.jsx"`
Expected: no output. If something prints, that file still depends on old code. Fix it before deleting.

- [ ] **Step 2: Delete**

```bash
git rm src/components/CineNav.jsx src/components/CineFooter.jsx src/components/CustomCursor.jsx \
  src/components/ProgressUpdater.jsx src/components/NavIndex.jsx src/components/Reveal.jsx \
  src/components/CaseViz.jsx src/components/caseVizMap.js src/components/offeringViz.jsx \
  src/components/offeringVizMap.js src/components/IndustryIcon.jsx src/components/BrandMark.jsx \
  src/sections/Hero.jsx src/sections/ShipScroll.jsx src/sections/Sections.jsx \
  src/sections/ExtraSections.jsx src/sections/Founders.jsx src/data/offerings.js \
  public/uploads/portfolio-*.png
npm uninstall three marked framer-motion
```

- [ ] **Step 3: Content guard — no forbidden content anywhere in source**

Run: `grep -rniE "northwind|sable health|halcyon|seats remain|agents deployed|ambient|three\.js|Instrument Serif|Geist|Playfair" src index.html`
Expected: no output.

Run: `grep -rnE "\\\$[0-9]|₹" src`
Expected: no output (no pricing).

- [ ] **Step 4: Update `README.md`** — replace everything from the `> Agentic systems…` tagline down to (not including) `## License` with:

```markdown
> Agentic systems & AI-native SaaS for ambitious founders.

A clean, fast, conversion-focused agency site. One goal: book a free 30-minute call (Cal.com).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + Vite 8 |
| **Routing** | React Router v7 |
| **Styling** | Plain CSS with design tokens (`src/styles.css`) |
| **Font** | Inter |
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
├── pages/          # Home, Services, Contact, Start (ads), Privacy, Terms, NotFound
├── data/           # Services, FAQ, clients, process, testimonials
├── lib/            # Cal constants, analytics, useInView
└── styles.css      # Design system
scripts/            # routes.mjs (single route list), sitemap, prerender, indexnow
```

Removed pages (`/portfolio`, `/case-studies`, `/blog`, `/testimonials`) 301-redirect via `vercel.json`.
```

- [ ] **Step 5: Lint, test, build**

Run: `npm run lint && npm test && npm run build`
Expected: lint reports 0 errors (old files with errors are gone). All tests pass. Build passes, and the main JS chunk is far smaller than before (note the `dist/assets/*.js` sizes in the build output for the Task 11 report).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: delete cinematic components, Three.js, Framer Motion, marked; update README"
```

---

### Task 11: Final verification + content review

**Files:** none (fix-ups only if checks fail)

- [ ] **Step 1: Full check**

Run: `npm run lint && npm test && npm run build`
Expected: 0 lint errors; all tests pass; `sitemap.xml written — 5 URLs`; `prerender-meta: wrote 5 route HTML files`.

- [ ] **Step 2: Preview + manual route check**

Run: `npm run preview`, then open each route at 375px and 1440px widths: `/`, `/services`, `/services#whatsapp`, `/contact`, `/start`, `/privacy`, `/terms`, `/nope`.
Expected on every page: no horizontal scroll; nav links work, and `/#process` and `/#about` scroll correctly from `/services`; every "Book a free call" button opens the Cal.com popup; the inline calendar loads at the bottom.

- [ ] **Step 3: Contact form live check**

With a real `VITE_WEB3FORMS_KEY` in `.env`, rebuild and preview. Submit the form once.
Expected: the success message shows and an email arrives at velyxlabs@gmail.com.

- [ ] **Step 4: Reduced motion**

In Chrome DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce", reload `/`.
Expected: all content is visible immediately, with no fade.

- [ ] **Step 5: Lighthouse (mobile)** on `/` and `/services` in the preview build.
Expected: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95. If Performance is under 90, check the largest-contentful-paint element and the logo/founder image sizes first.

- [ ] **Step 6: Redirects** — after deploying a Vercel preview (`vercel` CLI, or push the branch if Git integration is on), run:

```bash
for p in /portfolio /portfolio/wa-health /case-studies /case-studies/x /blog /blog/agentic-systems-replace-sdr-team /testimonials; do
  curl -s -o /dev/null -w "$p → %{http_code} %{redirect_url}\n" "https://<preview-url>$p"
done
```

Expected: each line shows `308` (Vercel's permanent redirect) to `/services` or `/`.

- [ ] **Step 7: Copy review with the user** — share the copy that the plan drafted and the user hasn't seen:
  - Hero headline and sub (`src/sections/home/Hero.jsx`)
  - Services summaries, descriptions and deliverables (`src/data/services.js`)
  - FAQ answers (`src/data/faq.js`)
  - "Why Velyx" points (`src/sections/home/About.jsx`)
  - Contact success text "We reply within one working day" (`src/pages/Contact.jsx`)

Apply their edits, re-run `npm test`, and commit.

- [ ] **Step 7b: GA4** — in GA4 DebugView (or Realtime), click a CTA and confirm `book_call_click` arrives. Complete a test booking (then cancel it) and confirm `call_booked` arrives. If `call_booked` doesn't fire, check the event name in the Cal embed docs (`bookingSuccessful` vs `bookingSuccessfulV2`) and update `App.jsx`.

- [ ] **Step 8: Finish the branch** — use superpowers:finishing-a-development-branch.
