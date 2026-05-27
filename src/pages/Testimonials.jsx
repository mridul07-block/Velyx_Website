import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import CineNav from '../components/CineNav';
import CineFooter from '../components/CineFooter';
import CustomCursor from '../components/CustomCursor';
import ProgressUpdater from '../components/ProgressUpdater';

function TestimonialBg() {
  const ref = useRef(null);
  useEffect(() => {
    const mount = ref.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 12;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const particles = 1800;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(particles * 3);

    for (let i = 0; i < particles; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({ color: 0xf6cf8c, size: 0.05, transparent: true, opacity: 0.5 });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    let raf;
    const tick = () => {
      const time = Date.now() * 0.001;
      const positions = pts.geometry.attributes.position.array;
      
      for (let i = 0; i < particles; i++) {
        const x = positions[i * 3];
        const z = positions[i * 3 + 2];
        positions[i * 3 + 1] = Math.sin(x * 0.3 + time) * 1.5 + Math.cos(z * 0.2 + time * 0.8) * 1.0;
      }
      pts.geometry.attributes.position.needsUpdate = true;
      pts.rotation.y = Math.sin(time * 0.05) * 0.2;
      pts.rotation.x = Math.PI / 8;

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
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={ref} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", mixBlendMode: "screen" }} aria-hidden="true" />;
}

const FEATURED = [
  {
    name: "Prasannata",
    role: "FOUNDER",
    company: "Overshoot Newsletter",
    quote: "Velyx Labs built a complete, production-ready web application for us from the ground up. Their engineering velocity and attention to detail transformed our vision into reality, allowing us to launch much faster than anticipated.",
    metric: "100%",
    note: "production-ready delivery",
  },
  {
    name: "Dr. Parita",
    role: "FOUNDER",
    company: "Sacred Basil",
    quote: "They didn't just build our complete e-commerce brand; they conducted a deep audit of our business operations. The strategic insights and technical execution were unparalleled, giving us a massive competitive edge.",
    metric: "360°",
    note: "business audit and execution",
  },
  {
    name: "Nishant",
    role: "FOUNDER",
    company: "NaryanKripa",
    quote: "Velyx delivered a robust, AI-integrated web application that immediately scaled our operations. They are true partners who deeply care about our business outcomes and built a production-level system that drives real growth.",
    metric: "10x",
    note: "operational scale achieved",
  },
  {
    name: "Amol",
    role: "FOUNDER",
    company: "GetCredentialingDone",
    quote: "Working with Velyx was a game-changer. They built a complete production-level website with a seamlessly integrated AI MVP system. They took our concept and engineered an incredibly robust platform.",
    metric: "MVP",
    note: "shipped with full AI integration",
  },
  {
    name: "Atharv Golait",
    role: "FOUNDER",
    company: "Estatico",
    quote: "Velyx built a complete AI SaaS automation system for our real estate operations. From generating leads to nurturing them via an AI pipeline, the entire workflow is now automated and running flawlessly.",
    metric: "24/7",
    note: "automated lead nurturing",
  },
  {
    name: "Saurabh",
    role: "FOUNDER",
    company: "GreenWrench Solution",
    quote: "They built a complete web application for us and integrated an incredible AI-based Google Meet solution. The execution was flawless, and the technical capabilities they brought to the table were exactly what we needed.",
    metric: "AI",
    note: "integrated meeting intelligence",
  },
  {
    name: "Atharv Golait",
    role: "FOUNDER",
    company: "Preva AI",
    quote: "Velyx built our complete SaaS MVP at production scale — a highly personalized diet and workout split app tailored to individual body types. Their technical execution is world-class and the product feels premium from day one.",
    metric: "SaaS",
    note: "production-scale MVP shipped",
  },
  {
    name: "Ecell Team",
    role: "ORGANIZERS",
    company: "ESUMMIT · NIT Hamirpur",
    quote: "They built the complete website for ESUMMIT NIT Hamirpur and continue to maintain it flawlessly. Extremely reliable engineering team that delivers under tight event deadlines without compromise.",
    metric: "5K+",
    note: "event attendees served",
  },
  {
    name: "Rohit",
    role: "FOUNDER",
    company: "Vyomira",
    quote: "Velyx built our complete cloud platform web application with deep AI integrations baked in. The platform is robust, scalable, and beautifully engineered — exactly the foundation we needed to grow.",
    metric: "Cloud",
    note: "AI-integrated platform delivered",
  },
];

function TestimonialsPage() {
  return (
    <>
      <CustomCursor />
      <ProgressUpdater />
      <CineNav active="testimonials" />

      <section className="page-hero" data-screen-label="01 Testimonials Hero">
        <TestimonialBg />
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
              <span>VELYX LABS</span> <span style={{ color: "var(--fg-mute)" }}>/</span> TESTIMONIALS
            </motion.div>
            <motion.h1 
              className="page-hero__title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              In their <span className="serif">own words.</span>
            </motion.h1>
          </div>
          <motion.p 
            className="page-hero__sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            We don't write our own marketing. The founders we partner with do.
            Below: unedited words from operators who've worked with us through one,
            two, sometimes three years of compounding engagement.
          </motion.p>
        </div>
      </section>

      <div className="container">
        {FEATURED.map((f, i) => (
          <motion.div 
            className="tm-feature" key={f.name}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="tm-feature__meta">
              <div className="name">{f.name}</div>
              <div className="role">{f.role}</div>
              <div className="company">{f.company}</div>
              <div className="tm-feature__metric">
                <span className="big">{f.metric.includes("$") || f.metric.includes("%") ? (
                  <>{f.metric}</>
                ) : (
                  <>{f.metric}</>
                )}</span>
                <span className="note">{f.note}</span>
              </div>
            </div>
            <div>
              <blockquote className="tm-feature__quote">{f.quote}</blockquote>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="section">
        <div className="container">
          <motion.div 
            className="section__head" style={{ marginBottom: 60 }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="section__label">VLX / IMPACT</div>
            <h2 className="section__title">
              The numbers behind the <span className="serif">partnerships.</span>
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {[
              { icon: "🚀", value: "9+", label: "Founders Partnered", desc: "Production-level projects shipped for ambitious founders across industries" },
              { icon: "⚡", value: "6+", label: "Industries Served", desc: "From healthtech and real estate to e-commerce, edtech, cloud platforms, and SaaS" },
              { icon: "🤖", value: "100%", label: "AI Integration Rate", desc: "Every project ships with intelligent automation baked into the core architecture" },
              { icon: "🎯", value: "0", label: "Failed Launches", desc: "Every engagement has resulted in a live, production-grade product in the market" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                style={{
                  padding: "clamp(32px, 4vw, 48px)",
                  borderRadius: "clamp(16px, 2vw, 24px)",
                  border: "1px solid var(--line-soft)",
                  background: "linear-gradient(160deg, oklch(0.18 0.012 60 / 0.8), oklch(0.12 0.006 60 / 0.5))",
                  backdropFilter: "blur(20px)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 20, right: 20, fontSize: 32, opacity: 0.15 }}>{stat.icon}</div>
                <div style={{ fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1, color: "var(--accent)", marginBottom: 8 }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--fg-mute)", marginBottom: 12 }}>
                  {stat.label}
                </div>
                <p style={{ fontSize: 14.5, color: "var(--fg-dim)", lineHeight: 1.55, margin: 0 }}>
                  {stat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingBlock: "clamp(60px, 9vw, 120px)" }}>
        <motion.div 
          style={{
            textAlign: "center",
            padding: "clamp(60px, 9vw, 120px) clamp(28px, 6vw, 80px)",
            border: "1px solid var(--line-soft)",
            borderRadius: "clamp(20px, 3vw, 40px)",
            background: "linear-gradient(135deg, oklch(0.20 0.014 60), oklch(0.16 0.01 60))",
          }}
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 style={{ fontSize: "clamp(36px, 5vw, 72px)", letterSpacing: "-0.035em", lineHeight: 1.0, fontWeight: 500, marginBottom: 20 }}>
            Want a <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--accent)" }}>reference call?</span>
          </h2>
          <p style={{ fontSize: 17, color: "var(--fg-dim)", maxWidth: "50ch", margin: "0 auto 36px", lineHeight: 1.55 }}>
            We'll connect you with two of the founders above. No pitch deck, no script. Just an honest 30-minute call with someone who's lived the engagement.
          </p>
          <Link to="/contact" className="btn btn--primary">Request a reference <span className="arr">↗</span></Link>
        </motion.div>
      </section>

      <CineFooter />
    </>
  );
}

export default TestimonialsPage;

