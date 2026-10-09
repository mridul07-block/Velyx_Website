import { Link } from "react-router-dom";
import Logo from "./Logo";
import FooterPlayground from "./FooterPlayground";

export default function SiteFooter() {
  return (
    <footer className="sfoot">
      <FooterPlayground />
      <div className="container sfoot__inner">
        <Link to="/" aria-label="Velyx Labs home"><Logo /></Link>
        <nav className="sfoot__links" aria-label="Footer">
          <a href="mailto:velyxlabs@gmail.com">velyxlabs@gmail.com</a>
          <a href="https://x.com/VelyxLabs" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://www.linkedin.com/company/velyx-labs/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
        <p className="sfoot__copy">© {new Date().getFullYear()} Velyx Labs</p>
      </div>
    </footer>
  );
}
