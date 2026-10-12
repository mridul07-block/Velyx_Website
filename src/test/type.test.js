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
    expect(rule(".tcard__quote")).toMatch(/24px/);
    expect(rule(".team__name")).toMatch(/font-size:\s*18px/);
    expect(rule(".svc-card__copy")).toMatch(/font-weight:\s*500/);
  });

  it("uses Kargul's full-width panels with a 36px radius", () => {
    expect(css).toMatch(/--radius-panel:\s*36px/);
    expect(rule(".panel")).toMatch(/margin-inline:\s*0/);
  });
});
