import { useEffect, useRef } from "react";
import { floor, wall } from "./illustrations/isoMatrix";
import { disc, extrude, extrudeWall, ORBITS, orbitAt, orbitPath, project } from "../lib/isoScene";

/* Kargul-style footer scene, in Velyx's own objects. A large standing
   Velyx V floats over a hatched plinth on a fine diamond lattice, with
   three dots gliding along two dotted arcs around it. Spaced around it,
   in one soft-gray palette, are the things Velyx builds: an AI sparkle,
   a WhatsApp chat bubble, a SaaS dashboard, a website, a mobile app, an
   automation workflow and </> code. Each has one quiet loop (CSS); one
   rAF loop moves the dots while `playing`. Otherwise it is a still. */
const DOTS = [
  { orbit: 0, period: 7000, offset: 0.2 },
  { orbit: 1, period: 9000, offset: 0.1 },
  { orbit: 1, period: 9000, offset: 0.6 },
];
const TRAIL = [1, 2, 3];
const TRAIL_GAP = 0.014;
const fade = (t) => Math.sin(Math.PI * t).toFixed(2); // dots fade in and out along an arc
const f = (n) => n.toFixed(1);
const W = (x, y, z) => wall(...project(x, y, z).map(f));
const dotAt = (dot, k) => {
  const [x, y] = orbitAt(ORBITS[dot.orbit], k);
  return `translate(${f(x)} ${f(y)})`;
};

// The Velyx V standing on its plinth (letter space: a across, b up).
const toV = ([a, b]) => [(a - 70) * 1.4, b * 1.5 + 24];
const BRAND_V = extrudeWall([[0, 130], [34, 130], [70, 40], [106, 130], [140, 130], [88, 0], [52, 0]].map(toV), 40, 34);
const BRAND_SLASH = extrudeWall([[10, -14], [20, -14], [152, 150], [144, 150]].map(toV), 48, 6);
const V_SHADOW = disc(0, 30, 0, 120);
const PLINTH = [[-150, -150], [150, -150], [150, 150], [-150, 150]].map(([x, y]) => project(x, y, 0).map(f).join(" ")).join(" ");

// AI: two four-point sparkles, standing.
const star = (cx, cz, r) => Array.from({ length: 8 }, (_, i) => {
  const a = Math.PI / 2 + (i * Math.PI) / 4;
  const k = i % 2 ? r * 0.26 : r;
  return [cx + k * Math.cos(a), cz + k * Math.sin(a)];
});
const SPARKLE = extrudeWall(star(-300, 64, 36), -40, 10);
const SPARKLE_SM = extrudeWall(star(-246, 112, 15), -40, 6);

// Code: </> lying on the floor at the front right.
const K = Math.SQRT1_2;
const toFloor = ([a, b]) => [330 + (a - b) * K, 140 - (a + b) * K];
const CODE = [
  [[36, 0], [50, 0], [18, 40], [50, 80], [36, 80], [4, 40]],
  [[60, 0], [72, 0], [98, 80], [86, 80]],
  [[104, 0], [118, 0], [150, 40], [118, 80], [104, 80], [136, 40]],
].map((p) => extrude(p.map(toFloor), 0, 16));

const BUBBLE_AT = project(-320, 120, 34);
const DASH_AT = project(60, -380, 46);
const FLOW_AT = project(150, 230, 0);

function Obj({ d = 1, delay = 0, shadow, name, children }) {
  const sh = shadow && disc(shadow[0], shadow[1], 0, shadow[2]);
  return (
    <g className="fobj" style={{ "--d": d }} data-obj={name}>
      {sh && <ellipse cx={f(sh.cx)} cy={f(sh.cy)} rx={f(sh.rx)} ry={f(sh.ry)} fill="url(#fs-shadow-g)" className="fobj__shadow" style={{ animationDelay: `${delay}s` }} />}
      <g className="fobj__bob" style={{ animationDelay: `${delay}s` }}>{children}</g>
    </g>
  );
}

