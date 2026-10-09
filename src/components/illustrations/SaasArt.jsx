export default function SaasArt() {
  return (
    <svg viewBox="0 0 320 180" className="art" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
      <g className="art__float art__float--3">
        <path d="M160 112l90-34-90-34-90 34z" />
        <path d="M70 78v10l90 34 90-34V78" />
      </g>
      <g className="art__float art__float--2">
        <path d="M160 92l70-26-70-26-70 26z" />
        <path className="art__draw" d="M120 66l40 15 40-15" />
      </g>
      <g className="art__float">
        <path d="M160 70l46-17-46-17-46 17z" />
        <circle cx="160" cy="53" r="5" className="art__pulse" />
      </g>
    </svg>
  );
}
