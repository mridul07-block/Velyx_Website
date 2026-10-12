import { Link } from "react-router-dom";
import ProofLine from "../../components/ProofLine";
import IntroCallButton from "../../components/IntroCallButton";

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="container hero__inner">
        <ProofLine />
        <h1 className="h1 hero__title">An AI and engineering partner for founders and growing businesses.</h1>
        <p className="lead hero__sub">
          We design and build AI agents, SaaS products, WhatsApp systems, websites and apps — end to end,
          with the founders in the room.
        </p>
        <div className="hero__actions">
          <IntroCallButton />
          <Link to="/work" className="btn btn--secondary">See our work</Link>
        </div>
      </div>
    </section>
  );
}
