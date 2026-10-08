/* ------------------------------------------------------------------
   PRERENDER META — writes a static HTML file per route with the
   correct <title>, description, canonical and Open Graph baked in.
   The body still hydrates the SPA normally. Runs as postbuild.
------------------------------------------------------------------ */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { ROUTES } from "./routes.mjs";
import { renderMeta } from "./meta.mjs";

const template = readFileSync("dist/index.html", "utf8");

for (const route of ROUTES) {
  const outDir = route.path === "/" ? "dist" : join("dist", route.path);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), renderMeta(template, route));
}
console.log(`prerender-meta: wrote ${ROUTES.length} route HTML files`);
