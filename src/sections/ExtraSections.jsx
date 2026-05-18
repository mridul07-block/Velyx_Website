import { useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";

export function StatsBar() {
  const stats = [
    { label: "01 / SYSTEMS LIVE", big: "184", serif: "", note: "agent systems shipped to production since '23" },
    { label: "02 / FTE REPLACED", big: "362", serif: "", note: "weekly hours of manual ops eliminated — and counting" },
    { label: "03 / TIME TO LIVE", big: "30", serif: "d", note: "median days from kickoff to first agent in production" },
    { label: "04 / NPS", big: "78", serif: ".4", note: "founder-rated, last 12 months of engagements" },
  ];
  return (
    <section className="stats-bar" data-screen-label="06 Numbers">
      <div className="container">
        <Reveal className="section__head" style={{ marginBottom: 60 }}>
          <div className="section__label">VLX / RECEIPTS</div>
          <h2 className="section__title">
            We don't pitch potential. <span className="serif">We ship receipts.</span>
          </h2>
        </Reveal>
        <div className="stats-bar__grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-cell">
              <div className="stat-cell__label">{s.label}</div>
              <div className="stat-cell__big">{s.big}<span className="serif">{s.serif}</span></div>
              <div className="stat-cell__note">{s.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsPreview() {
  const items = [
    {
      q: "Velyx didn't sell us AI. They rebuilt our operating system. We're now doing the work of 12 with 4.",
      name: "Priya Anand",
      role: "FOUNDER · NORTHWIND",
      avatar: "PA",
    },
    {
      q: "They shipped our SaaS MVP in 38 days. Paying customers in 60. I've never seen velocity like this from an agency.",
      name: "Marcus Reeves",
      role: "CEO · SABLE HEALTH",
      avatar: "MR",
    },
    {
      q: "The agents Velyx built run the GTM motion now. I review escalations for 20 minutes a day and ship product.",
      name: "Ananya Iyer",
      role: "FOUNDER · HALCYON AI",
      avatar: "AI",
    },
  ];
  return (
    <section className="section" id="testimonials" data-screen-label="07 Testimonials">
      <div className="container">
        <Reveal className="section__head">
          <div className="section__label">VLX / FOUNDERS SAY</div>
          <h2 className="section__title">
            Operators we've worked with — <span className="serif">unfiltered.</span>
          </h2>
        </Reveal>
        <Reveal className="testimonials__grid">
          {items.map((t) => (
            <article key={t.name} className="testimonial">
              <p className="testimonial__quote">{t.q}</p>
              <div className="testimonial__author">
                <div className="testimonial__avatar">{t.avatar}</div>
                <div className="testimonial__meta">
                  <div className="testimonial__name">{t.name}</div>
                  <div className="testimonial__role">{t.role}</div>
                </div>
              </div>
            </article>
          ))}
        </Reveal>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
          <Link to="/testimonials" className="btn btn--ghost">
            Read all testimonials <span className="arr">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const items = [
    { q: "Who do you work with?", a: "Founders building product-led companies between seed and Series B. We're picky — we take ~6 engagements per quarter. The bar is: ambitious, technical, and ready to operate differently." },
    { q: "How is this different from hiring an AI agency?", a: "Most agencies build prototypes and disappear. We embed, ship to production, and stay on for compounding engagements. Every agent we deploy is observable, evaluable, and improvable — like real software, not a one-off demo." },
    { q: "What does an engagement look like?", a: "Two weeks of diagnosis. Thirty days to first agent in production. Then a monthly compounding cycle — new agents, new evals, new leverage. Most founders renew. Some are on year three." },
    { q: "What does it cost?", a: "Engagements start at $35k/month. We work on retainer because the work compounds — agent #1 makes agent #2 cheaper to build. There's no quick-fix tier. We're not the right partner for a one-shot project." },
    { q: "Will I own the code and the agents?", a: "Yes. Everything we build is yours — source code, model fine-tunes, eval suites, infrastructure. We document obsessively so you can run it without us if you choose." },
    { q: "Do you build for non-technical founders?", a: "Especially. The founders who get the most leverage from Velyx are the ones who'd never build this themselves but have a sharp instinct for where the work should disappear." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="section" data-screen-label="11 FAQ">
      <div className="container">
        <Reveal className="faq">
          <div>
            <div className="section__label" style={{ marginBottom: 18 }}>VLX / FAQ</div>
            <h2 className="section__title">
              The questions <span className="serif">founders ask first.</span>
            </h2>
          </div>
          <div className="faq__list">
            {items.map((it, i) => (
              <div
                key={i}
                className={`faq__item ${open === i ? "open" : ""}`}
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                <div className="faq__q">
                  <span>{it.q}</span>
                  <span className="plus">+</span>
                </div>
                <div className="faq__a">{it.a}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
