import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import CineNav from "../components/CineNav";
import CineFooter from "../components/CineFooter";
import CustomCursor from "../components/CustomCursor";
import ProgressUpdater from "../components/ProgressUpdater";

function ServiceBg() {
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

    // Wireframe Sphere
    const geo = new THREE.SphereGeometry(2, 32, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xd97757,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const sphere = new THREE.Mesh(geo, mat);
    sphere.position.x = 2;
    scene.add(sphere);

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
      sphere.rotation.x = t * 0.15;
      sphere.rotation.y = t * 0.2;
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

const SERVICES = [
  { id: "agents", num: "01 / PRACTICE", title: "Agentic", titleSerif: "systems.", lede: "Multi-agent systems that own entire workflows — and improve every quarter.", body: "We design, ship, and operate agent fleets that take real work off your team's plate. Sales qualification, ops routing, finance reconciliation, customer research — each handled by a specialist agent with clear ownership, observability, and an eval-driven improvement loop. Every agent we deploy ships with a kill-switch, an audit trail, and a regression suite.", deliverables: [["01", "Agent runtime", "Typed, observable, retry-safe. Built on patterns we've shipped 184×."], ["02", "Eval harness", "Golden datasets, regression checks, weekly review cycles."], ["03", "Human-in-loop", "Escalation rules that respect your team's working hours."], ["04", "Cost & latency budgets", "Per-agent SLAs you actually enforce."], ["05", "Slack / email / API integrations", "Wherever your team already works."], ["06", "Kill-switches & guardrails", "For the day an agent does the wrong thing."]] },
  { id: "saas", num: "02 / PRACTICE", title: "AI-native", titleSerif: "SaaS MVPs.", lede: "Zero to paying customers in under 45 days — with architecture designed for year three.", body: "We don't ship throwaway prototypes. We ship the smallest possible production SaaS — auth, billing, agent backbone, telemetry — designed around the workflow you're betting on.", deliverables: [["01", "Design system + brand", "A real visual identity, not a Tailwind template."], ["02", "Next.js + TypeScript stack", "The boring choices, made well."], ["03", "Auth, billing, multi-tenant", "Stripe, Clerk, Supabase — wired and tested."], ["04", "Agent + RAG backbone", "Vector DB, retrieval, evals from day one."], ["05", "Telemetry & analytics", "PostHog, Sentry, and a dashboard you'll actually read."], ["06", "Launch playbook", "First 100 customers, with you, in the first 30 days post-launch."]] },
  { id: "copilots", num: "03 / PRACTICE", title: "Internal", titleSerif: "copilots.", lede: "Custom AI coworkers, trained on your data, wired into your tools.", body: "Generic chatbots don't move the needle. We build copilots for specific roles — each grounded in your private data, your past decisions, and your team's actual working patterns.", deliverables: [["01", "Private RAG pipelines", "Over your docs, tickets, code, transcripts."], ["02", "Custom UI per role", "Not another chat window — the right interface."], ["03", "Permissions & audit", "Row-level access, full audit trail, SOC-ready."], ["04", "Voice + chat", "Slack, email, voice — wherever the team lives."], ["05", "Continuous fine-tuning", "Quarterly evaluation against your own examples."], ["06", "Integrations", "Notion, Linear, Hubspot, QuickBooks, your CRM."]] },
  { id: "workflows", num: "04 / PRACTICE", title: "Custom", titleSerif: "workflows.", lede: "Bespoke automations stitched across the tools you already use.", body: "Most operational pain isn't in your tools — it's in the gaps between them. We build the AI-powered glue: document intelligence pipelines, invoice routing, voice-ops handlers, KPI digests, exception triage.", deliverables: [["01", "ETL & data pipelines", "Reliable ingest from APIs, files, voice, email."], ["02", "Document intelligence", "PDFs, forms, contracts — structured, validated, routed."], ["03", "Webhook orchestration", "Event-driven flows with retries and dead-letter handling."], ["04", "Voice ops", "Inbound and outbound calls with structured handoffs."], ["05", "Reporting & KPI digests", "Weekly executive briefings, written by an agent."], ["06", "Operational dashboards", "One screen the founder actually looks at."]] },
  { id: "strategy", num: "05 / PRACTICE", title: "AI", titleSerif: "strategy.", lede: "Embedded as a founding partner — your thinking partner on every AI decision.", body: "For founders who want a peer in the room. We embed with your leadership for two days a month — auditing your operations, sequencing your AI bets, vetting your hires, and writing the 12-month roadmap.", deliverables: [["01", "Operating audit", "Two weeks. Every workflow mapped. Highest-leverage bets ranked."], ["02", "12-month roadmap", "Sequenced, costed, with success criteria written upfront."], ["03", "Hiring & vendor plan", "Who to hire, who to fire, who to buy from."], ["04", "Quarterly reviews", "Board-ready materials. The story you actually want to tell."], ["05", "On-call thinking partner", "Slack access, weekly syncs, midnight texts when it matters."], ["06", "Founder workshops", "We run workshops with your team — they learn the patterns too."]] },
];

function ServiceDetail({ s }) {
  return (
    <motion.div
      className="svc-detail" id={s.id}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div>
        <div className="svc-detail__num">{s.num}</div>
        <h2 className="svc-detail__title">{s.title} <span className="serif">{s.titleSerif}</span></h2>
        <p className="svc-detail__lede">{s.lede}</p>
      </div>
      <div>
        <p className="svc-detail__body">{s.body}</p>
        <motion.div
          className="svc-detail__deliverables"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
        >
          {s.deliverables.map(([n, t, d]) => (
            <motion.div
              key={n} className="svc-deliv"
              variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
            >
              <span className="n">{n}</span>
              <div><div className="t">{t}</div><div className="d">{d}</div></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <>
      <CustomCursor />
      <ProgressUpdater />
      <CineNav active="services" />

      <section className="page-hero" data-screen-label="01 Services Hero">
        <ServiceBg />
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
              <span>VELYX LABS</span> <span style={{ color: "var(--fg-mute)" }}>/</span> SERVICES
            </motion.div>
            <motion.h1
              className="page-hero__title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              Five practices.<br /><span className="serif">One operating thesis.</span>
            </motion.h1>
          </div>
          <motion.p
            className="page-hero__sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            Every engagement starts with one question: where in your company does work happen that doesn't have to? We answer it five ways.
          </motion.p>
        </div>
      </section>

      <div className="container">
        {SERVICES.map((s) => <ServiceDetail key={s.id} s={s} />)}
      </div>

      <section className="container" style={{ paddingBlock: "clamp(60px, 9vw, 120px)" }}>
        <motion.div
          style={{ textAlign: "center", padding: "clamp(60px, 9vw, 120px) clamp(28px, 6vw, 80px)", border: "1px solid var(--line-soft)", borderRadius: "clamp(20px, 3vw, 40px)", background: "linear-gradient(135deg, oklch(0.20 0.014 60), oklch(0.16 0.01 60))" }}
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 style={{ fontSize: "clamp(36px, 5vw, 72px)", letterSpacing: "-0.035em", lineHeight: 1.0, fontWeight: 500, marginBottom: 20 }}>Not sure which practice <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, color: "var(--accent)" }}>fits?</span></h2>
          <p style={{ fontSize: 17, color: "var(--fg-dim)", maxWidth: "50ch", margin: "0 auto 36px", lineHeight: 1.55 }}>Book a 30-minute call. We'll diagnose the highest-leverage move on the spot.</p>
          <Link to="/contact" className="btn btn--primary">Book a strategy call <span className="arr">↗</span></Link>
        </motion.div>
      </section>

      <CineFooter />
    </>
  );
}
