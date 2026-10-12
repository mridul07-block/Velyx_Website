import { useState } from "react";
import { Link } from "react-router-dom";
import BtnLabel from "../components/BtnLabel";
import useInView from "../lib/useInView";
import { PLAN_NOTE, TIERS } from "../data/pricing";

const Check = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" />
  </svg>
);

/* "Start small. Scale when it works." as a ladder: three steps joined by a
   rail a dot travels along — the trial week first and raised dark, then a
   sprint, then an ongoing partnership. Each card keeps to a short list and
   one button. Cards un-blur in on scroll-in (`reveal`); off on /pricing. */
export default function Pricing({ headingLevel = 2, reveal = true }) {
  const H = `h${headingLevel}`;
  const H2 = `h${headingLevel + 1}`;
  const [ref, inView] = useInView("0px 0px -10% 0px", 3000);
  const [armed] = useState(() => reveal && typeof IntersectionObserver !== "undefined");
  const cls = ["section", "pricing", armed && "rv-armed", inView && "is-in"].filter(Boolean).join(" ");

  return (
    <section id="pricing" ref={ref} className={cls}>
      <div className="container">
        <div className="pricing__head">
          <p className="pricing__eyebrow"><span className="pricing__dot" aria-hidden="true" />Simple pricing</p>
          <H className="pricing__title">
            <span className="tone-muted">Start small.</span> <span>Scale when it works.</span>
          </H>
        </div>

        <div className="ladder">
          <div className="ladder__rail" aria-hidden="true">
            {TIERS.map((t) => <span key={t.id} className="ladder__node" />)}
            <span className="ladder__dot" />
          </div>
          <ol className="ladder__tiers">
            {TIERS.map((t, i) => (
              <li key={t.id} className={`tier rv${t.hero ? " tier--hero" : ""}`} style={{ "--i": i }}>
                <p className="tier__step">{t.step}</p>
                <H2 className="tier__title">{t.title}</H2>
                <p className="tier__desc">{t.desc}</p>
                <p className="tier__price">
                  {t.price ? (
                    <>
                      <span className="tier__amount">{t.price}</span>
                      <span className="tier__unit">{t.unit}</span>
                    </>
                  ) : (
                    <span className="tier__quote">Custom quote</span>
                  )}
                </p>
                <ul className="tier__list">
                  {t.features.map((f) => (
                    <li key={f} className="tier__feature"><Check />{f}</li>
                  ))}
                </ul>
                <Link to={t.href} className={`btn tier__cta${t.hero ? " btn--light" : " btn--primary"}`}>
                  <BtnLabel>{t.cta}</BtnLabel>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <p className="pricing__note"><Check />{PLAN_NOTE}</p>
      </div>
    </section>
  );
}
