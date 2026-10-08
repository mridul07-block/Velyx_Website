import Seo from "../components/Seo";
import Layout from "../components/Layout";
import Section from "../components/Section";
import SectionHeader from "../components/SectionHeader";
import CalButton from "../components/CalButton";
import FadeIn from "../components/FadeIn";
import FAQ from "../components/FAQ";
import ProcessSteps from "../components/ProcessSteps";
import FinalCTA from "../components/FinalCTA";
import { SERVICES } from "../data/services";
import { FAQ_ITEMS } from "../data/faq";

export default function Services() {
  return (
    <Layout>
      <Seo
        title="Services — AI systems, SaaS & apps"
        description="Agentic automation, AI SaaS and MVPs, WhatsApp automation with CRM, and websites and mobile apps — designed and built by Velyx Labs."
        path="/services"
      />
      <section className="page-hero">
        <div className="container">
          <SectionHeader
            as="h1"
            eyebrow="Services"
            title="What we build for founders"
            sub="Four services, one goal: systems and software that take work off your team and help you grow."
          />
          <CalButton>Book a free 30-min call</CalButton>
        </div>
      </section>

      {SERVICES.map((s, i) => (
        <section key={s.id} id={s.id} className={`section svc ${i % 2 === 0 ? "section--alt" : ""}`}>
          <div className="container svc__inner">
            <div className="svc__intro">
              <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="h2">{s.title}</h2>
              <p className="lead">{s.description}</p>
              <CalButton variant="secondary">Talk to us about this</CalButton>
            </div>
            <FadeIn className="svc__lists">
              <div>
                <h3 className="h3">What you get</h3>
                <ul className="checklist">
                  {s.deliverables.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="h3">Example builds</h3>
                <ul className="examples">
                  {s.examples.map(([title, tagline]) => (
                    <li key={title}>
                      <span className="examples__title">{title}</span>
                      <span className="muted">{tagline}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </section>
      ))}

      <ProcessSteps />
      <Section id="faq">
        <SectionHeader align="center" eyebrow="FAQ" title="Questions founders ask" />
        <FAQ items={FAQ_ITEMS} />
      </Section>
      <FinalCTA />
    </Layout>
  );
}
