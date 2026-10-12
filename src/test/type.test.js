import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

/* Type and dimensions measured from kargul.studio (1280px and 390px). */
const css = readFileSync("src/styles.css", "utf8");
const html = readFileSync("index.html", "utf8");
const rule = (sel) => (css.match(new RegExp(`(?:^|\\n)${sel.replace(/[.()]/g, "\\$&")}\\s*\\{([^}]*)\\}`)) || [])[1] || "";

describe("Kargul type scale", () => {
  it("loads Geist's real bold instead of a faux bold", () => {
    expect(html).toMatch(/family=Geist:wght@400;500;600;700/);
    expect(html).not.toMatch(/family=Geist:wght@400;500;600&/);
  });

  it("matches Kargul's sizes and weights", () => {
    expect(rule(".btn")).toMatch(/font-weight:\s*700/);
    expect(rule(".h3")).toMatch(/letter-spacing:\s*-0\.01em/);
    expect(rule(".section-header__sub")).toMatch(/font-size:\s*14px/);
    expect(rule(".tcard2__quote")).toMatch(/17px/); // Bricx testimonial cards
    expect(rule(".team__name")).toMatch(/font-size:\s*18px/);
    expect(rule(".svc-card__copy")).toMatch(/font-weight:\s*500/);
  });

  it("uses Kargul's full-width panels with a 36px radius", () => {
    expect(css).toMatch(/--radius-panel:\s*36px/);
    expect(rule(".panel")).toMatch(/margin-inline:\s*0/);
  });
});

describe("contrast on the new sections (WCAG AA)", () => {
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const lum = (h) => { const [r, g, b] = hex(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const color = (sel) => (rule(sel).match(/color:\s*(#[0-9a-f]{6})/i) || [])[1];

  it("keeps large grey headline text at 3:1 or better on the page grey", () => {
    for (const sel of [".mwork__row--next .mwork__name", ".tsec__muted"]) expect(ratio(color(sel), "#efefef")).toBeGreaterThanOrEqual(3);
  });

  it("keeps small text on the dark plan card at 4.5:1 or better", () => {
    expect(ratio(color(".plan--dark .plan__includes"), "#171717")).toBeGreaterThanOrEqual(4.5);
  });

  it("never fades the footer actions in (they must always be readable)", () => {
    expect(rule(".closing__actions")).not.toMatch(/opacity:\s*0[;\s]/);
  });
});
