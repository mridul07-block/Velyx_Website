import { Link } from "react-router-dom";
import BtnLabel from "./BtnLabel";

/* Maydit-style "Intro call": a clean dark pill with a video-call glyph
   (the booking runs on Cal Video), opening the Cal.com booking page. */
export default function IntroCallButton({ className = "", children = "Intro call", ...props }) {
  return (
    <Link to="/intro-call" className={`btn btn--intro ${className}`.trim()} {...props}>
      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="5" width="11" height="10" rx="2.5" />
        <path d="M13 9l5-3v8l-5-3z" />
      </svg>
      <BtnLabel>{children}</BtnLabel>
    </Link>
  );
}
