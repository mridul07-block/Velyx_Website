import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import CineNav from '../components/CineNav';
import CineFooter from '../components/CineFooter';
import CustomCursor from '../components/CustomCursor';
import ProgressUpdater from '../components/ProgressUpdater';

function ContactBg() {
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

    // Wireframe torus knot — slow rotation
    const geo = new THREE.TorusKnotGeometry(2.2, 0.6, 300, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xd97757,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const knot = new THREE.Mesh(geo, mat);
    knot.position.x = 2;
    scene.add(knot);

    // particles
    const pgeo = new THREE.BufferGeometry();
    const pcount = 600;
    const pos = new Float32Array(pcount * 3);
    for (let i = 0; i < pcount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    pgeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pmat = new THREE.PointsMaterial({ size: 0.03, color: 0xf6cf8c, transparent: true, opacity: 0.7 });
    const pts = new THREE.Points(pgeo, pmat);
    scene.add(pts);

    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      const t = clock.getElapsedTime();
      knot.rotation.x = t * 0.15;
      knot.rotation.y = t * 0.2;
      pts.rotation.y = t * 0.05;
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
  return <div ref={ref} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", mixBlendMode: "screen" }} aria-hidden="true" />;
}

function ContactPage() {
  const [form, setForm] = useState({
    name: "", email: "", company: "", stage: "Seed",
    practice: "Agentic Systems", budget: "$35K – $60K / month",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <CustomCursor />
      <ProgressUpdater />
      <CineNav active="contact" />

      <section className="page-hero" data-screen-label="01 Contact Hero" style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}>
        <ContactBg />
        <div className="page-hero__bg" />
        <div className="page-hero__inner" style={{ position: "relative", zIndex: 1 }}>
          <div>
            <motion.div 
              className="page-hero__crumbs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span>VELYX LABS</span> <span style={{ color: "var(--fg-mute)" }}>/</span> CONTACT
            </motion.div>
            <motion.h1 
              className="page-hero__title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              Let's build your<br /><span className="serif">unfair advantage.</span>
            </motion.h1>
          </div>
          <motion.p 
            className="page-hero__sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            Three seats remain for the spring '26 cohort. Tell us what you're building and we'll
            reply within one business day with a calendar link — or a thoughtful 'not yet' if
            we're not the right fit.
          </motion.p>
        </div>
      </section>

      <div className="container">
        <div className="contact-grid">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.08em", color: "var(--fg-mute)", textTransform: "uppercase", marginBottom: 24 }}>
              01 / Brief us
            </div>

            {sent ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  padding: "60px 36px", border: "1px solid var(--accent)",
                  borderRadius: 18, background: "oklch(0.78 0.16 65 / 0.06)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 16, color: "var(--accent)" }}>✓</div>
                <h3 style={{ fontSize: 28, letterSpacing: "-0.025em", fontWeight: 500, marginBottom: 12 }}>
                  Brief received.
                </h3>
                <p style={{ fontSize: 15, color: "var(--fg-dim)", maxWidth: "38ch", margin: "0 auto", lineHeight: 1.55 }}>
                  You'll hear from us within one business day. In the meantime —
                  we'd love to know what you're reading. <a href="#" style={{ color: "var(--accent)" }}>Our thesis ↗</a>
                </p>
              </motion.div>
            ) : (
              <form className="contact-form" onSubmit={submit}>
                <div className="field-row">
                  <div className="field">
                    <label>Your name</label>
                    <input value={form.name} onChange={update("name")} placeholder="Priya Anand" required />
                  </div>
                  <div className="field">
                    <label>Work email</label>
                    <input type="email" value={form.email} onChange={update("email")} placeholder="priya@yourcompany.com" required />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Company</label>
                    <input value={form.company} onChange={update("company")} placeholder="Northwind" />
                  </div>
                  <div className="field">
                    <label>Stage</label>
                    <select value={form.stage} onChange={update("stage")}>
                      <option>Pre-seed</option>
                      <option>Seed</option>
                      <option>Series A</option>
                      <option>Series B</option>
                      <option>Bootstrapped / Profitable</option>
                    </select>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Practice you're curious about</label>
                    <select value={form.practice} onChange={update("practice")}>
                      <option>Agentic Systems</option>
                      <option>SaaS MVP</option>
                      <option>Internal Copilots</option>
                      <option>Custom Workflows</option>
                      <option>AI Strategy</option>
                      <option>Not sure — diagnose us</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Engagement budget</label>
                    <select value={form.budget} onChange={update("budget")}>
                      <option>$35K – $60K / month</option>
                      <option>$60K – $100K / month</option>
                      <option>$100K+ / month</option>
                      <option>Project-based ($50K – $250K)</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>What's the work you wish would disappear?</label>
                  <textarea
                    value={form.message}
                    onChange={update("message")}
                    placeholder="Be specific. The more we know about the workflow you're trying to compress, the more useful our first reply will be."
                  />
                </div>
                <button type="submit" className="btn btn--primary" style={{ alignSelf: "flex-start" }}>
                  Send brief <span className="arr">↗</span>
                </button>
                <p style={{ fontSize: 12, color: "var(--fg-mute)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
                  WE REPLY TO EVERY BRIEF. WITHIN ONE BUSINESS DAY. EVEN THE 'NOT YET' ONES.
                </p>
              </form>
            )}
          </motion.div>

          <motion.div 
            className="contact-side"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.08em", color: "var(--fg-mute)", textTransform: "uppercase", marginBottom: 8 }}>
              02 / Or, directly
            </div>
            <h3>Skip the form.</h3>
            <p>If you'd rather just book a 30-minute call, here's our partner calendar. We keep two slots open every week for first conversations.</p>

            <a href="#" className="btn btn--ghost" style={{ alignSelf: "flex-start" }}>
              Open calendar <span className="arr">↗</span>
            </a>

            <div style={{ marginTop: 32 }}>
              <div className="row">
                <div className="l">EMAIL</div>
                <div className="v"><a href="mailto:hi@velyx.com">hi@velyx.com</a></div>
              </div>
              <div className="row">
                <div className="l">PRESS</div>
                <div className="v"><a href="mailto:press@velyx.com">press@velyx.com</a></div>
              </div>
              <div className="row">
                <div className="l">PARTNERSHIPS</div>
                <div className="v"><a href="mailto:partners@velyx.com">partners@velyx.com</a></div>
              </div>
              <div className="row">
                <div className="l">CAREERS</div>
                <div className="v"><a href="mailto:join@velyx.com">join@velyx.com</a> — we're hiring 2 senior engineers</div>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", color: "var(--fg-mute)", textTransform: "uppercase", marginBottom: 12 }}>
                Studios
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>Bangalore</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", lineHeight: 1.6 }}>HQ · 12.97°N<br />Indiranagar, BLR</div>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>San Francisco</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", lineHeight: 1.6 }}>SATELLITE · 37.77°N<br />SoMa, SF</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <CineFooter />
    </>
  );
}

export default ContactPage;

