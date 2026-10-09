/* A SaaS dashboard assembles itself, then ships. Beats: 1 sidebar,
   2 KPI cards and chart frame, 3 bars grow, 4 trend line draws,
   5 cursor heads to Deploy, 6 click → Live. */
const BARS = [[108, 18], [124, 30], [140, 24], [156, 40], [172, 50]];

export default function SaasArt() {
  return (
    <svg viewBox="0 0 320 180" className="art" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
      <rect x="30" y="12" width="260" height="156" rx="12" className="f-box" />
      <path d="M30 34h260" />
      <circle cx="44" cy="23" r="2.5" /><circle cx="54" cy="23" r="2.5" /><circle cx="64" cy="23" r="2.5" />
      <g className="saas-btn">
        <rect x="236" y="17" width="46" height="12" rx="6" className="btn-bg" />
        <text x="259" y="25.5" fontSize="7" textAnchor="middle" className="t t--hi btn-off">Deploy</text>
        <text x="259" y="25.5" fontSize="7" textAnchor="middle" className="t t--panel a a6">Live ✓</text>
        <circle cx="259" cy="23" r="12" className="s-ok click-ring" />
      </g>

      <g className="a a1 a--left">
        <rect x="38" y="42" width="50" height="118" rx="7" className="f-box2 s-none" />
        <rect x="44" y="63" width="38" height="12" rx="4" className="f-box2 s-none" />
        <path d="M48 54h22M48 69h26M48 85h20M48 99h24M48 113h18" />
      </g>

      <g className="layer" style={{ "--d": 1.2 }}>
        <g className="a a2 a--up">
          <rect x="96" y="42" width="88" height="40" rx="7" className="f-box2 s-none" />
          <text x="104" y="56" fontSize="7" className="t t--mu">Revenue</text>
          <text x="104" y="73" fontSize="13" className="t t--hi">24.8k</text>
        </g>
        <g className="a a2 a--up" style={{ transitionDelay: ".12s" }}>
          <rect x="192" y="42" width="88" height="40" rx="7" className="f-box2 s-none" />
          <text x="200" y="56" fontSize="7" className="t t--mu">Users</text>
          <text x="200" y="73" fontSize="13" className="t t--hi">1,284</text>
          <text x="272" y="73" fontSize="7" textAnchor="end" className="t t--ok">+18%</text>
        </g>
      </g>

      <rect x="96" y="90" width="184" height="70" rx="7" className="f-box2 s-none a a2 a--up" style={{ transitionDelay: ".24s" }} />
      {BARS.map(([x, h], i) => (
        <rect key={x} x={x} y={150 - h} width="9" height={h} rx="2"
          className={`s-none a a3 a--grow-y ${i === BARS.length - 1 ? "f-ok" : "f-mu"}`}
          style={{ transitionDelay: `${i * 0.08}s` }} />
      ))}
      <path d="M198 142c12-8 18-4 28-16s18-12 28-20 14-8 18-10" pathLength="1" className="s-ok a a4 a--draw" strokeWidth="1.75" />

      <g transform="translate(262 26)">
        <path d="M0 0v14l4-4 3 7 3-1-3-7h6z" className="f-hi s-panel saas-cursor" strokeWidth="1" />
      </g>
    </svg>
  );
}
SaasArt.steps = 6;
