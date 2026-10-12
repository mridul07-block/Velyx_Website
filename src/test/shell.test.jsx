import { describe, it, expect, vi, afterEach } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import PillNav from "../components/PillNav";
import SiteFooter from "../components/SiteFooter";
import Marquee from "../components/Marquee";
import Panel from "../components/Panel";

describe("PillNav", () => {
  it("has Recent Work, Pricing, Swipe file and the Intro call CTA", () => {
    renderWithProviders(<PillNav />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getAllByRole("link", { name: "Recent Work" })[0]).toHaveAttribute("href", "/work");
    expect(within(nav).getAllByRole("link", { name: "Pricing" })[0]).toHaveAttribute("href", "/pricing");
    expect(within(nav).getAllByRole("link", { name: "Swipe file" })[0]).toHaveAttribute("href", "/swipe-file");
    expect(within(nav).getByRole("link", { name: "Intro call" })).toHaveAttribute("href", "/intro-call");
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

  it("ends every page with the closing: heading, isometric scene, Intro call and See our work", () => {
    const { container } = renderWithProviders(<SiteFooter />);
    const cta = container.querySelector("footer section#closing");
    expect(within(cta).getByRole("heading", { level: 2, name: "Let's build something amazing" })).toBeInTheDocument();
    expect(within(cta).getByRole("link", { name: "Intro call" })).toHaveAttribute("href", "/intro-call");
    expect(within(cta).getByRole("link", { name: "See our work" })).toHaveAttribute("href", "/work");
    const scene = cta.querySelector(".fcta__scene svg");
    expect(scene.getAttribute("aria-hidden")).toBe("true");
    // Altair's observatory, as in the reference recording: a flared plinth
    // with a fanned hatch on its right side, a shaded drum, a still dome
    // with its oculus, a slit on the left and a telescope.
    expect(scene.querySelectorAll(".dome")).toHaveLength(1);
    expect(scene.querySelectorAll(".obs-fan line").length).toBeGreaterThan(40);
    expect(scene.querySelector(".obs-drum")).not.toBeNull();
    expect(scene.querySelector(".obs-oculus")).not.toBeNull();
    expect(scene.querySelector(".obs-slit")).not.toBeNull();
    expect(scene.querySelector(".obs-scope")).not.toBeNull();
    // One dotted circular arc with a single travelling dot, a still cluster
    // of dots on it, and a dotted horizon with still dots.
    expect(scene.querySelectorAll(".orbit")).toHaveLength(1);
    expect(scene.querySelectorAll(".orbit-dot")).toHaveLength(1);
    expect(scene.querySelectorAll(".arc-still").length).toBe(3);
    expect(scene.querySelector(".fs-horizon")).not.toBeNull();
    expect(scene.querySelectorAll(".hz-dot").length).toBe(4);
    // Nine still objects; four in dashed selection frames with corner
    // handles, each wired to the plinth with a dot sliding along the wire.
    expect(scene.querySelectorAll(".fobj").length).toBe(9);
    expect(scene.querySelector(".fobj__bob")).toBeNull();
    expect(scene.querySelectorAll(".fsel")).toHaveLength(4);
    for (const f of scene.querySelectorAll(".fsel")) expect(f.querySelectorAll(".fs-handle")).toHaveLength(4);
    expect(scene.querySelectorAll(".fwire")).toHaveLength(4);
    expect(scene.querySelectorAll(".fwire-dot")).toHaveLength(4);
    // Altair's floor: a large, faint diamond grid.
    const grid = scene.querySelector("pattern#fs-grid");
    expect(Number(grid.getAttribute("width"))).toBeGreaterThanOrEqual(30);
    expect(scene.querySelectorAll(".fobj__shadow").length).toBeGreaterThanOrEqual(4);
    expect(scene.querySelector(".core, .packet, .station, .trace, .ripple, .satellite")).toBeNull();
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

describe("Footer (Altair layout)", () => {
  it("has one Intro call CTA, a reply-time line and a quiet See our work link", async () => {
    const { default: SiteFooter } = await import("../components/SiteFooter");
    renderWithProviders(<SiteFooter />);
    const closing = document.querySelector("#closing");
    const ctas = closing.querySelectorAll("a.btn");
    expect(ctas.length).toBe(1);
    expect(ctas[0]).toHaveAttribute("href", "/intro-call");
    expect(closing.querySelector(".closing__sub").textContent).toMatch(/reply within one working day/i);
    expect(closing.querySelector('a.closing__link[href="/work"]')).toBeTruthy();
  });

  it("puts © on the left and Work and Pricing in the footer links", async () => {
    const { default: SiteFooter } = await import("../components/SiteFooter");
    renderWithProviders(<SiteFooter />);
    const nav = screen.getByRole("navigation", { name: "Footer" });
    expect(nav.querySelector('a[href="/work"]')).toBeTruthy();
    expect(nav.querySelector('a[href="/pricing"]')).toBeTruthy();
    expect(document.querySelector(".sfoot__copy").compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("Ask AI links only carry the fixed prompt about Velyx Labs", async () => {
    const { default: SiteFooter } = await import("../components/SiteFooter");
    const { askAiLinks } = await import("../lib/askAi");
    renderWithProviders(<SiteFooter />);
    const links = document.querySelectorAll(".askai a");
    expect(links.length).toBe(4);
    for (const a of links) {
      expect(decodeURIComponent(a.href)).toMatch(/Tell me about Velyx Labs \(velyxlabs\.in\)/);
      expect(a).toHaveAttribute("target", "_blank");
      expect(a.getAttribute("aria-label")).toMatch(/^Ask .+ about Velyx Labs$/);
    }
    expect(askAiLinks("x y")[0].href).toBe("https://chatgpt.com/?q=x%20y");
  });
});
