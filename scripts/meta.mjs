/* Per-route <head> rewriting for prerender-meta.mjs (kept separate so it's testable). */
import { BASE, DEFAULT_TITLE } from "./routes.mjs";

const SITE = "Velyx Labs";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fullTitle = (t) => (t ? `${t} · ${SITE}` : DEFAULT_TITLE);
const canon = (p) => `${BASE}${p === "/" ? "" : p}`;

export function renderMeta(template, route) {
  const t = esc(fullTitle(route.title));
  const d = esc(route.desc);
  const url = canon(route.path);
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description"\s+content=")[\s\S]*?("\s*\/>)/, `$1${d}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title"\s+content=")[\s\S]*?("\s*\/>)/, `$1${t}$2`)
    .replace(/(<meta property="og:description"\s+content=")[\s\S]*?("\s*\/>)/, `$1${d}$2`)
    .replace(/(<meta property="og:url"\s+content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title"\s+content=")[\s\S]*?("\s*\/>)/, `$1${t}$2`)
    .replace(/(<meta name="twitter:description"\s+content=")[\s\S]*?("\s*\/>)/, `$1${d}$2`);
}
