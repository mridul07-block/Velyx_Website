import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import CineNav from '../components/CineNav';
import CineFooter from '../components/CineFooter';
import CustomCursor from '../components/CustomCursor';
import ProgressUpdater from '../components/ProgressUpdater';

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
    id: "northwind",
    name: "Northwind",
    cat: "Agentic Systems",
    year: "2026",
    title: "An agentic GTM org for a Series A SaaS.",
    desc: "We replaced a 6-person SDR team with a fleet of specialist agents — inbound qualification, outbound research, meeting prep, CRM hygiene. The founder reviews 18 escalations a week.",
    metrics: [["87%", "auto-qualified"], ["$2.4M", "ARR added"], ["6→1", "FTE reduction"]],
    viz: "agents",
  },
  {
    id: "sable",
    name: "Sable Health",
    cat: "SaaS MVP",
    year: "2026",
    title: "AI-native invoicing built in 38 days.",
    desc: "Healthcare ops platform with an AI invoicing layer that reads incoming bills, validates against contracts, routes exceptions, and writes to QuickBooks — built and launched in six weeks.",
    metrics: [["38d", "to launch"], ["1.8", "FTE replaced"], ["146", "beta users"]],
    viz: "saas",
  },
  {
    id: "halcyon",
    name: "Halcyon AI",
    cat: "Internal Copilot",
    year: "2026",
    title: "A finance copilot for a Series B founder.",
    desc: "Trained on the company's entire ledger, vendor contracts, and three years of board materials. The CEO uses it for monthly variance reviews — and it's caught $340K in billing errors.",
    metrics: [["$340K", "errors caught"], ["4hr→8min", "monthly close"], ["100%", "audit trail"]],
    viz: "copilot",
  },
  {
    id: "meridian",
    name: "Meridian Robotics",
    cat: "Custom Workflow",
    year: "2025",
    title: "Voice-ops dispatcher for field service.",
    desc: "Inbound voice agent triages calls from field technicians, opens tickets, queries the parts database, and dispatches the next move — replacing a 24/7 dispatch desk.",
    metrics: [["24/7", "coverage"], ["$180K", "annual savings"], ["91%", "first-call resolution"]],
    viz: "workflow",
  },
  {
    id: "polaris",
    name: "Polaris OS",
    cat: "AI Strategy",
    year: "2025",
    title: "12-month AI roadmap for a $40M ARR scaleup.",
    desc: "Embedded with the founding team for two days a month. Reordered their AI bets, killed three vendor contracts, and shipped four internal copilots. Hit profitability eight months early.",
    metrics: [["3", "vendors fired"], ["4", "copilots shipped"], ["8mo", "early to profit"]],
    viz: "strategy",
  },
  {
    id: "quartzline",
    name: "Quartzline",
    cat: "Agentic Systems",
    year: "2025",
    title: "Compliance agent for a fintech.",
    desc: "Reviews every customer transaction, flags AML risks, drafts SAR filings, and routes to compliance officers — clearing a backlog of 14,000 reviews in the first month.",
    metrics: [["14K", "reviews cleared"], ["0.04%", "false-positive rate"], ["12×", "throughput"]],
    viz: "agents",
  },
];

function VizAgents() {
  return (
    <svg viewBox="0 0 400 320" width="100%" height="100%">
      <defs>
        <radialGradient id="va-glow"><stop offset="0%" stopColor="oklch(0.78 0.16 65)" stopOpacity="0.5" /><stop offset="100%" stopColor="oklch(0.78 0.16 65)" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="200" cy="160" r="120" fill="url(#va-glow)" />
      <g stroke="oklch(0.78 0.16 65 / 0.4)" strokeWidth="0.7">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * Math.PI * 2;
          return <line key={i} x1="200" y1="160" x2={200 + Math.cos(a) * 110} y2={160 + Math.sin(a) * 110} />;
        })}
      </g>
      <circle cx="200" cy="160" r="14" fill="oklch(0.78 0.16 65)" />
      <circle cx="200" cy="160" r="22" fill="none" stroke="oklch(0.78 0.16 65)" strokeOpacity="0.6">
        <animate attributeName="r" values="22;38;22" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2;
        const x = 200 + Math.cos(a) * 110, y = 160 + Math.sin(a) * 110;
        return <circle key={i} cx={x} cy={y} r="6" fill="oklch(0.14 0.01 60)" stroke="oklch(0.92 0.18 110)" strokeWidth="1.5" />;
      })}
      <text x="200" y="300" textAnchor="middle" fill="oklch(0.55 0.012 65)" fontFamily="Geist Mono" fontSize="10" letterSpacing="0.08em">8-AGENT FLEET · LIVE</text>
    </svg>
  );
}

