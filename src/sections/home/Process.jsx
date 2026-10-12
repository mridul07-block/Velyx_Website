import Panel from "../../components/Panel";
import IntroCallButton from "../../components/IntroCallButton";
import StepArt from "../../components/illustrations/StepArt";
import useOnScreen from "../../lib/useOnScreen";
import useReducedMotion from "../../lib/useReducedMotion";
import { ARC_D, ARC_VIEW, NODE_T, PROCESS, arcPoint } from "../../data/process";

/* Altair's process: a two-tone heading, an arc that draws itself once with
   a pulsing node per step, four isometric step cards and a CTA bar. */
export default function Process() {
  const [ref, onScreen] = useOnScreen("0px");
  const reduced = useReducedMotion();
  const playing = onScreen && !reduced;
  const nodes = NODE_T.map(arcPoint);

  return (
    <Panel id="process" className="process">
      <div ref={ref} className={playing ? "is-playing" : undefined}>
        <h2 className="process__title">
          <span className="tone-muted">Three weeks.</span> <span className="tone-ink">One clear path.</span>
        </h2>
        <p className="process__sub">A fixed path from first call to launch, built around your product. No mystery scope, no padded retainer.</p>

        <svg viewBox={ARC_VIEW} className={`arc${onScreen ? " is-drawn" : ""}`} aria-hidden="true" fill="none">
          <path d={ARC_D} pathLength="1" className="arc__line" />
          {nodes.map((p, i) => (
            <g key={i} className="arc__node" transform={`translate(${p.x} ${p.y})`}>
              <path d={`M0 0V${220 - p.y}`} className="arc__drop" />
              <circle r="22" className="arc__halo" style={{ animationDelay: `${i * 0.4}s` }} />
              <circle r="5" className="arc__dot" />
            </g>
          ))}
        </svg>

        <ol className="steps">
          {PROCESS.map((s) => (
            <li key={s.n} className="step">
              <StepArt kind={s.art} />
              <p className="mono step__when">{s.n} · {s.when}</p>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__copy">{s.copy}</p>
            </li>
          ))}
        </ol>

        <div className="process__cta">
          <p className="process__cta-text">Want to know what we'd change in your product?</p>
          <IntroCallButton className="btn--light" />
        </div>
      </div>
    </Panel>
  );
}
