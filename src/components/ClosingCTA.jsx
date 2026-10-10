import { Link } from "react-router-dom";
import useInView from "../lib/useInView";
import useOnScreen from "../lib/useOnScreen";
import useReducedMotion from "../lib/useReducedMotion";
import ClosingScene from "./ClosingScene";

const WORDS = ["Let's", "build", "something", "amazing"];

/* Kargul's footer CTA, shown on every page: the heading's words rise in
   sequence, then the isometric scene and the two CTAs. The scene animates
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
      </div>
      <div ref={sceneRef} className={`fcta__scene${playing ? " is-playing" : ""}`}>
        <ClosingScene playing={playing} />
      </div>
      <div className="hero__actions closing__actions">
        <Link to="/start-a-project" className="btn btn--primary">Start a project</Link>
        <Link to="/work" className="btn btn--secondary">See our work</Link>
      </div>
    </section>
  );
}
