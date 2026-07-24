/* ------------------------------------------------------------------
   PRERENDER META — writes a static HTML file per route with the
   correct <title>, description, canonical and Open Graph baked in.

   The body still hydrates the SPA normally; this only gives non-JS
   crawlers (social, AI engines) the right per-route <head>. Runs as a
   postbuild step over dist/index.html. Zero change to the app.
------------------------------------------------------------------ */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { OFFERINGS } from "../src/data/offerings.js";
import { CASE_STUDIES } from "../src/data/caseStudies.js";

const BASE = "https://www.velyxlabs.in";
const SITE = "Velyx Labs";
const OG_IMAGE = "https://res.cloudinary.com/dmhabztbf/image/upload/v1779688104/ChatGPT_Image_May_25__2026__11_15_18_AM-removebg-preview_hy48ex.png";
const DEFAULT_TITLE = "Velyx Labs — Agentic systems & AI-native SaaS for founders";
const DEFAULT_DESC = "We partner with founders to build agentic systems, AI-native SaaS, and bespoke automation that compound — so your company scales in revenue, not headcount.";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fullTitle = (t) => (t ? `${t} · ${SITE}` : DEFAULT_TITLE);
const canon = (p) => `${BASE}${p === "/" ? "" : p}`;

const routes = [
  { path: "/", title: null, desc: DEFAULT_DESC },
  { path: "/services", title: "Services — agentic systems, SaaS & app development", desc: "Our AI practices: agentic systems, AI-native SaaS MVPs, website and mobile app development, internal copilots, and custom automation for founders." },
  { path: "/portfolio", title: "Portfolio — AI products & systems we’ve shipped", desc: "Live web apps, SaaS products, and agentic systems Velyx Labs has designed and shipped for founders and businesses." },
  { path: "/case-studies", title: "Case studies — how we help industries leverage AI", desc: "How Velyx Labs helps real estate, healthcare, coaching, legal, hospitality and B2B SaaS teams use AI to scale in revenue, not headcount." },
  { path: "/testimonials", title: "Testimonials — founders on working with Velyx Labs", desc: "What the founders and teams we’ve worked with say about building with Velyx Labs." },
  { path: "/contact", title: "Contact — book a strategy call", desc: "Book a 30-minute strategy call with Velyx Labs. We take on a handful of founders each quarter." },
  { path: "/privacy", title: "Privacy Policy", desc: "How Velyx Labs collects, uses, and protects the information you share through this website." },
  { path: "/terms", title: "Terms of Service", desc: "The terms that govern your use of the Velyx Labs website." },
  ...OFFERINGS.map((o) => ({ path: `/portfolio/${o.slug}`, title: o.title.replace(/\.$/, ""), desc: o.desc })),
  ...CASE_STUDIES.map((c) => ({ path: `/case-studies/${c.slug}`, title: `${c.name} — case study`, desc: c.summary })),
];

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

let n = 0;
for (const route of routes) {
  const html = render(route);
  const outDir = route.path === "/" ? "dist" : join("dist", route.path);
  mkdirSync(outDir, { recursive: true });
  const outFile = route.path === "/" ? "dist/index.html" : join(outDir, "index.html");
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
  n++;
}
console.log(`prerender-meta: wrote ${n} route HTML files (+ og:image ${OG_IMAGE ? "set" : "missing"})`);
