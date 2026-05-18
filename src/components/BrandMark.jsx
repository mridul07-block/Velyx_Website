export default function BrandMark({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" style={{ display: "inline-block" }}>
      <path d="M2 4 L12 22 L22 4 L17 4 L12 13 L7 4 Z" fill="currentColor" />
      <circle cx="12" cy="6" r="1.6" fill="oklch(0.78 0.16 65)" />
    </svg>
  );
}
