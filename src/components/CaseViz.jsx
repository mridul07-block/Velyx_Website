/* ------------------------------------------------------------------
   CASE STUDY CARD VISUALS
   Animated SVGs matching the site palette. One per industry archetype.
------------------------------------------------------------------ */

const AMBER = "oklch(0.78 0.16 65)";
const LIME = "oklch(0.92 0.18 110)";
const MUTE = "oklch(0.55 0.012 65)";
const FG = "oklch(0.96 0.005 80)";
const PANEL = "oklch(0.17 0.012 60)";
const PANEL_D = "oklch(0.12 0.012 60)";
const LINE = "oklch(0.28 0.01 60)";

/* Lead funnel — real estate */
export function VizFunnel() {
  const rows = [
    { w: 280, label: "LEADS", v: "400" },
    { w: 210, label: "ENGAGED", v: "342" },
    { w: 150, label: "QUALIFIED", v: "272" },
    { w: 96, label: "VISITS", v: "106" },
  ];
  return (
    <svg viewBox="0 0 400 320" width="100%" height="100%">
      <defs>
        <radialGradient id="cf-glow">
          <stop offset="0%" stopColor={AMBER} stopOpacity="0.35" />
          <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="160" rx="170" ry="130" fill="url(#cf-glow)" />
      {rows.map((r, i) => (
        <g key={r.label}>
          <rect
            x={200 - r.w / 2}
            y={54 + i * 62}
            width={r.w}
            height="44"
            rx="8"
            fill={i === rows.length - 1 ? "oklch(0.78 0.16 65 / 0.10)" : PANEL_D}
            stroke={i === rows.length - 1 ? AMBER : LINE}
          >
            <animate
              attributeName="opacity"
              values="0.55;1;0.55"
              dur="3s"
              begin={`${i * 0.35}s`}
              repeatCount="indefinite"
            />
          </rect>
          <text x={200 - r.w / 2 + 14} y={54 + i * 62 + 28} fill={MUTE} fontFamily="Geist Mono" fontSize="9.5" letterSpacing="0.08em">
            {r.label}
          </text>
          <text x={200 + r.w / 2 - 14} y={54 + i * 62 + 28} fill={i === rows.length - 1 ? AMBER : FG} fontFamily="Geist" fontSize="15" fontWeight="500" textAnchor="end">
            {r.v}
          </text>
        </g>
      ))}
      <circle r="3.5" fill={LIME}>
        <animateMotion dur="3.2s" repeatCount="indefinite" path="M200,76 L200,138 L200,200 L200,262" />
      </circle>
    </svg>
  );
}

/* Booking grid — health, salon */
export function VizCalendar() {
  const cells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 6; c++) cells.push({ r, c, i: r * 6 + c });
  }
  const booked = [0, 1, 3, 4, 6, 7, 8, 10, 12, 13, 15, 16, 18, 19, 20, 22];
  const filling = [5, 11, 17];
  return (
    <svg viewBox="0 0 400 320" width="100%" height="100%">
      <defs>
        <radialGradient id="cc-glow">
          <stop offset="0%" stopColor={AMBER} stopOpacity="0.28" />
          <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="150" rx="180" ry="130" fill="url(#cc-glow)" />
      {["MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d, i) => (
        <text key={d} x={54 + i * 52} y="52" fill={MUTE} fontFamily="Geist Mono" fontSize="8.5" letterSpacing="0.08em" textAnchor="middle">
          {d}
        </text>
      ))}
      {cells.map(({ r, c, i }) => {
        const isBooked = booked.includes(i);
        const isFilling = filling.includes(i);
        return (
          <rect
            key={i}
            x={54 + c * 52 - 22}
            y={66 + r * 50}
            width="44"
            height="38"
            rx="6"
            fill={isBooked ? "oklch(0.78 0.16 65 / 0.16)" : PANEL_D}
            stroke={isFilling ? LIME : isBooked ? "oklch(0.78 0.16 65 / 0.5)" : LINE}
          >
            {isFilling && (
              <animate attributeName="fill" values={`${PANEL_D};oklch(0.92 0.18 110 / 0.22);${PANEL_D}`} dur="2.4s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
            )}
          </rect>
        );
      })}
      <circle cx="60" cy="292" r="4" fill={LIME}>
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <text x="74" y="296" fill={MUTE} fontFamily="Geist Mono" fontSize="9.5" letterSpacing="0.06em">
        WAITLIST BACKFILL · 9 MIN
      </text>
    </svg>
  );
}

