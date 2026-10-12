import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { renderWithProviders } from "./renderWithProviders";
import Hero from "../sections/home/Hero";
import PillNav from "../components/PillNav";

/* The Velyx mark is cream + orange, drawn for a dark ground. It must keep
   its original colours (never flattened to black) and sit on the brand
   dark tile wherever it appears on the light page. */
const css = readFileSync("src/styles.css", "utf8");
const rule = (sel) => (css.match(new RegExp(`${sel.replace(/[.]/g, "\\.")}\\s*\\{([^}]*)\\}`)) || [])[1] || "";

describe("Velyx brand mark", () => {
  it("puts a large, clearly visible Velyx mark behind the status pill, like Kargul's", () => {
    const { container } = renderWithProviders(<Hero />);
    const mark = container.querySelector("img.hero__mark");
    expect(mark.nextElementSibling).toHaveClass("status");
    expect(mark.getAttribute("src")).toBe("/brand/velyx-mark-hero.webp");
    expect(rule(".hero__mark")).not.toMatch(/opacity|filter/);
    expect(rule(".hero__mark")).toMatch(/margin-bottom:\s*-/);
    expect(rule(".hero .status")).toMatch(/z-index/);
  });

  it("shows the navbar mark in dark lines and orange on a white chip", () => {
    const { container } = renderWithProviders(<PillNav />);
    expect(container.querySelector(".pnav__logo img").getAttribute("src")).toBe("/brand/velyx-mark-nav.webp");
    expect(rule(".pnav__logo img")).not.toMatch(/filter/);
    expect(css).not.toMatch(/\.pnav__inner \.pnav__logo\s*\{[^}]*brand-ground/);
    expect(rule(".logo__icon")).not.toMatch(/filter/);
  });
});
