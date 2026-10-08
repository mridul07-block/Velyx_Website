import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import CalButton from "./CalButton";

const LINKS = [
  { label: "Services", to: "/services" },
  { label: "Process", to: "/#process" },
  { label: "About", to: "/#about" },
  { label: "Contact", to: "/contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(() => typeof window !== "undefined" && window.scrollY > 20);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${scrolled || open ? "nav--solid" : ""}`}>
      <nav className="nav__inner container" aria-label="Main">
        <Link to="/" className="nav__brand" aria-label="Velyx Labs home" onClick={close}>
          <Logo />
        </Link>
        <ul className="nav__links">
          {LINKS.map((l) => (
            <li key={l.label}>
              <Link to={l.to}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <div className="nav__actions">
          <CalButton size="sm" className="nav__cta" />
          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
        {open && (
          <div id="mobile-menu" className="nav__mobile">
            <ul>
              {LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} onClick={close}>{l.label}</Link>
                </li>
              ))}
            </ul>
            <CalButton block />
          </div>
        )}
      </nav>
    </header>
  );
}
