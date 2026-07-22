/* ------------------------------------------------------------------
   INDUSTRY ICONS
   One line-icon per case study, keyed by slug. Keeps the card
   scannable — you know the industry before reading a word.
------------------------------------------------------------------ */

const PATHS = {
  "real-estate": (
    <>
      <path d="M3 11.2 12 4l9 7.2" />
      <path d="M5.6 9.8V20h12.8V9.8" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  "health-and-wellness": (
    <>
      <path d="M20.6 7.1a4.5 4.5 0 0 0-7.7-2L12 6l-.9-.9a4.5 4.5 0 0 0-7.7 2c0 4.2 5.5 8 8.6 10.8 3.1-2.8 8.6-6.6 8.6-10.8Z" />
      <path d="M3.6 12.2h3.6L9 10l1.8 4.4L12.6 12h3.2" />
    </>
  ),
  "coaching-and-consulting": (
    <>
      <circle cx="12" cy="8.2" r="3.4" />
      <path d="M5.4 20c0-3.3 3-5.4 6.6-5.4s6.6 2.1 6.6 5.4" />
      <path d="M17.8 4.4a4.6 4.6 0 0 1 0 6" />
    </>
  ),
  "legal-services": (
    <>
      <path d="M12 3.4v17" />
      <path d="M7 20.4h10" />
      <path d="M4.6 7.8 12 5.4l7.4 2.4" />
      <path d="M4.6 7.8 2.6 13a2.9 2.9 0 0 0 4 0Z" />
      <path d="M19.4 7.8 21.4 13a2.9 2.9 0 0 1-4 0Z" />
    </>
  ),
  "restaurants-and-cafes": (
    <>
      <path d="M4 8.6h12v4.8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z" />
      <path d="M16 10h2.4a2.4 2.4 0 0 1 0 4.8H16" />
      <path d="M7 3v2.2M11 3v2.2M15 3v2.2" />
      <path d="M3.4 21h14" />
    </>
  ),
  "beauty-and-salon-chains": (
    <>
      <circle cx="6.2" cy="18" r="2.3" />
      <circle cx="17.8" cy="18" r="2.3" />
      <path d="M7.8 16.3 18 4" />
      <path d="M16.2 16.3 6 4" />
    </>
  ),
  "b2b-saas-founders": (
    <>
      <path d="M12 3.2 3.2 8 12 12.8 20.8 8Z" />
      <path d="M3.2 12.4 12 17.2l8.8-4.8" />
      <path d="M3.2 16.6 12 21.4l8.8-4.8" />
    </>
  ),
  "event-management-and-wedding-planning": (
    <>
      <rect x="3.2" y="5.2" width="17.6" height="15.6" rx="2.4" />
      <path d="M8 3.2v4M16 3.2v4M3.2 10.4h17.6" />
      <path d="M12 13.4l1.1 2.2 2.4.35-1.75 1.7.4 2.4-2.15-1.13-2.15 1.13.4-2.4-1.75-1.7 2.4-.35Z" />
    </>
  ),
};

export default function IndustryIcon({ slug, size = 22 }) {
  const d = PATHS[slug];
  if (!d) return null;
  return (
    <svg
      className="cs-industry-icon"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {d}
    </svg>
  );
}
