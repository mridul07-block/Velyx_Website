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
    expect(rule(".tcard2__quote")).toMatch(/16px/); // testimonial cards, site body size
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
  const token = (name) => (css.match(new RegExp(`${name}:\\s*(#[0-9a-f]{6})`, "i")) || [])[1];
  const color = (sel) => {
    const v = (rule(sel).match(/(?:^|[;\s])color:\s*(#[0-9a-f]{6}|var\(--[a-z-]+\))/i) || [])[1];
    return v?.startsWith("var(") ? token(v.slice(4, -1)) : v;
  };

  it("keeps large grey headline text at 3:1 or better on the page grey", () => {
    for (const sel of [".mwork__row--next .mwork__name", ".tsec__muted"]) expect(ratio(color(sel), "#efefef")).toBeGreaterThanOrEqual(3);
  });

  it("keeps small text on the dark plan card at 4.5:1 or better", () => {
    expect(ratio(color(".plan--dark .plan__includes"), token("--panel"))).toBeGreaterThanOrEqual(4.5);
  });

  it("never fades the footer actions in (they must always be readable)", () => {
    expect(rule(".closing__actions")).not.toMatch(/opacity:\s*0[;\s]/);
  });
});

describe("/start ads landing has no audit row", () => {
  it("resets the nav height so its hero doesn't gain the audit row's space", () => {
    expect(rule(".lp")).toMatch(/--nav-h:\s*88px/);
  });
});

describe("pricing reveal", () => {
  it("never fades text out (it un-blurs and settles instead), so contrast holds mid-reveal", () => {
    expect(rule(".rv-armed .rv")).not.toMatch(/opacity/);
  });
});

describe("one theme across sections (hero + services palette and type)", () => {
  const off = ["#161616", "#171717", "#1f1f1f", "#1b1b1b", "#1c1c1c", "#262626", "#a3a3a3", "#a8a8a8", "#525252", "#404040", "#737373", "#8a8a8a"];
  const block = (start, end) => css.slice(css.indexOf(start), css.indexOf(end));

  it("uses Geist only (no monospace face)", () => {
    expect(html).not.toMatch(/Geist\+Mono/);
    expect(css).not.toMatch(/Geist Mono/);
  });

  it("the new sections use only the site's colour tokens, not one-off greys", () => {
    for (const [a, b] of [
      ["/* ---------- Selected work + More work", "/* Covers (case study"],
      ["/* ---------- Process (Altair)", "/* ---------- Team"],
      ["/* ---------- Testimonials (Bricx)", "/* ---------- Tools"],
      ["/* ---------- Pricing (925 Studios)", "/* Reveal:"],
    ]) {
      const part = block(a, b);
      for (const c of off) expect(part, `${a} uses ${c}`).not.toContain(c);
    }
  });

  it("section titles share the services heading size", () => {
    for (const sel of [".process__title", ".tsec__title", ".pricing__title", ".selwork__title"]) expect(rule(sel)).toMatch(/font-size:\s*min\(36px/);
  });
});

describe("Altair layout for Selected work and Process", () => {
  it("left-aligns the process heading and runs the case cards full width like the panels", () => {
    expect(rule(".process__title")).not.toMatch(/text-align:\s*center/);
    expect(rule(".selwork__list")).toMatch(/margin-inline:\s*0/);
  });
});
