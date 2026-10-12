import { Link } from "react-router-dom";

/* Kargul-style top row: a standing offer of a free audit. */
export default function AuditBar() {
  return (
    <Link to="/intro-call?for=audit" className="audit">
      Get your product or website audited. For free
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M3 8h9M8.5 4l4 4-4 4" />
      </svg>
    </Link>
  );
}
