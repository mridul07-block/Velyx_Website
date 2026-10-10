import { LOGO_ICON } from "../../lib/brand";
import { Guides, Handles, Layer, Patterns } from "./iso";
import { floor } from "./isoMatrix";

/* A Velyx hub plane hovers over its hatched shadow and streams work along
   dotted wires to Inbox, CRM and Calendar tiles floating around it. */
const HUB = [225, 110];
const TOOLS = [
  { label: "INBOX", c: [95, 135], s: [-6, 2], icon: <><rect x="10" y="9" width="20" height="14" rx="1" /><path d="M10 10l10 7 10-7" /></> },
  { label: "CRM", c: [335, 84], s: [6, -4], icon: <><circle cx="20" cy="14" r="4.5" /><path d="M11 28a9 9 0 0 1 18 0" /></> },
  { label: "CALENDAR", c: [325, 196], s: [6, 4], icon: <><rect x="10" y="9" width="20" height="18" rx="1" /><path d="M10 14h20M15 7v4M25 7v4" /></> },
];

export default function AgentsArt() {
  return (
    <svg viewBox="0 0 360 240" preserveAspectRatio="xMidYMid slice" className="art" aria-hidden="true" fill="none">
      <Patterns id="ag" />
      <Guides id="ag" w={360} h={240} />
      <g transform="translate(-40 0)">
      <path className="wire" d={TOOLS.map(({ c }) => `M${HUB[0]} ${HUB[1]}L${c[0]} ${c[1]}`).join("")} />

      <g transform={floor(225, 100)}>
        <rect width="100" height="100" fill="url(#ag-hatch)" className="p-dim" />
      </g>

      {TOOLS.map(({ label, c, s, icon }, i) => (
        <Layer key={label} sx={s[0]} sy={s[1]} amp={-5} delay={-i * 1.6} dur={5} d={1.6}>
          <g transform={floor(c[0], c[1] - 20)}>
            <rect width="40" height="40" className="p-solid" />
            <g className="ln-bright">{icon}</g>
            <text x="4" y="37" fontSize="5" className="t">{label}</text>
          </g>
        </Layer>
      ))}

      {TOOLS.map(({ label, c }, i) => (
        <g key={label} transform={`translate(${HUB[0]} ${HUB[1]})`}>
          <g className="travel" style={{ "--tx": `${c[0] - HUB[0]}px`, "--ty": `${c[1] - HUB[1]}px`, animationDelay: `${i * 0.8}s` }}>
            <path d="M0 -3.5l6 3.5-6 3.5-6-3.5z" className="fill-ok" />
          </g>
        </g>
      ))}

      <Layer sy={-16} amp={-8} d={0.6}>
        <g transform={floor(225, 60)}>
          <rect width="100" height="100" className="p-top" />
          <image href={LOGO_ICON} x="24" y="24" width="52" height="52" />
          <rect x="10" y="84" width="40" height="6" fill="url(#ag-hatch)" />
          <Handles w={100} h={100} />
        </g>
      </Layer>
      </g>
    </svg>
  );
}
