export default function MobileArt() {
  return (
    <svg viewBox="0 0 320 180" className="art" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
      <g className="art__float art__float--2">
        <rect x="104" y="20" width="70" height="140" rx="14" />
        <path d="M128 30h22M116 52h46M116 64h30" />
        <rect x="116" y="80" width="46" height="46" rx="8" />
      </g>
      <g className="art__float">
        <rect x="160" y="34" width="66" height="132" rx="14" />
        <path d="M182 44h22M172 66h42M172 78h26" />
        <circle cx="193" cy="120" r="16" className="art__pulse" />
      </g>
    </svg>
  );
}
