import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import { RING_ITEMS } from "../data/testimonials";

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

/* ------------------------------------------------------------------
   TESTIMONIALS — revolving 3D ring
   Cards orbit the vertical axis of the page. Two kinds ride the same
   ring: client quotes, and engagement cards describing the work.
------------------------------------------------------------------ */

function RingCard({ t }) {
  const isQuote = t.kind === "quote";
  return (
    <article className={`vt-card ${isQuote ? "vt-card--quote" : "vt-card--work"}`}>
      <span className="vt-card__tag">{isQuote ? "Testimonial" : "Engagement"}</span>

      <div className="vt-card__head">
        <div className="vt-card__avatar">{t.avatar}</div>
        <div className="vt-card__id">
          <div className="vt-card__name">{t.name}</div>
          <div className="vt-card__role">{isQuote ? t.role : t.meta}</div>
        </div>
      </div>

      {isQuote ? (
        <p className="vt-card__quote">{t.q}</p>
      ) : (
        <>
          <p className="vt-card__desc">{t.d}</p>
          <div className="vt-card__rel">{t.rel}</div>
        </>
      )}
    </article>
  );
}

const SPIN_DEG_PER_SEC = 9;

export function TestimonialsPreview() {
  const [hovered, setHovered] = useState(false);
  const [radius, setRadius] = useState(430);

  const ringRef = useRef(null);
  const cardRefs = useRef([]);
  const rot = useRef(0);      // current angle
  const target = useRef(0);   // where we're easing toward
  const frozenRef = useRef(false);
  const drag = useRef(null);

  const slots = RING_ITEMS.length < 5 ? [...RING_ITEMS, ...RING_ITEMS] : RING_ITEMS;
  const n = slots.length;
  const step = 360 / n;

  useEffect(() => { frozenRef.current = hovered; }, [hovered]);

  // Radius scales with card width so cards never intersect
  useEffect(() => {
    const measure = () => {
      const w = Math.min(360, Math.max(268, window.innerWidth * 0.26));
      const min = (w / 2) / Math.tan(Math.PI / n);
      setRadius(Math.round(Math.max(min * 1.5, w * 1.38)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [n]);

  // Drive the orbit; write straight to the DOM so we don't re-render per frame
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!frozenRef.current && !reduce) target.current -= SPIN_DEG_PER_SEC * dt;
      rot.current += (target.current - rot.current) * Math.min(1, dt * 5);

      if (ringRef.current) {
        ringRef.current.style.transform = `translateZ(-${radius}px) rotateY(${rot.current}deg)`;
      }
      // Fade cards as they swing behind the axis
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const a = ((i * step + rot.current) % 360 + 360) % 360;
        const facing = (Math.cos((a * Math.PI) / 180) + 1) / 2; // 1 = front, 0 = back
        el.style.opacity = (0.08 + 0.92 * Math.pow(facing, 1.6)).toFixed(3);
        el.style.pointerEvents = facing > 0.55 ? "auto" : "none";
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [radius, step]);

  const nudge = (dir) => { target.current += dir * step; };

  const onPointerDown = (e) => {
    drag.current = { x: e.clientX, start: target.current };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    target.current = drag.current.start + (e.clientX - drag.current.x) * 0.28;
  };
  const onPointerUp = () => { drag.current = null; };

  return (
    <section className="section" id="testimonials" data-screen-label="07 Testimonials">
      <div className="container">
        <Reveal className="section__head">
          <div className="section__label">VLX / FOUNDERS SAY</div>
          <h2 className="section__title">
            Operators we've worked with — <span className="serif">unfiltered.</span>
          </h2>
        </Reveal>
      </div>

      <div
        className={`vt3d ${hovered ? "is-frozen" : ""}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); drag.current = null; }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="vt3d__stage">
          <div className="vt3d__ring" ref={ringRef}>
            {slots.map((t, i) => (
              <div
                key={`${t.name}-${i}`}
                className="vt3d__slot"
                ref={(el) => (cardRefs.current[i] = el)}
                style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}
              >
                <RingCard t={t} />
              </div>
            ))}
          </div>
        </div>

        <div className="vt3d__floor" aria-hidden="true" />

        <button className="vt3d__arrow vt3d__arrow--l" onClick={() => nudge(-1)} aria-label="Previous">←</button>
        <button className="vt3d__arrow vt3d__arrow--r" onClick={() => nudge(1)} aria-label="Next">→</button>
      </div>

      <div className="container vt3d__foot">
        <span className="vt3d__hint">
          <span className="dot" />
          {hovered ? "Paused — take your time" : "Hover to pause · drag to spin"}
        </span>
        <Link to="/testimonials" className="btn btn--ghost">
          Read all testimonials <span className="arr">→</span>
        </Link>
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
