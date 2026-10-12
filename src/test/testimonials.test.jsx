import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Testimonials from "../components/Testimonials";
import { AUTO_STEP_MS } from "../lib/drift";
import TeamGrid from "../components/TeamGrid";
import { TESTIMONIAL_QUOTES } from "../data/testimonials";
import { shouldDrift, wrap, roleLine, loopPeriod } from "../lib/drift";

describe("testimonial drift rules", () => {
  it("only drifts with 6+ cards and never under reduced motion", () => {
    expect(shouldDrift(3, false)).toBe(false);
    expect(shouldDrift(6, false)).toBe(true);
    expect(shouldDrift(9, true)).toBe(false);
  });

  it("wraps the doubled track at its half width", () => {
    expect(wrap(1200, 1000)).toBe(200);
    expect(wrap(400, 1000)).toBe(400);
  });

  it("measures the loop as the distance between the two copies of the first card", () => {
    const cards = [{ offsetLeft: 200 }, { offsetLeft: 659 }, { offsetLeft: 1118 }, { offsetLeft: 1577 }];
    expect(loopPeriod(cards, 2)).toBe(1118 - 200);
  });

  it("auto-advances one whole card at a time, so cards always sit aligned", () => {
    vi.useFakeTimers();
    const many = Array.from({ length: 6 }, (_, i) => ({ ...TESTIMONIAL_QUOTES[i % 3], name: `N${i}` }));
    renderWithProviders(<Testimonials items={many} />);
    const track = document.querySelector(".tsec__track");
    expect(track).toHaveClass("is-auto");
    expect(track).not.toHaveClass("is-drifting");
    let left = 0;
    track.scrollBy = ({ left: l }) => (left += l);
    act(() => vi.advanceTimersByTime(AUTO_STEP_MS + 10));
    expect(left).toBeGreaterThan(0);
    vi.useRealTimers();
  });

  it("formats roles Bricx-style", () => {
    expect(roleLine("Founder · Sacred Basil")).toBe("Founder @Sacred Basil");
    expect(roleLine("CEO")).toBe("CEO");
  });
});

describe("Testimonials (Bricx)", () => {
  it("has the two-tone headline and arrows", () => {
    renderWithProviders(<Testimonials items={TESTIMONIAL_QUOTES} />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toMatch(/Don't take our word\.\s*Take theirs\./);
    expect(screen.getByRole("button", { name: "Previous testimonial" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next testimonial" })).toBeInTheDocument();
  });

  it("renders each real quote exactly once while there are too few to drift", () => {
    renderWithProviders(<Testimonials items={TESTIMONIAL_QUOTES} />);
    expect(document.querySelectorAll(".tcard2").length).toBe(TESTIMONIAL_QUOTES.length);
    for (const t of TESTIMONIAL_QUOTES) expect(screen.getByText(t.name)).toBeInTheDocument();
  });

  it("uses a monogram when there is no photo, and the photo when there is", () => {
    renderWithProviders(<Testimonials items={[TESTIMONIAL_QUOTES[0], { ...TESTIMONIAL_QUOTES[1], photo: "/people/p.jpg" }]} />);
    const cards = document.querySelectorAll(".tcard2");
    expect(cards[0].querySelector(".tcard2__mono").textContent).toBe(TESTIMONIAL_QUOTES[0].avatar);
    expect(cards[1].querySelector("img.tcard2__img")).toHaveAttribute("src", "/people/p.jpg");
  });

  it("links to the client's case study when there is one", () => {
    renderWithProviders(<Testimonials items={TESTIMONIAL_QUOTES} />);
    const card = screen.getByText("Dr. Parita").closest(".tcard2");
    expect(card.querySelector('a[href="/work/sacred-basil"]')).toBeTruthy();
  });

  it("arrow buttons scroll the track by one card", () => {
    renderWithProviders(<Testimonials items={TESTIMONIAL_QUOTES} />);
    const track = document.querySelector(".tsec__track");
    let left = 0;
    track.scrollBy = ({ left: l }) => (left += l);
    fireEvent.click(screen.getByRole("button", { name: "Next testimonial" }));
    expect(left).toBeGreaterThan(0);
  });
});

describe("Testimonials layout", () => {
  it("keeps the track inside the page container so cards line up with the heading", () => {
    renderWithProviders(<Testimonials items={TESTIMONIAL_QUOTES} />);
    expect(document.querySelector(".tsec__track").parentElement).toHaveClass("container");
  });

  it("fits exactly three compact cards per view on desktop", async () => {
    const { readFileSync } = await import("node:fs");
    const css = readFileSync("src/styles.css", "utf8");
    const rule = (css.match(/(?:^|\n)\.tcard2 \{([^}]*)\}/) || [])[1];
    expect(rule).toMatch(/flex:\s*0 0 calc\(\(100% - 48px\) \/ 3\)/);
    expect(rule).toMatch(/aspect-ratio:\s*4 \/ 5/);
  });

  it("shows ten clients' cards once there are ten, drifting with a seamless copy", () => {
    const ten = Array.from({ length: 10 }, (_, i) => ({ ...TESTIMONIAL_QUOTES[i % 3], name: `Client ${i}`, photo: `/people/c${i}.jpg` }));
    renderWithProviders(<Testimonials items={ten} />);
    expect(document.querySelectorAll(".tcard2")).toHaveLength(20);
    expect(document.querySelectorAll(".tcard2[aria-hidden='true']")).toHaveLength(10);
    expect(document.querySelectorAll("img.tcard2__img")).toHaveLength(20);
  });
});

describe("Founders", () => {
  it("titles the team section Founders", () => {
    renderWithProviders(<TeamGrid />);
    expect(screen.getByRole("heading", { level: 2, name: "Founders" })).toBeInTheDocument();
  });
});

describe("dummy testimonials (local preview only)", () => {
  it("fills ten cards in development with seven marked dummies after the real three", async () => {
    const { quotesFor, DUMMY_QUOTES } = await import("../data/testimonials");
    const dev = quotesFor(true);
    expect(dev).toHaveLength(10);
    expect(dev.slice(0, 3)).toEqual(TESTIMONIAL_QUOTES);
    expect(DUMMY_QUOTES).toHaveLength(7);
    for (const q of DUMMY_QUOTES) expect(q.dummy).toBe(true);
  });

  it("never ships the dummies in a production build", async () => {
    const { quotesFor } = await import("../data/testimonials");
    const prod = quotesFor(false);
    expect(prod).toEqual(TESTIMONIAL_QUOTES);
    expect(prod.some((q) => q.dummy)).toBe(false);
  });
});
