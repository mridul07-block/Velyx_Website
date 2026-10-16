import { Link } from "react-router-dom";
import SectionHeader from "./SectionHeader";
import { TEAM } from "../data/team";

const ICONS = {
  linkedin: { label: "LinkedIn", d: "M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.6h.06c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.77 2.5 4.77 5.75v5.6h-4v-4.96c0-1.18-.02-2.7-1.7-2.7-1.7 0-1.96 1.28-1.96 2.6v5.06h-4z" },
  x: { label: "X", d: "M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.1L4.8 21H1.6l7.5-8.6L1.2 3h6.6l4.5 5.6zm-1.1 16.2h1.8L6.6 4.7H4.7z" },
  site: { label: "website", d: "M12 2a10 10 0 100 20 10 10 0 000-20zm6.9 6h-3a15.6 15.6 0 00-1.3-4 8 8 0 014.3 4zM12 4c.8 1 1.6 2.4 2 4h-4c.4-1.6 1.2-3 2-4zM4.3 14a8 8 0 010-4h3.3a17 17 0 000 4zm.8 2h3a15.6 15.6 0 001.3 4 8 8 0 01-4.3-4zm3-8h-3a8 8 0 014.3-4 15.6 15.6 0 00-1.3 4zM12 20c-.8-1-1.6-2.4-2-4h4c-.4 1.6-1.2 3-2 4zm2.4-6H9.6a15 15 0 010-4h4.8a15 15 0 010 4zm.3 6a15.6 15.6 0 001.3-4h3a8 8 0 01-4.3 4zm1.7-6a17 17 0 000-4h3.3a8 8 0 010 4z" },
};

/* The founders as two tall portrait cards: the photo (black and white,
   colour on hover — or, until a photo exists, the initials in a dashed
   selection frame) with role and name over it, then a short bio and the
   profiles we have. */
export default function TeamGrid() {
  return (
    <section id="team" className="section founders">
      <div className="container">
        <SectionHeader align="center" title="Founders" sub="The two people you'll work with, on every project." />
        <ul className="founders__list">
          {TEAM.map((m) => {
            const first = m.name.split(" ")[0];
            const links = Object.entries(m.links ?? {}).filter(([, href]) => href);
            return (
              <li key={m.name} className="founder">
                <div className="founder__portrait">
                  {m.photo ? (
                    <img src={m.photo} alt={`${m.name}`} className="founder__photo" loading="lazy" />
                  ) : (
                    <>
                      <span className="founder__initials" aria-hidden="true">{m.initials}</span>
                      <span className="founder__frame" aria-hidden="true">
                        {[0, 1, 2, 3].map((i) => <span key={i} className="founder__handle" />)}
                      </span>
                    </>
                  )}
                  <div className="founder__caption">
                    <p className="founder__role">{m.role}</p>
                    <h3 className="team__name">{m.name}</h3>
                  </div>
                </div>
                <div className="founder__body">
                  <p className="founder__bio">{m.bio}</p>
                  {links.length > 0 && (
                    <div className="founder__links">
                      {links.map(([key, href]) => (
                        <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${first} on ${ICONS[key].label}`}>
                          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d={ICONS[key].d} /></svg>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <p className="founders__cta">
          <Link to="/intro-call" className="closing__link">Talk to the founders <span aria-hidden="true">→</span></Link>
        </p>
      </div>
    </section>
  );
}
