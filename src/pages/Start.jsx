import Seo from "../components/Seo";
import Logo from "../components/Logo";
import CalButton from "../components/CalButton";
import SectionHeader from "../components/SectionHeader";
import FAQ from "../components/FAQ";
import TrustedBy from "../sections/home/TrustedBy";
import ServicesPanel from "../sections/home/ServicesPanel";
import TrialCard from "../components/TrialCard";
import { FAQ_ITEMS } from "../data/faq";

/* /start — dedicated ads landing page. No nav links (no exits); every
   CTA books a call or starts the trial. Cal clicks are tracked by GA4. */
export default function Start() {
  return (
    <>
      <Seo
        title="Build your AI system — free strategy call"
        description="Velyx Labs designs and builds AI agents, SaaS products, WhatsApp systems, websites and apps for founders. Book a free 30-minute call."
        path="/start"
        noindex
      />
      <header className="lp-head container">
        <Logo />
        <CalButton size="sm" />
      </header>
      <main className="lp">
        <section className="hero">
          <div className="container hero__inner">
            <p className="status"><span className="status__dot" aria-hidden="true" />Founder-led · Bangalore, India</p>
            <h1 className="h1 hero__title">An AI and engineering partner for founders and growing businesses.</h1>
            <p className="lead hero__sub">
              We design and build AI agents, SaaS products, WhatsApp systems, websites and apps that take repetitive
              work off your team — so you scale in revenue, not headcount.
            </p>
            <div className="hero__actions">
              <CalButton>Book a free 30-min call</CalButton>
            </div>
          </div>
        </section>
        <TrustedBy />
        <ServicesPanel />
        <div className="section"><TrialCard /></div>
        <section className="section">
          <div className="container">
            <SectionHeader align="center" title="FAQs" />
            <FAQ items={FAQ_ITEMS} />
          </div>
        </section>
      </main>
      <footer className="container lp-foot">
        © {new Date().getFullYear()} Velyx Labs · <a href="mailto:velyxlabs@gmail.com">velyxlabs@gmail.com</a> · <a href="/privacy">Privacy</a>
      </footer>
    </>
  );
}
