import { useEffect, useRef } from "react";
import useOnScreen from "../../lib/useOnScreen";
import useReducedMotion from "../../lib/useReducedMotion";
import { progress, wordOpacity } from "../../lib/reveal";

/* TO CONFIRM: the statement copy. */
const COPY =
  "Velyx Labs is a small founder-led team. We design the product, build the AI and ship the code — one team from first call to launch, so nothing gets lost in a handoff.";
const WORDS = COPY.split(" ");

/* Dualite-style reveal: the words light up in reading order as the
   paragraph scrolls through the viewport. Fully visible by default, under
   reduced motion and before JS runs. */
export default function Statement() {
  const [ref, onScreen] = useOnScreen("0px");
  const reduced = useReducedMotion();
  const words = useRef([]);

  useEffect(() => {
    const el = ref.current;
    if (!onScreen || reduced || !el) return;
    let frame = 0;
    const paint = () => {
      const p = progress(el.getBoundingClientRect(), window.innerHeight);
      words.current.forEach((w, i) => w && (w.style.opacity = wordOpacity(i, WORDS.length, p).toFixed(3)));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScreen, reduced, ref]);

  useEffect(() => {
    if (reduced) words.current.forEach((w) => w && (w.style.opacity = ""));
  }, [reduced]);

  return (
    <section id="statement" className="section statement">
      <div className="container">
        <p ref={ref} className="statement__text" aria-label={COPY}>
          {WORDS.map((w, i) => (
            <span key={i} ref={(n) => (words.current[i] = n)} className="statement__w" aria-hidden="true">
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
