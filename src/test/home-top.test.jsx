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

describe("Hero", () => {
  it("has the status pill, h1 and both CTAs", () => {
    renderWithProviders(<Hero />);
    expect(screen.getByText("Now booking projects for Q4 2026")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/AI and engineering partner/);
    expect(screen.getByRole("link", { name: "Start a project" })).toHaveAttribute("href", "/start-a-project");
    expect(screen.getByRole("link", { name: "See our work" })).toHaveAttribute("href", "/work");
  });
});

describe("TrustedBy", () => {
  it("lists real clients under Kargul's heading", () => {
    renderWithProviders(<TrustedBy />);
    expect(screen.getByRole("heading", { name: "Trusted by startups and industry leaders" })).toBeInTheDocument();
    expect(screen.getAllByText("Sacred Basil").length).toBeGreaterThan(0);
  });
});

describe("ServicesPanel", () => {
  it("renders five service cards with tags inside the dark panel", () => {
    const { container } = renderWithProviders(<ServicesPanel />);
    expect(container.querySelector("section#services.panel")).not.toBeNull();
    expect(container.querySelectorAll(".svc-card")).toHaveLength(5);
    expect(container.querySelectorAll(".svc-card--wide")).toHaveLength(2);
    expect(screen.getByText("WHATSAPP API")).toBeInTheDocument();
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
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
  const motionOk = (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} });

  it("builds the scene one step at a time while playing, faster on hover", () => {
    vi.useFakeTimers();
    let fire;
    vi.stubGlobal("matchMedia", motionOk);
    vi.stubGlobal("IntersectionObserver", class { constructor(cb) { fire = cb; } observe() {} disconnect() {} });
    const { container } = renderWithProviders(<ServiceCard service={SERVICES[0]} />);
    const art = container.querySelector(".svc-card__art");
    act(() => fire([{ isIntersecting: true }]));
    expect(art).not.toHaveClass("s1");
    act(() => vi.advanceTimersByTime(900));
    expect(art).toHaveClass("s1");
    expect(art).not.toHaveClass("s2");
    fireEvent.pointerEnter(container.querySelector(".svc-card"));
    act(() => vi.advanceTimersByTime(450));
    expect(art).toHaveClass("s2");
  });

  it("loops back to an empty scene after holding the finished one", () => {
    vi.useFakeTimers();
    let fire;
    vi.stubGlobal("matchMedia", motionOk);
    vi.stubGlobal("IntersectionObserver", class { constructor(cb) { fire = cb; } observe() {} disconnect() {} });
    const { container } = renderWithProviders(<ServiceCard service={SERVICES[0]} />);
    const art = container.querySelector(".svc-card__art");
    act(() => fire([{ isIntersecting: true }]));
    let sawFull = false;
    for (let i = 0; i < 20; i++) {
      act(() => vi.advanceTimersByTime(900));
      if (art.classList.contains("s6")) sawFull = true;
      if (sawFull && !art.classList.contains("s1")) return;
    }
    throw new Error("scene never reset");
  });

  it("shows every service's finished scene when it is not playing", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    for (const service of SERVICES) {
      const { container, unmount } = renderWithProviders(<ServiceCard service={service} />);
      const art = container.querySelector(".svc-card__art");
      const steps = [...art.classList].filter((c) => /^s\d+$/.test(c));
      expect(steps.length, service.id).toBeGreaterThanOrEqual(5);
      expect(art.querySelectorAll(`.a${steps.length}`).length, service.id).toBeGreaterThan(0);
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