/* Agent fleet — coaching, SaaS */
export function VizAgents() {
  return (
    <svg viewBox="0 0 400 320" width="100%" height="100%">
      <defs>
        <radialGradient id="ca-glow">
          <stop offset="0%" stopColor={AMBER} stopOpacity="0.5" />
          <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="155" r="120" fill="url(#ca-glow)" />
      <g stroke="oklch(0.78 0.16 65 / 0.35)" strokeWidth="0.7">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
          return <line key={i} x1="200" y1="155" x2={200 + Math.cos(a) * 105} y2={155 + Math.sin(a) * 105} />;
        })}
      </g>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        return (
          <circle key={`p${i}`} r="2.5" fill={LIME}>
            <animateMotion
              dur="2.6s"
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
              path={`M${200 + Math.cos(a) * 105},${155 + Math.sin(a) * 105} L200,155`}
            />
          </circle>
        );
      })}
      <circle cx="200" cy="155" r="15" fill={AMBER} />
      <circle cx="200" cy="155" r="24" fill="none" stroke={AMBER} strokeOpacity="0.6">
        <animate attributeName="r" values="24;42;24" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="2.8s" repeatCount="indefinite" />
      </circle>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        return (
          <circle key={`n${i}`} cx={200 + Math.cos(a) * 105} cy={155 + Math.sin(a) * 105} r="7" fill={PANEL_D} stroke={LIME} strokeWidth="1.5" />
        );
      })}
      <text x="200" y="298" textAnchor="middle" fill={MUTE} fontFamily="Geist Mono" fontSize="9.5" letterSpacing="0.08em">
        SPECIALIST FLEET · LIVE
      </text>
    </svg>
  );
}

