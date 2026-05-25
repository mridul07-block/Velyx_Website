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
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "relative",
                  padding: "72px 44px 56px",
                  borderRadius: 22,
                  background: "linear-gradient(160deg, oklch(0.16 0.02 60 / 0.9), oklch(0.12 0.015 55 / 0.95))",
                  backdropFilter: "blur(24px) saturate(150%)",
                  WebkitBackdropFilter: "blur(24px) saturate(150%)",
                  border: "1px solid oklch(0.78 0.16 65 / 0.15)",
                  textAlign: "center",
                  overflow: "hidden",
                  boxShadow: "0 40px 100px -30px oklch(0.78 0.16 65 / 0.15), inset 0 1px 0 oklch(1 0 0 / 0.04)",
                }}
              >
                {/* Ambient glow */}
                <div style={{
                  position: "absolute", top: "25%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 280, height: 280, borderRadius: "50%",
                  background: "radial-gradient(circle, oklch(0.78 0.16 65 / 0.12) 0%, transparent 70%)",
                  filter: "blur(50px)", pointerEvents: "none",
                }} />
                {/* Corner accent line */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 1,
                  background: "linear-gradient(90deg, transparent, oklch(0.78 0.16 65 / 0.3), transparent)",
                }} />

                {/* Floating particles */}
                {[
                  { top: "10%", left: "12%", s: 3, d: 0 },
                  { top: "18%", right: "15%", s: 2, d: 0.4 },
                  { bottom: "22%", left: "10%", s: 2.5, d: 0.8 },
                  { bottom: "12%", right: "12%", s: 2, d: 0.3 },
                  { top: "50%", left: "6%", s: 1.5, d: 1.0 },
                  { top: "38%", right: "8%", s: 2, d: 0.6 },
                ].map((dot, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 0.5, 0.2], scale: 1 }}
                    transition={{ duration: 2.5, delay: 0.6 + dot.d, repeat: Infinity, repeatType: "reverse" }}
                    style={{
                      position: "absolute", top: dot.top, left: dot.left, right: dot.right, bottom: dot.bottom,
                      width: dot.s, height: dot.s, borderRadius: "50%",
                      background: "var(--accent)", pointerEvents: "none",
                    }}
                  />
                ))}

                {/* Animated checkmark icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
                  style={{
                    position: "relative", width: 76, height: 76,
                    margin: "0 auto 28px", borderRadius: 22,
                    background: "linear-gradient(135deg, oklch(0.78 0.16 65), oklch(0.62 0.18 50))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 16px 50px -10px oklch(0.78 0.16 65 / 0.45), 0 0 0 1px oklch(0.78 0.16 65 / 0.25)",
                  }}
                >
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#14110a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L19 7" />
                  </svg>
                </motion.div>

                {/* Status badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "7px 18px", borderRadius: 100,
                    background: "oklch(0.78 0.16 65 / 0.08)",
                    border: "1px solid oklch(0.78 0.16 65 / 0.18)",
                    fontFamily: "var(--font-mono)", fontSize: 10.5,
                    letterSpacing: "0.1em", color: "var(--accent)",
                    textTransform: "uppercase", marginBottom: 28,
                  }}
                >
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "var(--accent-2)",
                    boxShadow: "0 0 10px var(--accent-2)",
                    animation: "pulse 2s infinite",
                  }} />
                  TRANSMISSION RECEIVED
                </motion.div>

                {/* Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  style={{
                    fontSize: "clamp(28px, 4vw, 36px)", letterSpacing: "-0.03em",
                    fontWeight: 500, marginBottom: 16, position: "relative",
                  }}
                >
                  Brief{" "}
                  <span style={{
                    fontFamily: "var(--font-serif)", fontStyle: "italic",
                    color: "var(--accent)", fontWeight: 400,
                  }}>received.</span>
                </motion.h3>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  style={{
                    fontSize: 15, color: "var(--fg-dim)", maxWidth: "40ch",
                    margin: "0 auto 36px", lineHeight: 1.65, position: "relative",
                  }}
                >
                  You'll hear from us within one business day. We read every brief carefully — expect a thoughtful response, not a template.
                </motion.p>

                {/* Stats row */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  style={{
                    display: "flex", justifyContent: "center", gap: 48,
                    paddingTop: 28,
                    borderTop: "1px solid oklch(0.78 0.16 65 / 0.1)",
                    position: "relative",
                  }}
                >
                  {[
                    { v: "<24h", l: "RESPONSE TIME" },
                    { v: "100%", l: "REPLY RATE" },
                    { v: "3", l: "SEATS LEFT" },
                  ].map((s) => (
                    <div key={s.l} style={{ textAlign: "center" }}>
                      <div style={{
                        fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em",
                        color: "var(--fg)", fontFeatureSettings: '"tnum"',
                      }}>{s.v}</div>
                      <div style={{
                        fontFamily: "var(--font-mono)", fontSize: 9,
                        letterSpacing: "0.1em", color: "var(--fg-mute)", marginTop: 4,
                      }}>{s.l}</div>
                    </div>
                  ))}
                </motion.div>
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

            <button data-cal-namespace="30min" data-cal-link="velyx-labs/30min" data-cal-config='{"layout":"month_view"}' className="btn btn--ghost" style={{ alignSelf: "flex-start" }}>
              Book a call <span className="arr">↗</span>
            </button>

            <div style={{ marginTop: 32 }}>
              <div className="row">
                <div className="l">EMAIL</div>
                <div className="v"><a href="mailto:velyxlabs@gmail.com">velyxlabs@gmail.com</a></div>
              </div>
              <div className="row">
                <div className="l">ATHARV MAIL</div>
                <div className="v"><a href="mailto:atharv@velyxlabs.in">atharv@velyxlabs.in</a></div>
              </div>
              <div className="row">
                <div className="l">MRIDUL MAIL</div>
                <div className="v"><a href="mailto:mridul@velyxlabs.in">Mridul@velyxlabs.in</a></div>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", color: "var(--fg-mute)", textTransform: "uppercase", marginBottom: 12 }}>
                Studios
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>Pune</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-mute)", lineHeight: 1.6 }}>HQ · 18.52°N<br />Pune, PNQ</div>
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

