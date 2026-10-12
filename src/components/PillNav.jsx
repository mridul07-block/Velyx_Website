import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import VelyxMark from "./VelyxMark";
import BtnLabel from "./BtnLabel";

const LINKS = [
  { label: "Recent Work", to: "/work" },
  { label: "Pricing", to: "/pricing" },
  { label: "Swipe file", to: "/swipe-file" },
];

export default function PillNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="pnav">
      <nav className="pnav__inner" aria-label="Main">
        <Link to="/" className="pnav__logo" aria-label="Velyx Labs home" onClick={close}>
          <VelyxMark />
        </Link>
        <ul className="pnav__links">
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to}>{l.label}</NavLink>
            </li>
          ))}
        </ul>
        <Link to="/intro-call" className="btn btn--intro pnav__cta" onClick={close}><BtnLabel>Start a project</BtnLabel></Link>
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
            {[...LINKS, { label: "Start a project", to: "/start-a-project" }].map((l) => (
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
