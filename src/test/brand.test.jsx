import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { renderWithProviders } from "./renderWithProviders";
import Hero from "../sections/home/Hero";
import PillNav from "../components/PillNav";

/* The official V mark sits big and quiet behind the hero status pill
   (Kargul-style) and dark on the white navbar chip. */
const css = readFileSync("src/styles.css", "utf8");
const rule = (sel) => (css.match(new RegExp(`${sel.replace(/[.]/g, "\\.")}\\s*\\{([^}]*)\\}`)) || [])[1] || "";

describe("Velyx brand mark", () => {
  it("puts a large, clearly visible Velyx mark behind the status pill", () => {
    const { container } = renderWithProviders(<Hero />);
    const mark = container.querySelector("svg.hero__mark");
    expect(mark.nextElementSibling).toHaveClass("status");
    expect(rule(".hero__mark")).not.toMatch(/opacity|filter/);
    expect(rule(".hero__mark")).toMatch(/margin-bottom:\s*-/);
    expect(rule(".hero .status")).toMatch(/z-index/);
  });

  it("shows the navbar mark in ink on the white chip", () => {
    const { container } = renderWithProviders(<PillNav />);
    expect(container.querySelector(".pnav__logo svg")).toBeTruthy();
    expect(rule(".pnav__logo svg")).toMatch(/color:\s*var\(--ink\)/);
    expect(css).not.toMatch(/\.pnav__inner \.pnav__logo\s*\{[^}]*brand-ground/);
    expect(rule(".logo__icon")).not.toMatch(/filter/);
  });
});
