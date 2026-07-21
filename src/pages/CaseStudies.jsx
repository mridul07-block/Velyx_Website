import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import CineNav from "../components/CineNav";
import CineFooter from "../components/CineFooter";
import CustomCursor from "../components/CustomCursor";
import ProgressUpdater from "../components/ProgressUpdater";
import { CASE_STUDIES } from "../data/caseStudies";
import { CASE_VIZ } from "../components/caseVizMap";

/* ------------------------------------------------------------------
   Hero background — torus knot lattice + drifting particles
------------------------------------------------------------------ */
function CaseStudiesBg() {
  const ref = useRef(null);
  useEffect(() => {
    const mount = ref.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 9;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Wireframe torus knot — the "interlocking systems" motif
    const geo = new THREE.TorusKnotGeometry(1.9, 0.42, 128, 12, 2, 3);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xd97757,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const knot = new THREE.Mesh(geo, mat);
    knot.position.x = 2.6;
    scene.add(knot);

    // Secondary ring
    const rgeo = new THREE.TorusGeometry(3.2, 0.012, 8, 120);
    const rmat = new THREE.MeshBasicMaterial({ color: 0xf6cf8c, transparent: true, opacity: 0.22 });
    const ring = new THREE.Mesh(rgeo, rmat);
    ring.position.x = 2.6;
    ring.rotation.x = Math.PI / 2.6;
    scene.add(ring);

    // Particles
    const pgeo = new THREE.BufferGeometry();
    const pcount = 700;
    const pos = new Float32Array(pcount * 3);
    for (let i = 0; i < pcount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 9;
    }
    pgeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pmat = new THREE.PointsMaterial({ size: 0.028, color: 0xf6cf8c, transparent: true, opacity: 0.65 });
    const pts = new THREE.Points(pgeo, pmat);
    scene.add(pts);

    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      const t = clock.getElapsedTime();
      knot.rotation.x = t * 0.09;
      knot.rotation.y = t * 0.13;
      ring.rotation.z = t * 0.06;
      pts.rotation.y = t * 0.04;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      rgeo.dispose();
      rmat.dispose();
      pgeo.dispose();
      pmat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);
  return (
    <div
      ref={ref}
      style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", mixBlendMode: "screen" }}
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------
   Industry card
------------------------------------------------------------------ */
function CaseCard({ c, i }) {
  const V = CASE_VIZ[c.viz];
  return (
    <motion.article
      className="cs-card"
      layout
      initial={{ opacity: 0, scale: 0.96, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: Math.min(i * 0.06, 0.3) }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <Link to={`/case-studies/${c.slug}`} className="cs-card__link">
        <div className="cs-card__viz">
          <V />
          <div className="cs-card__num">{c.num}</div>
        </div>
        <div className="cs-card__body">
          <div className="cs-card__kicker">
            <span>{c.name}</span>
            <span className="cat">{c.cat}</span>
          </div>
          <h3 className="cs-card__title">{c.tagline}</h3>
          <p className="cs-card__desc">{c.summary}</p>
          <div className="cs-card__metrics">
            {c.metrics.map(([v, l]) => (
              <div key={l} className="cs-card__metric">
                <div className="v">{v}</div>
                <div className="l">{l}</div>
              </div>
            ))}
          </div>
          <div className="cs-card__cta">
            Read the case study <span className="arr">↗</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* ------------------------------------------------------------------
   PAGE
------------------------------------------------------------------ */
export default function CaseStudies() {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Agentic Automation", "SaaS + Agents", "Full System"];
  const list = filter === "All" ? CASE_STUDIES : CASE_STUDIES.filter((c) => c.cat === filter);

  return (
    <>
      <CustomCursor />
      <ProgressUpdater />
      <CineNav active="case-studies" />

      <section className="page-hero" data-screen-label="01 Case Studies Hero">
        <CaseStudiesBg />
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
              <span>VELYX LABS</span> <span style={{ color: "var(--fg-mute)" }}>/</span> CASE STUDIES
            </motion.div>
            <motion.h1
              className="page-hero__title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              Eight industries.<br />
              <span className="serif">One operating thesis.</span>
            </motion.h1>
          </div>
          <motion.p
            className="page-hero__sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            Every business has a bottleneck that headcount cannot fix. We find the part of the
            operation that runs on repetition rather than judgement — and hand it to a system.
            Here is exactly how that plays out, industry by industry.
          </motion.p>
        </div>
      </section>

      {/* Thesis strip */}
      <section className="container">
        <motion.div
          className="cs-thesis"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {[
            ["01", "Find the leak", "Most businesses lose more to response lag, dead follow-up, and admin drag than to competition."],
            ["02", "Build the system", "A SaaS layer, an agent fleet, or both — designed around your actual workflow, not a template."],
            ["03", "Hand back the hours", "Your team stops doing what repeats and starts doing what only a human can."],
          ].map(([n, t, d], i) => (
            <motion.div
              key={n}
              className="cs-thesis__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="n">{n}</div>
              <div className="t">{t}</div>
              <div className="d">{d}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Filter + grid */}
      <div className="container">
        <div className="cs-filters">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`cs-filter ${filter === c ? "is-active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="cs-grid">
          <AnimatePresence mode="popLayout">
            {list.map((c, i) => (
              <CaseCard key={c.slug} c={c} i={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* CTA */}
      <section className="container" style={{ paddingBlock: "clamp(60px, 9vw, 120px)" }}>
        <motion.div
          className="cs-cta"
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2>
            Don't see <span className="serif">your industry?</span>
          </h2>
          <p>
            The pattern travels. If your team spends its day on work that repeats, there is a
            system underneath it waiting to be built.
          </p>
          <Link to="/contact" className="btn btn--primary">
            Book a strategy call <span className="arr">↗</span>
          </Link>
        </motion.div>
      </section>

      <CineFooter />
    </>
  );
}
