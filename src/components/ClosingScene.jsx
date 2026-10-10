import { useEffect, useRef } from "react";
import { floor, wall } from "./illustrations/isoMatrix";
import {
  CORE, ORBITS, SPHERE_SCALE, disc, extrude, orbitAt, orbitBehind, orbitPath, polyline, project, sphereMeridians, sphereParallels,
} from "../lib/isoScene";

/* The footer's "AI engine": a turning wireframe core with a firing neural
   net floats over a hatched plinth, sending data packets along circuit
   traces to the five service stations (agents, SaaS, WhatsApp, web,
   mobile), which react as each packet lands. Satellites orbit the core,
   a terminal types code, ripples roll across the grid. One rAF loop
   (only while `playing`) turns the core and moves packets and
   satellites; CSS does the rest. `burst` speeds everything up. */
const R = 100;
const MERIDIANS = 10;
const CORE_PERIOD = 2600; // ms per meridian spacing
const PACKET_PERIOD = 3200;
const TRAVEL = 0.7; // share of a period a packet spends travelling
const S = SPHERE_SCALE;
const f = (n) => n.toFixed(1);
const at = (x, y, z = 0) => project(x, y, z);
const F = (x, y, z = 0) => floor(...at(x, y, z).map(f));
const W = (x, y, z) => wall(...at(x, y, z).map(f));

const STATIONS = [
  { id: "agents", end: [-172, 232] },
  { id: "saas", end: [-288, -12] },
  { id: "whatsapp", end: [-6, -294] },
  { id: "web", end: [255, -195] },
  { id: "mobile", end: [73, 327] },
];
const TRACES = STATIONS.map(({ end: [x, y] }) => polyline([[0, 0, 0], [x, 0, 0], [x, y, 0]]));

const [CX, CY] = at(...CORE);
const SHELL = { meridians: sphereMeridians(CORE, R, MERIDIANS, 0), rings: sphereParallels(CORE, R, [-60, -30, 0, 30, 60]) };
const NODES = [
  [0, 0, 0.55], [0.5, 0.1, 0.25], [-0.45, 0.25, 0.3], [0.15, -0.5, 0.2], [-0.2, -0.3, -0.15], [0.45, -0.25, -0.2],
  [-0.5, 0.2, -0.3], [0.1, 0.5, -0.1], [0.25, 0.25, 0.5], [-0.3, -0.45, 0.35], [0, 0, -0.55], [0.35, 0.4, 0.15],
].map(([x, y, z]) => [CORE[0] + x * R, CORE[1] + y * R, CORE[2] + z * R]);
const LINKS = [];
NODES.forEach((a, i) => NODES.forEach((b, j) => {
  if (j > i && Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 0.72 * R) LINKS.push([at(...a), at(...b)]);
}));
const NODE_XY = NODES.map((n) => at(...n));
const PLINTH = [[-150, -150], [150, -150], [150, 150], [-150, 150]].map(([x, y]) => at(x, y).map(f).join(" ")).join(" ");
const PAD = disc(0, 0, 0, 118);
const SHADOW = disc(0, 0, 0, 84);
const BEAMS = [0, 1, 2, 3].map((k) => {
  const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
  const [x0, y0] = at(118 * Math.cos(a), 118 * Math.sin(a), 0);
  const [, y1] = at(118 * Math.cos(a), 118 * Math.sin(a), 52);
  return `M${f(x0)} ${f(y0)}V${f(y1)}`;
});

const K = Math.SQRT1_2;
const toWorld = ([a, b]) => [316 + (a - b) * K, 116 - (a + b) * K];
const V_LETTER = extrude([[0, 130], [34, 130], [70, 40], [106, 130], [140, 130], [88, 0], [52, 0]].map(toWorld), 0, 26);
const V_SLASH = extrude([[10, -14], [20, -14], [152, 150], [144, 150]].map(toWorld), 26, 5);

