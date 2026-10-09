export default function WhatsAppArt() {
  return (
    <svg viewBox="0 0 320 180" className="art" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25">
      <g className="art__float">
        <path d="M70 40h120a14 14 0 0 1 14 14v26a14 14 0 0 1-14 14H96l-18 14V94h-8a14 14 0 0 1-14-14V54a14 14 0 0 1 14-14z" />
        <path d="M80 60h90M80 72h60" />
      </g>
      <g className="art__float art__float--2">
        <path d="M250 98H150a14 14 0 0 0-14 14v14a14 14 0 0 0 14 14h76l18 14v-14h6a14 14 0 0 0 14-14v-14a14 14 0 0 0-14-14z" />
        <circle cx="176" cy="119" r="4" className="art__dot" />
        <circle cx="194" cy="119" r="4" className="art__dot" />
        <circle cx="212" cy="119" r="4" className="art__dot" />
      </g>
    </svg>
  );
}
