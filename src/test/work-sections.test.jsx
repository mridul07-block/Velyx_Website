import { describe, it, expect, vi, afterEach } from "vitest";
import { act, screen, within } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import ProjectsPanel from "../sections/home/ProjectsPanel";
import ProjectSpotlight from "../components/ProjectSpotlight";
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

describe("GetLandy spotlight video", () => {
  afterEach(() => vi.unstubAllGlobals());
  const getlandy = PROJECTS.find((p) => p.slug === "getlandy");

  it("leads the spotlights with a muted, looping product video that loads nothing up front", () => {
    renderWithProviders(<ProjectsPanel />);
    const first = document.querySelector(".spot");
    const video = first.querySelector("video.cover");
    expect(video).not.toBeNull();
    expect(video).toHaveAttribute("src", getlandy.video.src);
    expect(video).toHaveAttribute("poster", getlandy.video.poster);
    expect(video).toHaveAttribute("preload", "none");
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("aria-label", "Getlandy AI — product walkthrough");
  });

  it("plays only while on screen, and never with reduced motion", () => {
    let fire;
    vi.stubGlobal("IntersectionObserver", class { constructor(cb) { fire = cb; } observe() {} disconnect() {} });
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    renderWithProviders(<ProjectSpotlight project={getlandy} />);
    expect(play).not.toHaveBeenCalled();
    act(() => fire([{ isIntersecting: true }]));
    expect(play).toHaveBeenCalledTimes(1);
    act(() => fire([{ isIntersecting: false }]));
    expect(pause).toHaveBeenCalled();

    play.mockClear();
    vi.stubGlobal("matchMedia", (q) => ({ matches: q.includes("reduce"), addEventListener() {}, removeEventListener() {} }));
    renderWithProviders(<ProjectSpotlight project={getlandy} />);
    act(() => fire([{ isIntersecting: true }]));
    expect(play).not.toHaveBeenCalled();
    play.mockRestore(); pause.mockRestore();
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
