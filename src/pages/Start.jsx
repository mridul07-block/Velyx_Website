import Seo from "../components/Seo";
import Logo from "../components/Logo";
import Section from "../components/Section";
import SectionHeader from "../components/SectionHeader";
import CalButton from "../components/CalButton";
import ClientStrip from "../components/ClientStrip";
import ProcessSteps from "../components/ProcessSteps";
import FinalCTA from "../components/FinalCTA";
import { SERVICES } from "../data/services";

/* ------------------------------------------------------------------
   /start — dedicated ads landing page.
   Minimal header (no nav links = no exits), one message, one action.
   Every Cal.com click is tracked as book_call_click by the GA4 listener.
------------------------------------------------------------------ */
export default function Start() {
  return (
    <>
      <Seo
        title="Build your AI system — free strategy call"
        description="Velyx Labs designs and builds agentic automation, AI SaaS, WhatsApp CRM systems, and apps for founders. Book a free 30-minute strategy call."
        path="/start"
        noindex
      />
      <header className="nav nav--solid">
        <div className="nav__inner container">
          <span className="nav__brand"><Logo /></span>
          <CalButton size="sm" />
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <p className="eyebrow hero__eyebrow">Founder-led AI studio · Bangalore, India</p>
            <h1 className="h1 hero__title">Put AI to work in your business, properly.</h1>
            <p className="lead hero__sub">
              We design and build agentic automation, AI-native SaaS and WhatsApp systems that take the
              repetitive work off your team — so you scale in revenue, not headcount.
            </p>
            <div className="hero__actions">
              <CalButton>Book a free strategy call</CalButton>
            </div>
            <p className="hero__note">30 minutes · No obligation · Talk directly to the builders</p>
            <ClientStrip label="Products & teams we've built for" />
          </div>
        </section>

        <Section alt>
          <SectionHeader eyebrow="Services" title="What we build" />
          <div className="grid-2">
            {SERVICES.map((s) => (
              <article key={s.id} className="card service-card">
                <h3 className="h3">{s.title}</h3>
                <p className="muted">{s.summary}</p>
              </article>
            ))}
          </div>
        </Section>

        <ProcessSteps />
        <FinalCTA />
      </main>

      <footer className="container lp-foot">
        © {new Date().getFullYear()} Velyx Labs · Bangalore, India · <a href="mailto:velyxlabs@gmail.com">velyxlabs@gmail.com</a> · <a href="/privacy">Privacy</a>
      </footer>
    </>
  );
}
