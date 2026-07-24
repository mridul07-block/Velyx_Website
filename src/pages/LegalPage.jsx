import { motion } from "framer-motion";
import CineNav from "../components/CineNav";
import CineFooter from "../components/CineFooter";
import CustomCursor from "../components/CustomCursor";
import ProgressUpdater from "../components/ProgressUpdater";

/* ------------------------------------------------------------------
   Shared layout for legal pages (Privacy, Terms).
   `sections`: [{ h, body: [string | {list:[...]}] }]
------------------------------------------------------------------ */
export default function LegalPage({ kicker, title, titleSerif, updated, intro, sections }) {
  return (
    <>
      <CustomCursor />
      <ProgressUpdater />
      <CineNav />

      <section className="page-hero" data-screen-label={`01 ${title}`}>
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
              <span>VELYX LABS</span> <span style={{ color: "var(--fg-mute)" }}>/</span> {kicker}
            </motion.div>
            <motion.h1
              className="page-hero__title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              {title} <span className="serif">{titleSerif}</span>
            </motion.h1>
          </div>
          <motion.p
            className="page-hero__sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            {intro}
            <br />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-mute)", letterSpacing: "0.06em" }}>
              LAST UPDATED · {updated}
            </span>
          </motion.p>
        </div>
      </section>

      <div className="container legal">
        {sections.map((s, i) => (
          <motion.section
            key={s.h}
            className="legal__block"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="legal__num">{String(i + 1).padStart(2, "0")}</div>
            <div className="legal__content">
              <h2 className="legal__h">{s.h}</h2>
              {s.body.map((b, j) =>
                typeof b === "string" ? (
                  <p key={j} className="legal__p">{b}</p>
                ) : (
                  <ul key={j} className="legal__list">
                    {b.list.map((li) => <li key={li}>{li}</li>)}
                  </ul>
                )
              )}
            </div>
          </motion.section>
        ))}
      </div>

      <CineFooter />
    </>
  );
}
