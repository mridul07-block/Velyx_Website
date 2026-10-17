import { useState } from "react";
import Tag from "./Tag";
import useOnScreen from "../lib/useOnScreen";
import useReducedMotion from "../lib/useReducedMotion";
import AgentsArt from "./illustrations/AgentsArt";
import SaasArt from "./illustrations/SaasArt";
import WhatsAppArt from "./illustrations/WhatsAppArt";
import WebArt from "./illustrations/WebArt";
import MobileArt from "./illustrations/MobileArt";
import { VoiceArt } from "./illustrations/IndustryArt";

const ART = { agents: AgentsArt, saas: SaasArt, whatsapp: WhatsAppArt, web: WebArt, mobile: MobileArt, voice: VoiceArt };

/* Kargul-style living illustrations: isometric layers float on their own
   rhythm while the card is on screen, spread apart while it is hovered and
   shift with the cursor. Off screen or under reduced motion they hold still. */
export default function ServiceCard({ service }) {
  const [ref, onScreen] = useOnScreen("0px 0px -10% 0px");
  const reduced = useReducedMotion();
  const [hover, setHover] = useState(false);
  const Art = ART[service.art];
  const playing = onScreen && !reduced;

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
    // Touch has no hover: a tap spreads the layers for a few seconds.
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
      <div ref={ref} className={`svc-card__art${playing ? " is-playing" : ""}${hover ? " is-hover" : ""}`}>
        <Art />
      </div>
      <p className="svc-card__copy">{service.copy}</p>
      <div className="tags">
        {service.tags.map((t) => <Tag key={t}>{t}</Tag>)}
      </div>
    </article>
  );
}
