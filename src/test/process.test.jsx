import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Process from "../sections/home/Process";
import { PROCESS, arcPoint } from "../data/process";

describe("Process (Altair)", () => {
  it("shows the two-tone heading, an arc with 4 nodes and 4 numbered steps", () => {
    renderWithProviders(<Process />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toMatch(/Three weeks\.\s*One clear path\./);
    expect(document.querySelectorAll(".arc__node").length).toBe(4);
    const steps = document.querySelectorAll(".step");
    expect(steps.length).toBe(4);
    expect(steps[0].querySelector(".step__when").textContent).toMatch(/01 · Day 1/i);
    for (const s of steps) expect(s.querySelector("svg.art")).toBeTruthy();
  });

  it("closes with a CTA bar that books the intro call", () => {
    renderWithProviders(<Process />);
    expect(screen.getByRole("link", { name: /Intro call/ })).toHaveAttribute("href", "/intro-call");
  });

  it("places the nodes on the arc, rising to the middle", () => {
    const [a, b] = [arcPoint(0.125), arcPoint(0.375)];
    expect(a.x).toBeLessThan(b.x);
    expect(b.y).toBeLessThan(a.y);
    expect(arcPoint(0).y).toBeCloseTo(arcPoint(1).y);
    expect(PROCESS.map((s) => s.n)).toEqual(["01", "02", "03", "04"]);
  });
  it("draws Altair-style solid iso scenes where one part at a time lifts and lights up", () => {
    renderWithProviders(<Process />);
    const [call, trial, build, launch] = [...document.querySelectorAll(".step svg.art")];
    expect(call.querySelectorAll(".pick").length).toBe(4);
    expect(call.querySelectorAll(".pick .pick-edge").length).toBe(4);
    expect(trial.querySelectorAll(".pick").length).toBeGreaterThanOrEqual(4);
    expect(build.querySelector(".split")).not.toBeNull();
    expect(launch.querySelector(".beam")).not.toBeNull();
    // Staggered so only one part moves at a time.
    const delays = [...call.querySelectorAll(".pick")].map((g) => g.style.animationDelay);
    expect(new Set(delays).size).toBe(4);
    // Each card's art sits on a faint grid.
    for (const st of document.querySelectorAll(".step")) expect(st.querySelector(".step__grid")).not.toBeNull();
  });
});
