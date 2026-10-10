import { Guides, Handles, Layer, Patterns } from "./iso";
import { floor } from "./isoMatrix";

/* A product exploded into its layers: hatched database, API mesh and the
   dashboard on top, breathing apart and together. */
const W = 130;
const D = 96;
const NODES = [[22, 22], [48, 22], [82, 22], [108, 22], [34, 48], [66, 48], [96, 48], [22, 74], [56, 74], [108, 74]];

export default function SaasArt() {
  return (
    <svg viewBox="0 0 360 240" preserveAspectRatio="xMidYMid slice" className="art" aria-hidden="true" fill="none">
      <Patterns id="sa" />
      <Guides id="sa" w={360} h={240} />
      <g transform="translate(-40 0)">

      <Layer sy={10} amp={-3} dur={6}>
        <g transform={floor(210, 124)}>
          <rect width={W} height={D} fill="url(#sa-hatch)" className="p-dim" />
          {[12, 38, 64].map((y) => <rect key={y} x="12" y={y} width="106" height="18" rx="4" className="p-solid" />)}
          {[12, 38, 64].map((y) => <circle key={y} cx="22" cy={y + 9} r="2.5" className="fill-ok" />)}
        </g>
      </Layer>

      <Layer sy={-4} amp={-5} delay={-1.2} dur={6}>
        <g transform={floor(210, 90)}>
          <rect width={W} height={D} className="p-solid" />
          <path className="ln" d="M22 22h86M34 48h62M22 74h86M22 22l12 26 22 26M82 22l-16 26-10 26M108 22l-12 26 12 26" />
          {NODES.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3" className="p-top" />)}
        </g>
      </Layer>

      <Layer sy={-20} amp={-8} delay={-2.4} dur={6} d={0.7}>
        <g transform={floor(210, 56)}>
          <rect width={W} height={D} className="p-top" />
          <rect x="10" y="10" width="54" height="8" rx="2" className="fill-hi" />
          <rect x="10" y="26" width="22" height="60" rx="3" className="ln" />
          {[[42, 44], [56, 30], [70, 50], [84, 24], [98, 38]].map(([x, h]) => (
            <rect key={x} x={x} y={86 - h} width="9" height={h} rx="1" className={x === 84 ? "fill-ok" : "ln-bright"} />
          ))}
          <path d="M42 34h70" className="ln" strokeDasharray="2 3" />
          <Handles w={W} h={D} />
        </g>
      </Layer>

      <path className="wire" d="M323 121l34 20" />
      <text x="360" y="152" fontSize="15" className="t">{"{ }"}</text>
      </g>
    </svg>
  );
}
