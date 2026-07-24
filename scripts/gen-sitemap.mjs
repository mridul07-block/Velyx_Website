/* Generates public/sitemap.xml from static routes + data-driven slugs. */
import { writeFileSync } from "node:fs";
import { OFFERINGS } from "../src/data/offerings.js";
import { CASE_STUDIES } from "../src/data/caseStudies.js";
import { readdirSync } from "node:fs";

const blogSlugs = readdirSync("src/content/blog").filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));

const BASE = "https://www.velyxlabs.in";
const today = new Date().toISOString().slice(0, 10);

const routes = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/services", priority: 0.9, changefreq: "monthly" },
  { path: "/portfolio", priority: 0.9, changefreq: "weekly" },
  { path: "/case-studies", priority: 0.9, changefreq: "monthly" },
  { path: "/blog", priority: 0.8, changefreq: "weekly" },
  { path: "/testimonials", priority: 0.7, changefreq: "monthly" },
  { path: "/contact", priority: 0.8, changefreq: "yearly" },
  { path: "/privacy", priority: 0.3, changefreq: "yearly" },
  { path: "/terms", priority: 0.3, changefreq: "yearly" },
  ...OFFERINGS.map((o) => ({ path: `/portfolio/${o.slug}`, priority: 0.8, changefreq: "monthly" })),
  ...blogSlugs.map((slug) => ({ path: `/blog/${slug}`, priority: 0.7, changefreq: "monthly" })),
  ...CASE_STUDIES.map((c) => ({ path: `/case-studies/${c.slug}`, priority: 0.7, changefreq: "monthly" })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${BASE}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap.xml written — ${routes.length} URLs`);
