/* ------------------------------------------------------------------
   OFFERING VISUALS — animated SVGs for portfolio + detail pages
------------------------------------------------------------------ */
export function VizAgents() {
  return (
    <svg viewBox="0 0 400 320" width="100%" height="100%">
      <defs>
        <radialGradient id="va-glow"><stop offset="0%" stopColor="oklch(0.78 0.16 65)" stopOpacity="0.5" /><stop offset="100%" stopColor="oklch(0.78 0.16 65)" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="200" cy="160" r="120" fill="url(#va-glow)" />
      <g stroke="oklch(0.78 0.16 65 / 0.4)" strokeWidth="0.7">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * Math.PI * 2;
          return <line key={i} x1="200" y1="160" x2={200 + Math.cos(a) * 110} y2={160 + Math.sin(a) * 110} />;
        })}
      </g>
      <circle cx="200" cy="160" r="14" fill="oklch(0.78 0.16 65)" />
      <circle cx="200" cy="160" r="22" fill="none" stroke="oklch(0.78 0.16 65)" strokeOpacity="0.6">
        <animate attributeName="r" values="22;38;22" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2;
        const x = 200 + Math.cos(a) * 110, y = 160 + Math.sin(a) * 110;
        return <circle key={i} cx={x} cy={y} r="6" fill="oklch(0.14 0.01 60)" stroke="oklch(0.92 0.18 110)" strokeWidth="1.5" />;
      })}
      <text x="200" y="300" textAnchor="middle" fill="oklch(0.55 0.012 65)" fontFamily="Geist Mono" fontSize="10" letterSpacing="0.08em">8-AGENT FLEET · LIVE</text>
    </svg>
  );
}

export function VizSaas() {
  return (
    <svg viewBox="0 0 400 320" width="100%" height="100%">
      <rect x="40" y="40" width="320" height="240" rx="14" fill="oklch(0.12 0.012 60)" stroke="oklch(0.28 0.01 60)" />
      <circle cx="56" cy="56" r="3.5" fill="oklch(0.6 0.16 25)" />
      <circle cx="68" cy="56" r="3.5" fill="oklch(0.78 0.14 80)" />
      <circle cx="80" cy="56" r="3.5" fill="oklch(0.7 0.14 145)" />
      <rect x="60" y="80" width="180" height="10" rx="2" fill="oklch(0.96 0.005 80)" />
      <rect x="60" y="98" width="240" height="6" rx="2" fill="oklch(0.55 0.012 65)" />
      <rect x="60" y="108" width="200" height="6" rx="2" fill="oklch(0.55 0.012 65)" />
      <rect x="60" y="140" width="80" height="32" rx="16" fill="oklch(0.78 0.16 65)" />
      <text x="100" y="160" textAnchor="middle" fill="#14110a" fontSize="11" fontFamily="Geist" fontWeight="500">Try free</text>
      <g>
        <rect x="60" y="200" width="92" height="60" rx="8" fill="oklch(0.17 0.012 60)" stroke="oklch(0.28 0.01 60)" />
        <text x="68" y="220" fill="oklch(0.55 0.012 65)" fontSize="9" fontFamily="Geist Mono">USERS</text>
        <text x="68" y="248" fill="oklch(0.96 0.005 80)" fontSize="22" fontFamily="Geist" fontWeight="500">146</text>

        <rect x="160" y="200" width="92" height="60" rx="8" fill="oklch(0.17 0.012 60)" stroke="oklch(0.28 0.01 60)" />
        <text x="168" y="220" fill="oklch(0.55 0.012 65)" fontSize="9" fontFamily="Geist Mono">MRR</text>
        <text x="168" y="248" fill="oklch(0.96 0.005 80)" fontSize="22" fontFamily="Geist" fontWeight="500">$4.2K</text>

        <rect x="260" y="200" width="80" height="60" rx="8" fill="oklch(0.17 0.012 60)" stroke="oklch(0.78 0.16 65)" />
        <text x="268" y="220" fill="oklch(0.78 0.16 65)" fontSize="9" fontFamily="Geist Mono">LIVE</text>
        <text x="268" y="248" fill="oklch(0.96 0.005 80)" fontSize="22" fontFamily="Geist" fontWeight="500">38d</text>
      </g>
    </svg>
  );
}

