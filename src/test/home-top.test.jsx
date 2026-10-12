import { describe, it, expect, vi, afterEach } from "vitest";
import { act, fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Hero from "../sections/home/Hero";
import TrustedBy from "../sections/home/TrustedBy";
import ServicesPanel from "../sections/home/ServicesPanel";
import ServiceCard from "../components/ServiceCard";
import Stats from "../components/Stats";
import { SERVICES } from "../data/services";
import { STATS } from "../data/stats";
import { PROOFS, PROOF_INTERVAL } from "../data/proofs";

describe("Hero", () => {
  it("has the changing proof line, h1, the Intro call button and See our work, and no mark or status pill", () => {
    const { container } = renderWithProviders(<Hero />);
    expect(container.querySelector(".hero__mark, .status")).toBeNull();
    const proof = container.querySelector(".proof");
    expect(proof.nextElementSibling.tagName).toBe("H1");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/AI and engineering partner/);
    expect(screen.getByRole("link", { name: "Intro call" })).toHaveAttribute("href", "/intro-call");
    expect(screen.getByRole("link", { name: "See our work" })).toHaveAttribute("href", "/work");
  });

  it("reads every proof line once to assistive tech and shows the first one by default", () => {
    const { container } = renderWithProviders(<Hero />);
    const rows = container.querySelectorAll(".proof__row");
    expect(rows.length).toBe(PROOFS.length);
    expect(rows[0]).toHaveClass("is-on");
    for (const r of rows) expect(r).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".proof .sr-only").textContent).toBe(PROOFS.join(". "));
  });

  it("moves to the next line on a timer and wraps round", () => {
    vi.useFakeTimers();
    const { container } = renderWithProviders(<Hero />);
    act(() => vi.advanceTimersByTime(PROOF_INTERVAL));
    expect(container.querySelectorAll(".proof__row")[1]).toHaveClass("is-on");
    act(() => vi.advanceTimersByTime(PROOF_INTERVAL * (PROOFS.length - 1)));
    expect(container.querySelectorAll(".proof__row")[0]).toHaveClass("is-on");
    vi.useRealTimers();
  });
});

describe("TrustedBy", () => {
  it("lists real clients under the founders heading", () => {
    renderWithProviders(<TrustedBy />);
    expect(screen.getByRole("heading", { name: "Trusted by founders and industry leaders" })).toBeInTheDocument();
    expect(screen.getAllByText("Sacred Basil").length).toBeGreaterThan(0);
  });
});

describe("ServicesPanel", () => {
  it("renders five service cards with tags inside the dark panel", () => {
    const { container } = renderWithProviders(<ServicesPanel />);
    expect(container.querySelector("section#services.panel")).not.toBeNull();
    expect(container.querySelectorAll(".svc-card")).toHaveLength(5);
    expect(container.querySelectorAll(".svc-card--wide")).toHaveLength(2);
    expect(screen.getByText("WhatsApp API")).toBeInTheDocument();
  });
});

describe("ServiceCard motion", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("plays the illustration only while it is on screen", () => {
    let fire;
    vi.stubGlobal("matchMedia", (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
    vi.stubGlobal("IntersectionObserver", class { constructor(cb) { fire = cb; } observe() {} disconnect() {} });
    const { container } = renderWithProviders(<ServiceCard service={SERVICES[0]} />);
    const art = container.querySelector(".svc-card__art");
    expect(art).not.toHaveClass("is-playing");
    act(() => fire([{ isIntersecting: true }]));
    expect(art).toHaveClass("is-playing");
    act(() => fire([{ isIntersecting: false }]));
    expect(art).not.toHaveClass("is-playing");
  });

  it("does not start looping off-screen just because a fallback timer fired", () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
    vi.stubGlobal("IntersectionObserver", class { observe() {} disconnect() {} });
    const { container } = renderWithProviders(<ServiceCard service={SERVICES[0]} />);
    act(() => vi.advanceTimersByTime(5000));
    expect(container.querySelector(".svc-card__art")).not.toHaveClass("is-playing");
    vi.useRealTimers();
  });

  it("never plays the illustration for reduced-motion visitors", () => {
    vi.stubGlobal("matchMedia", (q) => ({ matches: q.includes("reduce"), media: q, addEventListener() {}, removeEventListener() {} }));
    vi.stubGlobal("IntersectionObserver", class { constructor(cb) { this.cb = cb; } observe() { this.cb([{ isIntersecting: true }]); } disconnect() {} });
    const { container } = renderWithProviders(<ServiceCard service={SERVICES[0]} />);
    expect(container.querySelector(".svc-card__art")).not.toHaveClass("is-playing");
  });
});

describe("ServiceCard scenes", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("spreads the scene's layers apart while hovered", () => {
    const { container } = renderWithProviders(<ServiceCard service={SERVICES[0]} />);
    const card = container.querySelector(".svc-card");
    const art = container.querySelector(".svc-card__art");
    expect(art).not.toHaveClass("is-hover");
    fireEvent.pointerEnter(card);
    expect(art).toHaveClass("is-hover");
    fireEvent.pointerLeave(card);
    expect(art).not.toHaveClass("is-hover");
  });

  it("draws every service as layered isometric planes over guide lines", () => {
    for (const service of SERVICES) {
      const { container, unmount } = renderWithProviders(<ServiceCard service={service} />);
      const art = container.querySelector(".svc-card__art");
      expect(art.querySelector(".iso-guides"), service.id).not.toBeNull();
      expect(art.querySelectorAll(".spread .float").length, service.id).toBeGreaterThanOrEqual(3);
      expect(art.querySelectorAll("[transform^='matrix(']").length, service.id).toBeGreaterThanOrEqual(3);
      unmount();
    }
  });
});

describe("Stats", () => {
  it("renders every stat from data", () => {
    renderWithProviders(<Stats />);
    for (const s of STATS) {
      expect(screen.getByText(s.value)).toBeInTheDocument();
      expect(screen.getByText(s.label)).toBeInTheDocument();
    }
  });
});
