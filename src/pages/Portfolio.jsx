import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import CineNav from '../components/CineNav';
import CineFooter from '../components/CineFooter';
import CustomCursor from '../components/CustomCursor';
import ProgressUpdater from '../components/ProgressUpdater';
import Seo from "../components/Seo";
import { VIZ } from '../components/offeringVizMap';
import { OFFERINGS } from '../data/offerings';

function PortfolioBg() {
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

    // Wireframe Icosahedron
    const geo = new THREE.IcosahedronGeometry(2, 0);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xd97757,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const icosahedron = new THREE.Mesh(geo, mat);
    icosahedron.position.x = -2;
    scene.add(icosahedron);

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
      icosahedron.rotation.x = t * 0.15;
      icosahedron.rotation.y = t * 0.2;
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

/* ------------------------------------------------------------------
   PORTFOLIO PAGE
------------------------------------------------------------------ */

const PROJECTS = [
  {
    id: "getlandy",
    name: "Getlandy AI",
    cat: "Web Application",
    year: "2026",
    title: "AI Career & Personal-Brand OS",
    desc: "A Netherlands-based SaaS: an AI-powered personal brand studio and career operating system. Landy helps high-signal professionals design career strategy, hold a credible online presence, and build long-term career leverage — beyond job searching.",
    image: "https://res.cloudinary.com/dmhabztbf/image/upload/v1784826856/Screenshot_2026-07-23_at_10.40.33_PM_zrbnvf.png",
    liveUrl: "https://getlandy.ai/",
  },
  {
    id: "yorkscreenplay",
    name: "theYorkScreenPlay",
    cat: "Web Application",
    year: "2026",
    title: "Online Auction & Bidding Platform",
    desc: "An online auction and bidding platform built for Jon Stewart, centred on the original screenplay YORK — An Untold American Epic. Real-time bidding, lot management, and a cinematic showcase for the work.",
    image: "https://res.cloudinary.com/dmhabztbf/image/upload/v1784826853/Screenshot_2026-07-23_at_10.39.05_PM_sk5bpl.png",
    liveUrl: "https://yorkscreenplay.com/",
  },
  {
    id: "eavesdrop",
    name: "Eavesdrop",
    cat: "Web Application",
    year: "2026",
    title: "Buyer-Intent Lead Generation",
    desc: "A buyer-intent platform that listens across Reddit, X, and Hacker News to surface prospects actively looking for a solution. AI intent-scoring on every mention, always-on competitor monitors, and AI-drafted replies — turning community signal into pipeline.",
    image: "https://res.cloudinary.com/dmhabztbf/image/upload/v1784826856/Screenshot_2026-07-23_at_10.42.44_PM_oljvwt.png",
    liveUrl: "https://www.eavesdrop.co.in/",
  },
  {
    id: "bytecitadel",
    name: "ByteCitadel",
    cat: "Web Application",
    year: "2026",
    title: "AI & ML Solutions Platform",
    desc: "Transforming businesses with cutting-edge AI and machine learning solutions. Based in India, serving the world.",
    image: "https://res.cloudinary.com/dmhabztbf/image/upload/v1780326044/Screenshot_2026-06-01_202946_un8s63.png",
    liveUrl: "https://bytecitadel.vercel.app/",
  },
  {
    id: "overshoot",
    name: "Overshoot",
    cat: "Web Application",
    year: "2026",
    title: "The Business of Entertainment",
    desc: "A community about the business of everything that entertains you. Strategy rooms, balance sheets, and power plays behind the content you binge, the games you play, and the culture you live in. Bi-monthly. Sharp. No fluff.",
    image: "https://res.cloudinary.com/dmhabztbf/image/upload/v1780326351/Screenshot_2026-06-01_203530_vqqrpl.png",
    liveUrl: "https://www.overshoot.in/",
  },
  {
    id: "narayankripa",
    name: "Narayan Kripa",
    cat: "Web Application",
    year: "2026",
    title: "Experience Divine Puja",
    desc: "Join live pujas performed by verified pandits at India's most revered temples — from the comfort of your home.",
    image: "https://res.cloudinary.com/dmhabztbf/image/upload/v1780326748/Screenshot_2026-06-01_204139_x0fzay.png",
    liveUrl: "https://www.narayankripa.in/",
  },
  {
    id: "theberrycoworks",
    name: "TheBerryCoworks",
    cat: "Web Application",
    year: "2026",
    title: "Delhi Coworking Space",
    desc: "Premium coworking spaces in Delhi designed for modern professionals and startups — flexible plans, vibrant community, and world-class amenities.",
    image: "https://res.cloudinary.com/dmhabztbf/image/upload/v1780327245/Screenshot_2026-06-01_204747_gzdl2w.png",
    liveUrl: "https://theberry.vercel.app/",
  },
  {
    id: "azuregrand",
    name: "Azure Grand Resort",
    cat: "Web Application",
    year: "2026",
    title: "Luxury Resort & Spa",
    desc: "Experience unparalleled luxury at Azure Grand Resort & Spa. Nestled along pristine coastlines, our five-star resort offers world-class dining, rejuvenating spa treatments, and breathtaking ocean views.",
    image: "https://res.cloudinary.com/dmhabztbf/image/upload/v1780327813/Screenshot_2026-06-01_205549_k5tzyb.png",
    liveUrl: "https://grand-azure-resort.vercel.app/",
  },
  {
    id: "getcredentialing",
    name: "GetCredentialingDone",
    cat: "Web Application",
    year: "2026",
    title: "Insurance Credentialing Services",
    desc: "Fast & easy insurance credentialing services — streamlining the process so healthcare providers can focus on what matters most: patient care.",
    image: "https://res.cloudinary.com/dmhabztbf/image/upload/v1780327961/Screenshot_2026-06-01_210115_zffetj.png",
    liveUrl: "https://getcredentialingdone.com/",
  },
  {
    id: "esummit",
    name: "E-Summit 2026",
    cat: "Web Application",
    year: "2026",
    title: "E-Cell NIT Hamirpur",
    desc: "E-Summit 2026 is the flagship annual entrepreneurship event organized by E-Cell NIT Hamirpur. One of the most anticipated events in the North Indian startup ecosystem, bringing together visionaries, innovators, and future leaders.",
    image: "https://res.cloudinary.com/dmhabztbf/image/upload/v1780328069/ecell_q5alca.png",
    liveUrl: "https://esummit.nith.ac.in/",
  },
];


function WebCard({ p }) {
  return (
    <motion.article
      className="pf-card pf-card--web"
      layout
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -8, boxShadow: "0 30px 80px -20px oklch(0 0 0 / 0.6)", transition: { duration: 0.3 } }}
    >
      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="pf-card__img-link">
        <div className="pf-card__viz pf-card__viz--img">
          <img src={p.image} alt={p.name} loading="lazy" />
          <div className="pf-card__img-overlay">
            <span className="pf-card__visit">Visit Live Site <span className="arr">↗</span></span>
          </div>
        </div>
      </a>
      <div className="pf-card__body">
        <div className="pf-card__kicker">
          <span>{p.name}</span>
          <span className="yr">{p.cat}</span>
        </div>
        <h3 className="pf-card__title">{p.title}</h3>
        <p className="pf-card__desc">{p.desc}</p>
      </div>
    </motion.article>
  );
}

