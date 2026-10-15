import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import Tag from "../components/Tag";
import IntroCallButton from "../components/IntroCallButton";
import TrialCard from "../components/TrialCard";
import useOnScreen from "../lib/useOnScreen";
import useReducedMotion from "../lib/useReducedMotion";
import AgentsArt from "../components/illustrations/AgentsArt";
import SaasArt from "../components/illustrations/SaasArt";
import WhatsAppArt from "../components/illustrations/WhatsAppArt";
import WebArt from "../components/illustrations/WebArt";
import MobileArt from "../components/illustrations/MobileArt";
import { HealthcareArt, RealEstateArt, AutomotiveArt } from "../components/illustrations/IndustryArt";
import { SERVICES } from "../data/services";

const ART = { agents: AgentsArt, saas: SaasArt, whatsapp: WhatsAppArt, web: WebArt, mobile: MobileArt, healthcare: HealthcareArt, realestate: RealEstateArt, automotive: AutomotiveArt };

/* One service in full: what it is, what's included, who it's for, the
   stack, and the same living illustration as its home-page card. */
function ServiceDetail({ service, index }) {
  const [ref, onScreen] = useOnScreen("0px 0px -10% 0px");
  const reduced = useReducedMotion();
  const Art = ART[service.art];

  return (
    <section id={service.id} className="svc-detail">
      <div className="svc-detail__body">
        <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
        <h2 className="h2">{service.title}</h2>
        <p className="svc-detail__copy">{service.copy}</p>

        <h3 className="svc-detail__label">What's included</h3>
        <ul className="svc-detail__list">
          {service.includes.map((item) => <li key={item}>{item}</li>)}
        </ul>

        <h3 className="svc-detail__label">Built for</h3>
        <div className="tags tags--light">
          {service.niches.map((n) => <Tag key={n}>{n}</Tag>)}
        </div>

        <h3 className="svc-detail__label">Tools</h3>
        <div className="tags">
          {service.tags.map((t) => <Tag key={t}>{t}</Tag>)}
        </div>

        <IntroCallButton className="svc-detail__cta">Book an intro call</IntroCallButton>
      </div>
      <div ref={ref} className={`svc-detail__art${onScreen && !reduced ? " is-playing" : ""}`}>
        <Art />
      </div>
    </section>
  );
}

export default function Services() {
  return (
    <Layout>
      <Seo
        title="Services"
        description="AI agents, AI SaaS and MVPs, WhatsApp automation, websites with SEO, and mobile apps — what Velyx Labs builds, what's included and who it's for."
        path="/services"
      />
      <section className="page-head">
        <div className="container">
          <SectionHeader
            as="h1"
            align="center"
            title="Services"
            sub="What we build, what's included, and the businesses we build it for."
          />
          <nav className="filters svc-jump" aria-label="Jump to a service">
            {SERVICES.map((s) => <a key={s.id} href={`#${s.id}`} className="filter">{s.title}</a>)}
          </nav>
        </div>
      </section>
      <div className="container svc-details">
        {SERVICES.map((s, i) => <ServiceDetail key={s.id} service={s} index={i} />)}
      </div>
      <TrialCard pricingLink />
    </Layout>
  );
}
