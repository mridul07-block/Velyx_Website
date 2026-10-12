import useInView from "../../lib/useInView";
import { STATEMENT } from "../../data/statement";

/* A calm, two-tone statement: three lines, the first in ink and the rest
   muted (like the two-tone headings), each sliding up into place in turn
   as the paragraph comes into view. Visible by default and under reduced
   motion; screen readers get it as one sentence. */
export default function Statement() {
  const [ref, inView] = useInView("0px 0px -12% 0px", 2500);
  return (
    <section id="statement" className="section statement">
      <div className="container">
        <p ref={ref} className={`statement__text${inView ? " is-in" : ""}`}>
          <span className="sr-only">{STATEMENT.join(" ")}</span>
          {STATEMENT.map((line, i) => (
            <span key={line} className="statement__mask">
              <span className={`statement__line ${i ? "tone-soft" : "tone-ink"}`} style={{ "--i": i }} aria-hidden="true">{line}</span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
