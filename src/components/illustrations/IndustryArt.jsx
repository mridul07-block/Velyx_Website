import { Guides, Handles, Layer, Patterns } from "./iso";
import { floor } from "./isoMatrix";

/* Industry and automation scenes, drawn like AgentsArt: an industry plane hovers over a
   hatched shadow and streams work along dotted wires to the tools the
   agents run, each floating on its own rhythm. */
function HubScene({ id, hub, tools, children }) {
  return (
    <svg viewBox="0 0 360 240" preserveAspectRatio="xMidYMid slice" className="art" aria-hidden="true" fill="none">
      <Patterns id={id} />
      <Guides id={id} w={360} h={240} />
      <g transform="translate(-40 0)">
        <path className="wire" d={tools.map(({ c }) => `M${hub[0]} ${hub[1]}L${c[0]} ${c[1]}`).join("")} />

        <g transform={floor(hub[0], hub[1] - 10)}>
          <rect width="100" height="100" fill={`url(#${id}-hatch)`} className="p-dim" />
        </g>

        {tools.map(({ label, c, s, icon }, i) => (
          <Layer key={label} sx={s[0]} sy={s[1]} amp={-5} delay={-i * 1.6} dur={5} d={1.6}>
            <g transform={floor(c[0], c[1] - 20)}>
              <rect width="40" height="40" className="p-solid" />
              <g className="ln-bright">{icon}</g>
              <text x="4" y="37" fontSize="5" className="t">{label}</text>
            </g>
          </Layer>
        ))}

        {tools.map(({ label, c }, i) => (
          <g key={label} transform={`translate(${hub[0]} ${hub[1]})`}>
            <g className="travel" style={{ "--tx": `${c[0] - hub[0]}px`, "--ty": `${c[1] - hub[1]}px`, animationDelay: `${i * 0.8}s` }}>
              <path d="M0 -3.5l6 3.5-6 3.5-6-3.5z" className="fill-ok" />
            </g>
          </g>
        ))}

        <Layer sy={-16} amp={-8} d={0.6}>
          <g transform={floor(hub[0], hub[1] - 50)}>
            <rect width="100" height="100" className="p-top" />
            {children}
            <Handles w={100} h={100} />
          </g>
        </Layer>
      </g>
    </svg>
  );
}

const calendar = <><rect x="10" y="9" width="20" height="18" rx="1" /><path d="M10 14h20M15 7v4M25 7v4" /></>;

/* Voice agents: a microphone over a live waveform, feeding calls, bookings
   and the CRM. */
export function VoiceArt() {
  return (
    <HubScene
      id="vo"
      hub={[225, 110]}
      tools={[
        { label: "CALLS", c: [95, 135], s: [-6, 2], icon: <><rect x="14" y="8" width="12" height="22" rx="2" /><path d="M18 26h4M29 14a6 6 0 0 1 0 8M32 11a10 10 0 0 1 0 14" /></> },
        { label: "BOOKING", c: [335, 84], s: [6, -4], icon: calendar },
        { label: "CRM", c: [325, 196], s: [6, 4], icon: <><ellipse cx="20" cy="12" rx="9" ry="3" /><path d="M11 12v14c0 2 4 3 9 3s9-1 9-3V12M11 19c0 2 4 3 9 3s9-1 9-3" /></> },
      ]}
    >
      <rect x="40" y="10" width="20" height="32" rx="10" className="ln-bright" />
      <path className="ln-bright" d="M32 32a18 18 0 0 0 36 0M50 50v8M42 58h16" />
      <path className="ln" d="M14 78v4M22 72v16M30 66v28M38 74v12M46 62v36M54 70v20M62 76v8M70 68v24M78 74v12M86 78v4" />
      <circle cx="84" cy="16" r="2.5" className="fill-ok" />
    </HubScene>
  );
}
