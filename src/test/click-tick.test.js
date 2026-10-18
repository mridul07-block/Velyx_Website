import { describe, it, expect, vi, afterEach } from "vitest";

const fresh = async () => {
  vi.resetModules();
  return import("../lib/tick");
};
const fakeCtx = () => {
  const param = () => ({ value: 0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() });
  const osc = { type: "", frequency: param(), connect: vi.fn((n) => n), start: vi.fn(), stop: vi.fn() };
  const noise = { buffer: null, connect: vi.fn((n) => n), start: vi.fn() };
  const ctx = {
    currentTime: 0, sampleRate: 48000, destination: {}, state: "running", resume: vi.fn(() => Promise.resolve()),
    createOscillator: vi.fn(() => osc),
    createGain: vi.fn(() => ({ gain: param(), connect: vi.fn((n) => n) })),
    createBufferSource: vi.fn(() => noise),
    createBiquadFilter: vi.fn(() => ({ type: "", frequency: param(), connect: vi.fn((n) => n) })),
    createBuffer: vi.fn((ch, len) => ({ getChannelData: () => new Float32Array(len) })),
  };
  return { osc, noise, ctx };
};
const press = (el, pointerType = "mouse", button = 0) => {
  const e = new Event("pointerdown", { bubbles: true });
  Object.assign(e, { pointerType, button });
  el.dispatchEvent(e);
};

describe("click tick (Kargul-style)", () => {
  afterEach(() => { vi.unstubAllGlobals(); document.body.innerHTML = ""; });

  it("plays a short falling sine plus a noise click when a mouse presses a link or button", async () => {
    const { osc, noise, ctx } = fakeCtx();
    vi.stubGlobal("AudioContext", vi.fn(function () { return ctx; }));
    const { initClickTick, setMuted } = await fresh();
    setMuted(false);
    document.body.innerHTML = `<a href="/work"><span id="in-link">Work</span></a><button id="b">Go</button><p id="p">text</p>`;
    const stop = initClickTick();
    press(document.getElementById("in-link"));
    expect(ctx.createOscillator).toHaveBeenCalledTimes(1);
    expect(osc.type).toBe("sine");
    expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(1200, 0);
    expect(osc.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(560, 0.04);
    expect(noise.start).toHaveBeenCalled();
    press(document.getElementById("b"));
    expect(ctx.createOscillator).toHaveBeenCalledTimes(2);
    stop();
  });

  it("stays silent for touch, right-clicks, plain text and when muted", async () => {
    const { ctx } = fakeCtx();
    vi.stubGlobal("AudioContext", vi.fn(function () { return ctx; }));
    const { initClickTick, setMuted } = await fresh();
    setMuted(false);
    document.body.innerHTML = `<button id="b">Go</button><p id="p">text</p>`;
    const stop = initClickTick();
    press(document.getElementById("b"), "touch");
    press(document.getElementById("b"), "mouse", 2);
    press(document.getElementById("p"));
    setMuted(true);
    press(document.getElementById("b"));
    expect(ctx.createOscillator).not.toHaveBeenCalled();
    setMuted(false);
    stop();
    press(document.getElementById("b"));
    expect(ctx.createOscillator).not.toHaveBeenCalled();
  });
});
