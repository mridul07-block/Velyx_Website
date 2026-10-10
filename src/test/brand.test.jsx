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
  it("shows the hero mark large and fully opaque on a brand tile above the status pill", () => {
    const { container } = renderWithProviders(<Hero />);
    const tile = container.querySelector(".hero__mark");
    expect(tile.nextElementSibling).toHaveClass("status");
    expect(tile.querySelector("img").getAttribute("src")).toMatch(/w_256/);
    expect(rule(".hero__mark")).not.toMatch(/opacity|filter/);
    expect(rule(".hero__mark")).toMatch(/var\(--brand-ground\)/);
  });

  it("keeps the navbar mark in its original colours on the brand ground", () => {
    const { container } = renderWithProviders(<PillNav />);
    expect(container.querySelector(".pnav__logo img")).not.toBeNull();
    expect(rule(".pnav__logo img")).not.toMatch(/filter/);
    expect(rule(".pnav__inner .pnav__logo")).toMatch(/var\(--brand-ground\)/);
    expect(rule(".logo__icon")).not.toMatch(/filter/);
  });
});
