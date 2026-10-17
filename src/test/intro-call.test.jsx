import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Layout from "../components/Layout";
import IntroCall from "../pages/IntroCall";
import CalEmbed from "../components/CalEmbed";
import { ROUTES } from "../../scripts/routes.mjs";
import { PROJECTS } from "../data/projects";

describe("audit bar + nav + intro call", () => {
  it("shows the free-audit row above the nav, linking to the audit booking", () => {
    renderWithProviders(<Layout><p /></Layout>);
    const bar = screen.getByRole("link", { name: /audited\. for free/i });
    expect(bar).toHaveAttribute("href", "/intro-call?for=audit");
    expect(bar.compareDocumentPosition(screen.getByRole("navigation", { name: "Main" })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("nav CTA is Start a project (no icon) to the booking page, with Pricing in the links", () => {
    renderWithProviders(<Layout><p /></Layout>);
    const nav = screen.getByRole("navigation", { name: "Main" });
    const cta = nav.querySelector("a.pnav__cta");
    expect(cta).toHaveAttribute("href", "/intro-call");
    expect(cta.textContent).toMatch(/^Start a project/);
    expect(cta.querySelector("svg")).toBeNull();
    expect(nav.querySelector('a[href="/pricing"]')).toBeTruthy();
  });

  it("intro-call page shows the calendar heading and a fallback link", () => {
    renderWithProviders(<IntroCall />, { route: "/intro-call" });
    expect(screen.getByRole("heading", { level: 1, name: "Book an intro call" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open the booking page/i })).toHaveAttribute("href", "https://cal.com/velyx-labs/30min");
  });

  it("slides every project's hero screenshot right to left in a seamless loop", () => {
    const { container } = renderWithProviders(<IntroCall />, { route: "/intro-call" });
    const heroes = PROJECTS.filter((p) => p.cover && p.cover.w / p.cover.h >= 1.6);
    expect(heroes.length).toBeGreaterThan(10);
    const strip = container.querySelector(".work-strip.marquee");
    const groups = strip.querySelectorAll(".marquee__group");
    expect(groups).toHaveLength(2);
    expect(groups[1]).toHaveAttribute("aria-hidden", "true");
    const shots = [...groups[0].querySelectorAll("a")];
    expect(shots.map((a) => a.getAttribute("href"))).toEqual(heroes.map((p) => `/work/${p.slug}`));
    expect(shots.map((a) => a.querySelector("img").getAttribute("src"))).toEqual(heroes.map((p) => p.cover.src));
    expect(groups[1]).toHaveAttribute("inert"); // the copy's links can't be tabbed to
  });

  it("shows the work screenshots large: 560px cards on desktop, 320px on phones", async () => {
    const { readFileSync } = await import("node:fs");
    const css = readFileSync("src/styles.css", "utf8");
    expect(css).toMatch(/\.work-strip__shot \{[^}]*width: 560px;/);
    expect(css).toMatch(/max-width: 640px\) \{ \.work-strip__shot \{ width: 320px; \}/);
  });

  it("switches the heading for the free audit", () => {
    renderWithProviders(<IntroCall />, { route: "/intro-call?for=audit" });
    expect(screen.getByRole("heading", { level: 1, name: "Free product audit" })).toBeInTheDocument();
  });

  it("is a pre-rendered, indexed route", () => {
    expect(ROUTES.some((r) => r.path === "/intro-call")).toBe(true);
  });
});

describe("Intro call button", () => {
  it("shows the Google Meet symbol in its four colours", async () => {
    const { default: IntroCallButton } = await import("../components/IntroCallButton");
    renderWithProviders(<IntroCallButton />);
    const icon = screen.getByRole("link", { name: "Intro call" }).querySelector("svg.meet-icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    const fills = [...icon.querySelectorAll("path")].map((p) => p.getAttribute("fill").toLowerCase());
    for (const c of ["#00832d", "#0066da", "#e94235", "#2684fc", "#00ac47", "#ffba00"]) expect(fills).toContain(c);
  });
});

describe("intro call about an agent", () => {
  it("names the agent you asked about and puts it in the booking notes", () => {
    renderWithProviders(<IntroCall />, { route: "/intro-call?agent=AI%20receptionist" });
    expect(screen.getByText("About: AI receptionist")).toBeInTheDocument();
    expect(JSON.parse(screen.getByTestId("cal-embed").dataset.config)).toMatchObject({ layout: "month_view", notes: "Interested in: AI receptionist" });
  });

  it("ignores an agent name we don't offer", () => {
    const { container } = renderWithProviders(<IntroCall />, { route: "/intro-call?agent=Free%20money%20bot" });
    expect(container.textContent).not.toMatch(/Free money bot/);
    expect(container.querySelector(".intro-call__about")).toBeNull();
    expect(JSON.parse(screen.getByTestId("cal-embed").dataset.config).notes).toBeUndefined();
  });

  it("passes notes straight through the embed", () => {
    renderWithProviders(<CalEmbed eager notes="Interested in: Booking agent" />);
    expect(JSON.parse(screen.getByTestId("cal-embed").dataset.config).notes).toBe("Interested in: Booking agent");
  });
});
