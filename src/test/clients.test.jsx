import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import TrustedBy from "../sections/home/TrustedBy";
import { CLIENTS } from "../data/clients";

describe("clients grid (Kargul layout, Bricx popup)", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("has Kargul's heading, the faint V watermark behind the grid and an And many more tile", () => {
    renderWithProviders(<TrustedBy />);
    expect(screen.getByRole("heading", { name: "Trusted by founders and industry leaders" })).toBeInTheDocument();
    expect(document.querySelector("#trusted svg.trusted__mark")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("15+ More")).toBeInTheDocument();
    expect(screen.queryByText("And many more")).toBeNull();
    expect(document.querySelector(".cmute")).toBeNull();
  });

  it("uses buttons so the pill follows keyboard focus too", () => {
    renderWithProviders(<TrustedBy />);
    const tile = screen.getByRole("button", { name: "Sacred Basil" });
    fireEvent.focus(tile);
    expect(tile).toHaveClass("is-active");
  });

  it("hovering a client only moves the pill — no popup", () => {
    renderWithProviders(<TrustedBy />);
    const tile = screen.getByRole("button", { name: "Sacred Basil" });
    fireEvent.pointerEnter(tile, { pointerType: "mouse" });
    expect(tile).toHaveClass("is-active");
    expect(document.querySelector(".cpill")).toHaveClass("is-on");
    expect(document.querySelector(".cpop")).toBeNull();
  });

  it("a real tap keeps the pill on the tapped client", () => {
    renderWithProviders(<TrustedBy />);
    const tile = screen.getByRole("button", { name: "Sacred Basil" });
    const grid = document.querySelector(".cgrid");
    fireEvent.pointerEnter(tile, { pointerType: "touch" });
    fireEvent.pointerDown(tile, { pointerType: "touch" });
    fireEvent.pointerUp(tile, { pointerType: "touch" });
    fireEvent.pointerLeave(grid, { pointerType: "touch" });
    fireEvent.focus(tile);
    expect(tile).toHaveClass("is-active");
    expect(document.querySelector(".cpill")).toHaveClass("is-on");
  });
});

describe("three full rows", () => {
  const NAMES = [
    "GetLandy", "YorkScreenplay", "Lexicon", "Orange Production", "Fitoholix", "Ideora",
    "Sacred Basil", "Overshoot", "Plainstate", "Estatico", "GetCredentialingDone", "Unitas Emergency",
    "Eavesdrops", "Narayan Kripa", "Aurelle Residence", "Kyrosec", "Tara Ayurvedic",
  ];

  it("lists the 17 real clients in order, with no dummy names", () => {
    expect(CLIENTS.map((c) => c.name)).toEqual(NAMES);
    renderWithProviders(<TrustedBy />);
    for (const dummy of ["Acme", "Globex", "Initech", "Hooli", "Vandelay", "Wonka"]) expect(screen.queryByText(dummy)).toBeNull();
  });

  it("fills Kargul's 3 x 6 grid: 17 clients and the 15+ More tile", () => {
    renderWithProviders(<TrustedBy />);
    expect(document.querySelectorAll(".cgrid .ctile").length).toBe(18);
  });

  it("every tile shows the client's logo mark next to its name", () => {
    renderWithProviders(<TrustedBy />);
    for (const c of CLIENTS) {
      expect(c.logo).toMatch(/^\/clients\/[a-z]+\.webp$/);
      const tile = screen.getByRole("button", { name: c.name });
      expect(tile.querySelector("img.ctile__logo")).toHaveAttribute("src", c.logo);
      expect(tile.querySelector(".ctile__name").textContent).toBe(c.name);
    }
  });
});

describe("Kargul's cursor over the clients grid", () => {
  it("shows a dot that follows the mouse instead of the arrow, and hides it on leave", () => {
    renderWithProviders(<TrustedBy />);
    const grid = document.querySelector(".cgrid");
    const dot = grid.querySelector(".ccursor");
    expect(dot).toHaveAttribute("aria-hidden", "true");
    expect(dot).not.toHaveClass("is-on");
    fireEvent.pointerMove(grid, { pointerType: "mouse", clientX: 120, clientY: 40 });
    expect(dot).toHaveClass("is-on");
    expect(dot.style.transform).toMatch(/translate\(/);
    fireEvent.pointerLeave(grid, { pointerType: "mouse" });
    expect(dot).not.toHaveClass("is-on");
  });

  it("never shows the dot for touch", () => {
    renderWithProviders(<TrustedBy />);
    const grid = document.querySelector(".cgrid");
    fireEvent.pointerMove(grid, { pointerType: "touch", clientX: 50, clientY: 50 });
    expect(grid.querySelector(".ccursor")).not.toHaveClass("is-on");
  });
});

describe("hover tick", () => {
  afterEach(() => vi.unstubAllGlobals());
  const fresh = async () => {
    vi.resetModules();
    return import("../lib/tick");
  };
  const fakeCtx = () => {
    const osc = { type: "", frequency: { value: 0 }, connect: vi.fn(), start: vi.fn(), stop: vi.fn() };
    const gain = { gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn() };
    return { osc, ctx: { currentTime: 0, destination: {}, state: "running", resume: vi.fn(() => Promise.resolve()), createOscillator: vi.fn(() => osc), createGain: vi.fn(() => gain) } };
  };

  it("is silent until the visitor has interacted with the page", async () => {
    const AC = vi.fn();
    vi.stubGlobal("AudioContext", AC);
    const { tick } = await fresh();
    tick(1);
    expect(AC).not.toHaveBeenCalled();
  });

  it("creates and resumes the audio context inside the unlocking gesture", async () => {
    const { ctx } = fakeCtx();
    ctx.state = "suspended";
    const AC = vi.fn(function () { return ctx; });
    vi.stubGlobal("AudioContext", AC);
    const { unlock } = await fresh();
    unlock();
    expect(AC).toHaveBeenCalledTimes(1);
    expect(ctx.resume).toHaveBeenCalled();
  });

  it("plays a short soft sine after unlock, and stays silent when muted", async () => {
    const { osc, ctx } = fakeCtx();
    vi.stubGlobal("AudioContext", vi.fn(function () { return ctx; }));
    const { tick, unlock, setMuted, isMuted } = await fresh();
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
