export default function WebArt() {
  return (
    <svg viewBox="0 0 320 180" className="art" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
      <g className="art__float">
        <rect x="56" y="24" width="208" height="136" rx="12" />
        <path d="M56 46h208" />
        <circle cx="70" cy="35" r="3" />
        <circle cx="82" cy="35" r="3" />
        <circle cx="94" cy="35" r="3" />
        <path d="M80 70h110M80 84h80" />
        <rect x="80" y="100" width="64" height="20" rx="10" />
        <rect x="200" y="66" width="44" height="70" rx="8" className="art__draw" />
      </g>
      <path className="art__cursor" d="M150 118l0 22 6-6 5 11 5-2-5-11h8z" fill="currentColor" />
    </svg>
  );
}
