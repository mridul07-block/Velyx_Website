/* Isometric geometry for the footer scene. World units: x runs down-right,
   y down-left, z straight up; the origin sits at the centre of the
   1200×600 scene. A sphere of radius R projects to a circle of radius
   R·√1.5 (SPHERE_SCALE), so outlines are exact. */
export const CX = 600;
export const CY = 300;
export const SPHERE_SCALE = Math.sqrt(1.5);
const f = (n) => n.toFixed(1);

export function project(x, y, z) {
  return [CX + (x - y) * 0.866, CY + (x + y) * 0.5 - z];
}

/* Draws the parts of a 3D polyline that face the viewer at (1,1,1) as seen
   from `c` (a sphere's centre) as one SVG path string. */
function visiblePath(points, c = [0, 0, 0]) {
  let d = "";
  let pen = false;
  for (const p of points) {
    if (p[0] - c[0] + p[1] - c[1] + p[2] - c[2] < -1e-9) { pen = false; continue; }
    const [x, y] = project(...p);
    d += `${pen ? "L" : "M"}${f(x)} ${f(y)}`;
    pen = true;
  }
  return d;
}

const onSphere = (c, R, e, th) => [c[0] + R * Math.cos(e) * Math.cos(th), c[1] + R * Math.cos(e) * Math.sin(th), c[2] + R * Math.sin(e)];

/* n pole-to-pole meridians of a sphere centred at c; phase in [0,1) turns it
   by one meridian spacing, so phase 1 draws the same picture as phase 0. */
export function sphereMeridians(c, R, n, phase) {
  const shift = ((phase % 1) + 1) % 1;
  return Array.from({ length: n }, (_, i) => {
    const th = ((i + shift) / n) * Math.PI * 2;
    const pts = [];
    for (let k = 0; k <= 36; k++) pts.push(onSphere(c, R, -Math.PI / 2 + (k / 36) * Math.PI, th));
    return visiblePath(pts, c);
  });
}

/* Latitude rings (visible parts) at the given elevations in degrees. */
export function sphereParallels(c, R, degrees) {
  return degrees.map((deg) => {
    const pts = [];
    for (let k = 0; k <= 72; k++) pts.push(onSphere(c, R, (deg * Math.PI) / 180, (k / 72) * Math.PI * 2));
    return visiblePath(pts, c);
  });
}

/* A trace through world points: its SVG path and the screen point a given
   fraction of the way along it (by world length). */
export function polyline(points) {
  const lens = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1], p[2] - points[i][2]));
  const total = lens.reduce((a, b) => a + b, 0);
  const d = points.map((p, i) => `${i ? "L" : "M"}${project(...p).map(f).join(" ")}`).join("");
  const at = (t) => {
    let left = Math.min(Math.max(t, 0), 1) * total;
    for (let i = 0; i < lens.length; i++) {
      if (left <= lens[i] || i === lens.length - 1) {
        const k = lens[i] ? Math.min(left / lens[i], 1) : 0;
        const [a, b] = [points[i], points[i + 1]];
        return project(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k);
      }
      left -= lens[i];
    }
    return project(...points[0]);
  };
  return { d, at };
}

/* Orbits around the AI core: a level ring and a tilted ring. */
export const CORE = [0, 0, 130];
export const ORBITS = [
  { id: "ring", r: 190, tilt: 0 },
  { id: "tilted", r: 165, tilt: 1 },
];

function orbitPoint3({ r, tilt }, t) {
  const a = t * Math.PI * 2;
  if (!tilt) return [CORE[0] + r * Math.cos(a), CORE[1] + r * Math.sin(a), CORE[2]];
  const u = [Math.SQRT1_2, -Math.SQRT1_2, 0];
  const lean = 0.42;
  const v = [lean * Math.SQRT1_2, lean * Math.SQRT1_2, Math.sqrt(1 - lean * lean)];
  return [0, 1, 2].map((i) => CORE[i] + r * (Math.cos(a) * u[i] + Math.sin(a) * v[i]));
}

export function orbitAt(orbit, t) {
  return project(...orbitPoint3(orbit, t));
}

/* True while a point on the orbit is behind the core. */
export function orbitBehind(orbit, t) {
  const p = orbitPoint3(orbit, t);
  return p[0] - CORE[0] + p[1] - CORE[1] + p[2] - CORE[2] < 0;
}

export function orbitPath(orbit) {
  const pts = [];
  for (let k = 0; k <= 120; k++) pts.push(orbitPoint3(orbit, k / 120));
  return pts.map((p, i) => `${i ? "L" : "M"}${project(...p).map(f).join(" ")}`).join("");
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
