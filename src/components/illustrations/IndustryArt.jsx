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

/* Healthcare: a care plane with a cross and a heartbeat, feeding bookings,
   patient intake and insurance claims. */
export function HealthcareArt() {
  return (
    <HubScene
      id="hc"
      hub={[225, 110]}
      tools={[
        { label: "BOOKING", c: [95, 135], s: [-6, 2], icon: calendar },
        { label: "INTAKE", c: [335, 84], s: [6, -4], icon: <><rect x="12" y="9" width="16" height="21" rx="1" /><path d="M16 15h8M16 20h8M16 25h5" /></> },
        { label: "CLAIMS", c: [325, 196], s: [6, 4], icon: <path d="M20 8l9 4v7c0 6-4 10-9 12-5-2-9-6-9-12v-7z" /> },
      ]}
    >
      <path className="ln-bright" d="M42 22h16v12h12v16H58v12H42V50H30V34h12z" />
      <path className="ln" d="M12 84h22l5-10 6 16 5-11 4 5h34" />
      <circle cx="84" cy="84" r="2.5" className="fill-ok" />
    </HubScene>
  );
}

/* Real estate: a home with its floor plan, feeding lead capture, site
   visits and the CRM. */
export function RealEstateArt() {
  return (
    <HubScene
      id="re"
      hub={[220, 112]}
      tools={[
        { label: "LEADS", c: [92, 120], s: [-6, -2], icon: <><circle cx="20" cy="14" r="4.5" /><path d="M11 28a9 9 0 0 1 18 0" /></> },
        { label: "VISITS", c: [330, 80], s: [6, -4], icon: <><path d="M20 30s8-8 8-14a8 8 0 0 0-16 0c0 6 8 14 8 14z" /><circle cx="20" cy="16" r="3" /></> },
        { label: "CRM", c: [318, 198], s: [6, 4], icon: <path d="M10 11h20v13H18l-6 5v-5h-2z" /> },
      ]}
    >
      <path className="ln-bright" d="M22 52l28-24 28 24v30H22z" />
      <path className="ln" d="M42 82V64h16v18M22 52h56" />
      <rect x="64" y="12" width="26" height="18" className="ln" />
      <path className="ln" d="M64 21h14M77 12v18" />
      <circle cx="16" cy="16" r="2.5" className="fill-ok" />
    </HubScene>
  );
}

/* Automobile: a car on its service plane, feeding service bookings,
   customer approvals and parts. */
export function AutomotiveArt() {
  return (
    <HubScene
      id="au"
      hub={[228, 108]}
      tools={[
        { label: "SERVICE", c: [98, 138], s: [-6, 2], icon: <path d="M26 10a6 6 0 0 0-7 8l-8 8 3 3 8-8a6 6 0 0 0 8-7l-4 4-3-1-1-3z" /> },
        { label: "APPROVAL", c: [338, 90], s: [6, -4], icon: <><rect x="10" y="10" width="20" height="18" rx="2" /><path d="M14 19l4 4 8-9" /></> },
        { label: "PARTS", c: [322, 200], s: [6, 4], icon: <><circle cx="20" cy="19" r="5" /><path d="M20 8v4M20 26v4M9 19h4M27 19h4M12 11l3 3M25 24l3 3M28 11l-3 3M15 24l-3 3" /></> },
      ]}
    >
      <path className="ln-bright" d="M16 62h68l-7-16c-2-5-6-8-11-8H34c-5 0-9 3-11 8z" />
      <circle cx="32" cy="64" r="7" className="p-top" />
      <circle cx="68" cy="64" r="7" className="p-top" />
      <path className="ln" d="M30 86a20 20 0 0 1 40 0" />
      <path className="ln-bright" d="M50 86l9-9" />
      <circle cx="84" cy="16" r="2.5" className="fill-ok" />
    </HubScene>
  );
}

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

/* Automated CRM: a pipeline board whose cards move themselves, feeding
   lead capture, follow-ups and reports. */
export function CrmArt() {
  return (
    <HubScene
      id="cr"
      hub={[222, 110]}
      tools={[
        { label: "LEADS", c: [94, 128], s: [-6, -2], icon: <><circle cx="20" cy="14" r="4.5" /><path d="M11 28a9 9 0 0 1 18 0" /></> },
        { label: "FOLLOW-UP", c: [332, 82], s: [6, -4], icon: <path d="M14 26v-8a6 6 0 0 1 12 0v8l2 2H12zM18 31h4" /> },
        { label: "REPORTS", c: [320, 198], s: [6, 4], icon: <path d="M9 30h22M12 29v-8M18 29V15M24 29v-11M30 29V10" /> },
      ]}
    >
      <path className="ln" d="M10 14h22v72H10zM39 14h22v72H39zM68 14h22v72H68z" />
      <path className="ln-bright" d="M13 20h16v10H13zM13 34h16v10H13zM13 48h16v10H13zM42 20h16v10H42zM42 34h16v10H42zM71 20h16v10H71z" />
      <circle cx="79" cy="74" r="2.5" className="fill-ok" />
    </HubScene>
  );
}
