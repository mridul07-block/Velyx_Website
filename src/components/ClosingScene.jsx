import { useEffect, useRef } from "react";
import { floor } from "./illustrations/isoMatrix";
import { ARC_D, HORIZON_Y, arcAt, box, disc, domeOutline, lerpAt, meridians, parallels, project, sphereAt } from "../lib/isoScene";

/* Altair-style footer scene: an observatory (hatched stepped plinth, a
   drum, a turning wireframe dome with its slit and telescope) on a fading
   lattice, with isometric objects around it. Four sit in dashed selection
   frames wired back to the plinth, dots flowing along the wires. One dotted
   arc carries a comet of dots; a dotted horizon carries a few more. While
   `playing`, one rAF loop turns the dome and moves every dot; CSS sweeps the
   telescope and flows the wires. Otherwise it is a still drawing. */
const O = [600, 388]; // plinth centre on the floor
const R = 65; // dome radius
const MERIDIANS = 22;
const DOME_PERIOD = 2600; // ms per meridian spacing
const PLINTH = { b: 138, t: 94, h: 24 }; // bottom / top half-sides, height
const PLATFORM = { half: 78, z: PLINTH.h, h: 8 };
const DRUM = { r: 60, z: PLATFORM.z + PLATFORM.h, h: 44 };
const DOME_Z = DRUM.z + DRUM.h;
const DOME_SHIFT = O[1] - DOME_Z - 300; // meridians are drawn around (600, 300)

const P = (x, y, z, o = O) => project(x, y, z, o).map((v) => v.toFixed(1)).join(" ");
const poly = (...pts) => pts.join(" ");

// The plinth: a square frustum, its two visible sides; the right one hatched.
const { b: PB, t: PT, h: PH } = PLINTH;
const PLINTH_RIGHT = poly(P(PB, -PB, 0), P(PB, PB, 0), P(PT, PT, PH), P(PT, -PT, PH));
const PLINTH_LEFT = poly(P(-PB, PB, 0), P(PB, PB, 0), P(PT, PT, PH), P(-PT, PT, PH));
const PLINTH_FLOOR = poly(P(-PB, -PB, 0), P(PB, -PB, 0), P(PB, PB, 0), P(-PB, PB, 0));

// The dome's slit: the band between two meridians on the front-right.
const SLIT = (() => {
  const o = [600, 300 + DOME_SHIFT + 0];
  const band = [];
  for (let k = 0; k <= 16; k++) band.push(sphereAt(R + 0.5, (k / 16) * (Math.PI / 2), -0.42, [o[0], o[1]]));
  for (let k = 16; k >= 0; k--) band.push(sphereAt(R + 0.5, (k / 16) * (Math.PI / 2), -0.16, [o[0], o[1]]));
  return band.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + "Z";
})();
const SCOPE_AT = sphereAt(R, 0.66, -0.29, [600, 300 + DOME_SHIFT]);

// Wires from the plinth to the four framed objects (Altair's dotted links).
const WIRES = [
  [[499, 321], [436, 281]],
  [[445, 424], [330, 452]],
  [[732, 336], [816, 304]],
  [[711, 443], [855, 508]],
];

// The comet on the arc and the dots on the horizon.
const ARC_DOTS = [
  { period: 11000, offset: 0.3 },
  { period: 11000, offset: 0.36 },
  { period: 11000, offset: 0.42 },
];
const HZ_DOTS = [
  { period: 16000, offset: 0.12, dark: true },
  { period: 16000, offset: 0.62 },
  { period: 16000, offset: 0.72 },
  { period: 16000, offset: 0.78 },
];
const HZ = [70, 1130];
const fade = (t) => Math.sin(Math.PI * t).toFixed(2);
const TRAIL = [1, 2, 3];
const TRAIL_GAP = 0.012;

function Box({ b, hatch = true }) {
  return (
    <>
      <polygon points={b.left} className="fs-left" />
      <polygon points={b.right} className="fs-right" />
      {hatch && <polygon points={b.right} fill="url(#fs-vhatch)" />}
      <polygon points={b.top} className="fs-top" />
    </>
  );
}

/* An upright cylinder (or a frustum when r2 differs) standing at z. */
function Cylinder({ o, r, h, z = 0, r2 = r, hatch = false }) {
  const base = disc(0, 0, z, r, o);
  const top = disc(0, 0, z + h, r2, o);
  const d = `M${base.cx - base.rx} ${base.cy}A${base.rx} ${base.ry} 0 0 0 ${base.cx + base.rx} ${base.cy}L${top.cx + top.rx} ${top.cy}A${top.rx} ${top.ry} 0 0 1 ${top.cx - top.rx} ${top.cy}Z`;
  return (
    <>
      <path d={d} className="fs-left" />
      {hatch && <path d={d} fill="url(#fs-vhatch-soft)" />}
      <ellipse cx={top.cx} cy={top.cy} rx={top.rx} ry={top.ry} className="fs-top" />
    </>
  );
}

