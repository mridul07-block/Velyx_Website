import { describe, it, expect } from "vitest";
import { project, sphereMeridians, polyline, ORBITS, orbitAt } from "../lib/isoScene";

const pairs = (d) => [...d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map((m) => [+m[1], +m[2]]);

describe("isoScene geometry", () => {
  it("projects the world origin to the scene centre and z straight up", () => {
    expect(project(0, 0, 0)).toEqual([600, 300]);
    expect(project(0, 0, 50)).toEqual([600, 250]);
    const [x, y] = project(100, 0, 0);
    expect(x).toBeCloseTo(686.6, 1);
    expect(y).toBeCloseTo(350, 5);
  });

  it("draws a floating sphere's meridians inside its outline", () => {
    const c = [0, 0, 130];
    const [sx, sy] = project(...c);
    const paths = sphereMeridians(c, 100, 10, 0);
    expect(paths).toHaveLength(10);
    for (const d of paths) for (const [x, y] of pairs(d)) expect(Math.hypot(x - sx, y - sy)).toBeLessThanOrEqual(100 * 1.2248 + 0.5);
  });

  it("turns the sphere with the phase and loops seamlessly", () => {
    const c = [0, 0, 130];
    expect(sphereMeridians(c, 100, 10, 0.3)).not.toEqual(sphereMeridians(c, 100, 10, 0));
    expect(sphereMeridians(c, 100, 10, 1)).toEqual(sphereMeridians(c, 100, 10, 0));
  });

  it("walks a packet along a trace from its start to its end", () => {
    const line = polyline([[0, 0, 0], [100, 0, 0], [100, -80, 0]]);
    expect(line.at(0)).toEqual(project(0, 0, 0));
    const [ex, ey] = line.at(1);
    const [px, py] = project(100, -80, 0);
    expect(ex).toBeCloseTo(px, 5);
    expect(ey).toBeCloseTo(py, 5);
    const [mx, my] = line.at(100 / 180);
    const [cx, cy] = project(100, 0, 0);
    expect(mx).toBeCloseTo(cx, 5);
    expect(my).toBeCloseTo(cy, 5);
    expect(line.d.startsWith("M600.0 300.0")).toBe(true);
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
