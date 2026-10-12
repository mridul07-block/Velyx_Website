import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { renderWithProviders } from "./renderWithProviders";
import VelyxMark from "../components/VelyxMark";
import PillNav from "../components/PillNav";

/* The official V (2026-10-12) is an inline SVG so it stays sharp and takes
   its colour from CSS. */
describe("new Velyx V logo", () => {
  it("is an inline single-path SVG that inherits its colour", () => {
    const { container } = render(<VelyxMark />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("fill", "currentColor");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg.querySelectorAll("path").length).toBe(1);
  });

  it("is the navbar mark", () => {
    const nav = renderWithProviders(<PillNav />).container;
    expect(nav.querySelector(".pnav__logo svg")).toBeTruthy();
  });

  it("no source file references the old logo assets", () => {
    for (const f of ["src/components/PillNav.jsx", "src/sections/home/Hero.jsx", "src/components/Logo.jsx", "src/components/illustrations/AgentsArt.jsx", "index.html", "src/components/seoConfig.js"]) {
      expect(readFileSync(f, "utf8")).not.toMatch(/velyx-mark-(hero|nav)\.webp|removebg|LOGO_ICON|ChatGPT_Image/);
    }
  });
});
