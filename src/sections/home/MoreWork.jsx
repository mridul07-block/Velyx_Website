import { Link } from "react-router-dom";
import { PROJECTS } from "../../data/projects";

const Arrow = () => (
  <span className="mwork__arrow" aria-hidden="true">
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4.5 11.5l7-7M5.5 4.5h6v6" /></svg>
  </span>
);

/* Altair's "More work" table: one ruled row per project, ending with an
   open row for the next product. */
export default function MoreWork({ exclude = ["sacred-basil", "getlandy"] }) {
  const rows = PROJECTS.filter((p) => !exclude.includes(p.slug));
  return (
    <section id="more-work" className="section mwork">
      <div className="container">
        <p className="mono mwork__label">More work</p>
        <div className="mwork__list">
          {rows.map((p) => (
            <Link key={p.slug} to={`/work/${p.slug}`} className="mwork__row">
              <span className="mwork__name">{p.name}</span>
              <span className="mwork__cat">{p.industry}</span>
              <span className="mono mwork__status">{p.status ?? "Built"}</span>
              <Arrow />
            </Link>
          ))}
          {/* TO CONFIRM: the founding-places offer. */}
          <Link to="/intro-call" className="mwork__row mwork__row--next">
            <span className="mwork__name">Your product, next.</span>
            <span className="mwork__cat mwork__offer">Book an intro call and tell us what you're building.</span>
            <span className="mwork__arrow mwork__arrow--solid" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8h9M8.5 4l4 4-4 4" /></svg>
            </span>
          </Link>
        </div>
        <Link to="/work" className="mwork__all">
          All work and case studies <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
