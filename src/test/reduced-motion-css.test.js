import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

/* jsdom can't evaluate media queries, so pin the CSS contract directly:
   under reduced motion, marquees must become a static wrapped row with the
   duplicate copy hidden, so every item stays visible. */
const css = readFileSync("src/styles.css", "utf8");
const reduced = css.slice(css.indexOf("/* ---------- Reduced motion (keep last) ---------- */"));

describe("reduced-motion CSS", () => {
  it("turns marquees into a static, wrapped, fully visible row", () => {
    expect(reduced).toMatch(/\.marquee\s*\{[^}]*mask-image:\s*none/);
    expect(reduced).toMatch(/\.marquee__track\s*\{[^}]*width:\s*auto/);
    expect(reduced).toMatch(/\.marquee__group\s*\{[^}]*flex-wrap:\s*wrap/);
    expect(reduced).toMatch(/\.marquee__dup\s*\{[^}]*display:\s*none/);
  });
});
