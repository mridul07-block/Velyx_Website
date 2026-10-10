import { describe, it, expect, vi, afterEach } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import PillNav from "../components/PillNav";
import SiteFooter from "../components/SiteFooter";
import Marquee from "../components/Marquee";
import Panel from "../components/Panel";

describe("PillNav", () => {
  it("has Recent Work, Swipe file and the Start a project CTA", () => {
    renderWithProviders(<PillNav />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getAllByRole("link", { name: "Recent Work" })[0]).toHaveAttribute("href", "/work");
    expect(within(nav).getAllByRole("link", { name: "Swipe file" })[0]).toHaveAttribute("href", "/swipe-file");
    expect(within(nav).getAllByRole("link", { name: "Start a project" })[0]).toHaveAttribute("href", "/start-a-project");
    expect(within(nav).getByRole("link", { name: "Velyx Labs home" })).toHaveAttribute("href", "/");
  });

  it("opens and closes the mobile menu", () => {
    renderWithProviders(<PillNav />);
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("mobile-menu")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(document.getElementById("mobile-menu")).toBeNull();
  });
});

describe("SiteFooter", () => {
  it("has email, socials and legal links", () => {
    renderWithProviders(<SiteFooter />);
    expect(screen.getByRole("link", { name: "velyxlabs@gmail.com" })).toHaveAttribute("href", "mailto:velyxlabs@gmail.com");
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/company/velyx-labs/");
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
  });
});

describe("Footer CTA scene", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("ends every page with Kargul's closing: heading, isometric scene, two CTAs", () => {
    const { container } = renderWithProviders(<SiteFooter />);
    const cta = container.querySelector("footer section#closing");
    expect(within(cta).getByRole("heading", { level: 2, name: "Let's build something amazing" })).toBeInTheDocument();
    expect(within(cta).getByRole("link", { name: "Start a project" })).toHaveAttribute("href", "/start-a-project");
    expect(within(cta).getByRole("link", { name: "See our work" })).toHaveAttribute("href", "/work");
    const scene = cta.querySelector(".fcta__scene svg");
    expect(scene.getAttribute("aria-hidden")).toBe("true");
    expect(scene.querySelector(".core")).not.toBeNull();
    expect(scene.querySelectorAll(".nn-node").length).toBeGreaterThanOrEqual(8);
    const stations = [...scene.querySelectorAll(".station")].map((s) => s.dataset.station);
    expect(stations).toEqual(["agents", "saas", "whatsapp", "web", "mobile"]);
    expect(scene.querySelectorAll(".trace")).toHaveLength(5);
    expect(scene.querySelectorAll(".packet")).toHaveLength(5);
    expect(scene.querySelectorAll(".satellite").length).toBeGreaterThanOrEqual(3);
  });

  it("fires a burst when the AI core is clicked", () => {
    vi.useFakeTimers();
    const { container } = renderWithProviders(<SiteFooter />);
    const scene = container.querySelector(".fcta__scene");
    fireEvent.click(scene.querySelector(".core"));
    expect(scene).toHaveClass("is-burst");
    act(() => vi.advanceTimersByTime(2000));
    expect(scene).not.toHaveClass("is-burst");
    vi.useRealTimers();
  });

  it("animates the scene only while it is on screen and motion is allowed", () => {
    let fire;
    vi.stubGlobal("matchMedia", (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
    vi.stubGlobal("IntersectionObserver", class { constructor(cb) { fire = cb; } observe() {} disconnect() {} });
    const { container } = renderWithProviders(<SiteFooter />);
    const scene = container.querySelector(".fcta__scene");
    expect(scene).not.toHaveClass("is-playing");
    act(() => fire([{ isIntersecting: true }]));
    expect(scene).toHaveClass("is-playing");
  });

  it("keeps the scene still for reduced-motion visitors", () => {
    vi.stubGlobal("matchMedia", (q) => ({ matches: q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} }));
    vi.stubGlobal("IntersectionObserver", class { constructor(cb) { this.cb = cb; } observe() { this.cb([{ isIntersecting: true }]); } disconnect() {} });
    const { container } = renderWithProviders(<SiteFooter />);
    expect(container.querySelector(".fcta__scene")).not.toHaveClass("is-playing");
  });
});

describe("Marquee and Panel", () => {
  it("duplicates marquee items for a seamless loop, hiding the copy from assistive tech", () => {
    render(<Marquee label="Clients"><span>Acme</span></Marquee>);
    const items = screen.getAllByText("Acme", { ignore: false });
    expect(items).toHaveLength(2);
    expect(items[1].closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("renders a dark panel section with its id", () => {
    const { container } = render(<Panel id="services"><p>x</p></Panel>);
    expect(container.querySelector("section#services.panel .container")).not.toBeNull();
  });
});
