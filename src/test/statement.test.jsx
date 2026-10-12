import { describe, it, expect } from "vitest";

import { renderWithProviders } from "./renderWithProviders";
import Statement from "../sections/home/Statement";
import { wordOpacity, progress, countValue } from "../lib/reveal";

describe("scroll reveal maths", () => {
  it("reveals words in reading order as progress grows", () => {
    expect(wordOpacity(0, 10, 0)).toBeCloseTo(0.18);
    expect(wordOpacity(4, 10, 0.5)).toBe(1);
    expect(wordOpacity(9, 10, 0.5)).toBeCloseTo(0.18);
    expect(wordOpacity(9, 10, 1)).toBe(1);
  });

  it("maps the paragraph's position to 0..1 progress", () => {
    expect(progress({ top: 2000, height: 100 }, 800)).toBe(0);
    expect(progress({ top: -5000, height: 100 }, 800)).toBe(1);
    const mid = progress({ top: 400, height: 200 }, 800);
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(1);
  });

  it("counts only the leading number of a stat and keeps its suffix", () => {
    expect(countValue("11+", 0)).toBe("0+");
    expect(countValue("11+", 1)).toBe("11+");
    expect(countValue("100%", 0.5)).toMatch(/^\d+%$/);
    expect(countValue("30 min", 0)).toBe("0 min");
    expect(countValue("Custom", 0.3)).toBe("Custom");
  });
});

describe("Statement", () => {
  it("reads as one accessible paragraph (no aria-label on a <p>) and is fully visible without motion", () => {
    renderWithProviders(<Statement />);
    const p = document.querySelector(".statement__text");
    expect(p).not.toHaveAttribute("aria-label");
    expect(p.querySelector(".sr-only").textContent).toMatch(/founder-led team/);
    expect(p.querySelectorAll(".statement__w").length).toBeGreaterThan(10);
    for (const w of p.querySelectorAll(".statement__w")) expect(w.style.opacity).toBe("");
  });
});
