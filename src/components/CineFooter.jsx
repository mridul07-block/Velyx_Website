import { Link } from "react-router-dom";
import BrandMark from "./BrandMark";

export default function CineFooter() {
  return (
    <footer className="footer-pro" data-screen-label="12 Footer">
      <div className="footer-pro__grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
            <img src="https://res.cloudinary.com/dmhabztbf/image/upload/v1779688104/ChatGPT_Image_May_25__2026__11_15_18_AM-removebg-preview_hy48ex.png" alt="Velyx Labs Icon" style={{ height: 50, width: 50, objectFit: "contain", marginRight: 2 }} />
            <div style={{ width: 1, height: 38, background: "linear-gradient(to bottom, transparent, rgba(240,146,15,0.7), transparent)" }} />
            <div style={{ display: "flex", alignItems: "baseline", fontSize: 26, letterSpacing: "-0.01em", marginLeft: 14 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: "var(--fg, #f6f1e7)" }}>vely</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: "#f0920f" }}>x</span>
              <span style={{ fontFamily: "var(--font-sans, sans-serif)", fontWeight: 400, color: "var(--fg, #f6f1e7)", marginLeft: 6 }}>labs</span>
            </div>
          </div>
          <p style={{ fontSize: 14.5, color: "var(--fg-dim)", maxWidth: "36ch", lineHeight: 1.55, marginBottom: 24 }}>
            We partner with founders to engineer compounding operating leverage —
            through agentic systems, AI-native SaaS, and bespoke automation.
          </p>

          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", letterSpacing: ".08em", marginBottom: 10, textTransform: "uppercase" }}>
            Get the dispatch — monthly.
          </div>
          <form className="footer-pro__news" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="founder@yourcompany.com" />
            <button type="submit">Subscribe ↗</button>
          </form>

          <div className="footer-pro__locations">
            <div><strong>PUNE</strong><span>HQ · 18.52°N</span></div>
            <div><strong>SAN FRANCISCO</strong><span>SAT · 37.77°N</span></div>
            <div><strong>REMOTE</strong><span>EVERYWHERE</span></div>
          </div>
        </div>

        <div>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em", color: "var(--fg-mute)", textTransform: "uppercase", marginBottom: 18 }}>Studio</h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            <li><Link to="/services" style={{ fontSize: 14.5, color: "var(--fg-dim)" }}>Services</Link></li>
            <li><Link to="/portfolio" style={{ fontSize: 14.5, color: "var(--fg-dim)" }}>Portfolio</Link></li>
            <li><Link to="/testimonials" style={{ fontSize: 14.5, color: "var(--fg-dim)" }}>Testimonials</Link></li>
            <li><Link to="/contact" style={{ fontSize: 14.5, color: "var(--fg-dim)" }}>Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em", color: "var(--fg-mute)", textTransform: "uppercase", marginBottom: 18 }}>Practice</h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            <li><Link to="/services#agents" style={{ fontSize: 14.5, color: "var(--fg-dim)" }}>Agentic systems</Link></li>
            <li><Link to="/services#saas" style={{ fontSize: 14.5, color: "var(--fg-dim)" }}>SaaS MVPs</Link></li>
            <li><Link to="/services#copilots" style={{ fontSize: 14.5, color: "var(--fg-dim)" }}>Internal copilots</Link></li>
            <li><Link to="/services#workflows" style={{ fontSize: 14.5, color: "var(--fg-dim)" }}>Custom workflows</Link></li>
            <li><Link to="/services#strategy" style={{ fontSize: 14.5, color: "var(--fg-dim)" }}>AI strategy</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em", color: "var(--fg-mute)", textTransform: "uppercase", marginBottom: 18 }}>Elsewhere</h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            <li><a href="https://x.com/VelyxLabs" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14.5, color: "var(--fg-dim)" }}>X / Twitter</a></li>
            <li><a href="https://www.linkedin.com/company/velyx-labs/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14.5, color: "var(--fg-dim)" }}>LinkedIn</a></li>
            <li><a href="https://github.com/ATHARVISM2804" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14.5, color: "var(--fg-dim)" }}>GitHub</a></li>
            <li><a href="mailto:velyxlabs@gmail.com" style={{ fontSize: 14.5, color: "var(--fg-dim)" }}>velyxlabs@gmail.com</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-pro__giant">
        VELYX<span className="serif"> · </span>LABS
      </div>

      <div className="footer-pro__bottom">
        <span>© 2026 VELYX LABS · ALL RIGHTS RESERVED</span>
        <div className="links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Trust</a>
        </div>
        <span>BUILT BY HUMANS · DEPLOYED BY AGENTS</span>
      </div>
    </footer>
  );
}