function VizSaas() {
  return (
    <svg viewBox="0 0 400 320" width="100%" height="100%">
      <rect x="40" y="40" width="320" height="240" rx="14" fill="oklch(0.12 0.012 60)" stroke="oklch(0.28 0.01 60)" />
      <circle cx="56" cy="56" r="3.5" fill="oklch(0.6 0.16 25)" />
      <circle cx="68" cy="56" r="3.5" fill="oklch(0.78 0.14 80)" />
      <circle cx="80" cy="56" r="3.5" fill="oklch(0.7 0.14 145)" />
      <rect x="60" y="80" width="180" height="10" rx="2" fill="oklch(0.96 0.005 80)" />
      <rect x="60" y="98" width="240" height="6" rx="2" fill="oklch(0.55 0.012 65)" />
      <rect x="60" y="108" width="200" height="6" rx="2" fill="oklch(0.55 0.012 65)" />
      <rect x="60" y="140" width="80" height="32" rx="16" fill="oklch(0.78 0.16 65)" />
      <text x="100" y="160" textAnchor="middle" fill="#14110a" fontSize="11" fontFamily="Geist" fontWeight="500">Try free</text>
      <g>
        <rect x="60" y="200" width="92" height="60" rx="8" fill="oklch(0.17 0.012 60)" stroke="oklch(0.28 0.01 60)" />
        <text x="68" y="220" fill="oklch(0.55 0.012 65)" fontSize="9" fontFamily="Geist Mono">USERS</text>
        <text x="68" y="248" fill="oklch(0.96 0.005 80)" fontSize="22" fontFamily="Geist" fontWeight="500">146</text>

        <rect x="160" y="200" width="92" height="60" rx="8" fill="oklch(0.17 0.012 60)" stroke="oklch(0.28 0.01 60)" />
        <text x="168" y="220" fill="oklch(0.55 0.012 65)" fontSize="9" fontFamily="Geist Mono">MRR</text>
        <text x="168" y="248" fill="oklch(0.96 0.005 80)" fontSize="22" fontFamily="Geist" fontWeight="500">$4.2K</text>

        <rect x="260" y="200" width="80" height="60" rx="8" fill="oklch(0.17 0.012 60)" stroke="oklch(0.78 0.16 65)" />
        <text x="268" y="220" fill="oklch(0.78 0.16 65)" fontSize="9" fontFamily="Geist Mono">LIVE</text>
        <text x="268" y="248" fill="oklch(0.96 0.005 80)" fontSize="22" fontFamily="Geist" fontWeight="500">38d</text>
      </g>
    </svg>
  );
}

function VizCopilot() {
  return (
    <svg viewBox="0 0 400 320" width="100%" height="100%">
      <rect x="60" y="50" width="280" height="50" rx="12" fill="oklch(0.16 0.012 60)" stroke="oklch(0.28 0.01 60)" />
      <text x="80" y="72" fill="oklch(0.55 0.012 65)" fontFamily="Geist Mono" fontSize="9">SARAH · CFO · 9:42 AM</text>
      <text x="80" y="90" fill="oklch(0.78 0.01 70)" fontFamily="Geist" fontSize="12">What did we spend on AWS Q1?</text>

      <rect x="60" y="120" width="280" height="100" rx="12" fill="oklch(0.78 0.16 65 / 0.08)" stroke="oklch(0.78 0.16 65 / 0.4)" />
      <text x="80" y="142" fill="oklch(0.78 0.16 65)" fontFamily="Geist Mono" fontSize="9">FINANCE-COPILOT</text>
      <text x="80" y="162" fill="oklch(0.96 0.005 80)" fontFamily="Geist" fontSize="12">AWS Q1: $84,210 vs $72K forecast.</text>
      <text x="80" y="180" fill="oklch(0.78 0.01 70)" fontFamily="Geist" fontSize="11">Variance: +16.9% — Bedrock inference (+$9.8K).</text>
      <rect x="80" y="195" width="80" height="18" rx="9" fill="oklch(0.17 0.012 60)" stroke="oklch(0.28 0.01 60)" />
      <text x="120" y="207" textAnchor="middle" fill="oklch(0.78 0.01 70)" fontFamily="Geist Mono" fontSize="9">Show breakdown</text>
      <rect x="170" y="195" width="68" height="18" rx="9" fill="oklch(0.17 0.012 60)" stroke="oklch(0.28 0.01 60)" />
      <text x="204" y="207" textAnchor="middle" fill="oklch(0.78 0.01 70)" fontFamily="Geist Mono" fontSize="9">Compare Q4</text>

      <circle cx="80" cy="250" r="4" fill="oklch(0.92 0.18 110)">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <text x="92" y="254" fill="oklch(0.55 0.012 65)" fontFamily="Geist Mono" fontSize="10" letterSpacing="0.04em">FINANCE-COPILOT TYPING…</text>
    </svg>
  );
}

