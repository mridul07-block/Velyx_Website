/* A landing page builds itself in the browser. Beats: 1 nav, 2 headline,
   3 CTA button, 4 hero image is picked up, 5 dropped into its slot,
   6 feature cards, 7 the page scrolls to the next section. */
export default function WebArt() {
  return (
    <svg viewBox="0 0 320 180" className="art" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
      <defs>
        <clipPath id="web-viewport"><rect x="24" y="30" width="272" height="140" /></clipPath>
      </defs>
      <rect x="24" y="10" width="272" height="160" rx="12" className="f-box" />
      <path d="M24 30h272" />
      <circle cx="36" cy="20" r="2.5" /><circle cx="46" cy="20" r="2.5" /><circle cx="56" cy="20" r="2.5" />
      <rect x="110" y="15" width="100" height="10" rx="5" className="f-box2 s-none" />
      <text x="160" y="22.5" fontSize="6.5" textAnchor="middle" className="t t--mu">velyx.site</text>

      <g clipPath="url(#web-viewport)">
        <g className="web-page">
          <g className="a a1 a--up">
            <circle cx="42" cy="42" r="5" className="f-hi s-none" />
            <path d="M54 42h24M222 42h14M242 42h14M262 42h20" />
          </g>
          <rect x="36" y="58" width="112" height="9" rx="3" className="f-hi s-none a a2 a--grow-x" />
          <rect x="36" y="71" width="84" height="9" rx="3" className="f-hi s-none a a2 a--grow-x" style={{ transitionDelay: ".12s" }} />
          <path d="M36 90h96M36 97h70" className="a a2 a--up" style={{ transitionDelay: ".24s" }} />
          <g className="a a3 a--pop">
            <rect x="36" y="106" width="48" height="14" rx="7" className="f-ok s-none" />
            <text x="60" y="115.5" fontSize="6" textAnchor="middle" className="t t--panel">Get started</text>
          </g>
          <rect x="168" y="54" width="112" height="72" rx="8" className="web-slot" strokeDasharray="4 4" />
          <g className="layer" style={{ "--d": 1.3 }}>
            <g className="web-hero">
              <rect x="168" y="54" width="112" height="72" rx="8" className="f-box2" />
              <circle cx="250" cy="74" r="7" className="f-ok s-none" />
              <path d="M176 118l26-30 18 18 12-12 40 24" />
            </g>
          </g>
          {[36, 116, 196].map((x, i) => (
            <g key={x} className="a a6 a--up" style={{ transitionDelay: `${i * 0.1}s` }}>
              <rect x={x} y="138" width="72" height="42" rx="7" className="f-box2 s-none" />
              <circle cx={x + 12} cy="150" r="4" className="f-mu s-none" />
              <path d={`M${x + 8} 162h44M${x + 8} 169h30`} />
            </g>
          ))}
          <g className="a a7 a--up">
            <rect x="36" y="190" width="244" height="22" rx="6" className="f-box2 s-none" />
            <path d="M48 201h40M128 201h40M208 201h40" className="s-ok" />
          </g>
        </g>
      </g>

      <g transform="translate(224 92)">
        <path d="M0 0v14l4-4 3 7 3-1-3-7h6z" className="f-hi s-panel web-cursor" strokeWidth="1" />
      </g>
    </svg>
  );
}
WebArt.steps = 7;
