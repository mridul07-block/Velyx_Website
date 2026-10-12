import { Link } from "react-router-dom";
import ProjectCover from "../../components/ProjectCover";
import FadeIn from "../../components/FadeIn";
import { PROJECTS } from "../../data/projects";

/* TO CONFIRM: which two projects lead. */
const SELECTED = ["sacred-basil", "getlandy"];
const TYPE_LABEL = { ai: "AI", saas: "SaaS", web: "Web", mobile: "Mobile" };

/* Altair's case cards: what the client faced, what we built, and the
   outcome (only when there is a real result). */
export default function SelectedWork() {
  const projects = SELECTED.map((slug) => PROJECTS.find((p) => p.slug === slug)).filter(Boolean);
  return (
    <section id="work" className="section selwork">
      <div className="container">
        <h2 className="h2 selwork__title">Selected work</h2>
        <div className="selwork__list">
          {projects.map((p, i) => (
            <FadeIn key={p.slug}>
              <article className={`case${i % 2 ? " case--flip" : ""}`}>
                <div className="case__copy">
                  <p className="mono case__eyebrow">{p.industry} · {p.audience}</p>
                  <h3 className="case__name">{p.name}</h3>
                  <p className="case__problem">{p.brief}</p>
                  <p className="case__built">{p.built}</p>
                  {p.result && <p className="case__outcome">{p.result}</p>}
                  <div className="case__chips">
                    {[...p.types.map((t) => TYPE_LABEL[t]), ...p.stack].filter(Boolean).map((c) => (
                      <span key={c} className="mono case__chip">{c}</span>
                    ))}
                  </div>
                  <div className="case__actions">
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn--secondary">
                        Visit site <span aria-hidden="true">↗</span>
                      </a>
                    )}
                    <Link to={`/work/${p.slug}`} className="case__link">
                      Read the case study <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
                <div className="case__media">
                  <ProjectCover project={p} className="case__cover" />
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