function Solid({ s, front = "front", cls = "" }) {
  return (
    <>
      {s.sides.map((side, i) => <polygon key={i} points={side.d} className={`fs-${side.shade}${cls}`} />)}
      <polygon points={s.front ?? s.top} className={`fs-${front}${cls}`} />
    </>
  );
}

export default function ClosingScene({ playing }) {
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
      DOTS.forEach((dot, i) => {
        const k = (t / dot.period + dot.offset) % 1;
        dotRefs.current[i]?.setAttribute("transform", dotAt(dot, k));
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
        <pattern id="fs-vhatch" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M1 0v4" className="fs-hatch" />
        </pattern>
        <radialGradient id="fs-spot-g">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="fs-spot-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="600">
          <circle ref={spotRef} cx="600" cy="420" r="170" fill="url(#fs-spot-g)" />
        </mask>
        <radialGradient id="fs-shadow-g">
          <stop offset="0" stopColor="#000" stopOpacity="0.13" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fs-fade-g" cx="50%" cy="48%" r="58%">
          <stop offset="0.62" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="fs-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="600">
          <rect width="1200" height="600" fill="url(#fs-fade-g)" />
        </mask>
        <linearGradient id="fs-front-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#efefef" />
        </linearGradient>
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

      <Obj name="ai" d={1.8} delay={-1} shadow={[-300, -40, 30]}>
        <g className="ai-pulse">
          <Solid s={SPARKLE} />
        </g>
        <g className="ai-pulse ai-pulse--late">
          <Solid s={SPARKLE_SM} />
        </g>
      </Obj>

      <Obj name="chat" d={1.4} delay={-2} shadow={[-270, 149, 58]}>
        <g transform={floor(...BUBBLE_AT)}>
          <rect x="4" y="6" width="100" height="58" rx="14" className="fs-shadow" />
          <path d="M14 0h76a14 14 0 0 1 14 14v30a14 14 0 0 1-14 14H40l-16 14V58H14A14 14 0 0 1 0 44V14A14 14 0 0 1 14 0z" className="fs-top" />
          {[34, 52, 70].map((x, i) => <circle key={x} cx={x} cy="29" r="4" className="fs-ink typing-dot" style={{ animationDelay: `${i * 0.18}s` }} />)}
        </g>
      </Obj>

      <Obj name="dashboard" d={1.5} delay={-2.6} shadow={[115, -342, 62]}>
        <g transform={floor(...DASH_AT)}>
          <rect x="4" y="6" width="110" height="76" rx="6" className="fs-shadow" />
          <rect width="110" height="76" rx="6" className="fs-top" />
          <rect x="8" y="8" width="40" height="6" rx="2" className="fs-left" />
          {[[12, 26], [26, 38], [40, 20], [54, 44], [68, 32]].map(([x, h], i) => (
            <rect key={x} x={x} y={68 - h} width="9" height={h} rx="1.5" className="fs-left dash-bar" style={{ animationDelay: `${i * 0.18}s` }} />
          ))}
          <path d="M82 60c4-10 8-6 12-16s6-8 10-12" className="fs-line" />
        </g>
      </Obj>

      <Obj name="browser" d={1.2} delay={-0.6} shadow={[300, -170, 54]}>
        <g transform={W(300, -120, 76)}>
          <rect width="104" height="76" rx="5" className="fs-panel" fill="url(#fs-front-g)" />
          <path d="M0 11h104" className="fs-line" />
          {[6, 11, 16].map((cx) => <circle key={cx} cx={cx} cy="5.5" r="1.6" className="fs-line" />)}
          <rect x="30" y="3" width="44" height="5" rx="2.5" className="fs-line" />
          <rect x="10" y="20" width="56" height="6" rx="1.5" className="fs-left" />
          <rect x="10" y="30" width="38" height="6" rx="1.5" className="fs-left" />
          <rect x="10" y="44" width="30" height="10" rx="5" className="fs-ink cta-btn" />
          <rect x="62" y="40" width="32" height="26" rx="3" className="fs-line" />
          <g className="web-cursor">
            <path d="M0 0v12l3.5-3.5 2.6 6 2.6-1.1-2.6-6H12z" className="fs-cursor" />
          </g>
        </g>
      </Obj>

      <Obj name="phone" d={1.1} delay={-3.4} shadow={[-120, 280, 32]}>
        <g transform={W(-120, 300, 86)}>
          <rect width="44" height="86" rx="9" className="fs-panel" fill="url(#fs-front-g)" />
          <rect x="16" y="4" width="12" height="3" rx="1.5" className="fs-left" />
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={7 + (i % 3) * 11} y={14 + Math.floor(i / 3) * 11} width="8" height="8" rx="2.5" className="fs-left app-icon" style={{ animationDelay: `${i * 0.22}s` }} />
          ))}
          <rect x="7" y="54" width="30" height="20" rx="3" className="fs-line" />
        </g>
      </Obj>

      <Obj name="workflow" d={0.9} delay={-1.8} shadow={[240, 250, 84]}>
        <g transform={floor(...FLOW_AT)}>
          <path d="M36 18H66M102 18H132" className="fs-dash" />
          {[0, 66, 132].map((x, i) => (
            <g key={x}>
              <rect x={x + 3} y="6" width="36" height="36" rx="9" className="fs-shadow" />
              <rect x={x} y="0" width="36" height="36" rx="9" className="fs-top flow-node" style={{ animationDelay: `${i * 0.8}s` }} />
            </g>
          ))}
          <path d="M20 7l-7 12h7l-3 10 9-14h-7z" className="fs-ink" />
          <path d="M84 8q1.5 8.5 10 10-8.5 1.5-10 10-1.5-8.5-10-10 8.5-1.5 10-10z" className="fs-ink" />
          <path d="M141 18l5 5 9-10" className="fs-tick" />
          <circle cx="36" cy="18" r="3.5" className="fs-ink flow-pulse" />
        </g>
      </Obj>

      <Obj name="code" d={1.3} delay={-2.2}>
        <Solid s={CODE[0]} front="top" />
        <g className="code-slash"><Solid s={CODE[1]} front="top" /></g>
        <Solid s={CODE[2]} front="top" />
      </Obj>

      <g className="fobj" style={{ "--d": 0.6 }}>
        <ellipse cx={f(V_SHADOW.cx)} cy={f(V_SHADOW.cy)} rx={f(V_SHADOW.rx)} ry={f(V_SHADOW.ry)} fill="url(#fs-shadow-g)" className="fobj__shadow brand-v__shadow" />
        <g className="brand-v">
          <Solid s={BRAND_V} />
          <Solid s={BRAND_SLASH} cls=" fs-brand" />
        </g>
      </g>

      {ORBITS.map((o, i) => <path key={i} d={orbitPath(o)} className="orbit" />)}

      {DOTS.flatMap((dot, i) => TRAIL.map((j) => {
        const kj = Math.max(dot.offset - j * TRAIL_GAP, 0);
        return (
          <g key={`${i}-${j}`} ref={(el) => { trailRefs.current[i * TRAIL.length + j - 1] = el; }} transform={dotAt(dot, kj)} opacity={(fade(kj) * (0.5 - j * 0.12)).toFixed(2)}>
            <ellipse rx={5 - j} ry={3.4 - j * 0.7} className="orbit-trail" />
          </g>
        );
      }))}
      {DOTS.map((dot, i) => (
        <g key={i} ref={(el) => { dotRefs.current[i] = el; }} transform={dotAt(dot, dot.offset)} opacity={fade(dot.offset)}>
          <ellipse rx="5" ry="3.4" className="orbit-dot" />
        </g>
      ))}
    </svg>
  );
}
