import { useEffect, useRef } from "react";
import { floor } from "./illustrations/isoMatrix";
import { box, disc, domeOutline, extrude, meridians, ORBITS, orbitAt, orbitPath, parallels, project } from "../lib/isoScene";

/* Kargul-style footer scene, kept as quiet as theirs: one soft-gray
   palette, a wireframe dome on a hatched plinth over a fading grid, a few
   Velyx objects spaced around it (the V, a chat bubble, a phone, a
   browser with a chart, dashboard bars, a database, building blocks, a
   handled ring) and three dots gliding along two dotted arcs. While
   `playing`, one rAF loop turns the dome and moves the dots; CSS bobs the
   objects gently. Otherwise it is a still drawing. */
const R = 150;
const MERIDIANS = 12;
const DOME_PERIOD = 3200; // ms per meridian spacing
const DOTS = [
  { orbit: 0, period: 7000, offset: 0.2 },
  { orbit: 1, period: 9000, offset: 0.1 },
  { orbit: 1, period: 9000, offset: 0.6 },
];
// Dots fade in at the start of an arc and out at its end.
const fade = (t) => Math.sin(Math.PI * t).toFixed(2);

// The Velyx V lying flat and facing the viewer (letter x runs across the
// screen, letter up runs into the scene), its orange slash laid on top like the logo.
const K = Math.SQRT1_2;
const toWorld = ([a, b]) => [316 + (a - b) * K, 116 - (a + b) * K];
const V_LETTER = extrude([[0, 130], [34, 130], [70, 40], [106, 130], [140, 130], [88, 0], [52, 0]].map(toWorld), 0, 26);
const V_SLASH = extrude([[10, -14], [20, -14], [152, 150], [144, 150]].map(toWorld), 26, 5);

const PLINTH = [[-180, -180], [180, -180], [180, 180], [-180, 180]].map(([x, y]) => project(x, y, 0).join(" ")).join(" ");
const BARS = [[-50, 255, 40], [-20, 255, 64], [10, 255, 92]].map(([x, y, h]) => box(x, y, 0, 24, 24, h));
const CUBE = box(-270, -60, 46, 44, 44, 44);
const LEGO = [box(250, -260, 0, 64, 44, 22), box(262, -248, 22, 40, 32, 20)];
const STUDS = [[266, -244, 42], [286, -244, 42], [266, -228, 42], [286, -228, 42], [258, -256, 22], [300, -256, 22]].map(([x, y, z]) => disc(x, y, z + 5, 5));
const CYLINDERS = [[10, -270, 16, 42]].map(([x, y, r, h]) => ({ top: disc(x, y, h, r), base: disc(x, y, 0, r) }));
const DOME = { outline: domeOutline(R), rings: parallels(R, [18, 36, 54, 72]) };
const RING_AT = project(210, 200, 0);
const BUBBLE_AT = project(-320, 120, 34);
const PHONE_AT = project(-150, 380, 18);
const BROWSER_AT = project(120, -420, 24);
const ORBIT_PATHS = ORBITS.map(orbitPath);
const START = meridians(R, MERIDIANS, 0);

function Box({ b }) {
  return (
    <>
      <polygon points={b.left} className="fs-left" />
      <polygon points={b.right} className="fs-right" />
      <polygon points={b.top} className="fs-top" />
    </>
  );
}

function Cylinder({ c }) {
  const { top, base } = c;
  return (
    <>
      <path d={`M${top.cx - top.rx} ${top.cy}V${base.cy}A${base.rx} ${base.ry} 0 0 0 ${base.cx + base.rx} ${base.cy}V${top.cy}`} className="fs-left" />
      <ellipse cx={top.cx} cy={top.cy} rx={top.rx} ry={top.ry} className="fs-top" />
    </>
  );
}

/* A scene object: drifts with the cursor (--d), bobs gently, and casts a
   soft floor shadow that shrinks as it rises. shadow = [x, y, radius]. */
function Obj({ d = 1, delay = 0, shadow, children }) {
  const sh = shadow && disc(shadow[0], shadow[1], 0, shadow[2]);
  return (
    <g className="fobj" style={{ "--d": d }}>
      {sh && <ellipse cx={sh.cx.toFixed(1)} cy={sh.cy.toFixed(1)} rx={sh.rx.toFixed(1)} ry={sh.ry.toFixed(1)} fill="url(#fs-shadow-g)" className="fobj__shadow" style={{ animationDelay: `${delay}s` }} />}
      <g className="fobj__bob" style={{ animationDelay: `${delay}s` }}>{children}</g>
    </g>
  );
}

const TRAIL = [1, 2, 3];
const TRAIL_GAP = 0.014;
const dotAt = (dot, k) => {
  const [x, y] = orbitAt(ORBITS[dot.orbit], k);
  return `translate(${x.toFixed(1)} ${y.toFixed(1)})`;
};
const DOME_SHADOW = disc(0, 0, 0, R * 1.12);

