export default function AgentsArt() {
  return (
    <svg viewBox="0 0 320 180" className="art" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path className="art__draw" d="M160 90 80 50M160 90l80-40M160 90l-80 45M160 90l80 45" />
      <g className="art__float">
        <circle cx="160" cy="90" r="22" className="art__pulse" />
        <circle cx="160" cy="90" r="8" />
      </g>
      <g className="art__float art__float--2">
        <rect x="52" y="32" width="56" height="36" rx="10" />
        <path d="M62 45h30M62 54h18" />
      </g>
      <g className="art__float art__float--3">
        <rect x="212" y="32" width="56" height="36" rx="10" />
        <path d="M222 45h30M222 54h18" />
      </g>
      <g className="art__float art__float--3">
        <rect x="52" y="117" width="56" height="36" rx="10" />
        <path d="M62 130h30M62 139h18" />
      </g>
      <g className="art__float art__float--2">
        <rect x="212" y="117" width="56" height="36" rx="10" />
        <path d="M222 130h30M222 139h18" />
      </g>
    </svg>
  );
}
