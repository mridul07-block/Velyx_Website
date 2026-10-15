import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import AppRoutes from "../AppRoutes";
import { PROJECTS } from "../data/projects";

const cards = (container) => [...container.querySelectorAll(".pcard")].map((a) => a.getAttribute("href"));

describe("/work", () => {
  it("lists every project by default", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/work" });
    expect(await screen.findByRole("heading", { level: 1, name: "Latest projects" })).toBeInTheDocument();
    expect(cards(container)).toHaveLength(PROJECTS.length);
  });

  it("shows product screenshots whole: wide covers are marked to fit, not crop", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/work" });
    await screen.findByRole("heading", { level: 1, name: "Latest projects" });
    for (const p of PROJECTS.filter((x) => x.cover && !x.cardVideo)) {
      const img = container.querySelector(`.pcard[href="/work/${p.slug}"] img.cover`);
      expect(img.classList.contains("cover--shot"), p.slug).toBe(p.cover.w / p.cover.h >= 1.6);
    }
    expect(PROJECTS.find((p) => p.slug === "getlandy").cover.src).toBe("/work/getlandy/landing-wide.webp");
  });

  it("lists the client sites, with Aurelle 5th playing its scroll recording", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/work" });
    await screen.findByRole("heading", { level: 1, name: "Latest projects" });
    const slugs = cards(container).map((h) => h.replace("/work/", ""));
    for (const s of ["lexicon-one", "yorkscreenplay", "narayankripa", "fitoholix", "orange-productions", "ideora-labs", "overshoot", "estatico", "get-credentialing-done", "unitas-emergency", "eavesdrop", "aurelle-residence"]) {
      expect(slugs, s).toContain(s);
    }
    expect(slugs[4]).toBe("aurelle-residence");
    expect(slugs).not.toContain("scanva");
    const aurelle = PROJECTS.find((p) => p.slug === "aurelle-residence");
    const video = container.querySelector('.pcard[href="/work/aurelle-residence"] video');
    expect(video).toHaveAttribute("src", aurelle.video.src);
    expect(video).toHaveAttribute("preload", "none");
    expect(video.muted).toBe(true);
    // every client site shows a real hero screenshot, not a placeholder
    for (const p of PROJECTS.filter((x) => x.slug !== "sparklingtimes")) expect(p.cover, p.slug).toBeTruthy();
  });

  it("filters by type and reflects it in the pressed pill", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/work" });
    await screen.findByRole("heading", { level: 1 });
    fireEvent.click(screen.getByRole("button", { name: "AI & Automation" }));
    expect(screen.getByRole("button", { name: "AI & Automation" })).toHaveAttribute("aria-pressed", "true");
    const ai = PROJECTS.filter((p) => p.types.includes("ai")).map((p) => `/work/${p.slug}`);
    expect(cards(container)).toEqual(ai);
  });

  it("an unknown ?type= falls back to All", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/work?type=nonsense" });
    await screen.findByRole("heading", { level: 1 });
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
    expect(cards(container)).toHaveLength(PROJECTS.length);
  });

  it("a filter with no projects says so", async () => {
    renderWithProviders(<AppRoutes />, { route: "/work?type=mobile" });
    await screen.findByRole("heading", { level: 1 });
    if (!PROJECTS.some((p) => p.types.includes("mobile"))) {
      expect(screen.getByText("No projects in this category yet.")).toBeInTheDocument();
    }
  });
});

