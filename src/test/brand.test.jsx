import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { renderWithProviders } from "./renderWithProviders";
import PillNav from "../components/PillNav";

/* The official V mark sits dark on the white navbar chip. */
const css = readFileSync("src/styles.css", "utf8");
const rule = (sel) => (css.match(new RegExp(`${sel.replace(/[.]/g, "\\.")}\\s*\\{([^}]*)\\}`)) || [])[1] || "";

describe("Velyx brand mark", () => {
  it("shows the navbar mark in ink on the white chip", () => {
    const { container } = renderWithProviders(<PillNav />);
    expect(container.querySelector(".pnav__logo svg")).toBeTruthy();
    expect(rule(".pnav__logo svg")).toMatch(/color:\s*var\(--ink\)/);
    expect(css).not.toMatch(/\.pnav__inner \.pnav__logo\s*\{[^}]*brand-ground/);
    expect(rule(".logo__icon")).not.toMatch(/filter/);
  });
});
