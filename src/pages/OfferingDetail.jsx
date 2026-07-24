import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import CineNav from "../components/CineNav";
import CineFooter from "../components/CineFooter";
import CustomCursor from "../components/CustomCursor";
import ProgressUpdater from "../components/ProgressUpdater";
import Seo from "../components/Seo";
import { OFFERINGS, getOffering } from "../data/offerings";
import { VIZ } from "../components/offeringVizMap";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

export default function OfferingDetail() {
  const { slug } = useParams();
  const o = getOffering(slug);
  if (!o) return <Navigate to="/portfolio" replace />;

  const V = VIZ[o.viz];
  const idx = OFFERINGS.findIndex((x) => x.slug === o.slug);
  const next = OFFERINGS[(idx + 1) % OFFERINGS.length];

  return (
    <>
      <Seo
        title={o.title.replace(/\.$/, "")}
        description={o.desc}
        path={`/portfolio/${o.slug}`}
        jsonLd={{ "@context": "https://schema.org", "@type": "Service", name: o.title.replace(/\.$/, ""), description: o.desc, serviceType: o.cat, provider: { "@type": "Organization", name: "Velyx Labs", url: "https://velyxlabs.in" }, areaServed: "Worldwide" }}
      />
      <CustomCursor />
      <ProgressUpdater />
      <CineNav active="portfolio" />

      {/* ---------------- HERO ---------------- */}
      <section className="page-hero" data-screen-label={`01 ${o.cat}`}>
        <div className="page-hero__bg" />
        <div className="page-hero__bg-grid" style={{ animation: "grid-drift 40s linear infinite", opacity: 0.5 }} />
        <div className="page-hero__inner" style={{ position: "relative", zIndex: 1 }}>
          <div>
            <motion.div
              className="page-hero__crumbs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Link to="/portfolio" style={{ color: "var(--accent)" }}>PORTFOLIO</Link>{" "}
              <span style={{ color: "var(--fg-mute)" }}>/</span> {o.cat.toUpperCase()}
            </motion.div>
            <motion.h1
              className="page-hero__title"
              style={{ fontSize: "clamp(38px, 5.4vw, 84px)" }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              {o.title}
            </motion.h1>
            <motion.p
              className="page-hero__sub"
              style={{ marginTop: 20 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
            >
              <span className="serif" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--accent)", fontSize: "1.15em" }}>
                {o.tagline}
              </span>
            </motion.p>
            <motion.div
              style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
            >
              <button
                data-cal-namespace="30min"
                data-cal-link="velyx-labs/30min"
                data-cal-config='{"layout":"month_view"}'
                className="btn btn--primary"
              >
                Book a strategy call <span className="arr">↗</span>
              </button>
              <Link to="/portfolio" className="btn btn--ghost">All work <span className="arr">→</span></Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div className="cs-viz-frame" style={{ marginTop: 0 }}><V /></div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- OVERVIEW ---------------- */}
      <section className="container cs-section">
        <motion.div {...fadeUp}>
          <div className="cs-label">What it is</div>
          <h2 className="cs-h2" style={{ maxWidth: "20ch" }}>
            The <span className="serif">short version.</span>
          </h2>
          <p className="cs-lede" style={{ marginTop: 22 }}>{o.overview}</p>
        </motion.div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="container cs-section">
        <motion.div {...fadeUp}>
          <div className="cs-label">How it works</div>
          <h2 className="cs-h2">
            Three moves, <span className="serif">start to live.</span>
          </h2>
          <div className="cs-modules" style={{ marginTop: 34 }}>
            {o.howItWorks.map(([t, d], i) => (
              <motion.div
                key={t}
                className="cs-module"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div className="t">{t}</div>
                  <div className="d">{d}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ---------------- WHAT YOU GET ---------------- */}
      <section className="container cs-section">
        <motion.div {...fadeUp}>
          <div className="cs-label">What you get</div>
          <h2 className="cs-h2">
            Everything in <span className="serif">the box.</span>
          </h2>
          <div className="cs-deliv__grid" style={{ marginTop: 32 }}>
            {o.youGet.map((item, i) => (
              <motion.div
                key={item}
                className="cs-deliv__item"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <span className="tick">✓</span>
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ---------------- GOOD FOR + STACK ---------------- */}
      <section className="container cs-section">
        <motion.div className="cs-split" {...fadeUp}>
          <div className="cs-split__left">
            <div className="cs-label">Good for</div>
            <h2 className="cs-h2">
              Where it <span className="serif">fits.</span>
            </h2>
          </div>
          <div className="cs-split__right">
            <div className="cs-stack__chips" style={{ marginBottom: 40 }}>
              {o.goodFor.map((g) => (
                <span key={g} className="cs-chip">{g}</span>
              ))}
            </div>
            <div className="cs-label">Built on</div>
            <div className="cs-stack__chips" style={{ marginTop: 16 }}>
              {o.stack.map((s) => (
                <span key={s} className="cs-chip">{s}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ---------------- NEXT ---------------- */}
      <section className="container cs-section">
        <motion.div className="cs-next" {...fadeUp}>
          <Link to={`/portfolio/${next.slug}`} className="cs-next__link">
            <div className="cs-next__label">Next — {next.cat}</div>
            <div className="cs-next__name">{next.title} <span className="arr">↗</span></div>
            <div className="cs-next__tag">{next.tagline}</div>
          </Link>
        </motion.div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="container" style={{ paddingBlock: "clamp(40px, 7vw, 100px)" }}>
        <motion.div
          className="cs-cta"
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2>Want this <span className="serif">for your business?</span></h2>
          <p>We'll map this system to your workflow in a 30-minute call and tell you honestly whether it's the right build.</p>
          <button
            data-cal-namespace="30min"
            data-cal-link="velyx-labs/30min"
            data-cal-config='{"layout":"month_view"}'
            className="btn btn--primary"
          >
            Book a strategy call <span className="arr">↗</span>
          </button>
        </motion.div>
      </section>

      <CineFooter />
    </>
  );
}
