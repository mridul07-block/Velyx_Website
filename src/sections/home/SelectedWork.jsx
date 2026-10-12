import { Link } from "react-router-dom";
import FadeIn from "../../components/FadeIn";
import { PROJECTS } from "../../data/projects";

/* TO CONFIRM: which two projects lead. */
const SELECTED = ["sacred-basil", "getlandy"];
const TYPE_LABEL = { ai: "AI", saas: "SaaS", web: "Web", mobile: "Mobile" };

/* Altair's selected work: a header row (title left, a short line right),
   then full-width case cards that alternate. The media side layers up to
   three real screenshots on a faint grid; the copy side reads what the
   client faced, what we built and the outcome (only when there is a real
   result). */
function Media({ project }) {
  const shots = [project.cover, ...project.gallery].filter(Boolean).slice(0, 3);
  return (
    <div className={`case__media case__media--${shots.length || 0}`}>
      {shots.length ? (
        shots.map((s, i) => (
          <img key={s.src} src={s.src} width={s.w} height={s.h} alt={i ? "" : `${project.name} — screenshot`} loading="lazy" className={`case__shot case__shot--${i + 1}`} />
        ))
      ) : (
        <div className="case__empty" aria-hidden="true"><span>{project.name}</span></div>
      )}
    </div>
  );
}

export default function SelectedWork() {
  const projects = SELECTED.map((slug) => PROJECTS.find((p) => p.slug === slug)).filter(Boolean);
  return (
    <section id="work" className="section selwork">
      <div className="container selwork__head">
        <h2 className="selwork__title">Selected work.</h2>
        <p className="selwork__sub">Products we designed, built and shipped.</p>
      </div>
      <div className="container selwork__list">
        {projects.map((p, i) => (
          <FadeIn key={p.slug}>
            <article className={`case${i % 2 === 0 ? " case--media-first" : ""}`}>
              <Media project={p} />
              <div className="case__copy">
                <p className="mono case__eyebrow">{p.industry} · {p.audience}</p>
                <h3 className="case__name">{p.name}</h3>
                <p className="case__problem">{p.brief}</p>
                <p className="case__built">{p.built}</p>
                {p.result && <p className="case__outcome">{p.result}</p>}
                <div className="case__chips">
                  {[...p.types.map((t) => TYPE_LABEL[t]), ...p.stack].filter(Boolean).map((c) => (
                    <span key={c} className="case__chip">{c}</span>
                  ))}
                </div>
                <div className="case__actions">
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn--secondary">
                      Visit {p.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  <Link to={`/work/${p.slug}`} className="case__link">
                    Read the case study <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
