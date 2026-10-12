import { useEffect, useState } from "react";
import { STATS } from "../data/stats";
import useInView from "../lib/useInView";
import useReducedMotion from "../lib/useReducedMotion";
import { countValue } from "../lib/reveal";

/* Counts the leading number up once when the numbers first come into view
   (1.2s ease-out). Shows the real values by default, under reduced motion
   and wherever IntersectionObserver isn't available. */
function CountUp({ value, run }) {
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!run) return;
    let frame = 0;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / 1200);
      setShown(countValue(value, 1 - (1 - t) ** 3));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [run, value]);

  return shown;
}

export default function Stats() {
  const [ref, inView] = useInView("0px", 4000);
  const reduced = useReducedMotion();
  const [armed] = useState(() => typeof IntersectionObserver !== "undefined");
  if (!STATS.length) return null;
  const run = armed && inView && !reduced;
  return (
    <section id="numbers" className="section stats">
      <dl ref={ref} className="container stats__grid">
        {STATS.map((s) => (
          <div key={s.label} className="stats__item">
            <dt className="stats__label">{s.label}</dt>
            <dd className="stats__value">
              <CountUp value={s.value} run={run} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
