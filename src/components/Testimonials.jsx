import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useOnScreen from "../lib/useOnScreen";
import useReducedMotion from "../lib/useReducedMotion";
import { AUTO_STEP_MS, loopPeriod, roleLine, shouldDrift, wrap } from "../lib/drift";
import { PROJECTS } from "../data/projects";

/* Bricx's testimonials: a two-tone headline, tall cards in a snapping
   horizontal track, arrows at every width. Cards show the client's photo
   when we have one (`photo`), a large monogram until then. Once there are
   enough quotes to loop (see shouldDrift) it steps one card at a time, so
   cards always rest aligned to the page. */
export default function Testimonials({ items }) {
  const [sectionRef, onScreen] = useOnScreen("0px");
  const reduced = useReducedMotion();
  const trackRef = useRef(null);
  const paused = useRef(false);
  const holdUntil = useRef(0);
  const drift = shouldDrift(items.length, reduced);

  // Without IntersectionObserver (old browsers, tests) treat it as visible.
  const visible = onScreen || typeof IntersectionObserver === "undefined";

  useEffect(() => {
    const el = trackRef.current;
    if (!drift || !visible || !el) return;
    const id = setInterval(() => {
      if (paused.current || document.hidden || performance.now() < holdUntil.current) return;
      const cards = el.querySelectorAll(".tcard2");
      const stepBy = (cards[0]?.offsetWidth ?? 0) + 24;
      const period = loopPeriod(cards, items.length);
      // Past the first set? Jump back by one set (looks identical), then step.
      if (period > 0 && el.scrollLeft + stepBy > period) el.scrollLeft = wrap(el.scrollLeft, period);
      el.scrollBy({ left: stepBy, behavior: "smooth" });
    }, AUTO_STEP_MS);
    return () => clearInterval(id);
  }, [drift, visible, items.length]);

  if (!items.length) return null;
  const cards = drift ? [...items, ...items] : items;
  const by = (dir) => {
    const el = trackRef.current;
    const card = el?.querySelector(".tcard2");
    holdUntil.current = performance.now() + 900; // let the arrow's scroll finish
    el?.scrollBy({ left: dir * ((card?.offsetWidth ?? 0) + 24), behavior: reduced ? "auto" : "smooth" });
  };
  const hold = () => (paused.current = true);
  const release = () => (paused.current = false);

  return (
    <section id="testimonials" ref={sectionRef} className="section tsec">
      <div className="container tsec__head">
        <h2 className="tsec__title">
          <span className="tsec__muted">Don't take our word.</span> <span>Take theirs.</span>
        </h2>
        <div className="tsec__nav">
          <button type="button" aria-label="Previous testimonial" onClick={() => by(-1)}>
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M10 3.5L5.5 8l4.5 4.5" /></svg>
          </button>
          <button type="button" aria-label="Next testimonial" onClick={() => by(1)}>
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M6 3.5L10.5 8 6 12.5" /></svg>
          </button>
        </div>
      </div>

      <div className="container">
      <div
        ref={trackRef}
        className={`tsec__track${drift ? " is-auto" : ""}`}
        role="region"
        aria-label="Testimonials"
        tabIndex={0}
        onPointerEnter={hold}
        onPointerLeave={release}
        onFocus={hold}
        onBlur={release}
        onTouchStart={hold}
      >
        {cards.map((t, i) => {
          const caseSlug = PROJECTS.find((p) => p.quoteName === t.name)?.slug;
          const copy = i >= items.length;
          return (
            <figure key={`${t.name}-${i}`} className={`tcard2${t.photo ? " tcard2--photo" : ""}`} aria-hidden={copy || undefined}>
              {t.photo ? (
                <img src={t.photo} alt="" className="tcard2__img" loading="lazy" />
              ) : (
                <span className="tcard2__mono" aria-hidden="true">{t.avatar}</span>
              )}
              <div className="tcard2__body">
                <blockquote className="tcard2__quote">“{t.q}”</blockquote>
                <figcaption className="tcard2__who">
                  <span className="tcard2__name">{t.name}</span>
                  <span className="tcard2__role">{roleLine(t.role)}</span>
                </figcaption>
                {caseSlug && (
                  <div className="tcard2__more">
                    <div>
                      <Link to={`/work/${caseSlug}`} tabIndex={copy ? -1 : undefined}>
                        Read the case study <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </figure>
          );
        })}
      </div>
      </div>
    </section>
  );
}
