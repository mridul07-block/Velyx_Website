import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const LINKS = [
  { label: "Recent Work", to: "/work" },
  { label: "Swipe file", to: "/swipe-file" },
];

export default function PillNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="pnav">
      <nav className="pnav__inner" aria-label="Main">
        <Link to="/" className="pnav__logo" aria-label="Velyx Labs home" onClick={close}>
          <img src="/brand/velyx-mark-nav.webp" alt="" width="96" height="104" />
        </Link>
        <ul className="pnav__links">
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to}>{l.label}</NavLink>
            </li>
          ))}
        </ul>
        <Link to="/start-a-project" className="pnav__cta" onClick={close}>Start a project</Link>
        <button
          type="button"
          className="pnav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
        {open && (
          <ul id="mobile-menu" className="pnav__menu">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} onClick={close}>{l.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