export default function ClosingScene({ playing }) {
  const merRefs = useRef([]);
  const dotRefs = useRef([]);
  const trailRefs = useRef([]);
  const spotRef = useRef(null);
  const spotLayerRef = useRef(null);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const t0 = performance.now();
    const frame = (now) => {
      const t = now - t0;
      meridians(R, MERIDIANS, t / DOME_PERIOD).forEach((d, i) => merRefs.current[i]?.setAttribute("d", d));
      DOTS.forEach((dot, i) => {
        const k = (t / dot.period + dot.offset) % 1;
        const [x, y] = orbitAt(ORBITS[dot.orbit], k);
        dotRefs.current[i]?.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        dotRefs.current[i]?.setAttribute("opacity", fade(k));
        TRAIL.forEach((j) => {
          const kj = Math.max(k - j * TRAIL_GAP, 0);
          const el = trailRefs.current[i * TRAIL.length + j - 1];
          el?.setAttribute("transform", dotAt(dot, kj));
          el?.setAttribute("opacity", (fade(kj) * (0.5 - j * 0.12)).toFixed(2));
        });
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  /* The lattice darkens in a soft circle around the cursor. */
  const spot = (e) => {
    const m = e.currentTarget.getScreenCTM?.();
    if (!m || !spotRef.current) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    spotRef.current.setAttribute("cx", p.x.toFixed(0));
    spotRef.current.setAttribute("cy", p.y.toFixed(0));
    spotLayerRef.current?.classList.add("is-on");
  };
  const unspot = () => spotLayerRef.current?.classList.remove("is-on");

  return (
    <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none" onPointerMove={spot} onPointerLeave={unspot}>
      <defs>
        {/* Kargul's floor: small diamond cells, each line a groove with a lit edge. */}
        <pattern id="fs-grid" width="9" height="9" patternUnits="userSpaceOnUse">
          <path d="M9 0H0V9" className="fs-gridline" />
          <path d="M9 0.8H0.8V9" className="fs-gridlight" />
        </pattern>
        <pattern id="fs-grid-hot" width="9" height="9" patternUnits="userSpaceOnUse">
          <path d="M9 0H0V9" className="fs-gridline fs-gridline--hot" />
        </pattern>
        <radialGradient id="fs-spot-g">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="fs-spot-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="600">
          <circle ref={spotRef} cx="600" cy="420" r="170" fill="url(#fs-spot-g)" />
        </mask>
        <radialGradient id="fs-shadow-g">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fs-dome-g" cx="36%" cy="22%" r="85%">
          <stop offset="0" stopColor="#2e281f" />
          <stop offset="1" stopColor="#15120d" />
        </radialGradient>
        <pattern id="fs-vhatch" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M1 0v4" className="fs-hatch" />
        </pattern>
        <radialGradient id="fs-fade-g" cx="50%" cy="48%" r="58%">
          <stop offset="0.62" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="fs-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="600">
          <rect width="1200" height="600" fill="url(#fs-fade-g)" />
        </mask>
      </defs>

      <g mask="url(#fs-fade)">
        <g transform={floor(600, 300)}>
          <rect x="-1300" y="-1300" width="2600" height="2600" fill="url(#fs-grid)" />
        </g>
        <g ref={spotLayerRef} className="fs-spot" mask="url(#fs-spot-mask)">
          <g transform={floor(600, 300)}>
            <rect x="-1300" y="-1300" width="2600" height="2600" fill="url(#fs-grid-hot)" />
          </g>
        </g>
        <path d="M0 300H1200M0 314H1200" className="fs-horizon" />
      </g>

      <polygon points={PLINTH} fill="url(#fs-vhatch)" className="fs-plinth" />

      <Obj d={1.4} delay={-2} shadow={[-270, 149, 58]}>
        <g transform={floor(...BUBBLE_AT)}>
          <rect x="4" y="6" width="100" height="58" rx="14" className="fs-shadow" />
          <path d="M14 0h76a14 14 0 0 1 14 14v30a14 14 0 0 1-14 14H40l-16 14V58H14A14 14 0 0 1 0 44V14A14 14 0 0 1 14 0z" className="fs-top" />
          {[34, 52, 70].map((x) => <circle key={x} cx={x} cy="29" r="4" className="fs-ink" />)}
        </g>
      </Obj>

      <Obj d={1.8} delay={-1} shadow={[-248, -38, 34]}>
        <Box b={CUBE} />
      </Obj>

      <Obj d={1.5} delay={-2.6} shadow={[175, -382, 62]}>
        <g transform={floor(...BROWSER_AT)}>
          <rect x="4" y="6" width="110" height="76" rx="6" className="fs-shadow" />
          <rect width="110" height="76" rx="6" className="fs-top" />
          <path d="M0 12h110" className="fs-line" />
          {[6, 11, 16].map((cx) => <circle key={cx} cx={cx} cy="6" r="1.6" className="fs-line" />)}
          <path d="M10 60c12-2 16-16 28-16s14 10 26 6 16-24 36-26" className="fs-line" />
          {[16, 30, 44].map((x, i) => <rect key={x} x={x} y={66 - (i + 1) * 4} width="8" height={(i + 1) * 4} className="fs-left" />)}
        </g>
      </Obj>

      <Obj d={1.2} delay={-3.4} shadow={[-126, 424, 46]}>
        <g transform={floor(...PHONE_AT)}>
          <rect x="4" y="6" width="48" height="88" rx="10" className="fs-shadow" />
          <rect width="48" height="88" rx="10" className="fs-top" />
          <rect x="17" y="5" width="14" height="3" rx="1.5" className="fs-left" />
          <path d="M9 22h30M9 30h20M9 44h30M9 52h24" className="fs-line" />
          <rect x="9" y="66" width="30" height="10" rx="5" className="fs-left" />
        </g>
      </Obj>

      {CYLINDERS.map((c, i) => (
        <Obj key={i} d={1.2} delay={-i * 1.4} shadow={[10, -270, 26]}>
          <Cylinder c={c} />
        </Obj>
      ))}

      <ellipse cx={DOME_SHADOW.cx.toFixed(1)} cy={DOME_SHADOW.cy.toFixed(1)} rx={DOME_SHADOW.rx.toFixed(1)} ry={DOME_SHADOW.ry.toFixed(1)} fill="url(#fs-shadow-g)" />
      <g className="dome">
        <path d={DOME.outline} className="fs-dome" />
        {DOME.rings.map((d, i) => <path key={i} d={d} className="fs-domeline" />)}
        {START.map((d, i) => <path key={i} ref={(el) => { merRefs.current[i] = el; }} d={d} className="fs-domeline" />)}
      </g>

      {ORBIT_PATHS.map((d, i) => <path key={i} d={d} className="orbit" />)}

      <Obj d={0.8} delay={-3}>
        {BARS.map((b, i) => <Box key={i} b={b} />)}
        <path d="M352 352c18-30 50-26 74-48" className="fs-dash" />
        <circle cx="426" cy="304" r="3" className="fs-ink" />
      </Obj>

      <Obj d={1.6} delay={-0.5}>
        {LEGO.map((b, i) => <Box key={i} b={b} />)}
        {STUDS.map((s, i) => <ellipse key={i} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} className="fs-top" />)}
      </Obj>

      <Obj d={1.1} delay={-1.8}>
        <g transform={floor(RING_AT[0], RING_AT[1] + 10)}>
          <path d="M46 0A46 46 0 1 1 0 -46V-26A26 26 0 1 0 26 0Z" className="fs-right" />
        </g>
        <g transform={floor(...RING_AT)}>
          <rect x="-62" y="-62" width="124" height="124" className="fs-dash" />
          {[[-62, -62], [62, -62], [62, 62], [-62, 62], [0, -62], [62, 0], [0, 62], [-62, 0]].map(([x, y]) => (
            <rect key={`${x}${y}`} x={x - 4} y={y - 4} width="8" height="8" className="fs-handle" />
          ))}
          <path d="M46 0A46 46 0 1 1 0 -46V-26A26 26 0 1 0 26 0Z" className="fs-top" />
        </g>
      </Obj>

      <Obj d={1.3}>
        {V_LETTER.sides.map((s, i) => <polygon key={i} points={s.d} className={`fs-${s.shade}`} />)}
        <polygon points={V_LETTER.top} className="fs-top" />
        {V_SLASH.sides.map((s, i) => <polygon key={i} points={s.d} className={`fs-brand-${s.shade}`} />)}
        <polygon points={V_SLASH.top} className="fs-brand-top" />
      </Obj>

      {DOTS.flatMap((dot, i) => TRAIL.map((j) => {
        const kj = Math.max(dot.offset - j * TRAIL_GAP, 0);
        return (
          <g key={`${i}-${j}`} ref={(el) => { trailRefs.current[i * TRAIL.length + j - 1] = el; }} transform={dotAt(dot, kj)} opacity={(fade(kj) * (0.5 - j * 0.12)).toFixed(2)}>
            <ellipse rx={5 - j} ry={3.4 - j * 0.7} className="orbit-trail" />
          </g>
        );
      }))}
      {DOTS.map((dot, i) => {
        const [x, y] = orbitAt(ORBITS[dot.orbit], dot.offset);
        return (
          <g key={i} ref={(el) => { dotRefs.current[i] = el; }} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`} opacity={fade(dot.offset)}>
            <ellipse rx="5" ry="3.4" className="orbit-dot" />
          </g>
        );
      })}
    </svg>
  );
}