function VizWorkflow() {
  return (
    <svg viewBox="0 0 400 320" width="100%" height="100%">
      <g stroke="oklch(0.4 0.01 60)" strokeWidth="1" fill="none">
        <path d="M70,80 L180,80" />
        <path d="M180,80 L290,80" />
        <path d="M180,80 L180,180" />
        <path d="M180,180 L290,180" />
        <path d="M180,180 L180,260" />
        <path d="M180,260 L290,260" />
      </g>
      {[
        [70, 80, "TRIGGER"], [180, 80, "PARSE"], [290, 80, "VALIDATE"],
        [180, 180, "MATCH"], [290, 180, "QB"],
        [180, 260, "NOTIFY"], [290, 260, "SLACK"],
      ].map(([x, y, t], i) => (
        <g key={i}>
          <rect x={x - 48} y={y - 16} width="96" height="32" rx="8" fill="oklch(0.16 0.012 60)" stroke="oklch(0.78 0.16 65 / 0.5)" />
          <text x={x} y={y + 4} textAnchor="middle" fill="oklch(0.96 0.005 80)" fontFamily="Geist Mono" fontSize="10">{t}</text>
        </g>
      ))}
      <circle r="3" fill="oklch(0.92 0.18 110)">
        <animateMotion dur="4s" repeatCount="indefinite" path="M70,80 L180,80 L180,180 L180,260 L290,260" />
      </circle>
    </svg>
  );
}

function VizStrategy() {
  return (
    <svg viewBox="0 0 400 320" width="100%" height="100%">
      <g>
        {["Q1", "Q2", "Q3", "Q4"].map((q, i) => {
          const states = ["done", "now", "next", "next"];
          const colors = { done: "oklch(0.92 0.18 110)", now: "oklch(0.78 0.16 65)", next: "oklch(0.55 0.012 65)" };
          const c = colors[states[i]];
          return (
            <g key={q}>
              <rect x="40" y={50 + i * 60} width="320" height="44" rx="8"
                fill={states[i] === "now" ? "oklch(0.78 0.16 65 / 0.06)" : "oklch(0.12 0.012 60)"}
                stroke="oklch(0.28 0.01 60)" />
              <text x="56" y={50 + i * 60 + 26} fill={c} fontFamily="Geist Mono" fontSize="13" letterSpacing="0.04em">{q}</text>
              <rect x="84" y={50 + i * 60 + 18} width={[180, 220, 140, 120][i]} height="6" rx="3" fill={c} opacity="0.6" />
              <text x="320" y={50 + i * 60 + 26} fill={c} fontFamily="Geist Mono" fontSize="9" textAnchor="end" letterSpacing="0.06em">{states[i].toUpperCase()}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

const VIZ = { agents: VizAgents, saas: VizSaas, copilot: VizCopilot, workflow: VizWorkflow, strategy: VizStrategy };

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
        <div className="pf-card__metrics">
          {p.metrics.map(([v, l]) => (
            <div key={l} className="pf-card__metric">
              <div className="v">{v}</div>
              <div className="l">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function PortfolioPage() {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Agentic Systems", "SaaS MVP", "Internal Copilot", "Custom Workflow", "AI Strategy"];
  const list = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.cat === filter);

  return (
    <>
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
              Six engagements.<br /><span className="serif">One pattern.</span>
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
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 8, padding: "20px 0 30px",
          borderBottom: "1px solid var(--line-soft)",
        }}>
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                padding: "8px 16px",
                borderRadius: 100,
                border: "1px solid",
                borderColor: filter === c ? "var(--accent)" : "var(--line-soft)",
                background: filter === c ? "oklch(0.78 0.16 65 / 0.08)" : "transparent",
                color: filter === c ? "var(--fg)" : "var(--fg-dim)",
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.25s",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="portfolio">
          <AnimatePresence mode="popLayout">
            {list.map((p) => <PfCard key={p.id} p={p} />)}
          </AnimatePresence>
        </motion.div>
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

