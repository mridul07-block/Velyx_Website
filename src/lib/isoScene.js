/* Isometric geometry for the footer scene. World units: x runs down-right,
   y down-left, z straight up; the origin sits at the centre of the
   1200×600 scene. A sphere of radius R projects to a circle of radius
   R·√1.5, so the dome outline is exact. */
export const CX = 600;
export const CY = 300;
const S = Math.sqrt(1.5);
const f = (n) => n.toFixed(1);

export function project(x, y, z) {
  return [CX + (x - y) * 0.866, CY + (x + y) * 0.5 - z];
}

const visible = ([x, y, z]) => x + y + z >= -1e-9; // faces the viewer at (1,1,1)

/* Draws the visible runs of a 3D polyline as one SVG path string. */
function visiblePath(points) {
  let d = "";
  let pen = false;
  for (const p of points) {
    if (!visible(p)) { pen = false; continue; }
    const [x, y] = project(...p);
    d += `${pen ? "L" : "M"}${f(x)} ${f(y)}`;
    pen = true;
  }
  return d;
}

/* n meridians from the pole to the equator; phase in [0,1) turns the dome
   by one meridian spacing, so phase 1 is the same picture as phase 0. */
export function meridians(R, n, phase) {
  const shift = ((phase % 1) + 1) % 1;
  return Array.from({ length: n }, (_, i) => {
    const th = ((i + shift) / n) * Math.PI * 2;
    const pts = [];
    for (let k = 0; k <= 24; k++) {
      const e = (k / 24) * (Math.PI / 2);
      pts.push([R * Math.cos(e) * Math.cos(th), R * Math.cos(e) * Math.sin(th), R * Math.sin(e)]);
    }
    return visiblePath(pts);
  });
}

/* Latitude rings (visible parts) at the given elevations in degrees. */
export function parallels(R, degrees) {
  return degrees.map((deg) => {
    const e = (deg * Math.PI) / 180;
    const pts = [];
    for (let k = 0; k <= 72; k++) {
      const th = (k / 72) * Math.PI * 2;
      pts.push([R * Math.cos(e) * Math.cos(th), R * Math.cos(e) * Math.sin(th), R * Math.sin(e)]);
    }
    return visiblePath(pts);
  });
}

/* The dome's outline: the silhouette's upper arc plus the front equator. */
export function domeOutline(R) {
  const r = R * S;
  const front = [];
  for (let k = 0; k <= 48; k++) {
    const th = -Math.PI / 4 + (k / 48) * Math.PI;
    front.push(project(R * Math.cos(th), R * Math.sin(th), 0));
  }
  return `M${f(CX - r)} ${f(CY)}A${f(r)} ${f(r)} 0 0 1 ${f(CX + r)} ${f(CY)}` + front.map(([x, y]) => `L${f(x)} ${f(y)}`).join("") + "Z";
}

/* Kargul's two dotted arcs, both running left to right over the dome: a
   tall arch leaning toward us and the back half of a ring around it. */
export const ORBITS = [
  { id: "arch", r: 250, z: 0, tilt: 1, from: Math.PI, to: 0 },
  { id: "ring", r: 235, z: 64, tilt: 0, from: (3 * Math.PI) / 4, to: (7 * Math.PI) / 4 },
];

function orbitPoint3({ r, z, tilt, from, to }, t) {
  const a = from + t * (to - from);
  if (!tilt) return [r * Math.cos(a), r * Math.sin(a), z];
  const u = [Math.SQRT1_2, -Math.SQRT1_2, 0];
  const lean = 0.35;
  const v = [lean * Math.SQRT1_2, lean * Math.SQRT1_2, Math.sqrt(1 - lean * lean)];
  return [0, 1, 2].map((i) => r * (Math.cos(a) * u[i] + Math.sin(a) * v[i]) + (i === 2 ? z : 0));
}

export function orbitAt(orbit, t) {
  return project(...orbitPoint3(orbit, t));
}

export function orbitPath(orbit) {
  const pts = [];
  for (let k = 0; k <= 80; k++) pts.push(project(...orbitPoint3(orbit, k / 80)));
  return pts.map(([x, y], i) => `${i ? "L" : "M"}${f(x)} ${f(y)}`).join("");
}

/* Box faces visible from the viewer: top, +x side and +y side. */
export function box(x, y, z, w, d, h) {
  const P = (a, b, c) => project(a, b, c).map(f).join(" ");
  const poly = (...pts) => pts.join(" ");
  return {
    top: poly(P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)),
    right: poly(P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)),
    left: poly(P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)),
  };
}

/* A flat polygon (world x/y points) extruded upward by h: visible side
   faces ordered far to near, then the top face. */
export function extrude(points, z, h) {
  const n = points.length;
  // Winding decides which side of each edge is outside (works for concave shapes).
  let area = 0;
  for (let i = 0; i < n; i++) {
    const [ax, ay] = points[i];
    const [bx, by] = points[(i + 1) % n];
    area += ax * by - bx * ay;
  }
  const sign = area > 0 ? 1 : -1;
  const sides = [];
  for (let i = 0; i < n; i++) {
    const [ax, ay] = points[i];
    const [bx, by] = points[(i + 1) % n];
    const nx = sign * (by - ay);
    const ny = sign * -(bx - ax);
    if (nx + ny <= 0) continue; // faces away from the viewer
    const pts = [project(ax, ay, z), project(bx, by, z), project(bx, by, z + h), project(ax, ay, z + h)];
    sides.push({ depth: (ax + bx) / 2 + (ay + by) / 2, shade: nx > ny ? "right" : "left", d: pts.map((p) => p.map(f).join(" ")).join(" ") });
  }
  sides.sort((a, b) => a.depth - b.depth);
  const top = points.map(([px, py]) => project(px, py, z + h).map(f).join(" ")).join(" ");
  return { sides, top };
}

/* Ellipse of a flat circle of radius r centred at (x, y, z). */
export function disc(x, y, z, r) {
  const [cx, cy] = project(x, y, z);
  return { cx, cy, rx: r * 1.2247, ry: r * 0.7071 };
}
