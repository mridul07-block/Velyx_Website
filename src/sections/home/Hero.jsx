import CalButton from "../../components/CalButton";
import ClientStrip from "../../components/ClientStrip";

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="container">
        <p className="eyebrow hero__eyebrow">Founder-led AI studio · Bangalore, India</p>
        <h1 className="h1 hero__title">AI systems and software that grow your business.</h1>
        <p className="lead hero__sub">
          We design and build agentic automation, AI-native SaaS, WhatsApp systems, websites and apps —
          so your team spends less time on repetitive work and more on growth.
        </p>
        <div className="hero__actions">
          <CalButton>Book a free 30-min call</CalButton>
          <a href="#services" className="btn btn--secondary">See what we build</a>
        </div>
        <p className="hero__note">30 minutes · No obligation · Talk directly to the builders</p>
        <ClientStrip />
      </div>
    </section>
  );
}
