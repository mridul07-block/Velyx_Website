import { describe, it, expect } from "vitest";
import { project, meridians, arcAt, lerpAt, slitBand, scopePose } from "../lib/isoScene";

describe("isoScene geometry", () => {
  it("projects the world origin to the scene centre and z straight up", () => {
    expect(project(0, 0, 0)).toEqual([600, 300]);
    expect(project(0, 0, 50)).toEqual([600, 250]);
    const [x, y] = project(100, 0, 0);
    expect(x).toBeCloseTo(686.6, 1);
    expect(y).toBeCloseTo(350, 5);
  });

  it("draws only the visible half of each dome meridian, inside the dome outline", () => {
    const paths = meridians(150, 12, 0);
    expect(paths).toHaveLength(12);
    const r = 150 * 1.2248;
    for (const d of paths) {
      for (const [, x, y] of d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g).map((m) => [m[0], +m[1], +m[2]])) {
        expect(Math.hypot(x - 600, y - 300)).toBeLessThanOrEqual(r + 0.5);
      }
    }
  });

  it("turns the dome as the phase advances and loops seamlessly", () => {
    expect(meridians(150, 12, 0.3)).not.toEqual(meridians(150, 12, 0));
    expect(meridians(150, 12, 1)).toEqual(meridians(150, 12, 0));
  });

  it("runs the dotted arc from the left horizon over the scene to the right", () => {
    const [a, top, b] = [arcAt(0), arcAt(0.5), arcAt(1)];
    expect(a[0]).toBeLessThan(top[0]);
    expect(top[0]).toBeLessThan(b[0]);
    expect(top[1]).toBeLessThan(a[1]);
    expect(a[1]).toBeCloseTo(b[1]);
  });

  it("moves wire dots in a straight line between two points", () => {
    expect(lerpAt([0, 0], [10, 20], 0.5)).toEqual([5, 10]);
  });
  it("draws the dome's slit only while it faces the viewer", () => {
    const front = slitBand(65, Math.PI / 4, 0.25, [600, 300]);
    const back = slitBand(65, Math.PI / 4 + Math.PI, 0.25, [600, 300]);
    expect(front.length).toBeGreaterThan(20);
    // Behind the dome only the part near the top is still in view.
    expect(back.length).toBeLessThan(front.length / 2);
  });

  it("turns the telescope around the dome: visible in front, hidden behind", () => {
    const front = scopePose(65, Math.PI / 4, [600, 300]);
    const back = scopePose(65, Math.PI / 4 + Math.PI, [600, 300]);
    expect(front.visible).toBeGreaterThan(0.5);
    expect(back.visible).toBe(0);
    // Gone well before it reaches the dome's edge, so it never shows behind it.
    expect(scopePose(65, Math.PI / 4 + Math.PI * 0.62, [600, 300]).visible).toBe(0);
    const left = scopePose(65, Math.PI * 0.75, [600, 300]);
    expect(left.x).toBeLessThan(front.x + 1);
  });
});
