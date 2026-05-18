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
    name: "Priya Anand",
    role: "FOUNDER & CEO",
    company: "Northwind · Series A SaaS · Backed by Sequoia, Lightspeed",
    quote: "Velyx didn't sell us AI. They rebuilt our operating system. We're doing the work of twelve with four — and I sleep better than I have in three years. They're the only outside partner I'd recommend to another founder without a single caveat.",
    metric: "$2.4M",
    note: "ARR added in 9 months without a new GTM hire",
  },
  {
    name: "Marcus Reeves",
    role: "CO-FOUNDER & CTO",
    company: "Sable Health · Seed-stage healthtech · Y Combinator W25",
    quote: "We came to Velyx with a deck and three weeks of runway. They shipped our MVP in 38 days. We had paying customers by day 60 and our seed round closed at 3× the valuation. I genuinely cannot imagine doing it without them.",
    metric: "38d",
    note: "from blank canvas to first paying customer",
  },
  {
    name: "Ananya Iyer",
    role: "FOUNDER",
    company: "Halcyon AI · Series B devtool · 80-person team",
    quote: "The agents Velyx built run our GTM motion. Inbound qualification, outbound research, meeting prep, CRM hygiene — all handled. I review escalations for twenty minutes a day and spend the rest of my time on product and capital. That's the leverage I was always told AI would unlock. Velyx is the only group I've worked with that actually delivered it.",
    metric: "87%",
    note: "of inbound handled without founder review",
  },
  {
    name: "David Okafor",
    role: "FOUNDER & CEO",
    company: "Meridian Robotics · Series A robotics · Backed by Andreessen, Bessemer",
    quote: "I was deeply skeptical of voice agents. Velyx changed my mind. They shipped a dispatcher that handles ninety-one percent of inbound technician calls — at three in the morning, in the rain, in seven languages. Our customers think we doubled headcount. We didn't.",
    metric: "91%",
    note: "first-call resolution from the voice agent",
  },
  {
    name: "Lina Castro",
    role: "CO-FOUNDER",
    company: "Polaris OS · $40M ARR scaleup · Bootstrapped",
    quote: "We hired Velyx as a strategic advisor — two days a month, embedded with the leadership team. They reordered our AI bets, killed three vendor contracts that were costing us a fortune, and helped us hit profitability eight months ahead of plan. Most expensive line item on our P&L. Best ROI on our P&L.",
    metric: "8mo",
    note: "early to profitability vs internal plan",
  },
  {
    name: "Kai Vasquez",
    role: "FOUNDER",
    company: "Quartzline · Seed-stage fintech · Backed by First Round",
    quote: "Compliance was eating our roadmap. Velyx built an agent that reviews every customer transaction, drafts SAR filings, and routes to our compliance officer with full citations. We cleared a 14,000-review backlog in a month. Our compliance team thanked us. That doesn't happen.",
    metric: "14K",
    note: "compliance reviews cleared in 30 days",
  },
];

const SHORT = [
  { q: "They ship like a startup, think like a McKinsey partner, and execute like a top engineering team.", name: "Sahil R.", role: "CEO, FERROUS" },
  { q: "I've worked with five AI agencies. Velyx is the only one I'd hire again. The only one.", name: "Dee P.", role: "FOUNDER, FOUNDRY/06" },
  { q: "Velyx's evals discipline is what separates them. Every agent ships with a regression suite. That's how you build software, not demos.", name: "Maya L.", role: "CTO, ATLAS CAPITAL" },
  { q: "They made me a better operator. The frameworks alone were worth the retainer.", name: "James W.", role: "FOUNDER, LUMEN ROBOTICS" },
  { q: "I send them a Slack message, an agent ships a fix. Honestly unfair.", name: "Yuki T.", role: "CEO, QUARTZLINE" },
  { q: "We measured: every dollar we paid Velyx returned eleven dollars in productive output within six months.", name: "Rohan K.", role: "COO, NORTHWIND" },
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
            <div className="section__label">VLX / MORE VOICES</div>
            <h2 className="section__title">
              Founders, in <span className="serif">one line.</span>
            </h2>
          </motion.div>
          <motion.div 
            className="testimonials__grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
          >
            {SHORT.map((s, i) => (
              <motion.article 
                key={i} className="testimonial"
                variants={{ hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
                whileHover={{ y: -5, boxShadow: "0 20px 40px -10px oklch(0 0 0 / 0.5)", transition: { duration: 0.3 } }}
              >
                <p className="testimonial__quote" style={{ fontSize: 18 }}>{s.q}</p>
                <div className="testimonial__author">
                  <div className="testimonial__avatar">{s.name.split(" ").map(x => x[0]).join("")}</div>
                  <div className="testimonial__meta">
                    <div className="testimonial__name">{s.name}</div>
                    <div className="testimonial__role">{s.role}</div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
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

