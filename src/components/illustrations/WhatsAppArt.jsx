/* A WhatsApp booking runs itself. Beats: 1 customer asks, 2 bot types,
   3 bot replies, 4 customer confirms, 5 booking card, 6 read ticks. */
function Ticks({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 3l2 2 4-4M3.5 5l4-4" className="s-read a a6 a--pop" strokeWidth="1.2" />
    </g>
  );
}

export default function WhatsAppArt() {
  return (
    <svg viewBox="0 0 320 180" className="art" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
      <rect x="70" y="6" width="180" height="168" rx="14" className="f-box" />
      <circle cx="90" cy="24" r="8" className="f-ok s-none" />
      <path d="M86 24.5l2.5 2.5 5-5" className="s-panel" strokeWidth="1.5" />
      <text x="104" y="22" fontSize="8" className="t t--hi">Velyx Bot</text>
      <text x="104" y="31" fontSize="6.5" className="t t--ok loop-blink">online</text>
      <path d="M70 40h180" />

      <g className="a a1 a--bubble-l">
        <rect x="80" y="48" width="100" height="20" rx="8" className="f-box2 s-none" />
        <text x="88" y="61" fontSize="7.5" className="t t--hi">Table for 4 tonight?</text>
      </g>
      <g className="typing">
        <rect x="208" y="74" width="32" height="18" rx="8" className="f-bot s-none" />
        <circle cx="217" cy="83" r="2" className="f-mu s-none loop-blink" />
        <circle cx="224" cy="83" r="2" className="f-mu s-none loop-blink" style={{ animationDelay: ".2s" }} />
        <circle cx="231" cy="83" r="2" className="f-mu s-none loop-blink" style={{ animationDelay: ".4s" }} />
      </g>
      <g className="a a3 a--bubble-r">
        <rect x="136" y="74" width="104" height="20" rx="8" className="f-bot s-none" />
        <text x="144" y="87" fontSize="7.5" className="t t--hi">Sure! 8:00 PM works?</text>
      </g>
      <Ticks x={229} y={84} />
      <g className="a a4 a--bubble-l">
        <rect x="80" y="100" width="62" height="20" rx="8" className="f-box2 s-none" />
        <text x="88" y="113" fontSize="7.5" className="t t--hi">Yes please!</text>
      </g>
      <g className="layer" style={{ "--d": 1.4 }}>
        <g className="a a5 a--up">
          <rect x="112" y="128" width="128" height="34" rx="9" className="f-bot s-ok" />
          <circle cx="126" cy="145" r="7" className="f-ok s-none" />
          <path d="M122.5 145.5l2.5 2.5 5-5" className="s-panel" strokeWidth="1.5" />
          <text x="138" y="142" fontSize="7.5" className="t t--hi">Booking confirmed</text>
          <text x="138" y="153" fontSize="6.5" className="t t--mu">Fri · 8:00 PM · 4 guests</text>
        </g>
      </g>
      <Ticks x={229} y={153} />
    </svg>
  );
}
WhatsAppArt.steps = 6;
