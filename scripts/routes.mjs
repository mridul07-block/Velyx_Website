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
  { path: "/pricing", title: "Pricing", desc: "Start with a $1500 trial week, then a product sprint or a monthly partnership with the Velyx Labs founders.", priority: 0.9, changefreq: "monthly" },
  { path: "/intro-call", title: "Book an intro call", desc: "Book a free 30-minute intro call with the Velyx Labs founders — or ask for a free product audit.", priority: 0.9, changefreq: "yearly" },
  { path: "/privacy", title: "Privacy Policy", desc: "How Velyx Labs collects, uses, and protects the information you share through this website.", priority: 0.3, changefreq: "yearly" },
  { path: "/terms", title: "Terms of Service", desc: "The terms that govern your use of the Velyx Labs website and the services offered through it.", priority: 0.3, changefreq: "yearly" },
];
