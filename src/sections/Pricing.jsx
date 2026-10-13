import { useState } from "react";
import { Link } from "react-router-dom";
import IntroCallButton from "../components/IntroCallButton";
import BtnLabel from "../components/BtnLabel";
import useInView from "../lib/useInView";
import { PLAN_NOTE, PLANS, TRIAL } from "../data/pricing";

const ICONS = {
  partner: <path d="M4 14l4-4 3 3 5-6M13 7h3v3" />,
  sprint: <path d="M11 2L5 11h5l-1 7 6-9h-5z" />,
};

/* 925 Studios' pricing: a "Simple pricing" eyebrow, a two-tone heading,
   then (our addition) the trial week strip and two plan cards — dark and
   light — each with a price line, a full-width CTA and what's included.
   Rows un-blur in as the section enters view (`reveal`); off on /pricing,
   where the cards are the first thing on screen. */
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

        <div className="trialstrip rv" style={{ "--i": 0 }}>
          <div className="trialstrip__copy">
            <p className="trialstrip__title">
              Trial week <span className="price-tag">{TRIAL.price}</span>
            </p>
            <p className="trialstrip__line">{TRIAL.line}</p>
          </div>
          <Link to={TRIAL.href} className="btn btn--primary trialstrip__cta"><BtnLabel>{TRIAL.cta}</BtnLabel></Link>
        </div>

        <div className="plans">
          {PLANS.map((p, i) => (
            <article key={p.id} className={`plan rv${p.dark ? " plan--dark" : ""}`} style={{ "--i": i + 1 }}>
              <div className="plan__top">
                <span className="plan__icon" aria-hidden="true">
                  <svg viewBox="0 0 20 20" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">{ICONS[p.id]}</svg>
                </span>
                <H2 className="plan__title">{p.title}</H2>
                <p className="plan__tagline">{p.tagline}</p>
                <p className="plan__price">
                  {p.price ? (p.unit === "from" ? <>From {p.price}</> : <>{p.price}<span>{p.unit}</span></>) : "Custom"}
                </p>
              </div>
              <IntroCallButton className="plan__cta">Book a call</IntroCallButton>
              <div>
                <p className="plan__includes">Plan includes:</p>
                <ul className="plan__list">
                  {p.features.map((f, j) => (
                    <li key={f} className="plan__feature rv" style={{ "--i": i + 2 + j * 0.5 }}>
                      <span className="plan__bullet" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="plan__note">
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 8.5l3 3 7-7" /></svg>
                  {PLAN_NOTE}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
