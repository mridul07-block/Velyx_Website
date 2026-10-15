import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import ProjectsPanel from "../sections/home/ProjectsPanel";
import Compare from "../sections/home/Compare";
import { PROJECTS } from "../data/projects";
import { COMPARE } from "../data/compare";

describe("Project spotlights (Kargul)", () => {
  it("shows the featured projects as alternating spotlight cards with case-study buttons", () => {
    renderWithProviders(<ProjectsPanel />);
    expect(screen.getByRole("heading", { level: 2, name: "Project spotlights" })).toBeInTheDocument();
    const featured = PROJECTS.filter((p) => p.featured);
    const cards = document.querySelectorAll(".spot");
    expect(cards.length).toBe(featured.length);
    expect(cards[1]).toHaveClass("spot--flip");
    expect([...document.querySelectorAll(".spot a.btn")].map((a) => a.getAttribute("href"))).toEqual(featured.map((p) => `/work/${p.slug}`));
  });
});

describe("Spotlight highlights", () => {
  it("lists a project's highlights as points in place of the build paragraph", () => {
    renderWithProviders(<ProjectsPanel />);
    const withPoints = PROJECTS.filter((x) => x.featured && x.highlights);
    expect(withPoints.map((p) => p.slug)).toEqual(["getlandy", "audi-service-system", "plainstate"]);
    for (const p of withPoints) {
      const card = [...document.querySelectorAll(".spot")].find((c) => c.querySelector("h3").textContent === p.name);
      expect([...card.querySelectorAll(".spot__points li")].map((li) => li.textContent)).toEqual(p.highlights);
      expect(card.textContent).not.toContain(p.built);
    }
  });
});

describe("GetLandy spotlight screenshots", () => {
  const getlandy = PROJECTS.find((p) => p.slug === "getlandy");

  it("leads the spotlights with two stacked product screenshots, not a video", () => {
    renderWithProviders(<ProjectsPanel />);
    const first = document.querySelector(".spot");
    expect(first.querySelector("video")).toBeNull();
    const shots = [...first.querySelectorAll(".spot__shots img")];
    expect(shots.map((i) => i.getAttribute("src"))).toEqual(getlandy.shots.map((s) => s.src));
    for (const [i, img] of shots.entries()) expect(img).toHaveAttribute("alt", `Getlandy AI — ${getlandy.shots[i].alt}`);
  });
});

describe("How we compare (Kargul)", () => {
  it("compares Velyx Labs with an in-house hire and freelancers, row by row", () => {
    renderWithProviders(<Compare />);
    expect(screen.getByRole("heading", { level: 2, name: "How we compare" })).toBeInTheDocument();
    const table = screen.getByRole("table");
    const heads = within(table).getAllByRole("columnheader").map((th) => th.textContent.trim());
    expect(heads).toEqual(["Compared on", "Velyx Labs", "In-house hire", "Freelancers"]);
    expect(within(table).getAllByRole("rowheader").map((th) => th.textContent)).toEqual(COMPARE.map((r) => r.label));
    for (const r of COMPARE) expect(r.cells).toHaveLength(3);
  });

  it("highlights the Velyx column and shows the logo in its header", () => {
    renderWithProviders(<Compare />);
    const ours = screen.getByRole("columnheader", { name: "Velyx Labs" });
    expect(ours).toHaveClass("cmp__us");
    expect(ours.querySelector("svg")).toBeTruthy();
    expect(document.querySelectorAll("tbody tr:not(.cmp__end) td.cmp__us").length).toBe(COMPARE.length);
  });

  it("only makes claims we can stand behind: the one price is the real trial week", () => {
    renderWithProviders(<Compare />);
    expect(new Set(document.querySelector(".cmp").textContent.match(/\$\d[\d,]*/g) ?? [])).toEqual(new Set(["$1500"]));
  });
});
