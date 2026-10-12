/* Isometric geometry for the footer scene (Altair's observatory). World units: x runs down-right,
   y down-left, z straight up; the origin sits at the centre of the
   1200×600 scene. A sphere of radius R projects to a circle of radius
   R·√1.5, so the dome outline is exact. */
export const CX = 600;
export const CY = 300;
const S = Math.sqrt(1.5);
const f = (n) => n.toFixed(1);

/* `o` moves the world origin to another point of the scene, so a small
   object can be drawn around its own footprint. */
export function project(x, y, z, o = [CX, CY]) {
  return [o[0] + (x - y) * 0.866, o[1] + (x + y) * 0.5 - z];
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

/* Altair's dotted arc: part of a large circle through both ends of the
   horizon and the top of the scene. t runs 0..1 left to right. */
export const HORIZON_Y = 248;
const ARC = { x0: 70, x1: 1130, top: 67 };
const ARC_C = (() => {
  const half = (ARC.x1 - ARC.x0) / 2;
  const cy = (half * half + HORIZON_Y * HORIZON_Y - ARC.top * ARC.top) / (2 * (HORIZON_Y - ARC.top));
  return { cx: ARC.x0 + half, cy, r: cy - ARC.top };
})();
const A0 = Math.atan2(HORIZON_Y - ARC_C.cy, ARC.x0 - ARC_C.cx);
const A1 = Math.atan2(HORIZON_Y - ARC_C.cy, ARC.x1 - ARC_C.cx);
export const ARC_D = `M${ARC.x0} ${HORIZON_Y}A${ARC_C.r.toFixed(1)} ${ARC_C.r.toFixed(1)} 0 0 1 ${ARC.x1} ${HORIZON_Y}`;

export function arcAt(t) {
  const a = A0 + (A1 - A0) * t;
  return [ARC_C.cx + ARC_C.r * Math.cos(a), ARC_C.cy + ARC_C.r * Math.sin(a)];
}

/* A point t of the way from a to b (wire dots). */
export function lerpAt(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/* The dome's slit at azimuth th (width w, radians): the band between two
   meridians from the equator to near the top, keeping only what faces the
   viewer, so it slides out of sight as the turret turns away. */
export function slitBand(R, th, w, o) {
  const top = (80 * Math.PI) / 180;
  const side = (a) => {
    const pts = [];
    for (let k = 0; k <= 18; k++) {
      const e = (k / 18) * top;
      const p3 = [R * Math.cos(e) * Math.cos(a), R * Math.cos(e) * Math.sin(a), R * Math.sin(e)];
      if (visible(p3)) pts.push(project(...p3, o));
    }
    return pts;
  };
  const a = side(th - w / 2);
  const b = side(th + w / 2).reverse();
  if (a.length < 2 || b.length < 2) return "";
  return [...a, ...b].map(([x, y], i) => `${i ? "L" : "M"}${f(x)} ${f(y)}`).join("") + "Z";
}

/* Where the telescope sits on the turning dome (azimuth th): its base on
   screen, the screen angle it points along, its foreshortened length and
   how much of it faces the viewer (0 when it is round the back). */
export function scopePose(R, th, o, e = (40 * Math.PI) / 180) {
  const n = [Math.cos(e) * Math.cos(th), Math.cos(e) * Math.sin(th), Math.sin(e)];
  const [x, y] = project(R * n[0], R * n[1], R * n[2], o);
  const dx = (n[0] - n[1]) * 0.866;
  const dy = (n[0] + n[1]) * 0.5 - n[2];
  const facing = (n[0] + n[1] + n[2]) / Math.sqrt(3);
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI, length: Math.hypot(dx, dy), visible: Math.min(1, Math.max(0, (facing - 0.3) / 0.25)) };
}

/* Box faces visible from the viewer: top, +x side and +y side. */
export function box(x, y, z, w, d, h, o) {
  const P = (a, b, c) => project(a, b, c, o).map(f).join(" ");
  const poly = (...pts) => pts.join(" ");
  return {
    top: poly(P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)),
    right: poly(P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)),
    left: poly(P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)),
  };
}

/* Ellipse of a flat circle of radius r centred at (x, y, z). */
export function disc(x, y, z, r, o) {
  const [cx, cy] = project(x, y, z, o);
  return { cx, cy, rx: r * 1.2247, ry: r * 0.7071 };
}
