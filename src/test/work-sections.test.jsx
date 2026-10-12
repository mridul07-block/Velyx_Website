import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import SelectedWork from "../sections/home/SelectedWork";
import MoreWork from "../sections/home/MoreWork";
import { PROJECTS } from "../data/projects";

describe("Selected work (Altair)", () => {
  it("shows two large case cards with problem and built copy and a case-study link", () => {
    renderWithProviders(<SelectedWork />);
    const cards = document.querySelectorAll(".case");
    expect(cards.length).toBe(2);
    for (const c of cards) {
      expect(c.querySelector(".case__problem").textContent.length).toBeGreaterThan(10);
      expect(c.querySelector(".case__built").textContent.length).toBeGreaterThan(10);
      expect(c.querySelector('a[href^="/work/"]')).toHaveTextContent(/Read the case study/);
    }
    expect(cards[1]).toHaveClass("case--flip");
  });

  it("never renders an outcome line without a real result", () => {
    renderWithProviders(<SelectedWork />);
    for (const c of document.querySelectorAll(".case")) {
      const slug = c.querySelector('a[href^="/work/"]').getAttribute("href").split("/").pop();
      const p = PROJECTS.find((x) => x.slug === slug);
      expect(Boolean(c.querySelector(".case__outcome"))).toBe(Boolean(p.result));
    }
  });
});

describe("More work (Altair)", () => {
  it("lists the other projects as rows linking to their case studies", () => {
    renderWithProviders(<MoreWork />);
    const rows = [...document.querySelectorAll(".mwork__row")];
    const projectRows = rows.slice(0, -1);
    expect(projectRows.length).toBeGreaterThan(2);
    for (const r of projectRows) expect(r.getAttribute("href")).toMatch(/^\/work\//);
  });

  it("ends with Your product, next. linking to the intro call, then All work", () => {
    renderWithProviders(<MoreWork />);
    const rows = document.querySelectorAll(".mwork__row");
    const last = rows[rows.length - 1];
    expect(last).toHaveTextContent(/Your product, next\./);
    expect(last.getAttribute("href")).toBe("/intro-call");
    expect(screen.getByRole("link", { name: /All work and case studies/ })).toHaveAttribute("href", "/work");
  });
});
