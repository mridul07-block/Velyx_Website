import { Link } from "react-router-dom";
import useInView from "../lib/useInView";
import useOnScreen from "../lib/useOnScreen";
import useReducedMotion from "../lib/useReducedMotion";
import AgentsArt from "./illustrations/AgentsArt";
import SaasArt from "./illustrations/SaasArt";
import WhatsAppArt from "./illustrations/WhatsAppArt";
import WebArt from "./illustrations/WebArt";
import MobileArt from "./illustrations/MobileArt";

const WORDS = ["Let's", "build", "something", "amazing"];

/* Words rise in sequence when scrolled into view; service illustrations
   drift behind. CSS stagger via nth-child; reduced motion shows it static. */
export default function ClosingCTA() {
  const [ref, inView] = useInView("0px 0px -15% 0px", 2000);
  // The drifting art only animates while the section is on screen.
  const [artRef, artOnScreen] = useOnScreen("0px");
  const reduced = useReducedMotion();
  return (
    <section id="closing" ref={ref} className={`closing${inView ? " is-in" : ""}`}>
      <div ref={artRef} className={`closing__art${artOnScreen && !reduced ? " is-playing" : ""}`} aria-hidden="true">
        <AgentsArt />
        <SaasArt />
        <WhatsAppArt />
        <WebArt />
        <MobileArt />
      </div>
      <div className="container closing__inner">
        <h2 className="closing__title">
          {WORDS.flatMap((w, i) => [i > 0 ? " " : null, <span key={w} className="closing__word">{w}</span>])}
        </h2>
        <p className="closing__sub">Tell us what you're building. We'll show you how we'd ship it.</p>
        <div className="hero__actions closing__actions">
          <Link to="/start-a-project" className="btn btn--primary">Start a project</Link>
          <Link to="/work" className="btn btn--secondary">See our work</Link>
        </div>
      </div>
    </section>
  );
}
