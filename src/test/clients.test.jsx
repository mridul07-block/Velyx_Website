import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import TrustedBy from "../sections/home/TrustedBy";
import { noteFor } from "../lib/clientNotes";
import { tick, unlock, setMuted, isMuted } from "../lib/tick";

describe("clients grid (Kargul layout, Bricx popup)", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("has the founders heading and ends with an And many more tile", () => {
    renderWithProviders(<TrustedBy />);
    expect(screen.getByRole("heading", { name: "Trusted by founders and startups" })).toBeInTheDocument();
    expect(screen.getByText("And many more")).toBeInTheDocument();
  });

  it("uses buttons so the pill follows keyboard focus too", () => {
    renderWithProviders(<TrustedBy />);
    const tile = screen.getByRole("button", { name: /^Sacred Basil/ });
    fireEvent.focus(tile);
    expect(tile).toHaveClass("is-active");
  });

  it("shows what we built on mouse hover, but no popup on touch", () => {
    renderWithProviders(<TrustedBy />);
    const tile = screen.getByRole("button", { name: /^Sacred Basil/ });
    fireEvent.pointerEnter(tile, { pointerType: "mouse" });
    const pop = document.querySelector(".cpop");
    expect(pop).toHaveClass("is-on");
    expect(pop.textContent).toMatch(/e-commerce/i);
    fireEvent.pointerLeave(document.querySelector(".cgrid"));
    fireEvent.pointerEnter(tile, { pointerType: "touch" });
    expect(document.querySelector(".cpop.is-on")).toBeNull();
  });

  it("shows only the pill for a client without any copy", () => {
    expect(noteFor("Estatico")).toBeNull();
    renderWithProviders(<TrustedBy />);
    fireEvent.pointerEnter(screen.getByRole("button", { name: /^Estatico/ }), { pointerType: "mouse" });
    expect(document.querySelector(".cpop.is-on")).toBeNull();
  });

  it("builds notes from real project and engagement copy", () => {
    expect(noteFor("Sacred Basil")).toEqual({ line: expect.stringMatching(/e-commerce/i), chips: expect.arrayContaining(["Web"]) });
    expect(noteFor("Overshoot").line).toMatch(/web application/i);
    expect(noteFor("Orange Production").line).toMatch(/marketing agency/i);
  });
});

describe("hover tick", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("is silent until the visitor has interacted with the page", () => {
    const AC = vi.fn();
    vi.stubGlobal("AudioContext", AC);
    tick(1);
    expect(AC).not.toHaveBeenCalled();
  });

  it("plays a short soft sine after unlock, and stays silent when muted", () => {
    const osc = { type: "", frequency: { value: 0 }, connect: vi.fn(), start: vi.fn(), stop: vi.fn() };
    const gain = { gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn() };
    const ctx = { currentTime: 0, destination: {}, state: "running", createOscillator: vi.fn(() => osc), createGain: vi.fn(() => gain) };
    vi.stubGlobal("AudioContext", vi.fn(function () { return ctx; }));
    setMuted(false);
    unlock();
    tick(2);
    expect(ctx.createOscillator).toHaveBeenCalledTimes(1);
    expect(osc.type).toBe("sine");
    expect(osc.frequency.value).toBe(1180);
    setMuted(true);
    expect(isMuted()).toBe(true);
    tick(2);
    expect(ctx.createOscillator).toHaveBeenCalledTimes(1);
    setMuted(false);
  });
});