describe("/work/:slug", () => {
  it("renders the case study with brief, build and the client quote", async () => {
    renderWithProviders(<AppRoutes />, { route: "/work/sacred-basil" });
    expect(await screen.findByRole("heading", { level: 1, name: "Sacred Basil" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The brief" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What we built" })).toBeInTheDocument();
    expect(screen.getByText(/deep audit of our business operations/)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Stack" })).toBeNull();
    expect(screen.getByRole("link", { name: "← All work" })).toHaveAttribute("href", "/work");
    expect(screen.getByRole("link", { name: /Next project/ })).toBeInTheDocument();
  });

  it("the GetLandy case study opens on the product film and walks through every dashboard page", async () => {
    const getlandy = PROJECTS.find((p) => p.slug === "getlandy");
    renderWithProviders(<AppRoutes />, { route: "/work/getlandy" });
    await screen.findByRole("heading", { level: 1, name: "Getlandy AI" });
    expect(screen.getByRole("img", { name: "Getlandy AI logo" })).toHaveAttribute("src", getlandy.logo);
    const video = document.querySelector(".case__hero video");
    expect(video).toHaveAttribute("src", getlandy.video.src);
    expect(video).toHaveAttribute("poster", getlandy.video.poster);
    expect(video).toHaveAttribute("preload", "none");
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video).toHaveAttribute("playsinline");
    expect(screen.getByRole("heading", { level: 2, name: "Inside Landy" })).toBeInTheDocument();
    const rows = document.querySelectorAll(".feat");
    expect(rows).toHaveLength(getlandy.features.length);
    getlandy.features.forEach((f, i) => {
      expect(within(rows[i]).getByRole("heading", { level: 3, name: f.title })).toBeInTheDocument();
      expect(rows[i].querySelector("img")).toHaveAttribute("src", f.shot.src);
    });
  });

  it("the product film plays only while on screen, and never with reduced motion", async () => {
    const watchers = [];
    vi.stubGlobal("IntersectionObserver", class { constructor(cb) { this.cb = cb; } observe(el) { watchers.push([el, this.cb]); } unobserve() {} disconnect() {} });
    const fire = (entries) => watchers.filter(([el]) => el.tagName === "VIDEO" && el.isConnected).forEach(([, cb]) => cb(entries));
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    const { unmount } = renderWithProviders(<AppRoutes />, { route: "/work/getlandy" });
    await screen.findByRole("heading", { level: 1, name: "Getlandy AI" });
    expect(play).not.toHaveBeenCalled();
    act(() => fire([{ isIntersecting: true }]));
    expect(play).toHaveBeenCalledTimes(1);
    act(() => fire([{ isIntersecting: false }]));
    expect(pause).toHaveBeenCalled();
    unmount();

    play.mockClear();
    vi.stubGlobal("matchMedia", (q) => ({ matches: q.includes("reduce"), addEventListener() {}, removeEventListener() {} }));
    renderWithProviders(<AppRoutes />, { route: "/work/getlandy" });
    await screen.findByRole("heading", { level: 1, name: "Getlandy AI" });
    act(() => fire([{ isIntersecting: true }]));
    expect(play).not.toHaveBeenCalled();
    play.mockRestore(); pause.mockRestore(); vi.unstubAllGlobals();
  });

  it("the Audi case study is labelled a concept and walks through every screen of the demo", async () => {
    const audi = PROJECTS.find((p) => p.slug === "audi-service-system");
    renderWithProviders(<AppRoutes />, { route: "/work/audi-service-system" });
    await screen.findByRole("heading", { level: 1, name: "Audi Service System" });
    expect(screen.getByText("Concept demo on sample data. Not affiliated with Audi.")).toBeInTheDocument();
    expect(document.querySelector(".case__hero video")).toHaveAttribute("src", audi.video.src);
    expect(screen.getByRole("heading", { level: 2, name: audi.featuresTitle })).toBeInTheDocument();
    expect(document.querySelectorAll(".feat")).toHaveLength(audi.features.length);
  });

  it("the Plainstate case study opens on its product film and walks through the product", async () => {
    const ps = PROJECTS.find((p) => p.slug === "plainstate");
    renderWithProviders(<AppRoutes />, { route: "/work/plainstate" });
    await screen.findByRole("heading", { level: 1, name: "Plainstate" });
    expect(screen.getByRole("img", { name: "Plainstate logo" })).toHaveAttribute("src", ps.logo);
    expect(document.querySelector(".case__hero video")).toHaveAttribute("src", ps.video.src);
    expect(document.querySelectorAll(".feat")).toHaveLength(ps.features.length);
  });

  it("an unknown slug shows the 404 page", async () => {
    renderWithProviders(<AppRoutes />, { route: "/work/does-not-exist" });
    expect(await screen.findByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
  });
});

describe("closing CTA", () => {
  it.each(["/work", `/work/${PROJECTS[0].slug}`])("appears exactly once on %s (in the footer)", async (route) => {
    const { container } = renderWithProviders(<AppRoutes />, { route });
    await screen.findAllByRole("heading", { level: 1 });
    expect(container.querySelectorAll("section#closing")).toHaveLength(1);
    expect(container.querySelector("footer section#closing")).not.toBeNull();
  });
});
