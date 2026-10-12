import { Link } from "react-router-dom";

/* Kargul's trial section. TO CONFIRM: what the trial week includes. No
   conversion-rate claim. `pricingLink` adds a quiet link to the full plans. */
export default function TrialCard({ pricingLink = false }) {
  return (
    <section id="trial" className="trial">
      <div className="trial__card">
        <h2 className="h2 trial__title">
          Start with a trial week for only <span className="price-tag">$1500</span>
        </h2>
        <p className="muted">Work with the founders for one week: a kickoff call, a scoped plan and a first deliverable.</p>
        <p className="muted">If it's the right fit, we move into the full project. If not, you still walk away with a clear plan and a real sense of how we work.</p>
        <Link to="/start-a-project?plan=trial" className="btn btn--primary trial__cta">Start your trial week</Link>
        {pricingLink && (
          <Link to="/pricing" className="trial__more">See all pricing <span aria-hidden="true">→</span></Link>
        )}
      </div>
    </section>
  );
}
