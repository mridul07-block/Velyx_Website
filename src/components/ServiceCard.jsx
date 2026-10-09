import { useEffect, useState } from "react";
import Tag from "./Tag";
import useOnScreen from "../lib/useOnScreen";
import useReducedMotion from "../lib/useReducedMotion";
import AgentsArt from "./illustrations/AgentsArt";
import SaasArt from "./illustrations/SaasArt";
import WhatsAppArt from "./illustrations/WhatsAppArt";
import WebArt from "./illustrations/WebArt";
import MobileArt from "./illustrations/MobileArt";

const ART = { agents: AgentsArt, saas: SaasArt, whatsapp: WhatsAppArt, web: WebArt, mobile: MobileArt };
const TICK = 900;
const TICK_FAST = 450;
const HOLD = 3; // ticks the finished scene stays up before it resets

/* Each illustration is a little story told in `Art.steps` beats. While the
   card is on screen the art div collects s1…sN classes one beat at a time
   (CSS reveals .aN pieces at .sN), holds the finished scene, then resets.
   Hovering speeds the story up and tilts the scene toward the cursor.
   Off screen, without IntersectionObserver or under reduced motion, the
   finished scene is shown still. */
export default function ServiceCard({ service }) {
  const [ref, onScreen] = useOnScreen("0px 0px -10% 0px");
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [hover, setHover] = useState(false);
  const Art = ART[service.art];
  const steps = Art.steps;
  const playing = onScreen && !reduced;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setStep((s) => (s + 1) % (steps + HOLD)), hover ? TICK_FAST : TICK);
    return () => clearInterval(id);
  }, [playing, hover, steps]);

  const shown = playing ? Math.min(step, steps) : steps;
  const beats = Array.from({ length: shown }, (_, i) => ` s${i + 1}`).join("");

  const tilt = (e) => {
    const el = ref.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const enter = (e) => {
    setHover(true);
    // Touch has no hover: a tap speeds the story up for a few seconds.
    if (e.pointerType === "touch") setTimeout(() => setHover(false), 3000);
  };
  const leave = (e) => {
    if (e.pointerType !== "touch") setHover(false);
    ref.current?.style.setProperty("--mx", "0");
    ref.current?.style.setProperty("--my", "0");
  };

  return (
    <article
      className={`svc-card${service.wide ? " svc-card--wide" : ""}`}
      onPointerEnter={enter}
      onPointerMove={tilt}
      onPointerLeave={leave}
    >
      <h3 className="h3">{service.title}</h3>
      <div ref={ref} className={`svc-card__art${playing ? " is-playing" : ""}${beats}`}>
        <Art />
      </div>
      <p className="svc-card__copy">{service.copy}</p>
      <div className="tags">
        {service.tags.map((t) => <Tag key={t}>{t}</Tag>)}
      </div>
    </article>
  );
}
