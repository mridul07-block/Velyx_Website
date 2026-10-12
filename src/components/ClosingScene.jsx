import { useEffect, useRef } from "react";
import { floor } from "./illustrations/isoMatrix";
import { ARC_D, HORIZON_Y, arcAt, box, disc, domeOutline, lerpAt, meridians, parallels, project, sphereAt } from "../lib/isoScene";

/* Altair's footer scene, matched to the reference recording: a still
   observatory (flared plinth with a fanned hatch, a shaded drum, a wireframe
   dome with its oculus, a slit on the left and a telescope that slowly
   tilts) on a large, faint diamond floor. Nine still objects stand around
   it; four sit in dashed selection frames wired back to the plinth, a dot
   sliding along each wire. A single dot travels the dotted arc; the other
   dots stay put. While `playing`, one rAF loop moves those dots and CSS
   tilts the telescope. Otherwise it is a still drawing. */
const O = [600, 388]; // plinth centre on the floor
const R = 65; // dome radius
const PLINTH = { b: 120, t: 92, h: 34 }; // bottom / top half-sides, height
const PLATFORM = { half: 78, z: PLINTH.h, h: 8 };
const DRUM = { r: 60, z: PLATFORM.z + PLATFORM.h, h: 45 };
const DOME_Z = DRUM.z + DRUM.h;
const DOME_O = [600, O[1] - DOME_Z]; // the dome's base centre on screen
const DOME_SHIFT = DOME_O[1] - 300; // dome paths are drawn around (600, 300)

const P = (x, y, z, o = O) => project(x, y, z, o).map((v) => v.toFixed(1)).join(" ");
const poly = (...pts) => pts.join(" ");

// The plinth: a square frustum. The left side is plain; the right side is
// drawn as a fan of lines from its top edge to its bottom edge.
const { b: PB, t: PT, h: PH } = PLINTH;
const PLINTH_RIGHT = poly(P(PB, -PB, 0), P(PB, PB, 0), P(PT, PT, PH), P(PT, -PT, PH));
const PLINTH_LEFT = poly(P(-PB, PB, 0), P(PB, PB, 0), P(PT, PT, PH), P(-PT, PT, PH));
const FAN = Array.from({ length: 72 }, (_, i) => {
  const k = (i + 0.5) / 72;
  const [x1, y1] = project(PT, -PT + 2 * PT * k, PH, O);
  const [x2, y2] = project(PB, -PB + 2 * PB * k, 0, O);
  return [x1, y1, x2, y2].map((v) => v.toFixed(1));
});

// The dome: still, dense wireframe, an oculus on top, a slit down the left.
const DOME = { outline: domeOutline(R), rings: parallels(R, [14, 28, 42, 56, 68]), meridians: meridians(R, 28, 0.35) };
const OCULUS = disc(0, 0, R * Math.sin((80 * Math.PI) / 180), R * Math.cos((80 * Math.PI) / 180), DOME_O);
const SLIT = (() => {
  const band = [];
  const [a, b] = [(93 * Math.PI) / 180, (110 * Math.PI) / 180];
  const top = (80 * Math.PI) / 180;
  for (let k = 0; k <= 18; k++) band.push(sphereAt(R + 0.4, (k / 18) * top, a, DOME_O));
  for (let k = 18; k >= 0; k--) band.push(sphereAt(R + 0.4, (k / 18) * top, b, DOME_O));
  return band.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("") + "Z";
})();
const SCOPE_AT = sphereAt(R, (40 * Math.PI) / 180, (101 * Math.PI) / 180, DOME_O);

// Wires from the plinth to the four framed objects.
const WIRES = [
  [[499, 321], [436, 281]],
  [[445, 424], [330, 452]],
  [[732, 336], [816, 304]],
  [[711, 443], [855, 508]],
];
const WIRE_PERIOD = 7000; // there and back

// The arc's travelling dot, and the dots that stay where they are.
const ARC_PERIOD = 12000;
const ARC_STILL = [[0.231, 2.4, false], [0.257, 4.2, true], [0.28, 2.4, false]];
const HZ_STILL = [[140, true], [999, false], [1068, false], [1109, false]];
const fade = (t) => Math.min(1, Math.sin(Math.PI * t) * 3).toFixed(2);

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
function Cylinder({ o, r, h, z = 0, r2 = r, hatch = false, className = "fs-left" }) {
  const base = disc(0, 0, z, r, o);
  const top = disc(0, 0, z + h, r2, o);
  const d = `M${base.cx - base.rx} ${base.cy}A${base.rx} ${base.ry} 0 0 0 ${base.cx + base.rx} ${base.cy}L${top.cx + top.rx} ${top.cy}A${top.rx} ${top.ry} 0 0 1 ${top.cx - top.rx} ${top.cy}Z`;
  return (
    <>
      <path d={d} className={className} />
      {hatch && <path d={d} fill="url(#fs-vhatch-soft)" />}
      <ellipse cx={top.cx} cy={top.cy} rx={top.rx} ry={top.ry} className="fs-top" />
    </>
  );
}

