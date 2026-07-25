import { motion } from "framer-motion";
import CustomCursor from "../components/CustomCursor";
import Seo from "../components/Seo";

/* ------------------------------------------------------------------
   /start — dedicated ads landing page.
   Conversion-focused: minimal header (no nav links = no exits),
   one message, one action. All CTAs open Cal.com; every click is
   tracked as book_call_click by the global GA4 listener.
------------------------------------------------------------------ */

const CAL = {
  "data-cal-namespace": "30min",
  "data-cal-link": "velyx-labs/30min",
  "data-cal-config": '{"layout":"month_view"}',
};

const BUILD = [
  ["01", "Agentic automation", "Systems that answer, qualify, follow up, and file — the repetitive work your team shouldn't be doing."],
  ["02", "AI-native SaaS & MVPs", "From idea to a production product — auth, billing, agent backbone, and telemetry included."],
  ["03", "WhatsApp automation + CRM", "Bookings, reminders, lead nurture and re-engagement running conversationally on WhatsApp."],
  ["04", "Websites & mobile apps", "Fast, modern web and cross-platform apps that look like the company you're becoming."],
];

const PROOF = ["Getlandy AI", "YorkScreenPlay", "Eavesdrop", "Overshoot", "Sacred Basil", "GetCredentialingDone", "NarayanKripa", "Estatico"];

const STEPS = [
  ["Book a free call", "30 minutes. You talk, we listen. No pitch deck."],
  ["Get a mapped plan", "We tell you honestly what to build — and what not to."],
  ["We build it", "Design to deployment, with the founders in the room."],
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function Start() {
  return (
    <>
      <Seo
        title="Build your AI system — free strategy call"
        description="Velyx Labs designs and builds agentic automation, AI SaaS, WhatsApp CRM systems, and apps for founders. Book a free 30-minute strategy call."
        path="/start"
        noindex
      />
      <CustomCursor />

      {/* Minimal header — logo + one action, no exits */}
      <header className="lp-head">
        <div className="lp-head__brand">
          <img src="https://res.cloudinary.com/dmhabztbf/image/upload/v1779688104/ChatGPT_Image_May_25__2026__11_15_18_AM-removebg-preview_hy48ex.png" alt="Velyx Labs" />
          <span className="t"><b>vely</b><em>x</em> labs</span>
        </div>
        <button {...CAL} className="nav__cta"><span className="dot" />Book a free call</button>
      </header>

      {/* Hero */}
      <section className="lp-hero">
        <div className="page-hero__bg" />
        <div className="page-hero__bg-grid" style={{ animation: "grid-drift 40s linear infinite", opacity: 0.5 }} />
        <div className="lp-hero__inner">
          <motion.div className="lp-hero__chip" {...fadeUp(0)}>
            <span className="pip" /> Founder-led studio · Bangalore, India
          </motion.div>
          <motion.h1 className="lp-hero__title" {...fadeUp(0.08)}>
            Put AI to work in your business — <span className="serif">properly.</span>
          </motion.h1>
          <motion.p className="lp-hero__sub" {...fadeUp(0.16)}>
            We design and build agentic automation, AI-native SaaS, and WhatsApp systems that take
            the repetitive work off your team — so you scale in revenue, not headcount.
          </motion.p>
          <motion.div className="lp-hero__actions" {...fadeUp(0.24)}>
            <button {...CAL} className="btn btn--primary">Book a free strategy call <span className="arr">↗</span></button>
            <span className="lp-hero__note">30 minutes · No obligation · Talk directly to the builders</span>
          </motion.div>
        </div>
      </section>

      {/* What we build */}
      <section className="container lp-section">
        <motion.h2 className="lp-h2" {...fadeUp(0)}>What we <span className="serif">build.</span></motion.h2>
        <div className="lp-grid">
          {BUILD.map(([n, t, d], i) => (
            <motion.div key={n} className="lp-card" {...fadeUp(i * 0.07)}>
              <span className="n">{n}</span>
              <span className="t">{t}</span>
              <span className="d">{d}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Proof — real client/product names only */}
      <section className="lp-proof">
        <div className="container">
          <motion.div className="lp-proof__label" {...fadeUp(0)}>Products & teams we've built for</motion.div>
          <motion.div className="lp-proof__row" {...fadeUp(0.08)}>
            {PROOF.map((p) => <span key={p} className="lp-proof__item"><span className="dot" />{p}</span>)}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="container lp-section">
        <motion.h2 className="lp-h2" {...fadeUp(0)}>How it <span className="serif">works.</span></motion.h2>
        <div className="lp-steps">
          {STEPS.map(([t, d], i) => (
            <motion.div key={t} className="lp-step" {...fadeUp(i * 0.08)}>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <span className="t">{t}</span>
              <span className="d">{d}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container" style={{ paddingBlock: "clamp(30px, 5vw, 70px)" }}>
        <motion.div className="cs-cta" {...fadeUp(0)}>
          <h2>Tell us your <span className="serif">bottleneck.</span></h2>
          <p>We'll map the system that removes it — on a free 30-minute call. If we're not the right fit, we'll tell you that too.</p>
          <button {...CAL} className="btn btn--primary">Book a free strategy call <span className="arr">↗</span></button>
        </motion.div>
      </section>

      <footer className="lp-foot">
        © {new Date().getFullYear()} Velyx Labs · Bangalore, India · <a href="mailto:velyxlabs@gmail.com">velyxlabs@gmail.com</a> · <a href="/privacy">Privacy</a>
      </footer>
    </>
  );
}