export function VizCopilot() {
  return (
    <svg viewBox="0 0 400 320" width="100%" height="100%">
      <rect x="60" y="50" width="280" height="50" rx="12" fill="oklch(0.16 0.012 60)" stroke="oklch(0.28 0.01 60)" />
      <text x="80" y="72" fill="oklch(0.55 0.012 65)" fontFamily="Geist Mono" fontSize="9">SARAH · CFO · 9:42 AM</text>
      <text x="80" y="90" fill="oklch(0.78 0.01 70)" fontFamily="Geist" fontSize="12">What did we spend on AWS Q1?</text>

      <rect x="60" y="120" width="280" height="100" rx="12" fill="oklch(0.78 0.16 65 / 0.08)" stroke="oklch(0.78 0.16 65 / 0.4)" />
      <text x="80" y="142" fill="oklch(0.78 0.16 65)" fontFamily="Geist Mono" fontSize="9">FINANCE-COPILOT</text>
      <text x="80" y="162" fill="oklch(0.96 0.005 80)" fontFamily="Geist" fontSize="12">AWS Q1: $84,210 vs $72K forecast.</text>
      <text x="80" y="180" fill="oklch(0.78 0.01 70)" fontFamily="Geist" fontSize="11">Variance: +16.9% — Bedrock inference (+$9.8K).</text>
      <rect x="80" y="195" width="80" height="18" rx="9" fill="oklch(0.17 0.012 60)" stroke="oklch(0.28 0.01 60)" />
      <text x="120" y="207" textAnchor="middle" fill="oklch(0.78 0.01 70)" fontFamily="Geist Mono" fontSize="9">Show breakdown</text>
      <rect x="170" y="195" width="68" height="18" rx="9" fill="oklch(0.17 0.012 60)" stroke="oklch(0.28 0.01 60)" />
      <text x="204" y="207" textAnchor="middle" fill="oklch(0.78 0.01 70)" fontFamily="Geist Mono" fontSize="9">Compare Q4</text>

      <circle cx="80" cy="250" r="4" fill="oklch(0.92 0.18 110)">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <text x="92" y="254" fill="oklch(0.55 0.012 65)" fontFamily="Geist Mono" fontSize="10" letterSpacing="0.04em">FINANCE-COPILOT TYPING…</text>
    </svg>
  );
}

export function VizWorkflow() {
  return (
    <svg viewBox="0 0 400 320" width="100%" height="100%">
      <g stroke="oklch(0.4 0.01 60)" strokeWidth="1" fill="none">
        <path d="M70,80 L180,80" />
        <path d="M180,80 L290,80" />
        <path d="M180,80 L180,180" />
        <path d="M180,180 L290,180" />
        <path d="M180,180 L180,260" />
        <path d="M180,260 L290,260" />
      </g>
      {[
        [70, 80, "TRIGGER"], [180, 80, "PARSE"], [290, 80, "VALIDATE"],
        [180, 180, "MATCH"], [290, 180, "QB"],
        [180, 260, "NOTIFY"], [290, 260, "SLACK"],
      ].map(([x, y, t], i) => (
        <g key={i}>
          <rect x={x - 48} y={y - 16} width="96" height="32" rx="8" fill="oklch(0.16 0.012 60)" stroke="oklch(0.78 0.16 65 / 0.5)" />
          <text x={x} y={y + 4} textAnchor="middle" fill="oklch(0.96 0.005 80)" fontFamily="Geist Mono" fontSize="10">{t}</text>
        </g>
      ))}
      <circle r="3" fill="oklch(0.92 0.18 110)">
        <animateMotion dur="4s" repeatCount="indefinite" path="M70,80 L180,80 L180,180 L180,260 L290,260" />
      </circle>
    </svg>
  );
}

export function VizStrategy() {
  return (
    <svg viewBox="0 0 400 320" width="100%" height="100%">
      <g>
        {["Q1", "Q2", "Q3", "Q4"].map((q, i) => {
          const states = ["done", "now", "next", "next"];
          const colors = { done: "oklch(0.92 0.18 110)", now: "oklch(0.78 0.16 65)", next: "oklch(0.55 0.012 65)" };
          const c = colors[states[i]];
          return (
            <g key={q}>
              <rect x="40" y={50 + i * 60} width="320" height="44" rx="8"
                fill={states[i] === "now" ? "oklch(0.78 0.16 65 / 0.06)" : "oklch(0.12 0.012 60)"}
                stroke="oklch(0.28 0.01 60)" />
              <text x="56" y={50 + i * 60 + 26} fill={c} fontFamily="Geist Mono" fontSize="13" letterSpacing="0.04em">{q}</text>
              <rect x="84" y={50 + i * 60 + 18} width={[180, 220, 140, 120][i]} height="6" rx="3" fill={c} opacity="0.6" />
              <text x="320" y={50 + i * 60 + 26} fill={c} fontFamily="Geist Mono" fontSize="9" textAnchor="end" letterSpacing="0.06em">{states[i].toUpperCase()}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