const SATELLITES = [
  { orbit: 0, offset: 0, kind: "code" },
  { orbit: 0, offset: 0.5, kind: "ai" },
  { orbit: 1, offset: 0.25, kind: "db" },
  { orbit: 1, offset: 0.75, kind: "dot" },
];
const CODE = [[0, 52], [1, 34], [1, 60], [2, 44], [1, 28], [0, 40]];

function Tick({ x, y, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="st-tick" style={{ transitionDelay: `${delay}s` }}>
        <circle r="7" className="fs-ok" />
        <path d="M-3 0l2 2 4-4" className="fs-tickmark" />
      </g>
    </g>
  );
}

function Agents({ x, y }) {
  const tiles = [
    { dx: -66, label: "INBOX", icon: <><rect x="10" y="10" width="20" height="14" rx="1" /><path d="M10 11l10 7 10-7" /></> },
    { dx: -16, label: "CRM", icon: <><circle cx="20" cy="15" r="4.5" /><path d="M11 29a9 9 0 0 1 18 0" /></> },
    { dx: 34, label: "CALENDAR", icon: <><rect x="10" y="10" width="20" height="18" rx="1" /><path d="M10 15h20M15 8v4M25 8v4" /></> },
  ];
  return tiles.map((t, i) => {
    const [tx, ty] = at(x + t.dx + 40, y - 20, 10);
    return (
      <g key={t.label} className="st-bob" style={{ animationDelay: `${-i * 0.8}s` }}>
        <g transform={F(x + t.dx, y - 20, 4)}>
          <rect width="40" height="40" rx="3" className="fs-top" />
          <g className="fs-icon">{t.icon}</g>
          <text x="4" y="37" fontSize="5" className="fs-label">{t.label}</text>
        </g>
        <Tick x={f(tx)} y={f(ty)} delay={i * 0.12} />
      </g>
    );
  });
}

