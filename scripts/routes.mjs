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
