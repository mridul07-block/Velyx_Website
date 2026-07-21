import { useEffect, useRef } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import * as THREE from "three";
import { motion } from "framer-motion";
import CineNav from "../components/CineNav";
import CineFooter from "../components/CineFooter";
import CustomCursor from "../components/CustomCursor";
import ProgressUpdater from "../components/ProgressUpdater";
import { CASE_STUDIES, getCaseStudy } from "../data/caseStudies";
import { CASE_VIZ } from "../components/caseVizMap";

/* ------------------------------------------------------------------
   Hero background — slow rotating lattice, lighter than the index page
------------------------------------------------------------------ */
function DetailBg() {
  const ref = useRef(null);
  useEffect(() => {
    const mount = ref.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 8;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const geo = new THREE.OctahedronGeometry(2.3, 1);
    const mat = new THREE.MeshBasicMaterial({ color: 0xd97757, wireframe: true, transparent: true, opacity: 0.16 });
    const shape = new THREE.Mesh(geo, mat);
    shape.position.x = 3;
    scene.add(shape);

    const pgeo = new THREE.BufferGeometry();
    const pcount = 500;
    const pos = new Float32Array(pcount * 3);
    for (let i = 0; i < pcount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    pgeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pmat = new THREE.PointsMaterial({ size: 0.026, color: 0xf6cf8c, transparent: true, opacity: 0.6 });
    const pts = new THREE.Points(pgeo, pmat);
    scene.add(pts);

    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      const t = clock.getElapsedTime();
      shape.rotation.x = t * 0.11;
      shape.rotation.y = t * 0.16;
      pts.rotation.y = t * 0.035;
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

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

/* ------------------------------------------------------------------
   PAGE
------------------------------------------------------------------ */
export default function CaseStudyDetail() {
  const { slug } = useParams();
  const c = getCaseStudy(slug);

  if (!c) return <Navigate to="/case-studies" replace />;

  const V = CASE_VIZ[c.viz];
  const idx = CASE_STUDIES.findIndex((x) => x.slug === c.slug);
  const next = CASE_STUDIES[(idx + 1) % CASE_STUDIES.length];

  return (
    <>
      <CustomCursor />
      <ProgressUpdater />
      <CineNav active="case-studies" />

      {/* ---------------- HERO ---------------- */}
      <section className="page-hero" data-screen-label={`${c.num} ${c.name}`}>
        <DetailBg />
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
              <Link to="/case-studies" style={{ color: "var(--accent)" }}>
                CASE STUDIES
              </Link>{" "}
              <span style={{ color: "var(--fg-mute)" }}>/</span> {c.name.toUpperCase()}
            </motion.div>
            <motion.h1
              className="page-hero__title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              {c.hero.title}
              <br />
              <span className="serif">{c.hero.titleSerif}</span>
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <p className="page-hero__sub">{c.hero.sub}</p>
            <div className="cs-hero__tag">{c.cat}</div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- HEADLINE METRICS ---------------- */}
      <section className="container">
        <motion.div className="cs-metrics" {...fadeUp}>
          {c.results.map(([v, l], i) => (
            <motion.div
              key={l}
              className="cs-metrics__item"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="v">{v}</div>
              <div className="l">{l}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ---------------- THE PROBLEM ---------------- */}
      <section className="container cs-section">
        <motion.div className="cs-split" {...fadeUp}>
          <div className="cs-split__left">
            <div className="cs-label">The bottleneck</div>
            <h2 className="cs-h2">
              What was <span className="serif">actually broken.</span>
            </h2>
          </div>
          <div className="cs-split__right">
            <p className="cs-lede">{c.problem.lede}</p>
            <div className="cs-problems">
              {c.problem.points.map((p, i) => (
                <motion.div
                  key={p.t}
                  className="cs-problem"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="cs-problem__t">{p.t}</div>
                  <div className="cs-problem__d">{p.d}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ---------------- THE SYSTEM ---------------- */}
      <section className="container cs-section">
        <motion.div className="cs-split" {...fadeUp}>
          <div className="cs-split__left">
            <div className="cs-label">The build</div>
            <h2 className="cs-h2">
              {c.system.name.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="serif">{c.system.name.split(" ").slice(-1)}</span>
            </h2>
            <div className="cs-systemtype">{c.system.type}</div>
            <div className="cs-viz-frame">
              <V />
            </div>
          </div>
          <div className="cs-split__right">
            <p className="cs-lede">{c.system.lede}</p>
            <div className="cs-modules">
              {c.system.modules.map((m, i) => (
                <motion.div
                  key={m.n}
                  className="cs-module"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="n">{m.n}</span>
                  <div>
                    <div className="t">{m.t}</div>
                    <div className="d">{m.d}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ---------------- FLOW ---------------- */}
      <section className="container cs-section">
        <motion.div className="cs-flow" {...fadeUp}>
          {c.flow.map((step, i) => (
            <motion.div
              key={step}
              className="cs-flow__step"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="dot" />
              {step}
              {i < c.flow.length - 1 && <span className="cs-flow__arrow">→</span>}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ---------------- THE EXAMPLE ---------------- */}
      <section className="container cs-section">
        <motion.div className="cs-example" {...fadeUp}>
          <div className="cs-label">In practice</div>
          <h2 className="cs-h2">
            One client, <span className="serif">start to finish.</span>
          </h2>
          <div className="cs-example__client">{c.example.client}</div>
          <p className="cs-example__context">{c.example.context}</p>

          <div className="cs-ba">
            <motion.div
              className="cs-ba__col cs-ba__col--before"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="cs-ba__head">Before</div>
              {c.example.before.map((b) => (
                <div key={b} className="cs-ba__row">
                  <span className="mark">—</span>
                  {b}
                </div>
              ))}
            </motion.div>
            <motion.div
              className="cs-ba__col cs-ba__col--after"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="cs-ba__head">After</div>
              {c.example.after.map((a) => (
                <div key={a} className="cs-ba__row">
                  <span className="mark">↗</span>
                  {a}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="cs-story"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="cs-story__label">How it actually runs</div>
            <p>{c.example.narrative}</p>
          </motion.div>
        </motion.div>
      </section>

      {/* ---------------- STACK ---------------- */}
      <section className="container cs-section">
        <motion.div className="cs-stack" {...fadeUp}>
          <div className="cs-label">Built on</div>
          <div className="cs-stack__chips">
            {c.stack.map((s, i) => (
              <motion.span
                key={s}
                className="cs-chip"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                {s}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ---------------- NEXT + CTA ---------------- */}
      <section className="container cs-section">
        <motion.div className="cs-next" {...fadeUp}>
          <Link to={`/case-studies/${next.slug}`} className="cs-next__link">
            <div className="cs-next__label">Next industry</div>
            <div className="cs-next__name">
              {next.name} <span className="arr">↗</span>
            </div>
            <div className="cs-next__tag">{next.tagline}</div>
          </Link>
        </motion.div>
      </section>

      <section className="container" style={{ paddingBlock: "clamp(40px, 7vw, 100px)" }}>
        <motion.div
          className="cs-cta"
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2>
            Run a {c.name.toLowerCase()} <span className="serif">business?</span>
          </h2>
          <p>
            We'll map your bottleneck against this system in a 30-minute call and tell you
            honestly whether it applies.
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
