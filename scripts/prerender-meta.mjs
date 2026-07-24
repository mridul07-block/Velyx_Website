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
import { readdirSync } from "node:fs";

function frontmatter(raw) {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  const data = {};
  if (m) for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > -1) data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return data;
}
const blogPosts = readdirSync("src/content/blog")
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const fm = frontmatter(readFileSync(`src/content/blog/${f}`, "utf8"));
    return { path: `/blog/${f.replace(/\.md$/, "")}`, title: fm.title, desc: fm.description };
  });

const BASE = "https://www.velyxlabs.in";
const SITE = "Velyx Labs";
const OG_IMAGE = "https://res.cloudinary.com/dmhabztbf/image/upload/w_1200,h_630,c_pad,b_rgb:0d0b07/v1784914089/ChatGPT_Image_May_24_2026_12_33_18_AM_s7msqc.png";
const DEFAULT_TITLE = "Velyx Labs — Agentic systems & AI-native SaaS for founders";
const DEFAULT_DESC = "We partner with founders to build agentic systems, AI-native SaaS, and bespoke automation that compound — so your company scales in revenue, not headcount.";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fullTitle = (t) => (t ? `${t} · ${SITE}` : DEFAULT_TITLE);
const canon = (p) => `${BASE}${p === "/" ? "" : p}`;

const routes = [
  { path: "/", title: null, desc: DEFAULT_DESC },
  { path: "/services", title: "Services — AI systems, SaaS & apps", desc: "Our AI practices: agentic systems, AI-native SaaS MVPs, website and mobile app development, internal copilots, and custom automation for founders." },
  { path: "/portfolio", title: "Portfolio — AI products we've shipped", desc: "Live web apps, SaaS products, and agentic systems Velyx Labs has designed and shipped for founders and businesses." },
  { path: "/case-studies", title: "Case studies — AI systems by industry", desc: "How Velyx Labs helps real estate, healthcare, coaching, legal, hospitality and B2B SaaS teams use AI to scale in revenue, not headcount." },
  { path: "/blog", title: "Blog — notes on agentic systems & AI leverage", desc: "Field notes from Velyx Labs on building agentic systems, AI-native SaaS, and automation that gives founders compounding leverage." },
  { path: "/testimonials", title: "Testimonials — founders in their own words", desc: "What the founders and teams we've worked with say about building with Velyx Labs." },
  { path: "/contact", title: "Contact — book a strategy call", desc: "Book a 30-minute strategy call with Velyx Labs. We take on a handful of founders each quarter." },
  { path: "/privacy", title: "Privacy Policy", desc: "How Velyx Labs collects, uses, and protects the information you share through this website." },
  { path: "/terms", title: "Terms of Service", desc: "The terms that govern your use of the Velyx Labs website." },
  ...OFFERINGS.map((o) => ({ path: `/portfolio/${o.slug}`, title: o.title.replace(/\.$/, ""), desc: o.desc })),
  ...CASE_STUDIES.map((c) => ({ path: `/case-studies/${c.slug}`, title: `${c.name} — case study`, desc: c.summary })),
  ...blogPosts,
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
