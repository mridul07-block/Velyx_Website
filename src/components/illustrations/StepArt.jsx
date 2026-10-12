import { box as isoBox, disc, project } from "../../lib/isoScene";

/* Altair-style step scenes: solid, shaded isometric objects in the site's
   dark palette. One part at a time lifts and lights its edge (.pick, staggered
   delays), the building's top floor lifts off and settles (.split) and the
   lighthouse's beams sweep (.beam). Everything moves only while the process
   section is on screen (.is-playing); otherwise it is a still drawing. */
const O = [120, 104]; // floor centre of every scene
const PICK = 8; // seconds per full cycle; each part gets a quarter of it
const box = (x, y, z, w, d, h) => isoBox(x, y, z, w, d, h, O);

function Box({ b, edge = false }) {
  return (
    <>
      <polygon points={b.left} className="s-left" />
      <polygon points={b.right} className="s-right" />
      <polygon points={b.right} fill="url(#st-hatch)" />
      <polygon points={b.top} className="s-top" />
      {edge && <polygon points={b.top} className="pick-edge" />}
    </>
  );
}

/* An upright cylinder (frustum when r2 differs) at z, with an optional
   highlight outline for the pick animation. */
function Cyl({ o = O, r, h, z = 0, r2 = r, edge = false, hatch = true }) {
  const base = disc(0, 0, z, r, o);
  const top = disc(0, 0, z + h, r2, o);
  const side = `M${base.cx - base.rx} ${base.cy}A${base.rx} ${base.ry} 0 0 0 ${base.cx + base.rx} ${base.cy}L${top.cx + top.rx} ${top.cy}A${top.rx} ${top.ry} 0 0 1 ${top.cx - top.rx} ${top.cy}Z`;
  return (
    <>
      <path d={side} className="s-left" />
      {hatch && <path d={side} fill="url(#st-hatch)" />}
      <ellipse cx={top.cx} cy={top.cy} rx={top.rx} ry={top.ry} className="s-top" />
      {edge && (
        <g className="pick-edge">
          <path d={`M${base.cx - base.rx} ${base.cy}A${base.rx} ${base.ry} 0 0 0 ${base.cx + base.rx} ${base.cy}`} />
          <ellipse cx={top.cx} cy={top.cy} rx={top.rx} ry={top.ry} />
        </g>
      )}
    </>
  );
}

const pickStyle = (i, n = 4) => ({ animationDelay: `${(-PICK + (i * PICK) / n).toFixed(2)}s` });

/* 01 · Day 1 — a data stack on a round base: each segment lifts in turn. */
const TRAY = box(30, 14, 6, 30, 16, 3);
function Call() {
  return (
    <>
      <Cyl r={42} h={6} />
      <Box b={TRAY} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} className="pick" style={pickStyle(i)}>
          <Cyl r={22} h={12} z={6 + i * 14} edge />
        </g>
      ))}
    </>
  );
}

/* 02 · Week 1 — a planning board of blocks: one block at a time lifts. */
const BOARD = box(-50, -36, 0, 100, 72, 7);
const BLOCKS = [
  { b: box(-42, -26, 7, 22, 22, 20), pick: 0 },
  { b: box(-12, -30, 7, 26, 22, 10) },
  { b: box(-6, -26, 17, 14, 14, 20) },
  { b: box(22, -22, 7, 20, 20, 15), pick: 1 },
  { b: box(-28, 6, 7, 12, 12, 6), pick: 2 },
  { b: box(0, 6, 7, 28, 22, 10), pick: 3 },
];
function Trial() {
  return (
    <>
      <Box b={BOARD} />
      {BLOCKS.map(({ b, pick }, i) =>
        pick === undefined ? (
          <Box key={i} b={b} />
        ) : (
          <g key={i} className="pick" style={pickStyle(pick)}>
            <Box b={b} edge />
          </g>
        )
      )}
    </>
  );
}

/* 03 · Weeks 2 to 3 — floors on pillars: the top floor lifts and settles. */
const FLOOR = (z) => box(-32, -32, z, 64, 64, 4);
const PILLARS = (z) => [[-26, -26], [22, -26], [-26, 22], [22, 22]].map(([x, y]) => box(x, y, z, 4, 4, 10));
const BUILD_BASE = box(-36, -36, 0, 72, 72, 6);
function Build() {
  return (
    <>
      <Box b={BUILD_BASE} />
      {[6, 20, 34].map((z) => (
        <g key={z}>
          {PILLARS(z).map((p, i) => <Box key={i} b={p} />)}
          <Box b={FLOOR(z + 10)} />
        </g>
      ))}
      <g className="split">
        {PILLARS(48).map((p, i) => <Box key={i} b={p} />)}
        <Box b={FLOOR(58)} edge />
      </g>
    </>
  );
}

/* 04 · Week 3 — a lighthouse on a round base: its beams sweep. */
const LAMP = project(0, 0, 74, O);
const CAP = (() => {
  const c = disc(0, 0, 79, 8, O);
  const [tx, ty] = project(0, 0, 90, O);
  return `M${c.cx - c.rx} ${c.cy}L${tx} ${ty}L${c.cx + c.rx} ${c.cy}A${c.rx} ${c.ry} 0 0 1 ${c.cx - c.rx} ${c.cy}Z`;
})();
function Launch() {
  const [lx, ly] = LAMP;
  return (
    <>
      <g className="beam" style={{ transformOrigin: `${lx.toFixed(1)}px ${ly.toFixed(1)}px` }}>
        <path d={`M${lx} ${ly}L${lx - 100} ${ly - 26}M${lx} ${ly}L${lx - 104} ${ly - 6}`} className="beam__ray" />
      </g>
      <Cyl r={40} h={6} />
      <Cyl r={30} h={3} z={6} hatch={false} />
      <Cyl r={13} r2={9} h={56} z={9} />
      <Cyl r={13} h={4} z={65} />
      <Cyl r={7} h={10} z={69} hatch={false} edge />
      <path d={CAP} className="s-top" />
    </>
  );
}

const SCENES = { call: Call, trial: Trial, build: Build, launch: Launch };

export default function StepArt({ kind }) {
  const Scene = SCENES[kind];
  return (
    <svg viewBox="0 0 240 150" className="art step__art" aria-hidden="true" fill="none">
      <defs>
        <pattern id="st-hatch" width="2.5" height="2.5" patternUnits="userSpaceOnUse">
          <path d="M0.5 0v2.5" className="s-hatch" />
        </pattern>
      </defs>
      <Scene />
    </svg>
  );
}
