import { describe, it, expect } from "vitest";
import { createBodies, stepWorld, repel } from "../lib/chipPhysics";

const W = 600, H = 300;
const settle = (bodies, n = 900) => { for (let i = 0; i < n; i++) stepWorld(bodies, { width: W, height: H }, 1 / 60); };
const overlap = (a, b) => Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) > 2 && Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) > 2;

describe("chipPhysics", () => {
  const sizes = Array.from({ length: 10 }, (_, i) => ({ w: 90 + (i % 3) * 30, h: 44 }));

  it("drops chips in from above the stage", () => {
    const bodies = createBodies(sizes, W);
    expect(bodies).toHaveLength(10);
    for (const b of bodies) expect(b.y + b.h).toBeLessThanOrEqual(0);
  });

  it("settles every chip inside the stage without overlaps", () => {
    const bodies = createBodies(sizes, W);
    settle(bodies);
    for (const b of bodies) {
      expect(b.x).toBeGreaterThanOrEqual(-0.5);
      expect(b.x + b.w).toBeLessThanOrEqual(W + 0.5);
      expect(b.y + b.h).toBeLessThanOrEqual(H + 0.5);
      expect(Math.abs(b.vx) + Math.abs(b.vy)).toBeLessThan(20);
    }
    for (let i = 0; i < bodies.length; i++)
      for (let j = i + 1; j < bodies.length; j++) expect(overlap(bodies[i], bodies[j]), `${i}/${j}`).toBe(false);
  });

  it("reports when the world has come to rest", () => {
    const bodies = createBodies(sizes, W);
    let resting = false;
    for (let i = 0; i < 1500 && !resting; i++) resting = stepWorld(bodies, { width: W, height: H }, 1 / 60);
    expect(resting).toBe(true);
  });

  it("pushes nearby chips away from the pointer and leaves far ones alone", () => {
    const near = { x: 100, y: 200, w: 100, h: 44, vx: 0, vy: 0, angle: 0 };
    const far = { x: 450, y: 200, w: 100, h: 44, vx: 0, vy: 0, angle: 0 };
    repel([near, far], 120, 222, 140, 900);
    expect(near.vx).toBeGreaterThan(0);
    expect(far.vx).toBe(0);
    expect(far.vy).toBe(0);
  });
});
