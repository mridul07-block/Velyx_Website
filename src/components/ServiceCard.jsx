import Tag from "./Tag";
import useOnScreen from "../lib/useOnScreen";
import useReducedMotion from "../lib/useReducedMotion";
import AgentsArt from "./illustrations/AgentsArt";
import SaasArt from "./illustrations/SaasArt";
import WhatsAppArt from "./illustrations/WhatsAppArt";
import WebArt from "./illustrations/WebArt";
import MobileArt from "./illustrations/MobileArt";

const ART = { agents: AgentsArt, saas: SaasArt, whatsapp: WhatsAppArt, web: WebArt, mobile: MobileArt };

/* The illustration loops only while the card is on screen (a static
   drawing is fine if the observer never fires) and never plays for
   reduced-motion visitors. */
export default function ServiceCard({ service }) {
  const [ref, onScreen] = useOnScreen("0px 0px -10% 0px");
  const reduced = useReducedMotion();
  const Art = ART[service.art];

  return (
    <article className={`svc-card${service.wide ? " svc-card--wide" : ""}`}>
      <h3 className="h3">{service.title}</h3>
      <div ref={ref} className={`svc-card__art${onScreen && !reduced ? " is-playing" : ""}`}>
        <Art />
      </div>
      <p className="svc-card__copy">{service.copy}</p>
      <div className="tags">
        {service.tags.map((t) => <Tag key={t}>{t}</Tag>)}
      </div>
    </article>
  );
}
