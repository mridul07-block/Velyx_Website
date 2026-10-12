import { Link } from "react-router-dom";
import useInView from "../lib/useInView";
import useOnScreen from "../lib/useOnScreen";
import useReducedMotion from "../lib/useReducedMotion";
import ClosingScene from "./ClosingScene";
import IntroCallButton from "./IntroCallButton";

const WORDS = ["Let's", "build", "something", "amazing"];

/* The footer CTA on every page, laid out like Altair's: the heading's words
   rise in sequence over a reply-time line, then the isometric scene and a
   single Intro call button. The scene animates
   only while on screen and shifts with the cursor; reduced motion keeps
   everything still. */
export default function ClosingCTA() {
  const [ref, inView] = useInView("0px 0px -15% 0px", 2000);
  const [sceneRef, onScreen] = useOnScreen("0px");
  const reduced = useReducedMotion();
  const playing = onScreen && !reduced;

  const drift = (e) => {
    const el = sceneRef.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };

  return (
    <section id="closing" ref={ref} className={`closing${inView ? " is-in" : ""}`} onPointerMove={drift}>
      <div className="container closing__inner">
        <h2 className="closing__title">
          {WORDS.flatMap((w, i) => [i > 0 ? " " : null, <span key={w} className="closing__word">{w}</span>])}
        </h2>
        {/* TO CONFIRM: the reply-time promise. */}
        <p className="closing__sub">You get a reply within one working day, and an honest answer if it's not the right fit.</p>
      </div>
      <div ref={sceneRef} className={`fcta__scene${playing ? " is-playing" : ""}`}>
        <ClosingScene playing={playing} />
      </div>
      <div className="hero__actions closing__actions">
        <IntroCallButton />
        <Link to="/work" className="closing__link">See our work <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
