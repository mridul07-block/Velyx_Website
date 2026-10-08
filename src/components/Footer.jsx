import { Link } from "react-router-dom";
import Logo from "./Logo";

const COLUMNS = [
  {
    title: "Services",
    links: [
      { label: "Agentic automation", to: "/services#agents" },
      { label: "AI SaaS & MVPs", to: "/services#saas" },
      { label: "WhatsApp automation + CRM", to: "/services#whatsapp" },
      { label: "Websites & mobile apps", to: "/services#web" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/#about" },
      { label: "Process", to: "/#process" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

const SOCIAL = [
  { label: "X / Twitter", href: "https://x.com/VelyxLabs" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/velyx-labs/" },
  { label: "GitHub", href: "https://github.com/ATHARVISM2804" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo />
          <p className="muted">
            We design and build agentic systems, AI-native SaaS and automation for founders.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h2 className="footer__title">{col.title}</h2>
            <ul className="footer__list">
              {col.links.map((l) => (
                <li key={l.label}><Link to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="footer__title">Connect</h2>
          <ul className="footer__list">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
              </li>
            ))}
            <li><a href="mailto:velyxlabs@gmail.com">velyxlabs@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Velyx Labs</span>
        <span className="footer__legal">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </span>
      </div>
    </footer>
  );
}
