import { describe, it, expect } from "vitest";
import { project, meridians, orbitAt, ORBITS } from "../lib/isoScene";

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

  it("moves dots along each orbit and returns to the start", () => {
    for (const o of ORBITS) {
      expect(orbitAt(o, 0.25)).not.toEqual(orbitAt(o, 0));
      const [a, b] = [orbitAt(o, 0), orbitAt(o, 1)];
      expect(a[0]).toBeCloseTo(b[0], 5);
      expect(a[1]).toBeCloseTo(b[1], 5);
    }
  });
});