/* A soft floor shadow, cast to the right as if lit from the left. */
function Shadow({ o, r, k = 1 }) {
  const s = disc(r * 0.45, r * 0.05, 0, r * 1.15 * k, o);
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

const Obj = ({ children }) => <g className="fobj">{children}</g>;

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

export default function ClosingScene({ playing }) {
  const arcRef = useRef(null);
  const wireRefs = useRef([]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const t0 = performance.now();
    const frame = (now) => {
      const t = now - t0;
      const k = (t / ARC_PERIOD) % 1;
      const [x, y] = arcAt(k);
      arcRef.current?.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      arcRef.current?.setAttribute("opacity", fade(k));
      WIRES.forEach(([a, b], i) => {
        const phase = (t / WIRE_PERIOD + i * 0.23) % 1;
        const along = 0.5 - 0.5 * Math.cos(phase * Math.PI * 2); // eases there and back
        const [wx, wy] = lerpAt(a, b, 0.12 + along * 0.76);
        wireRefs.current[i]?.setAttribute("transform", `translate(${wx.toFixed(1)} ${wy.toFixed(1)})`);
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  return (
    <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none">
      <defs>
        {/* Altair's floor: a large, faint diamond grid. */}
        <pattern id="fs-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" className="fs-gridline" />
        </pattern>
        <radialGradient id="fs-shadow-g">
          <stop offset="0" stopColor="#000" stopOpacity="0.11" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fs-dome-g" cx="38%" cy="28%" r="80%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e9e9e9" />
        </radialGradient>
        <linearGradient id="obs-drum-g" x1="0" x2="1">
          <stop offset="0" stopColor="#f6f6f6" />
          <stop offset="0.55" stopColor="#ececec" />
          <stop offset="1" stopColor="#dedede" />
        </linearGradient>
        <linearGradient id="obs-left-g" x1="0" x2="1">
          <stop offset="0" stopColor="#efefef" />
          <stop offset="1" stopColor="#e6e6e6" />
        </linearGradient>
        <pattern id="fs-vhatch" width="3" height="3" patternUnits="userSpaceOnUse">
          <path d="M0.5 0v3" className="fs-hatch" />
        </pattern>
        <pattern id="fs-vhatch-soft" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M0.5 0v4" className="fs-hatch fs-hatch--soft" />
        </pattern>
        <radialGradient id="fs-fade-g" gradientUnits="userSpaceOnUse" cx="600" cy="380" r="560">
          <stop offset="0.5" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fs-hz-g" gradientUnits="userSpaceOnUse" x1="0" y1={HORIZON_Y} x2="0" y2="600">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.3" stopColor="#fff" />
          <stop offset="0.72" stopColor="#fff" />
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
          <stop offset="0.1" stopColor="#fff" />
          <stop offset="0.9" stopColor="#fff" />
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
            <rect x="-1400" y="-1400" width="2800" height="2800" fill="url(#fs-grid)" />
          </g>
        </g>
      </g>
      <path d={`M0 ${HORIZON_Y}H1200`} className="fs-horizon" mask="url(#fs-hz-fade)" />
      <path d={ARC_D} className="orbit" />

      {/* Back objects */}
      <Obj>
        <Shadow o={CYL_A} r={11} />
        <Cylinder o={CYL_A} r={10} h={46} hatch />
        <Shadow o={CYL_B} r={12} />
        <Cylinder o={CYL_B} r={11} h={30} hatch />
      </Obj>
      <Obj>
        <Box b={CUBE} />
      </Obj>
      <Obj>
        <Shadow o={BARS_O} r={30} />
        {BARS.map((b, i) => <Box key={i} b={b} />)}
      </Obj>

      {/* Wires from the plinth to the framed objects */}
      {WIRES.map(([a, b], i) => <path key={i} d={`M${a}L${b}`} className="fwire" />)}

      <Obj>
        <Frame o={DB_O} half={38} />
        <Shadow o={DB_O} r={26} />
        {[0, 18, 36].map((z) => <Cylinder key={z} o={DB_O} r={24} h={16} z={z} />)}
      </Obj>

      <Obj>
        <Frame o={PLATES_O} half={42} />
        <Shadow o={PLATES_O} r={34} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
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
      <ellipse cx={O[0] + 60} cy={O[1] + 22} rx="270" ry="120" fill="url(#fs-shadow-g)" />
      <polygon points={PLINTH_LEFT} fill="url(#obs-left-g)" className="fs-plinth-side" />
      <polygon points={PLINTH_RIGHT} className="fs-plinth-side is-hatched" />
      <g className="obs-fan">
        {FAN.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />)}
      </g>
      <g transform={floor(O[0], O[1] - PH)}>
        <rect x={-PT} y={-PT} width={PT * 2} height={PT * 2} rx="12" className="fs-top" />
      </g>
      <g transform={floor(O[0], O[1] - PLATFORM.z)}>
        <rect x={-PLATFORM.half} y={-PLATFORM.half} width={PLATFORM.half * 2} height={PLATFORM.half * 2} rx="16" className="fs-left" />
      </g>
      <g transform={floor(O[0], O[1] - PLATFORM.z - PLATFORM.h)}>
        <rect x={-PLATFORM.half} y={-PLATFORM.half} width={PLATFORM.half * 2} height={PLATFORM.half * 2} rx="16" className="fs-top" />
        <rect x={-PLATFORM.half + 5} y={-PLATFORM.half + 5} width={PLATFORM.half * 2 - 10} height={PLATFORM.half * 2 - 10} rx="12" className="fs-inline" />
      </g>
      <g className="obs-drum">
        <Cylinder o={O} r={DRUM.r} h={DRUM.h} z={DRUM.z} className="obs-drum__side" />
      </g>
      {[R + 3, R + 1].map((r, i) => {
        const lip = disc(0, 0, DOME_Z + i * 2, r, O);
        return <ellipse key={r} cx={lip.cx} cy={lip.cy} rx={lip.rx} ry={lip.ry} className="fs-top" />;
      })}
      <g className="dome" transform={`translate(0 ${DOME_SHIFT})`}>
        <path d={DOME.outline} className="fs-dome" />
        {DOME.rings.map((d, i) => <path key={i} d={d} className="fs-domeline" />)}
        {DOME.meridians.map((d, i) => <path key={i} d={d} className="fs-domeline" />)}
      </g>
      <ellipse cx={OCULUS.cx} cy={OCULUS.cy} rx={OCULUS.rx} ry={OCULUS.ry} className="obs-oculus" />
      <path d={SLIT} className="obs-slit" />
      <g transform={`translate(${SCOPE_AT[0].toFixed(1)} ${SCOPE_AT[1].toFixed(1)})`}>
        <g className="obs-scope">
          <g transform="rotate(-152)">
            <rect x="-6" y="-9" width="44" height="18" rx="9" className="fs-top" />
            <ellipse cx="38" cy="0" rx="5.5" ry="9" className="fs-left" />
          </g>
        </g>
      </g>

      {/* Front objects */}
      <Obj>
        <Frame o={BASE_O} half={48} />
        <Shadow o={BASE_O} r={40} />
        {BASE.map((b, i) => <Box key={i} b={b} />)}
      </Obj>

      <Obj>
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

      <Obj>
        <Shadow o={LEGO_O} r={32} />
        <Box b={LEGO} />
        {STUDS.map(([x, y]) => <Cylinder key={`${x}${y}`} o={project(x, y, 22, LEGO_O).map(Number)} r={7} h={5} />)}
      </Obj>

      <Obj>
        <Shadow o={CYL_R} r={14} />
        <Cylinder o={CYL_R} r={13} h={30} hatch />
      </Obj>

      {/* Dots: one slides on each wire, one travels the arc, the rest stay put. */}
      {WIRES.map(([a, b], i) => {
        const [x, y] = lerpAt(a, b, 0.5);
        return (
          <g key={i} ref={(el) => { wireRefs.current[i] = el; }} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
            <circle r="2.6" className="fwire-dot" />
          </g>
        );
      })}
      {HZ_STILL.map(([x, dark]) => <circle key={x} cx={x} cy={HORIZON_Y} r={dark ? 3.4 : 2.8} className={`hz-dot${dark ? " hz-dot--dark" : ""}`} />)}
      {ARC_STILL.map(([t, r, dark]) => {
        const [x, y] = arcAt(t);
        return <circle key={t} cx={x.toFixed(1)} cy={y.toFixed(1)} r={r} className={`arc-still${dark ? " arc-still--dark" : ""}`} />;
      })}
      {(() => {
        const [x, y] = arcAt(0.62);
        return (
          <g ref={arcRef} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
            <circle r="3" className="orbit-dot" />
          </g>
        );
      })()}
    </svg>
  );
}