function Saas({ x, y }) {
  return (
    <>
      <g transform={F(x - 45, y - 32)}>
        <rect width="90" height="64" rx="3" fill="url(#fs-dhatch)" className="fs-dim" />
      </g>
      <g className="st-layer" style={{ "--lift": "-6px" }}>
        <g transform={F(x - 45, y - 32, 24)}>
          <rect width="90" height="64" rx="3" className="fs-top" />
          {[[16, 16], [44, 16], [72, 16], [30, 40], [58, 40]].map(([cx, cy]) => <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="3" className="fs-node" />)}
          <path d="M16 16h56M30 40h28M16 16l14 24M44 16l-14 24M44 16l14 24M72 16l-14 24" className="fs-wire" />
        </g>
      </g>
      <g className="st-layer" style={{ "--lift": "-14px", animationDelay: "-0.6s" }}>
        <g transform={F(x - 45, y - 32, 48)}>
          <rect width="90" height="64" rx="3" className="fs-top fs-top--strong" />
          <rect x="8" y="8" width="38" height="6" rx="2" className="fs-inkfill" />
          {[[10, 22], [22, 34], [34, 16], [46, 40], [58, 28]].map(([bx, h], i) => (
            <rect key={bx} x={bx} y={56 - h} width="8" height={h} rx="1" className={`fs-bar${i === 3 ? " fs-bar--hot" : ""}`} style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
          <path d="M8 50c10-6 14-2 22-12s14-6 22-14 12-6 18-8" pathLength="1" className="fs-trend" />
        </g>
      </g>
    </>
  );
}

function WhatsApp({ x, y }) {
  const bubbles = [
    { dx: -10, dy: -36, w: 34, h: 15, z: 26, cls: "fs-top" },
    { dx: -26, dy: -28, w: 40, h: 16, z: 48, cls: "fs-okbubble" },
    { dx: -12, dy: -44, w: 46, h: 18, z: 70, cls: "fs-ok" },
  ];
  return (
    <>
      <g transform={F(x - 25, y - 46)}>
        <rect width="50" height="92" rx="10" className="fs-top" />
        <rect x="5" y="12" width="40" height="72" rx="5" fill="url(#fs-dots)" className="fs-dim" />
        <rect x="19" y="4" width="12" height="3" rx="1.5" className="fs-inkfill" />
      </g>
      {bubbles.map((b, i) => (
        <g key={i} className="st-rise" style={{ "--z": `${b.z}px`, animationDelay: `${i * 0.6}s` }}>
          <g transform={F(x + b.dx, y + b.dy, b.z)}>
            <rect width={b.w} height={b.h} rx="5" className={b.cls} />
            {i < 2 ? <path d={`M6 6h${b.w - 14}M6 10h${b.w - 22}`} className="fs-wire" /> : <path d="M7 9l3 3 6-6M22 7h18M22 11h12" className="fs-tickmark" />}
          </g>
        </g>
      ))}
    </>
  );
}

function Web({ x, y }) {
  return [0, 1, 2, 3].map((i) => {
    const front = i === 3;
    return (
      <g key={i} className="st-wave" style={{ animationDelay: `${-i * 0.35}s` }}>
        <g transform={W(x - 30 + i * 22, y + 31, 84)}>
          <rect width="62" height="84" rx="3" className={front ? "fs-top fs-top--strong" : "fs-top"} />
          {front ? (
            <>
              <path d="M0 9h62" className="fs-wire" />
              {[5, 9, 13].map((cx) => <circle key={cx} cx={cx} cy="4.5" r="1.3" className="fs-inkfill" />)}
              <rect x="6" y="18" width="40" height="5" rx="1" className="fs-inkfill" />
              <rect x="6" y="27" width="28" height="5" rx="1" className="fs-inkfill" />
              <rect x="6" y="38" width="20" height="7" rx="3.5" className="fs-ok" />
              {[6, 25, 44].map((cx) => <rect key={cx} x={cx} y="52" width="13" height="24" rx="2" className="fs-wire" />)}
            </>
          ) : (
            <path d="M6 14h34M6 22h24M6 34h46M6 42h40" className="fs-wire" />
          )}
        </g>
      </g>
    );
  });
}

function Mobile({ x, y }) {
  return (
    <>
      {[0, 1].map((i) => (
        <g key={i} className="st-wave" style={{ animationDelay: `${-i * 0.7}s` }}>
          <g transform={W(x - 14 + i * 34, y + 18, 72)}>
            <rect width="36" height="72" rx="7" className={i ? "fs-top fs-top--strong" : "fs-top"} />
            <clipPath id={`fs-phone-${i}`}><rect x="3" y="8" width="30" height="58" rx="4" /></clipPath>
            <g clipPath={`url(#fs-phone-${i})`}>
              <g className="st-scroll" style={{ animationDelay: `${-i * 2}s` }}>
                {[10, 22, 34, 46, 58, 70, 82].map((ry, k) => (
                  <rect key={ry} x="6" y={ry} width="24" height="8" rx="2" className={k === 2 ? "fs-ok" : "fs-wire"} />
                ))}
              </g>
            </g>
          </g>
        </g>
      ))}
      <g className="st-notif">
        <g transform={F(x + 40, y - 70, 64)}>
          <rect width="50" height="20" rx="6" className="fs-top fs-top--strong" />
          <circle cx="9" cy="10" r="3.5" className="fs-ok" />
          <path d="M17 7h26M17 12h16" className="fs-wire" />
        </g>
      </g>
    </>
  );
}

const DRAW = { agents: Agents, saas: Saas, whatsapp: WhatsApp, web: Web, mobile: Mobile };

function Satellite({ kind }) {
  if (kind === "dot") return <ellipse rx="5" ry="3.4" className="orbit-dot" />;
  if (kind === "db") {
    return (
      <>
        <path d="M-12 -10V8A12 7 0 0 0 12 8V-10" className="fs-left" />
        <ellipse cy="-10" rx="12" ry="7" className="fs-top" />
        <path d="M-12 -1A12 7 0 0 0 12 -1" className="fs-wire" />
      </>
    );
  }
  return (
    <g transform={floor(0, 0)}>
      <rect x="-24" y="-11" width="48" height="22" rx="6" className={kind === "ai" ? "fs-chip-dark" : "fs-top fs-top--strong"} />
      <text x="0" y="3.5" fontSize="10" textAnchor="middle" className={kind === "ai" ? "fs-chiptext fs-chiptext--light" : "fs-chiptext"}>
        {kind === "ai" ? "AI" : "</>"}
      </text>
    </g>
  );
}

export default function ClosingScene({ playing, burst, onCoreClick }) {
  const merRefs = useRef([]);
  const packetRefs = useRef([]);
  const stationRefs = useRef([]);
  const satRefs = useRef([]);
  const burstRef = useRef(false);

  useEffect(() => {
    burstRef.current = burst;
  }, [burst]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    let clock = 0;
    const frame = (now) => {
      clock += (now - last) * (burstRef.current ? 3 : 1);
      last = now;
      sphereMeridians(CORE, R, MERIDIANS, clock / CORE_PERIOD).forEach((d, i) => merRefs.current[i]?.setAttribute("d", d));
      TRACES.forEach((trace, i) => {
        const phase = (clock / PACKET_PERIOD + i * 0.19) % 1;
        const moving = phase < TRAVEL;
        const [x, y] = trace.at(Math.min(phase / TRAVEL, 1));
        const el = packetRefs.current[i];
        el?.setAttribute("transform", `translate(${f(x)} ${f(y)})`);
        el?.classList.toggle("is-off", !moving);
        stationRefs.current[i]?.classList.toggle("is-hit", !moving);
      });
      SATELLITES.forEach((s, i) => {
        const t = (clock / (s.orbit ? 9000 : 13000) + s.offset) % 1;
        const [x, y] = orbitAt(ORBITS[s.orbit], t);
        const el = satRefs.current[i];
        el?.setAttribute("transform", `translate(${f(x)} ${f(y)})`);
        el?.classList.toggle("is-behind", orbitBehind(ORBITS[s.orbit], t));
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  return (
    <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none">
      <defs>
        <pattern id="fs-grid" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0V26" className="fs-gridline" />
        </pattern>
        <pattern id="fs-vhatch" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M1 0v4" className="fs-hatch" />
        </pattern>
        <pattern id="fs-dhatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0v4" className="fs-hatch" />
        </pattern>
        <pattern id="fs-dots" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="0.9" className="fs-inkfill" />
        </pattern>
        <radialGradient id="fs-fade-g" cx="50%" cy="50%" r="50%">
          <stop offset="0.35" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="fs-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="600">
          <rect width="1200" height="600" fill="url(#fs-fade-g)" />
        </mask>
        <radialGradient id="fs-core-g" cx="42%" cy="38%" r="70%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ececec" />
        </radialGradient>
        <radialGradient id="fs-glow-g">
          <stop offset="0" stopColor="#e8a453" stopOpacity="0.55" />
          <stop offset="1" stopColor="#e8a453" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g mask="url(#fs-fade)">
        <g transform={floor(600, 300)}>
          <rect x="-1300" y="-1300" width="2600" height="2600" fill="url(#fs-grid)" />
        </g>
        <path d="M0 300H1200M0 314H1200" className="fs-horizon" />
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx="600" cy="300" rx={f(150 * S)} ry={f(150 * Math.SQRT1_2)} className="ripple" style={{ animationDelay: `${i * 1.4}s` }} />
        ))}
        <ellipse cx="600" cy="300" rx={f(150 * S)} ry={f(150 * Math.SQRT1_2)} className="ripple ripple--burst" />
      </g>

      <polygon points={PLINTH} fill="url(#fs-vhatch)" className="fs-plinth" />
      {TRACES.map((t, i) => <path key={i} d={t.d} className="trace" />)}

      <g className="fobj" style={{ "--d": 0.7 }}>
        <g transform={W(-375, 179, 92)}>
          <rect width="150" height="92" rx="6" className="fs-terminal" />
          {[8, 14, 20].map((cx) => <circle key={cx} cx={cx} cy="7" r="1.8" className="fs-term-dot" />)}
          {CODE.map(([indent, w], i) => (
            <rect key={i} x={10 + indent * 10} y={18 + i * 11} width={w} height="5" rx="1.5" className={`fs-code${i === 3 ? " fs-code--hot" : ""}`} style={{ animationDelay: `${i * 0.45}s` }} />
          ))}
          <rect x="10" y="84" width="6" height="4" className="fs-caret" />
        </g>
      </g>

      {STATIONS.map(({ id, end }, i) => {
        const Draw = DRAW[id];
        return (
          <g key={id} ref={(el) => { stationRefs.current[i] = el; }} className="station" data-station={id}>
            <g className="fobj" style={{ "--d": 1 + (i % 3) * 0.4 }}>
              <Draw x={end[0]} y={end[1]} />
            </g>
          </g>
        );
      })}

      <g className="fobj" style={{ "--d": 1.3 }}>
        {V_LETTER.sides.map((s, i) => <polygon key={i} points={s.d} className={`fs-${s.shade}`} />)}
        <polygon points={V_LETTER.top} className="fs-top" />
        {V_SLASH.sides.map((s, i) => <polygon key={i} points={s.d} className={`fs-brand-${s.shade}`} />)}
        <polygon points={V_SLASH.top} className="fs-brand-top" />
      </g>

      <ellipse cx={f(PAD.cx)} cy={f(PAD.cy)} rx={f(PAD.rx)} ry={f(PAD.ry)} className="fs-pad" />
      <ellipse cx={f(SHADOW.cx)} cy={f(SHADOW.cy)} rx={f(SHADOW.rx)} ry={f(SHADOW.ry)} className="fs-shadow" />
      {BEAMS.map((d, i) => <path key={i} d={d} className="beam" />)}

      {ORBITS.map((o, i) => <path key={i} d={orbitPath(o)} className="orbit" />)}

      <g className="core" onClick={onCoreClick}>
        <g className="core__tilt">
          <circle cx={f(CX)} cy={f(CY)} r={f(R * S * 1.25)} fill="url(#fs-glow-g)" className="core__glow" />
          <circle cx={f(CX)} cy={f(CY)} r={f(R * S)} fill="url(#fs-core-g)" className="fs-core" />
          {LINKS.map(([a, b], i) => <path key={i} d={`M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}`} className="nn-link" style={{ animationDelay: `${(i % 7) * 0.3}s` }} />)}
          {NODE_XY.map(([x, y], i) => <circle key={i} cx={f(x)} cy={f(y)} r="3.4" className="nn-node" style={{ animationDelay: `${(i * 0.37) % 2.6}s` }} />)}
          {SHELL.rings.map((d, i) => <path key={i} d={d} className="fs-shell" />)}
          {SHELL.meridians.map((d, i) => <path key={i} ref={(el) => { merRefs.current[i] = el; }} d={d} className="fs-shell" />)}
        </g>
      </g>

      {SATELLITES.map((s, i) => {
        const [x, y] = orbitAt(ORBITS[s.orbit], s.offset);
        return (
          <g key={i} ref={(el) => { satRefs.current[i] = el; }} transform={`translate(${f(x)} ${f(y)})`} className={`satellite${orbitBehind(ORBITS[s.orbit], s.offset) ? " is-behind" : ""}`}>
            <Satellite kind={s.kind} />
          </g>
        );
      })}

      {TRACES.map((t, i) => {
        const [x, y] = t.at(0.5);
        return (
          <g key={i} ref={(el) => { packetRefs.current[i] = el; }} transform={`translate(${f(x)} ${f(y)})`} className="packet">
            <path d="M0 -4l7 4-7 4-7-4z" />
          </g>
        );
      })}
    </svg>
  );
}
