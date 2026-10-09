import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
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

describe("Footer playground", () => {
  it("throws the services around as decorative chips above a giant wordmark", () => {
    const { container } = renderWithProviders(<SiteFooter />);
    const play = container.querySelector(".fplay");
    expect(play).not.toBeNull();
    const chips = play.querySelectorAll(".fplay__chip");
    expect(chips.length).toBeGreaterThanOrEqual(8);
    expect(play.querySelector(".fplay__stage").getAttribute("aria-hidden")).toBe("true");
    expect(play.querySelector(".fplay__word").getAttribute("aria-hidden")).toBe("true");
    expect(within(play).getByRole("link", { name: "Start a project" })).toHaveAttribute("href", "/start-a-project");
  });

  it("stays a static pile when it can't tell it is on screen", () => {
    const { container } = renderWithProviders(<SiteFooter />);
    expect(container.querySelector(".fplay")).toHaveClass("is-static");
  });
});

describe("Footer playground modes", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("keeps the chips out of sight until they drop in", () => {
    vi.stubGlobal("matchMedia", (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
    vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
    const { container } = renderWithProviders(<SiteFooter />);
    expect(container.querySelector(".fplay")).toHaveClass("is-waiting");
  });

  it("shows the still pile to reduced-motion visitors", () => {
    vi.stubGlobal("matchMedia", (q) => ({ matches: q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} }));
    vi.stubGlobal("IntersectionObserver", class { constructor(cb) { this.cb = cb; } observe() { this.cb([{ isIntersecting: true }]); } disconnect() {} });
    const { container } = renderWithProviders(<SiteFooter />);
    expect(container.querySelector(".fplay")).toHaveClass("is-static");
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
