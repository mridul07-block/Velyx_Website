import { useState, useRef } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------
   FOUNDERS — centred portrait, orbiting frame, interactive plates
------------------------------------------------------------------ */
const FOUNDERS_PHOTO =
  "https://res.cloudinary.com/dmhabztbf/image/upload/v1784752931/Founders_Profile_VelyxLabs_ywryqa.jpg";

const FOUNDERS = [
  { id: "atharv", num: "01", name: "Atharv Golait", role: "CEO & Co-founder", email: "atharv@velyxlabs.in" },
  { id: "mridul", num: "02", name: "Mridul", role: "Founder", email: "mridul@velyxlabs.in" },
];

const PRINCIPLES = [
  ["Small on purpose", "You talk to the people who build your system — not an account manager."],
  ["Systems, not staffing", "If work repeats, it shouldn't need a new hire to absorb it."],
  ["Weekly, not quarterly", "We stay on the engagement for as long as the system runs."],
];

export default function Founders() {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const [active, setActive] = useState(null);

  // Tilt + spotlight follow the cursor, written straight to the DOM
  const onMove = (e) => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;
    const r = wrap.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    card.style.transform = `rotateY(${(px - 0.5) * 11}deg) rotateX(${(0.5 - py) * 11}deg)`;
    wrap.style.setProperty("--fx", `${px * 100}%`);
    wrap.style.setProperty("--fy", `${py * 100}%`);
  };

  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  return (
    <section className="section fdr" id="founders" data-screen-label="05 Founders">
      <div className="fdr__bg" aria-hidden="true" />

      <div className="container fdr__inner">
        <motion.div
          className="fdr__head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section__label">VLX / FOUNDERS</div>
          <h2 className="fdr__title">
            Two people. <span className="serif">One obsession.</span>
          </h2>
          <p className="fdr__lede">
            We kept watching good teams grow headcount to absorb work that simply repeats — the
            follow-ups, the routing, the admin drag. So we started building the systems that take it
            instead.
          </p>
        </motion.div>

        {/* ---------- Centred portrait ---------- */}
        <motion.div
          className="fdr__stage"
          initial={{ opacity: 0, y: 44, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="fdr__halo" aria-hidden="true" />
          <span className="fdr__orbit fdr__orbit--a" aria-hidden="true" />
          <span className="fdr__orbit fdr__orbit--b" aria-hidden="true" />

          <div
            className="fdr__frame"
            ref={wrapRef}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
          >
            <div className="fdr__card" ref={cardRef}>
              <img
                className="fdr__img"
                src={FOUNDERS_PHOTO}
                alt="Atharv and Mridul, founders of Velyx Labs"
                loading="lazy"
              />

              <span className="fdr__vignette" aria-hidden="true" />
              <span className="fdr__spot" aria-hidden="true" />
              <span className="fdr__scan" aria-hidden="true" />

              <span className="fdr__corner fdr__corner--tl" aria-hidden="true" />
              <span className="fdr__corner fdr__corner--tr" aria-hidden="true" />
              <span className="fdr__corner fdr__corner--bl" aria-hidden="true" />
              <span className="fdr__corner fdr__corner--br" aria-hidden="true" />

              <div className="fdr__caption">
                <span className="pip" />
                Bangalore, India
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---------- Hand-drawn connectors from the portrait ---------- */}
        <div className="fdr__link" aria-hidden="true">
          <svg viewBox="0 0 1000 150" preserveAspectRatio="xMidYMid meet">
            {[
              { d: "M486 2 C470 46 430 58 372 70 C300 84 268 100 258 130", head: "M249 120 L258 134 L268 122", side: "atharv" },
              { d: "M514 2 C530 46 570 58 628 70 C700 84 732 100 742 130", head: "M733 120 L742 134 L752 122", side: "mridul" },
            ].map((p) => (
              <g key={p.side} className={`fdr__wire ${active === p.side ? "is-lit" : ""}`}>
                <motion.path
                  d={p.d}
                  fill="none"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.path
                  d={p.head}
                  fill="none"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.35, delay: 1.25 }}
                />
                <circle r="2.6" className="fdr__pulse">
                  <animateMotion dur="3.6s" repeatCount="indefinite" path={p.d} />
                  <animate attributeName="opacity" values="0;1;1;0" dur="3.6s" repeatCount="indefinite" />
                </circle>
              </g>
            ))}
          </svg>
        </div>

        {/* ---------- Founder plates ---------- */}
        <div className="fdr__people">
          {FOUNDERS.map((f, i) => (
            <motion.a
              key={f.id}
              href={`mailto:${f.email}`}
              className={`fdr__person ${active === f.id ? "is-active" : ""}`}
              onMouseEnter={() => setActive(f.id)}
              onMouseLeave={() => setActive(null)}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.12 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="fdr__shine" aria-hidden="true" />
              <span className="fdr__ptop">
                <span className="num">{f.num}</span>
                <span className="pip" />
              </span>
              <span className="fdr__name">{f.name}</span>
              <span className="fdr__role">{f.role}</span>
              <span className="fdr__prow">
                <span className="fdr__mail">{f.email}</span>
                <span className="fdr__arrow">↗</span>
              </span>
            </motion.a>
          ))}
        </div>

        {/* ---------- How we work ---------- */}
        <div className="fdr__principles">
          {PRINCIPLES.map(([t, d], i) => (
            <motion.div
              key={t}
              className="fdr__principle"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <span className="t">{t}</span>
              <span className="d">{d}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
