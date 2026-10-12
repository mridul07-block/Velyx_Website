import { Link } from "react-router-dom";
import VelyxMark from "../../components/VelyxMark";

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="container hero__inner">
        {/* Kargul-style: a big quiet mark that the status pill overlaps. */}
        <VelyxMark className="hero__mark" />
        {/* TO CONFIRM: a project count is allowed only if true. */}
        <p className="status"><span className="status__dot" aria-hidden="true" />Now booking projects for Q4 2026</p>
        <h1 className="h1 hero__title">An AI and engineering partner for founders and growing businesses.</h1>
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
