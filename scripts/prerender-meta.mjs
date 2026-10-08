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