function PfCard({ p }) {
  const V = VIZ[p.viz];
  return (
    <motion.article
      className={`pf-card ${p.tall ? "tall" : ""}`}
      layout
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -8, boxShadow: "0 30px 80px -20px oklch(0 0 0 / 0.6)", transition: { duration: 0.3 } }}
    >
      <div className="pf-card__viz"><V /></div>
      <div className="pf-card__body">
        <div className="pf-card__kicker">
          <span>{p.cat}</span>
          <span className="yr">{p.year}</span>
        </div>
        <h3 className="pf-card__title">{p.title}</h3>
        <p className="pf-card__desc">{p.desc}</p>
        <Link to={`/portfolio/${p.slug}`} className="pf-card__book pf-card__stretch">
          View details <span className="arr">↗</span>
        </Link>
      </div>
    </motion.article>
  );
}

const GROUPS = [
  { key: "Web Application", label: "Web Applications" },
  { key: "SaaS MVP", label: "SaaS MVPs" },
  { key: "Agentic Systems", label: "Agentic Systems" },
];

const ALL = [...PROJECTS, ...OFFERINGS];

function PortfolioPage() {
  const groups = GROUPS
    .map((g) => ({ ...g, items: ALL.filter((p) => p.cat === g.key) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <Seo title="Portfolio — AI products we've shipped" description="Live web apps, SaaS products, and agentic systems Velyx Labs has designed and shipped for founders and businesses." path="/portfolio" />
      <CustomCursor />
      <ProgressUpdater />
      <CineNav active="portfolio" />

      <section className="page-hero" data-screen-label="01 Portfolio Hero">
        <PortfolioBg />
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
              <span>VELYX LABS</span> <span style={{ color: "var(--fg-mute)" }}>/</span> PORTFOLIO
            </motion.div>
            <motion.h1
              className="page-hero__title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              Selected work.<br /><span className="serif">One pattern.</span>
            </motion.h1>
          </div>
          <motion.p
            className="page-hero__sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            Selected work from the last 18 months. Every engagement is on retainer — these are
            living systems, not before/after photos. Metrics reflect the last 90 days.
          </motion.p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: 40 }}>
        {groups.map((g, gi) => (
          <section key={g.key} className="pf-group">
            <motion.div
              className="pf-group__head"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="pf-group__idx">{String(gi + 1).padStart(2, "0")}</span>
              <h2 className="pf-group__title">{g.label}</h2>
              <span className="pf-group__count">{g.items.length} {g.items.length === 1 ? "project" : "projects"}</span>
            </motion.div>

            <div className="portfolio">
              {g.items.map((p) => p.image ? <WebCard key={p.id} p={p} /> : <PfCard key={p.id} p={p} />)}
            </div>
          </section>
        ))}
      </div>

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
            Could yours <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--accent)" }}>be next?</span>
          </h2>
          <p style={{ fontSize: 17, color: "var(--fg-dim)", maxWidth: "50ch", margin: "0 auto 36px", lineHeight: 1.55 }}>
            We take on six founders per quarter. Three seats remain for the spring cohort.
          </p>
          <Link to="/contact" className="btn btn--primary">Book a strategy call <span className="arr">↗</span></Link>
        </motion.div>
      </section>

      <CineFooter />
    </>
  );
}

export default PortfolioPage;

