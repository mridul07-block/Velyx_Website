import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Testimonials from "../components/Testimonials";
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

  it("turns snapping off while drifting so the drift is smooth", () => {
    const many = Array.from({ length: 6 }, (_, i) => ({ ...TESTIMONIAL_QUOTES[i % 3], name: `N${i}` }));
    renderWithProviders(<Testimonials items={many} />);
    expect(document.querySelector(".tsec__track")).toHaveClass("is-drifting");
    expect(document.querySelectorAll(".tcard2").length).toBe(12);
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

describe("Founders", () => {
  it("titles the team section Founders", () => {
    renderWithProviders(<TeamGrid />);
    expect(screen.getByRole("heading", { level: 2, name: "Founders" })).toBeInTheDocument();
  });
});
