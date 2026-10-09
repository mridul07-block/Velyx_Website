/* A mobile app in use. Beats: 1 home screen loads, 2 swipe to the
   product, 3 a notification drops in, 4 tap to pay, 5 swipe to success,
   6 store badges pop out around the phone. */
export default function MobileArt() {
  return (
    <svg viewBox="0 0 320 180" className="art" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
      <defs>
        <clipPath id="mobile-screen"><rect x="130" y="22" width="60" height="146" rx="8" /></clipPath>
      </defs>

      <g className="layer" style={{ "--d": 2 }}>
        <g className="a a6 a--pop">
          <rect x="34" y="52" width="62" height="22" rx="11" className="f-box2 s-none loop-float" />
          <text x="65" y="66" fontSize="8" textAnchor="middle" className="t t--hi loop-float">iOS</text>
        </g>
        <g className="a a6 a--pop" style={{ transitionDelay: ".12s" }}>
          <rect x="44" y="104" width="56" height="22" rx="11" className="f-box2 s-none loop-float" style={{ animationDelay: "-1.5s" }} />
          <text x="72" y="118" fontSize="8" textAnchor="middle" className="t t--ok loop-float" style={{ animationDelay: "-1.5s" }}>★ 4.9</text>
        </g>
        <g className="a a6 a--pop" style={{ transitionDelay: ".24s" }}>
          <rect x="218" y="78" width="70" height="22" rx="11" className="f-box2 s-none loop-float" style={{ animationDelay: "-3s" }} />
          <text x="253" y="92" fontSize="8" textAnchor="middle" className="t t--hi loop-float" style={{ animationDelay: "-3s" }}>Android</text>
        </g>
      </g>

      <rect x="124" y="6" width="72" height="168" rx="14" className="f-box" />
      <rect x="148" y="12" width="24" height="5" rx="2.5" className="f-mu s-none" />
      <g clipPath="url(#mobile-screen)">
        <g className="mob-strip">
          <g className="a a1 a--up">
            <path d="M136 32h24" />
            <rect x="136" y="40" width="48" height="36" rx="6" className="f-oktint s-ok" />
            <path d="M136 86h40M136 94h30" />
            <rect x="136" y="104" width="48" height="12" rx="4" className="f-box2 s-none" />
            <rect x="136" y="120" width="48" height="12" rx="4" className="f-box2 s-none" />
            <rect x="136" y="136" width="48" height="12" rx="4" className="f-box2 s-none" />
          </g>
          <circle cx="220" cy="62" r="18" className="f-box2" />
          <path d="M200 92h40M204 100h32M208 114h24" />
          <rect x="196" y="140" width="48" height="14" rx="7" className="f-ok s-none" />
          <text x="220" y="149.5" fontSize="6.5" textAnchor="middle" className="t t--panel">Pay now</text>
          <circle cx="280" cy="70" r="14" className="f-ok s-none" />
          <path d="M274 70.5l4 4 8-8" className="s-panel" strokeWidth="2" />
          <path d="M262 98h36M268 106h24" />
        </g>
      </g>
      <g className="mob-notif">
        <rect x="128" y="20" width="64" height="18" rx="6" className="f-hi s-none" />
        <circle cx="137" cy="29" r="3.5" className="f-ok s-none" />
        <text x="144" y="31.5" fontSize="6.5" className="t t--panel">New order</text>
      </g>
      <g className="mob-tap">
        <circle cx="160" cy="147" r="6" className="f-hi s-none" />
        <circle cx="160" cy="147" r="6" className="loop-ring s-hi" />
      </g>
    </svg>
  );
}
MobileArt.steps = 6;