/* A soft floor shadow, offset to the right as if lit from the left. */
function Shadow({ o, r, k = 1 }) {
  const s = disc(r * 0.35, r * 0.1, 0, r * 1.15 * k, o);
  return <ellipse cx={s.cx.toFixed(1)} cy={s.cy.toFixed(1)} rx={s.rx.toFixed(1)} ry={s.ry.toFixed(1)} fill="url(#fs-shadow-g)" className="fobj__shadow" />;
}

/* Altair's selection frame: a dashed square on the floor, handles on its corners. */
function Frame({ o, half }) {
  const corners = [[-half, -half], [half, -half], [half, half], [-half, half]].map(([x, y]) => project(x, y, 0, o));
  return (
    <g className="fsel">
      <polygon points={corners.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" ")} className="fs-dash" />
      {corners.map(([x, y], i) => <rect key={i} x={(x - 5).toFixed(1)} y={(y - 3).toFixed(1)} width="10" height="6" rx="1" className="fs-handle" />)}
    </g>
  );
}

/* A scene object: drifts with the cursor (--d), optionally bobs. */
function Obj({ d = 1, bob = false, delay = 0, children }) {
  return (
    <g className="fobj" style={{ "--d": d }}>
      <g className={bob ? "fobj__bob" : undefined} style={bob ? { animationDelay: `${delay}s` } : undefined}>{children}</g>
    </g>
  );
}

const CUBE_O = [425, 101];
const CUBE = box(-14, -14, 0, 28, 28, 28, CUBE_O);
const CYL_A = [204, 212];
const CYL_B = [196, 246];
const BARS_O = [249, 302];
const BARS = [[-34, 18], [-10, 30], [14, 46]].map(([x, h]) => box(x, -9, 0, 20, 18, h, BARS_O));
const DB_O = [394, 253];
const BASE_O = [275, 463];
const BASE = [box(-30, -30, 0, 60, 60, 22, BASE_O), box(-22, -18, 22, 30, 30, 42, BASE_O)];
const PLATES_O = [869, 280];
const LEGO_O = [1099, 392];
const LEGO = box(-23, -23, 0, 46, 46, 22, LEGO_O);
const STUDS = [[-11, -11], [11, -11], [-11, 11], [11, 11]];
const CYL_R = [1139, 487];
const LIGHT_O = [900, 527];
const DOME = { outline: domeOutline(R), rings: parallels(R, [15, 30, 45, 60, 75]) };
const START = meridians(R, MERIDIANS, 0);

