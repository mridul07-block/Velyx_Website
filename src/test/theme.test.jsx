import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { renderWithProviders } from "./renderWithProviders";
import Layout from "../components/Layout";
import BoxGrid from "../components/BoxGrid";
import { CELL, GLOWS } from "../lib/boxGrid";

/* The Velyx light theme: warm off-white page, the logo's near-black ink,
   the brand orange, and the X banner's boxed tile background. */
const css = readFileSync("src/styles.css", "utf8");
const token = (name) => (css.match(new RegExp(`${name}:\\s*(#[0-9a-f]+)`, "i")) || [])[1];

describe("Velyx banner theme", () => {
  it("is a light theme with the brand orange", () => {
    expect(token("--page")).toBe("#f5f0e8");
    expect(token("--ink")).toBe("#1a160f");
    expect(token("--accent")).toBe("#e8a453");
    expect(token("--panel")).toBe("#14110a");
    expect(readFileSync("index.html", "utf8")).toMatch(/name="theme-color" content="#f5f0e8"/);
  });

  it("puts the boxed background behind every page", () => {
    const { container } = renderWithProviders(<Layout><p>page</p></Layout>);
    const grid = container.querySelector(".boxgrid");
    expect(grid).toHaveAttribute("aria-hidden", "true");
    expect(grid.compareDocumentPosition(container.querySelector("main")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("lights a scattering of tiles, each sitting exactly on a grid cell", () => {
    const { container } = renderWithProviders(<BoxGrid />);
    const tiles = container.querySelectorAll(".boxgrid__glow");
    expect(tiles.length).toBe(GLOWS.length);
    expect(tiles.length).toBeGreaterThanOrEqual(24);
    for (const t of tiles) {
      expect(parseFloat(t.style.left) % CELL).toBe(0);
      expect(parseFloat(t.style.top) % CELL).toBe(0);
    }
    // Some tiles sit in the first columns so phones see them too.
    expect(GLOWS.filter((g) => g.col < 8).length).toBeGreaterThanOrEqual(5);
  });
});
