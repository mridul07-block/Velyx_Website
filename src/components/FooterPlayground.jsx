import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useOnScreen from "../lib/useOnScreen";
import useReducedMotion from "../lib/useReducedMotion";
import { createBodies, stepWorld, repel } from "../lib/chipPhysics";

const CHIPS = [
  { label: "AI agents", tone: "dark" },
  { label: "SaaS & MVPs" },
  { label: "WhatsApp bots", tone: "ok" },
  { label: "Websites" },
  { label: "Mobile apps", tone: "dark" },
  { label: "Automation" },
  { label: "CRM" },
  { label: "Dashboards", tone: "dark" },
  { label: "Landing pages" },
  { label: "Integrations" },
  { label: "AI evals", tone: "ok" },
  { label: "Design" },
];
const WORD = "velyx labs";
const MAX_FLING = 2400;

/* The footer's toy: the services drop in as chips, pile up on a giant
   wordmark, scatter away from the cursor and can be grabbed and thrown.
   Physics runs only while the stage is on screen and stops once the pile
   is at rest. Under reduced motion (or before it is ever seen) the chips
   are a still, wrapped pile. */
export default function FooterPlayground() {
  const [stageRef, onScreen] = useOnScreen("0px 0px -15% 0px");
  const reduced = useReducedMotion();
  const [live, setLive] = useState(false);
  const world = useRef(null);
  const wordRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!onScreen || reduced || !stage) return;
    const chips = [...stage.querySelectorAll(".fplay__chip")];
    const size = () => ({ width: stage.clientWidth, height: stage.clientHeight });
    if (!world.current) world.current = createBodies(chips.map((c) => ({ w: c.offsetWidth, h: c.offsetHeight })), size().width);
    const bodies = world.current;

    let raf = 0;
    let last = 0;
    let drag = null;

    const paint = () => {
      bodies.forEach((b, i) => {
        chips[i].style.transform = `translate(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px) rotate(${b.angle.toFixed(2)}deg)`;
      });
    };
    const frame = (now) => {
      const dt = last ? Math.min(1 / 30, (now - last) / 1000) : 1 / 60;
      last = now;
      const resting = stepWorld(bodies, size(), dt);
      if (drag) {
        drag.body.x = drag.px - drag.ox;
        drag.body.y = drag.py - drag.oy;
      }
      paint();
      if (resting && !drag) { raf = 0; return; }
      raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (raf) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const point = (e) => {
      const r = stage.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };

    const onMove = (e) => {
      const [px, py] = point(e);
      if (drag) {
        const t = performance.now();
        const dt = Math.max(1, t - drag.t) / 1000;
        const clamp = (v) => Math.max(-MAX_FLING, Math.min(MAX_FLING, v));
        drag.body.vx = clamp((px - drag.px) / dt);
        drag.body.vy = clamp((py - drag.py) / dt);
        Object.assign(drag, { px, py, t });
      } else {
        repel(bodies, px, py, 110, 260);
      }
      wake();
    };
    const onDown = (e) => {
      const chip = e.target.closest(".fplay__chip");
      if (!chip) return;
      const body = bodies[chips.indexOf(chip)];
      const [px, py] = point(e);
      drag = { body, px, py, ox: px - body.x, oy: py - body.y, t: performance.now() };
      chip.setPointerCapture?.(e.pointerId);
      chip.classList.add("is-grabbed");
      wake();
    };
    const onUp = () => {
      if (!drag) return;
      chips[bodies.indexOf(drag.body)].classList.remove("is-grabbed");
      drag = null;
      wake();
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    window.addEventListener("resize", wake);
    raf = requestAnimationFrame((now) => {
      setLive(true);
      frame(now);
    });

    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", wake);
    };
  }, [onScreen, reduced, stageRef]);

  /* Letters of the wordmark rise toward the cursor; the CTA leans in. */
  const follow = (e) => {
    if (reduced) return;
    for (const letter of wordRef.current?.children ?? []) {
      const r = letter.getBoundingClientRect();
      const lift = Math.max(0, 1 - Math.abs(e.clientX - (r.left + r.width / 2)) / 240);
      letter.style.setProperty("--lift", lift.toFixed(3));
    }
    const cta = ctaRef.current;
    if (cta) {
      const r = cta.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const near = Math.hypot(dx, dy) < 180;
      cta.style.setProperty("--tx", `${near ? Math.max(-22, Math.min(22, dx * 0.3)) : 0}px`);
      cta.style.setProperty("--ty", `${near ? Math.max(-14, Math.min(14, dy * 0.3)) : 0}px`);
    }
  };
  const settle = () => {
    for (const letter of wordRef.current?.children ?? []) letter.style.setProperty("--lift", "0");
    ctaRef.current?.style.setProperty("--tx", "0px");
    ctaRef.current?.style.setProperty("--ty", "0px");
  };

  // Chips wait out of sight until they can drop in; anywhere the drop can't
  // happen they are shown as a still pile instead.
  const canPlay = !reduced && typeof IntersectionObserver !== "undefined";
  const mode = live && !reduced ? "is-live" : canPlay ? "is-waiting" : "is-static";

  return (
    <section className={`fplay ${mode}`} aria-label="Start a project" onPointerMove={follow} onPointerLeave={settle}>
      <div className="container fplay__head">
        <p className="fplay__kicker">Everything we build, under one roof.</p>
        <Link ref={ctaRef} to="/start-a-project" className="btn btn--primary fplay__cta">Start a project</Link>
        <p className="fplay__hint" aria-hidden="true">psst — grab a chip and throw it</p>
      </div>
      <div ref={stageRef} className="fplay__stage" aria-hidden="true">
        {CHIPS.map((c, i) => (
          <span key={c.label} className={`fplay__chip${c.tone ? ` fplay__chip--${c.tone}` : ""}`} style={{ "--t": `${((i * 7) % 9) - 4}deg` }}>
            {c.label}
          </span>
        ))}
      </div>
      <div ref={wordRef} className="fplay__word" aria-hidden="true">
        {[...WORD].map((ch, i) => <span key={i}>{ch === " " ? " " : ch}</span>)}
      </div>
    </section>
  );
}
