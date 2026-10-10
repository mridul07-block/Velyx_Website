/* Isometric drawing kit for the service scenes (matrices in isoMatrix.js).
   Moving parts wrap a placed plane in <g class="spread"><g class="float">
   so CSS can animate them without touching the matrix. */

/* Diamond handles on a plane's corners, Figma-selection style. */
export function Handles({ w, h }) {
  return (
    <g className="iso-handle">
      {[[0, 0], [w, 0], [w, h], [0, h]].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 2.5} y={y - 2.5} width="5" height="5" />
      ))}
    </g>
  );
}

/* Faint dashed isometric construction lines across the whole scene. */
export function Guides({ id, w, h, step = 70 }) {
  const lines = [];
  for (let c = -w; c < w + h * 2; c += step) {
    lines.push(`M${c - h * 1.732} ${-h}L${c + h * 3.464} ${h * 2}`);
    lines.push(`M${c + h * 1.732} ${-h}L${c - h * 3.464} ${h * 2}`);
  }
  return (
    <>
      <defs>
        <radialGradient id={`${id}-fade`} gradientUnits="userSpaceOnUse" cx={w * 0.55} cy={h * 0.5} r={w * 0.62}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path className="iso-guides" stroke={`url(#${id}-fade)`} d={lines.join("")} />
    </>
  );
}

/* Hatch and halftone fills, namespaced so scenes don't share ids. */
export function Patterns({ id }) {
  return (
    <defs>
      <pattern id={`${id}-hatch`} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M0 0v3" className="iso-pat" />
      </pattern>
      <pattern id={`${id}-dots`} width="4" height="4" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="0.8" className="iso-pat-dot" />
      </pattern>
    </defs>
  );
}

/* A moving layer: `spread` is the hover offset, `float` the idle bob. */
export function Layer({ sx = 0, sy = -12, amp = -6, delay = 0, dur = 6, d = 1, rise, children }) {
  return (
    <g className="layer" style={{ "--d": d }}>
      <g className="spread" style={{ "--sx": `${sx}px`, "--sy": `${sy}px` }}>
        <g
          className={`float${rise ? " float--rise" : ""}`}
          style={{ "--amp": `${amp}px`, "--z": `${rise ?? 0}px`, animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
        >
          {children}
        </g>
      </g>
    </g>
  );
}
