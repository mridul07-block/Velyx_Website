import { Link } from "react-router-dom";
import ClosingCTA from "./ClosingCTA";

/* TO CONFIRM: the Instagram handle. */
const SOCIAL = [
  { label: "Email Velyx Labs", href: "mailto:velyxlabs@gmail.com", d: "M3 6.5A1.5 1.5 0 014.5 5h15A1.5 1.5 0 0121 6.5v11a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 17.5zm1.6.4l7.4 5.5 7.4-5.5M3.6 17.6l5.9-5.1m11 5.1l-5.9-5.1", stroke: true },
  { label: "Velyx Labs on X", href: "https://x.com/VelyxLabs", d: "M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.1L4.8 21H1.6l7.5-8.6L1.2 3h6.6l4.5 5.6zm-1.1 16.2h1.8L6.6 4.7H4.7z" },
  { label: "Velyx Labs on LinkedIn", href: "https://www.linkedin.com/company/velyx-labs/", d: "M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.6h.06c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.77 2.5 4.77 5.75v5.6h-4v-4.96c0-1.18-.02-2.7-1.7-2.7-1.7 0-1.96 1.28-1.96 2.6v5.06h-4z" },
  { label: "Velyx Labs on Instagram", href: "https://www.instagram.com/velyxlabs/", d: "M7.5 3h9A4.5 4.5 0 0121 7.5v9a4.5 4.5 0 01-4.5 4.5h-9A4.5 4.5 0 013 16.5v-9A4.5 4.5 0 017.5 3zM12 8a4 4 0 100 8 4 4 0 000-8zm5.2-1.9a1 1 0 100 2 1 1 0 000-2z", stroke: true },
];

export default function SiteFooter() {
  return (
    <footer className="sfoot">
      <ClosingCTA />
      <div className="container sfoot__inner">
        <p className="sfoot__copy">© {new Date().getFullYear()} Velyx Labs</p>
        <nav className="sfoot__links" aria-label="Footer">
          <Link to="/work">Work</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
        <div className="sfoot__social">
          {SOCIAL.map((s) => (
            <a key={s.label} href={s.href} aria-label={s.label} {...(s.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
              <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true" {...(s.stroke ? { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } : { fill: "currentColor" })}>
                <path d={s.d} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
