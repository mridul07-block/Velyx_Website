import { Link } from "react-router-dom";
import ClosingCTA from "./ClosingCTA";
import { askAiLinks } from "../lib/askAi";

export default function SiteFooter() {
  return (
    <footer className="sfoot">
      <ClosingCTA />
      <div className="container sfoot__inner">
        <p className="sfoot__copy">© {new Date().getFullYear()} Velyx Labs</p>
        <nav className="sfoot__links" aria-label="Footer">
          <a href="mailto:velyxlabs@gmail.com">velyxlabs@gmail.com</a>
          <a href="https://x.com/VelyxLabs" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://www.linkedin.com/company/velyx-labs/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <Link to="/work">Work</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
      </div>
      <div className="container askai">
        <span className="askai__label">Ask AI about Velyx Labs</span>
        {askAiLinks().map((l) => (
          <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`Ask ${l.name} about Velyx Labs`}>{l.name}</a>
        ))}
      </div>
    </footer>
  );
}