export default function ClosingScene({ playing }) {
  const merRefs = useRef([]);
  const arcRefs = useRef([]);
  const trailRefs = useRef([]);
  const hzRefs = useRef([]);
  const wireRefs = useRef([]);
  const spotRef = useRef(null);
  const spotLayerRef = useRef(null);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const t0 = performance.now();
    const frame = (now) => {
      const t = now - t0;
      meridians(R, MERIDIANS, t / DOME_PERIOD).forEach((d, i) => merRefs.current[i]?.setAttribute("d", d));
      ARC_DOTS.forEach((dot, i) => {
        const k = (t / dot.period + dot.offset) % 1;
        const [x, y] = arcAt(k);
        arcRefs.current[i]?.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        arcRefs.current[i]?.setAttribute("opacity", fade(k));
        TRAIL.forEach((j) => {
          const kj = Math.max(k - j * TRAIL_GAP, 0);
          const [tx, ty] = arcAt(kj);
          const el = trailRefs.current[i * TRAIL.length + j - 1];
          el?.setAttribute("transform", `translate(${tx.toFixed(1)} ${ty.toFixed(1)})`);
          el?.setAttribute("opacity", (fade(kj) * (0.45 - j * 0.12)).toFixed(2));
        });
      });
      HZ_DOTS.forEach((dot, i) => {
        const k = (t / dot.period + dot.offset) % 1;
        hzRefs.current[i]?.setAttribute("transform", `translate(${(HZ[0] + (HZ[1] - HZ[0]) * k).toFixed(1)} ${HORIZON_Y})`);
        hzRefs.current[i]?.setAttribute("opacity", fade(k));
      });
      WIRES.forEach(([a, b], i) => {
        const k = ((t / 3200 + i * 0.25) % 1);
        const [x, y] = lerpAt(a, b, k);
        wireRefs.current[i]?.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        wireRefs.current[i]?.setAttribute("opacity", fade(k));
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
        {/* The floor: small diamond cells, each line a groove with a lit edge. */}
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
          <stop offset="0" stopColor="#000" stopOpacity="0.12" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fs-dome-g" cx="36%" cy="22%" r="85%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ececec" />
        </radialGradient>
        <pattern id="fs-vhatch" width="3" height="3" patternUnits="userSpaceOnUse">
          <path d="M0.5 0v3" className="fs-hatch" />
        </pattern>
        <pattern id="fs-vhatch-soft" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M0.5 0v4" className="fs-hatch fs-hatch--soft" />
        </pattern>
        <radialGradient id="fs-fade-g" gradientUnits="userSpaceOnUse" cx="600" cy="380" r="520" fy="360">
          <stop offset="0.45" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fs-hz-g" gradientUnits="userSpaceOnUse" x1="0" y1={HORIZON_Y} x2="0" y2="600">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.3" stopColor="#fff" />
          <stop offset="0.7" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="fs-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="600">
          <rect width="1200" height="600" fill="url(#fs-fade-g)" />
        </mask>
        <mask id="fs-floor" maskUnits="userSpaceOnUse" x="0" y={HORIZON_Y} width="1200" height={600 - HORIZON_Y}>
          <rect y={HORIZON_Y} width="1200" height={600 - HORIZON_Y} fill="url(#fs-hz-g)" />
        </mask>
        <linearGradient id="fs-line-g" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.12" stopColor="#fff" />
          <stop offset="0.88" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="fs-hz-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="600">
          <rect x="0" y={HORIZON_Y - 8} width="1200" height="16" fill="url(#fs-line-g)" />
        </mask>
      </defs>

      {/* Floor, horizon and the dotted arc */}
      <g mask="url(#fs-fade)">
        <g mask="url(#fs-floor)">
          <g transform={floor(...O)}>
            <rect x="-1300" y="-1300" width="2600" height="2600" fill="url(#fs-grid)" />
          </g>
          <g ref={spotLayerRef} className="fs-spot" mask="url(#fs-spot-mask)">
            <g transform={floor(...O)}>
              <rect x="-1300" y="-1300" width="2600" height="2600" fill="url(#fs-grid-hot)" />
            </g>
          </g>
        </g>
      </g>
      <path d={`M0 ${HORIZON_Y}H1200`} className="fs-horizon" mask="url(#fs-hz-fade)" />
      <path d={ARC_D} className="orbit" />

      {/* Back objects */}
      <Obj d={1.6}>
        <Shadow o={CYL_A} r={11} />
        <Cylinder o={CYL_A} r={10} h={46} hatch />
        <Shadow o={CYL_B} r={12} />
        <Cylinder o={CYL_B} r={11} h={30} hatch />
      </Obj>
      <Obj d={1.8} bob delay={-1}>
        <Box b={CUBE} />
      </Obj>
      <Obj d={1.4}>
        <Shadow o={BARS_O} r={30} />
        {BARS.map((b, i) => <Box key={i} b={b} />)}
      </Obj>

      {/* Wires from the plinth to the framed objects */}
      {WIRES.map(([a, b], i) => <path key={i} d={`M${a}L${b}`} className="fwire" />)}

      <Obj d={1.2}>
        <Frame o={DB_O} half={38} />
        <Shadow o={DB_O} r={26} />
        {[0, 18, 36].map((z) => <Cylinder key={z} o={DB_O} r={24} h={16} z={z} />)}
      </Obj>

      <Obj d={1.2}>
        <Frame o={PLATES_O} half={42} />
        <Shadow o={PLATES_O} r={34} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} className={i ? "fobj__bob" : undefined} style={{ animationDelay: `${-i * 0.5}s` }}>
            <g transform={floor(PLATES_O[0], PLATES_O[1] - i * 17 - 4)}>
              <rect x="-26" y="-26" width="52" height="52" rx="7" className="fs-left" />
            </g>
            <g transform={floor(PLATES_O[0], PLATES_O[1] - i * 17 - 10)}>
              <rect x="-26" y="-26" width="52" height="52" rx="7" className="fs-top" />
            </g>
          </g>
        ))}
      </Obj>

      {/* The observatory */}
      <ellipse cx={O[0] + 40} cy={O[1] + 18} rx="260" ry="120" fill="url(#fs-shadow-g)" />
      <polygon points={PLINTH_FLOOR} className="fs-top" />
      <polygon points={PLINTH_LEFT} className="fs-plinth-side" />
      <polygon points={PLINTH_RIGHT} className="fs-plinth-side is-hatched" />
      <polygon points={PLINTH_RIGHT} fill="url(#fs-vhatch)" />
      <g transform={floor(O[0], O[1] - PH)}>
        <rect x={-PT} y={-PT} width={PT * 2} height={PT * 2} rx="14" className="fs-top" />
      </g>
      <g transform={floor(O[0], O[1] - PLATFORM.z)}>
        <rect x={-PLATFORM.half} y={-PLATFORM.half} width={PLATFORM.half * 2} height={PLATFORM.half * 2} rx="16" className="fs-left" />
      </g>
      <g transform={floor(O[0], O[1] - PLATFORM.z - PLATFORM.h)}>
        <rect x={-PLATFORM.half} y={-PLATFORM.half} width={PLATFORM.half * 2} height={PLATFORM.half * 2} rx="16" className="fs-top" />
      </g>
      <g className="obs-drum">
        <Cylinder o={O} r={DRUM.r} h={DRUM.h} z={DRUM.z} />
      </g>
      {(() => {
        const lip = disc(0, 0, DOME_Z, R + 2, O);
        return <ellipse cx={lip.cx} cy={lip.cy} rx={lip.rx} ry={lip.ry} className="fs-top" />;
      })()}
      <g className="dome" transform={`translate(0 ${DOME_SHIFT})`}>
        <path d={DOME.outline} className="fs-dome" />
        {DOME.rings.map((d, i) => <path key={i} d={d} className="fs-domeline" />)}
        {START.map((d, i) => <path key={i} ref={(el) => { merRefs.current[i] = el; }} d={d} className="fs-domeline" />)}
      </g>
      <path d={SLIT} className="obs-slit" />
      <g transform={`translate(${SCOPE_AT[0].toFixed(1)} ${SCOPE_AT[1].toFixed(1)})`}>
        <g className="obs-scope">
          <rect x="-4" y="-8" width="44" height="16" rx="8" transform="rotate(-28)" className="fs-top" />
          <ellipse cx="36" cy="0" rx="5" ry="8" transform="rotate(-28) translate(0 0)" className="fs-left" />
        </g>
      </g>

      {/* Front objects */}
      <Obj d={1.1}>
        <Frame o={BASE_O} half={48} />
        <Shadow o={BASE_O} r={40} />
        {BASE.map((b, i) => <Box key={i} b={b} />)}
      </Obj>

      <Obj d={1.3}>
        <Frame o={LIGHT_O} half={33} />
        <Shadow o={LIGHT_O} r={20} />
        <Cylinder o={LIGHT_O} r={17} r2={11} h={62} hatch />
        <Cylinder o={LIGHT_O} r={16} h={6} z={62} />
        <Cylinder o={LIGHT_O} r={9} h={12} z={68} />
        {(() => {
          const c = disc(0, 0, 80, 10, LIGHT_O);
          const [tx, ty] = project(0, 0, 92, LIGHT_O);
          return <path d={`M${c.cx - c.rx} ${c.cy}L${tx} ${ty}L${c.cx + c.rx} ${c.cy}A${c.rx} ${c.ry} 0 0 1 ${c.cx - c.rx} ${c.cy}Z`} className="fs-top" />;
        })()}
      </Obj>

      <Obj d={1.5} bob delay={-2}>
        <Shadow o={LEGO_O} r={32} />
        <Box b={LEGO} />
        {STUDS.map(([x, y]) => <Cylinder key={`${x}${y}`} o={project(x, y, 22, LEGO_O).map(Number)} r={7} h={5} />)}
      </Obj>

      <Obj d={1.6}>
        <Shadow o={CYL_R} r={14} />
        <Cylinder o={CYL_R} r={13} h={30} hatch />
      </Obj>

      {WIRES.map(([a], i) => (
        <g key={i} ref={(el) => { wireRefs.current[i] = el; }} transform={`translate(${a[0]} ${a[1]})`}>
          <circle r="2.6" className="fwire-dot" />
        </g>
      ))}

      {HZ_DOTS.map((dot, i) => (
        <g key={i} ref={(el) => { hzRefs.current[i] = el; }} transform={`translate(${(HZ[0] + (HZ[1] - HZ[0]) * dot.offset).toFixed(1)} ${HORIZON_Y})`} opacity={fade(dot.offset)}>
          <circle r={dot.dark ? 3.6 : 3} className={`hz-dot${dot.dark ? " hz-dot--dark" : ""}`} />
        </g>
      ))}

      {ARC_DOTS.flatMap((dot, i) => TRAIL.map((j) => {
        const kj = Math.max(dot.offset - j * TRAIL_GAP, 0);
        const [x, y] = arcAt(kj);
        return (
          <g key={`${i}-${j}`} ref={(el) => { trailRefs.current[i * TRAIL.length + j - 1] = el; }} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`} opacity={(fade(kj) * (0.45 - j * 0.12)).toFixed(2)}>
            <circle r={3.4 - j * 0.6} className="orbit-trail" />
          </g>
        );
      }))}
      {ARC_DOTS.map((dot, i) => {
        const [x, y] = arcAt(dot.offset);
        return (
          <g key={i} ref={(el) => { arcRefs.current[i] = el; }} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`} opacity={fade(dot.offset)}>
            <circle r={i === 1 ? 5 : 3.6} className="orbit-dot" />
          </g>
        );
      })}
    </svg>
  );
}
