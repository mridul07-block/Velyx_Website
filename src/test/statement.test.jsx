import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { renderWithProviders } from "./renderWithProviders";
import Statement from "../sections/home/Statement";
import { STATEMENT } from "../data/statement";
import { countValue } from "../lib/reveal";
import { PROOFS } from "../data/proofs";

describe("count-up", () => {
  it("counts only the leading number of a stat and keeps its suffix", () => {
    expect(countValue("30+", 0)).toBe("0+");
    expect(countValue("30+", 1)).toBe("30+");
    expect(countValue("100%", 0.5)).toMatch(/^\d+%$/);
    expect(countValue("30 min", 0)).toBe("0 min");
    expect(countValue("Custom", 0.3)).toBe("Custom");
  });
});

describe("Statement", () => {
  it("is set in three lines, the first in ink and the rest muted, like the two-tone headings", () => {
    renderWithProviders(<Statement />);
    const lines = document.querySelectorAll(".statement__line");
    expect(lines).toHaveLength(3);
    expect(lines[0]).toHaveClass("tone-ink");
    expect(lines[1]).toHaveClass("tone-soft");
    expect(lines[2]).toHaveClass("tone-soft");
  });

  it("reads as one sentence to assistive tech and is visible without motion", () => {
    renderWithProviders(<Statement />);
    const p = document.querySelector(".statement__text");
    expect(p.querySelector(".sr-only").textContent).toBe(STATEMENT.join(" "));
    for (const l of p.querySelectorAll(".statement__line")) expect(l).toHaveAttribute("aria-hidden", "true");
  });

  it("is lighter than a section title", () => {
    const css = readFileSync("src/styles.css", "utf8");
    const rule = (css.match(/\.statement__text\s*\{([^}]*)\}/) || [])[1];
    expect(rule).toMatch(/font-weight:\s*500/);
  });
});

describe("proof line", () => {
  it("uses the same client figure as the numbers", () => {
    expect(PROOFS).toContain("Trusted by 30+ founders and teams");
  });
});
