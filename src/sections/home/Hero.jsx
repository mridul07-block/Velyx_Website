import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="container hero__inner">
        {/* A big quiet mark that the status pill overlaps. */}
        <img src="/brand/velyx-mark-hero.webp" alt="" width="340" height="368" className="hero__mark" fetchPriority="high" />
        {/* TO CONFIRM: a project count is allowed only if true. */}
        <p className="status"><span className="status__dot" aria-hidden="true" />Now booking projects for Q4 2026</p>
        <h1 className="h1 hero__title">An AI and engineering partner <span className="accent">for founders and growing businesses.</span></h1>
        <p className="lead hero__sub">
          We design and build AI agents, SaaS products, WhatsApp systems, websites and apps — end to end,
          with the founders in the room.
        </p>
        <div className="hero__actions">
          <Link to="/start-a-project" className="btn btn--primary">Start a project</Link>
          <Link to="/work" className="btn btn--secondary">See our work</Link>
        </div>
      </div>
    </section>
  );
}