/* Document pipeline — legal */
export function VizDocs() {
  return (
    <svg viewBox="0 0 400 320" width="100%" height="100%">
      <defs>
        <radialGradient id="cd-glow">
          <stop offset="0%" stopColor={AMBER} stopOpacity="0.26" />
          <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="150" rx="175" ry="130" fill="url(#cd-glow)" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${44 + i * 18}, ${44 + i * 14})`} opacity={i === 2 ? 1 : 0.32}>
          <rect width="150" height="196" rx="10" fill={i === 2 ? PANEL : PANEL_D} stroke={i === 2 ? AMBER : LINE} />
          {i === 2 && (
            <>
              <rect x="18" y="24" width="86" height="9" rx="2" fill={FG} />
              {[0, 1, 2, 3, 4, 5].map((l) => (
                <rect key={l} x="18" y={48 + l * 16} width={l % 3 === 2 ? 70 : 114} height="5" rx="2" fill={MUTE}>
                  <animate attributeName="opacity" values="0;1;1" dur="3.6s" begin={`${l * 0.28}s`} repeatCount="indefinite" />
                </rect>
              ))}
              <rect x="18" y="152" width="60" height="20" rx="10" fill="oklch(0.78 0.16 65 / 0.15)" stroke={AMBER} />
              <text x="48" y="166" textAnchor="middle" fill={AMBER} fontFamily="Geist Mono" fontSize="8.5">
                DRAFT
              </text>
            </>
          )}
        </g>
      ))}
      <g transform="translate(232, 76)">
        <rect width="128" height="46" rx="9" fill={PANEL_D} stroke="oklch(0.7 0.14 145 / 0.6)" />
        <circle cx="18" cy="23" r="5" fill="oklch(0.7 0.14 145)" />
        <text x="34" y="20" fill={MUTE} fontFamily="Geist Mono" fontSize="8">
          CONFLICT CHECK
        </text>
        <text x="34" y="34" fill={FG} fontFamily="Geist" fontSize="12">
          Clear · 6 min
        </text>
      </g>
      <g transform="translate(232, 140)">
        <rect width="128" height="46" rx="9" fill={PANEL_D} stroke={LINE} />
        <text x="14" y="20" fill={MUTE} fontFamily="Geist Mono" fontSize="8">
          PARTNER REVIEW
        </text>
        <text x="14" y="34" fill={FG} fontFamily="Geist" fontSize="12">
          Awaiting sign-off
        </text>
        <circle cx="112" cy="27" r="4" fill={AMBER}>
          <animate attributeName="opacity" values="0.25;1;0.25" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </g>
      <text x="232" y="240" fill={MUTE} fontFamily="Geist Mono" fontSize="9" letterSpacing="0.06em">
        LAWYER SIGN-OFF: 100%
      </text>
    </svg>
  );
}

/* Guest / order loop — restaurants */
export function VizOrders() {
  return (
    <svg viewBox="0 0 400 320" width="100%" height="100%">
      <defs>
        <radialGradient id="co-glow">
          <stop offset="0%" stopColor={AMBER} stopOpacity="0.3" />
          <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="155" rx="170" ry="130" fill="url(#co-glow)" />
      <circle cx="200" cy="158" r="92" fill="none" stroke={LINE} strokeDasharray="3 6" />
      {[
        ["VISIT", 0],
        ["ORDER", 1],
        ["PROFILE", 2],
        ["WIN-BACK", 3],
      ].map(([label, i]) => {
        const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
        const x = 200 + Math.cos(a) * 92;
        const y = 158 + Math.sin(a) * 92;
        return (
          <g key={label}>
            <rect x={x - 44} y={y - 15} width="88" height="30" rx="15" fill={PANEL} stroke={AMBER} strokeOpacity="0.55" />
            <text x={x} y={y + 4} textAnchor="middle" fill={FG} fontFamily="Geist Mono" fontSize="9" letterSpacing="0.05em">
              {label}
            </text>
          </g>
        );
      })}
      <circle r="4" fill={LIME}>
        <animateMotion dur="5s" repeatCount="indefinite" path="M200,66 A92,92 0 0,1 292,158 A92,92 0 0,1 200,250 A92,92 0 0,1 108,158 A92,92 0 0,1 200,66" />
      </circle>
      <text x="200" y="152" textAnchor="middle" fill={AMBER} fontFamily="Geist" fontSize="24" fontWeight="500">
        11.4K
      </text>
      <text x="200" y="170" textAnchor="middle" fill={MUTE} fontFamily="Geist Mono" fontSize="8.5" letterSpacing="0.08em">
        OWNED GUESTS
      </text>
      <text x="200" y="300" textAnchor="middle" fill={MUTE} fontFamily="Geist Mono" fontSize="9" letterSpacing="0.06em">
        ZERO COMMISSION LOOP
      </text>
    </svg>
  );
}

/* Workflow tree — events */
export function VizWorkflow() {
  const nodes = [
    [78, 70, "ENQUIRY"],
    [200, 70, "PROPOSAL"],
    [322, 70, "BOOKED"],
    [200, 160, "VENDORS"],
    [322, 160, "30 LOCKED"],
    [200, 250, "RSVP"],
    [322, 250, "LIVE COUNT"],
  ];
  return (
    <svg viewBox="0 0 400 320" width="100%" height="100%">
      <defs>
        <radialGradient id="cw-glow">
          <stop offset="0%" stopColor={AMBER} stopOpacity="0.24" />
          <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="160" rx="180" ry="135" fill="url(#cw-glow)" />
      <g stroke="oklch(0.4 0.01 60)" strokeWidth="1" fill="none">
        <path d="M78,70 L200,70" />
        <path d="M200,70 L322,70" />
        <path d="M200,70 L200,160" />
        <path d="M200,160 L322,160" />
        <path d="M200,160 L200,250" />
        <path d="M200,250 L322,250" />
      </g>
      {nodes.map(([x, y, t]) => (
        <g key={t}>
          <rect x={x - 50} y={y - 16} width="100" height="32" rx="8" fill={PANEL} stroke="oklch(0.78 0.16 65 / 0.5)" />
          <text x={x} y={y + 4} textAnchor="middle" fill={FG} fontFamily="Geist Mono" fontSize="9" letterSpacing="0.04em">
            {t}
          </text>
        </g>
      ))}
      <circle r="3.5" fill={LIME}>
        <animateMotion dur="4.5s" repeatCount="indefinite" path="M78,70 L200,70 L200,160 L200,250 L322,250" />
      </circle>
    </svg>
  );
}
