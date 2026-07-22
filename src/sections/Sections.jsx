import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------
   Process stage glyphs — one animated mark per move
------------------------------------------------------------------ */
const A = "oklch(0.78 0.16 65)";
const A2 = "oklch(0.92 0.18 110)";
const DIM = "oklch(0.38 0.01 60)";

/* 01 Diagnose — a scan sweeping a grid of workflows */
function GlyphScan() {
  const dots = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) dots.push([14 + c * 15, 18 + r * 17, c]);
  return (
    <svg viewBox="0 0 120 72" width="100%" height="100%">
      {dots.map(([x, y, c], i) => (
        <circle key={i} cx={x} cy={y} r="2.4" fill={DIM}>
          <animate attributeName="fill" values={`${DIM};${A};${DIM}`} dur="3.6s" begin={`${c * 0.18}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="2.4;3.4;2.4" dur="3.6s" begin={`${c * 0.18}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <line y1="8" y2="64" stroke={A2} strokeWidth="1.2" opacity="0.8">
        <animate attributeName="x1" values="10;114;10" dur="3.6s" repeatCount="indefinite" />
        <animate attributeName="x2" values="10;114;10" dur="3.6s" repeatCount="indefinite" />
      </line>
    </svg>
  );
}

/* 02 Design — an architecture drawing itself in */
function GlyphBlueprint() {
  return (
    <svg viewBox="0 0 120 72" width="100%" height="100%">
      <g stroke={A} strokeWidth="1" fill="none" opacity="0.75">
        <path d="M26 36 H58 M58 36 V16 H92 M58 36 V56 H92" strokeDasharray="120" strokeDashoffset="120">
          <animate attributeName="stroke-dashoffset" values="120;0;0;120" dur="4s" repeatCount="indefinite" />
        </path>
      </g>
      <rect x="8" y="27" width="20" height="18" rx="4" fill="oklch(0.17 0.012 60)" stroke={A} strokeWidth="1.2" />
      {[[92, 8], [92, 48]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="20" height="17" rx="4" fill="oklch(0.17 0.012 60)" stroke={A2} strokeWidth="1.2" opacity="0">
          <animate attributeName="opacity" values="0;0;1;1;0" dur="4s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
        </rect>
      ))}
      <circle cx="58" cy="36" r="3.5" fill={A} />
    </svg>
  );
}

/* 03 Deploy — a build moving into a live environment */
function GlyphDeploy() {
  return (
    <svg viewBox="0 0 120 72" width="100%" height="100%">
      <line x1="10" y1="36" x2="86" y2="36" stroke={DIM} strokeWidth="1" strokeDasharray="4 5" />
      <rect x="84" y="20" width="28" height="32" rx="6" fill="oklch(0.78 0.16 65 / 0.1)" stroke={A} strokeWidth="1.2" />
      <circle cx="98" cy="30" r="3" fill={A2}>
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <text x="98" y="45" textAnchor="middle" fill={A} fontFamily="Geist Mono" fontSize="7" letterSpacing="0.08em">LIVE</text>
      {[0, 1].map((i) => (
        <rect key={i} x="6" y="30" width="13" height="12" rx="3" fill={A2}>
          <animateMotion dur="2.6s" begin={`${i * 1.3}s`} repeatCount="indefinite" path="M0,0 L74,0" />
          <animate attributeName="opacity" values="0;1;1;0" dur="2.6s" begin={`${i * 1.3}s`} repeatCount="indefinite" />
        </rect>
      ))}
    </svg>
  );
}

/* 04 Compound — leverage stacking quarter over quarter */
function GlyphCompound() {
  const bars = [[18, 16], [42, 26], [66, 40], [90, 56]];
  return (
    <svg viewBox="0 0 120 72" width="100%" height="100%">
      <line x1="8" y1="62" x2="112" y2="62" stroke={DIM} strokeWidth="1" />
      {bars.map(([x, h], i) => (
        <rect key={i} x={x} y={62 - h} width="14" height={h} rx="3" fill={i === bars.length - 1 ? A : "oklch(0.78 0.16 65 / 0.35)"}>
          <animate attributeName="height" values={`0;${h};${h}`} dur="3.2s" begin={`${i * 0.22}s`} repeatCount="indefinite" />
          <animate attributeName="y" values={`62;${62 - h};${62 - h}`} dur="3.2s" begin={`${i * 0.22}s`} repeatCount="indefinite" />
        </rect>
      ))}
      <path d="M25 46 L49 36 L73 22 L97 6" stroke={A2} strokeWidth="1.4" fill="none" strokeDasharray="110" strokeDashoffset="110">
        <animate attributeName="stroke-dashoffset" values="110;0;0" dur="3.2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

/* Pillar visualizations — small animated SVGs */
function VizAgents() {
  return (
    <svg viewBox="0 0 220 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <g stroke="oklch(0.78 0.16 65)" strokeWidth="0.6" fill="none" opacity="0.5">
        <line x1="110" y1="100" x2="40" y2="40" />
        <line x1="110" y1="100" x2="180" y2="40" />
        <line x1="110" y1="100" x2="40" y2="160" />
        <line x1="110" y1="100" x2="180" y2="160" />
        <line x1="110" y1="100" x2="200" y2="100" />
        <line x1="110" y1="100" x2="20" y2="100" />
      </g>
      <g fill="oklch(0.78 0.16 65)">
        <circle cx="110" cy="100" r="6">
          <animate attributeName="r" values="6;8;6" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="40" cy="40" r="3" />
        <circle cx="180" cy="40" r="3" />
        <circle cx="40" cy="160" r="3" />
        <circle cx="180" cy="160" r="3" />
        <circle cx="200" cy="100" r="3" />
        <circle cx="20" cy="100" r="3" />
      </g>
      <g fill="oklch(0.92 0.18 110)">
        <circle r="2">
          <animateMotion dur="3.5s" repeatCount="indefinite"
            path="M110,100 L40,40 L110,100 L180,40 L110,100" />
        </circle>
        <circle r="2">
          <animateMotion dur="4.2s" repeatCount="indefinite" begin="-1.5s"
            path="M110,100 L40,160 L110,100 L180,160 L110,100" />
        </circle>
      </g>
    </svg>
  );
}

function VizFlow() {
  return (
    <svg viewBox="0 0 220 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <g stroke="oklch(0.55 0.012 65)" strokeWidth="0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={i} x1="20" y1={40 + i * 30} x2="200" y2={40 + i * 30} />
        ))}
      </g>
      <g>
        {Array.from({ length: 5 }).map((_, i) => (
          <g key={i}>
            <rect x="20" y={34 + i * 30} width="40" height="12" rx="2" fill="oklch(0.22 0.01 60)" stroke="oklch(0.28 0.01 60)" />
            <rect x="90" y={34 + i * 30} width="50" height="12" rx="2" fill="oklch(0.22 0.01 60)" stroke="oklch(0.28 0.01 60)" />
            <rect x="160" y={34 + i * 30} width="40" height="12" rx="2" fill={i === 2 ? "oklch(0.78 0.16 65)" : "oklch(0.22 0.01 60)"} stroke="oklch(0.28 0.01 60)" />
          </g>
        ))}
      </g>
      <circle r="2.5" fill="oklch(0.92 0.18 110)">
        <animateMotion dur="3s" repeatCount="indefinite"
          path="M40,40 L110,40 L110,70 L180,70 L180,100 L110,100 L110,130 L40,130 L40,160 L180,160" />
      </circle>
    </svg>
  );
}

function VizGraph() {
  const nodes = [
    [40, 50], [110, 30], [180, 60],
    [60, 110], [130, 100], [185, 140],
    [40, 170], [110, 160],
  ];
  return (
    <svg viewBox="0 0 220 200" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <g stroke="oklch(0.55 0.012 65)" strokeWidth="0.5" fill="none" opacity="0.7">
        <path d="M40,50 L110,30 L180,60 L130,100 L60,110 Z" />
        <path d="M60,110 L40,170 L110,160 L130,100" />
        <path d="M180,60 L185,140 L110,160" />
      </g>
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4.5" fill="oklch(0.14 0.01 60)" stroke="oklch(0.78 0.16 65)" strokeWidth="1" />
          <circle cx={x} cy={y} r="1.5" fill="oklch(0.78 0.16 65)">
            <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
}

export function Marquee() {
  const items = [
    "Getlandy AI",
    "Scanva & Co",
    "Overshoot",
    "ByteCitadel",
    "Sacred Basil",
    "GetCredentialingDone",
    "NarayanKripa",
    "EavesDrop",
    "Nexolve Technologies",
    "Orange Production Bangalore",
    "Estatico",
  ];
  const doubled = [...items, ...items];
  return (
    <section className="marquee" aria-label="Trusted by">
      <div className="marquee__label">
        <span className="rule" />
        TRUSTED BY FOUNDERS BUILDING THE NEXT DECADE
        <span className="rule" />
      </div>
      <div className="marquee__viewport">
        <div className="marquee__track">
          {doubled.map((name, i) => (
            <div className="marquee__item" key={i}>
              <span className="marquee__dot" />
              <span className="marquee__name">{name}</span>
            </div>
          ))}
        </div>
        <div className="marquee__sweep" aria-hidden="true" />
      </div>
    </section>
  );
}

export function Pillars() {
  return (
    <section className="section" id="work" data-screen-label="03 Systems">
      <div className="container">
        <Reveal className="section__head">
          <div className="section__label">VLX / SYSTEMS</div>
          <h2 className="section__title">
            We build three things — <span className="serif">obsessively well.</span>
          </h2>
        </Reveal>

        <Reveal className="pillars">
          <article className="pillar">
            <div className="pillar__num">01 / AGENTIC SYSTEMS</div>
            <div className="pillar__viz"><VizAgents /></div>
            <h3 className="pillar__title">Agentic systems that run the company.</h3>
            <p className="pillar__desc">
              Specialist AI agents that own end-to-end workflows — sales, ops, finance,
              research. Observable. Evaluable. On-call 24/7.
            </p>
            <ul className="pillar__list">
              <li>Multi-agent orchestration</li>
              <li>Tool-use & function calling</li>
              <li>Eval harness + guardrails</li>
              <li>Human-in-the-loop checkpoints</li>
            </ul>
          </article>

          <article className="pillar">
            <div className="pillar__num">02 / AI AUTOMATION</div>
            <div className="pillar__viz"><VizFlow /></div>
            <h3 className="pillar__title">Automation that compounds, not breaks.</h3>
            <p className="pillar__desc">
              We replace the busywork — drafting, routing, summarizing, qualifying — with
              automations engineered to survive contact with reality.
            </p>
            <ul className="pillar__list">
              <li>Workflow & document intelligence</li>
              <li>Pipeline + CRM auto-pilot</li>
              <li>Internal copilots</li>
              <li>Voice + chat ops</li>
            </ul>
          </article>

          <article className="pillar">
            <div className="pillar__num">03 / CUSTOM WORKFLOWS</div>
            <div className="pillar__viz"><VizGraph /></div>
            <h3 className="pillar__title">Custom internal tools, ten times faster.</h3>
            <p className="pillar__desc">
              Bespoke dashboards, internal copilots, and back-office systems built around
              your data. Yours to keep. Yours to extend.
            </p>
            <ul className="pillar__list">
              <li>Bespoke dashboards</li>
              <li>Data pipelines & ETL</li>
              <li>RAG over private knowledge</li>
              <li>API + integration glue</li>
            </ul>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

export function Capabilities() {
  return (
    <section className="section" id="capabilities" data-screen-label="05 Capabilities">
      <div className="container">
        <Reveal className="section__head">
          <div className="section__label">VLX / CAPABILITIES</div>
          <h2 className="section__title">
            The full stack of <span className="serif">operating leverage.</span>
          </h2>
        </Reveal>

        <Reveal className="cap-grid">
          <article className="cap cap--lg">
            <div className="cap__kicker">CORE</div>
            <h3 className="cap__title">Agent orchestration layer</h3>
            <p className="cap__desc">
              A typed agent runtime with retries, tool-use, memory, and human-in-the-loop checkpoints. Built on
              the patterns we've shipped across 184 production deployments.
            </p>
            <div className="terminal">
              <div><span className="prompt">vlx</span> agent.run sales/qualify-inbound</div>
              <div className="mute">→ scoring 14 leads · model: sonnet-4.5 · tools: 6</div>
              <div><span className="ok">✓</span> 12/14 qualified · 2 escalated to founder</div>
              <div><span className="prompt">vlx</span> agent.eval ops/invoice-router</div>
              <div className="mute">→ regression vs golden set · 248 cases</div>
              <div><span className="ok">✓</span> precision 0.984 · recall 0.961 · ship</div>
            </div>
          </article>

          <article className="cap cap--md">
            <div className="cap__kicker">SIGNAL</div>
            <h3 className="cap__title">Live throughput, not vibes.</h3>
            <p className="cap__desc">
              Every agent is observable. We track latency, cost, escalation rate, and outcome quality
              against golden datasets — so improvements compound.
            </p>
            <div className="metric-row">
              <span className="big">11.4<span style={{ color: "var(--accent)" }}>×</span></span>
              <span className="unit">avg. throughput gain</span>
            </div>
            <div className="metric-row" style={{ marginTop: 6 }}>
              <span className="big" style={{ fontSize: "clamp(28px, 3.6vw, 52px)" }}>$0.04</span>
              <span className="unit">median cost per agent action</span>
            </div>
          </article>

          <article className="cap cap--sm">
            <div className="cap__kicker">MODELS</div>
            <h3 className="cap__title">Model-agnostic by design.</h3>
            <p className="cap__desc">
              Claude, GPT, open-source. We pick — or mix — based on cost, latency, and the eval scores
              that actually matter for your task.
            </p>
          </article>

          <article className="cap cap--sm">
            <div className="cap__kicker">DATA</div>
            <h3 className="cap__title">Your data, structured.</h3>
            <p className="cap__desc">
              Private knowledge pipelines, RAG, vectorstores. We turn your messy historical operations into
              the substrate agents actually need.
            </p>
          </article>

          <article className="cap cap--sm">
            <div className="cap__kicker">SAFETY</div>
            <h3 className="cap__title">Guardrails, not vibes.</h3>
            <p className="cap__desc">
              Policy layers, output validation, blast-radius limits, kill-switches. Designed for the day
              an agent does the wrong thing — because eventually one will.
            </p>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

export function Results() {
  return (
    <section className="section" id="results" data-screen-label="06 Results" style={{ paddingBlock: "clamp(40px, 6vw, 80px)" }}>
      <div className="container">
        <Reveal className="section__head" style={{ marginBottom: 60 }}>
          <div className="section__label">VLX / RESULTS</div>
          <h2 className="section__title">
            Compounding outcomes for the founders <span className="serif">we work with.</span>
          </h2>
        </Reveal>
      </div>

      <Reveal className="results">
        <div className="result">
          <div className="result__num">87<span className="serif">%</span></div>
          <div className="result__caption">
            of inbound qualification handled by the sales-agent — founder reviews only escalations.
          </div>
          <div className="result__client">NORTHWIND · SERIES A · SAAS</div>
        </div>
        <div className="result">
          <div className="result__num">14<span className="serif">d</span></div>
          <div className="result__caption">
            from kickoff to first production agent in invoicing ops — replacing 1.8 FTE of manual review.
          </div>
          <div className="result__client">SABLE HEALTH · SEED · FINTECH</div>
        </div>
        <div className="result">
          <div className="result__num">$2.1<span className="serif">M</span></div>
          <div className="result__caption">
            annualized run-rate added in 9 months — without a single new hire on the GTM team.
          </div>
          <div className="result__client">HALCYON AI · SERIES B · DEVTOOL</div>
        </div>
      </Reveal>
    </section>
  );
}

export function Manifesto() {
  return (
    <section className="manifesto" data-screen-label="07 Manifesto">
      <div className="container">
        <Reveal as="p" className="manifesto__quote">
          The next great companies will be built by <span className="accent">small teams</span> with
          <span className="sans"> infinite leverage.</span> We engineer the leverage.
        </Reveal>
        <Reveal as="div" className="manifesto__attr" delay={250}>
          — VELYX LABS / OPERATING THESIS / v4
        </Reveal>
      </div>
    </section>
  );
}

export function Process() {
  const steps = [
    {
      n: "01", t: "Diagnose", meta: "Weeks 1–2", G: GlyphScan,
      d: "Two weeks shadowing your operation. We map every workflow, identify the highest-leverage targets, and quantify what 'good' looks like.",
      out: "A ranked map of what's automatable — and a baseline to measure against.",
    },
    {
      n: "02", t: "Design", meta: "Weeks 3–4", G: GlyphBlueprint,
      d: "An agent architecture tailored to your data and decisions — with eval criteria written before a single line of code.",
      out: "An architecture and success criteria you sign off on before we build.",
    },
    {
      n: "03", t: "Deploy", meta: "Under 30 days", G: GlyphDeploy,
      d: "We ship the first agent into production in under 30 days. Real users, real workload, observable from day one.",
      out: "Your first agent live in production, with every action traceable.",
    },
    {
      n: "04", t: "Compound", meta: "Ongoing", G: GlyphCompound,
      d: "Monthly evaluation cycles. New agents added to the system. Your operating leverage grows quarter over quarter.",
      out: "New capability every cycle — leverage that compounds instead of plateauing.",
    },
  ];
  return (
    <section className="section" id="process" data-screen-label="08 Process">
      <div className="container">
        <Reveal className="section__head">
          <div className="section__label">VLX / PROCESS</div>
          <h2 className="section__title">
            From first call to compounding — <span className="serif">four moves.</span>
          </h2>
        </Reveal>

        <div className="proc">
          {/* connector rail — the signal running through the pipeline */}
          <div className="proc__rail" aria-hidden="true">
            <div className="proc__rail-line">
              <span className="proc__rail-pulse" />
            </div>
            {steps.map((s, i) => (
              <motion.span
                key={s.n}
                className="proc__node"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.13, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>

          <div className="proc__grid">
            {steps.map((s, i) => (
              <motion.article
                className="proc__card"
                key={s.n}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.65, delay: i * 0.13, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="proc__ghost">{s.n}</span>
                <div className="proc__glyph"><s.G /></div>
                <div className="proc__meta">
                  <span className="proc__num">{s.n}</span>
                  <span className="proc__dur">{s.meta}</span>
                </div>
                <h3 className="proc__title">{s.t}</h3>
                <p className="proc__desc">{s.d}</p>
                <div className="proc__out">
                  <span className="arrow">→</span>
                  <span>{s.out}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const CONTACT_EMAIL = "velyxlabs@gmail.com";

export function Cta() {
  const panelRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState("");

  // Live local time — same clock the nav shows
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const pad = (x) => String(x).padStart(2, "0");
      setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  // Spotlight follows the cursor across the panel
  const onMove = (e) => {
    const el = panelRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1900);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  return (
    <section className="container" id="contact" data-screen-label="09 CTA">
      <Reveal>
        <div className="cta" ref={panelRef} onPointerMove={onMove}>
          <div className="cta__spot" aria-hidden="true" />
          <div className="cta__grid" aria-hidden="true" />

          <div className="cta__inner">
            <div className="cta__left">
              <div className="cta__status">
                <span className="pip" />
                Bangalore, India
                <span className="sep">·</span>
                {time} local
              </div>
              <h2 className="cta__title">
                Let's build your <span className="serif">unfair</span> operating leverage.
              </h2>
            </div>

            <div className="cta__right">
              <p className="cta__copy">
                We take on a handful of founders each quarter. If you're scaling fast and want to do
                it without scaling headcount, let's talk.
              </p>

              <div className="cta__actions">
                <button
                  data-cal-namespace="30min"
                  data-cal-link="velyx-labs/30min"
                  data-cal-config='{"layout":"month_view"}'
                  className="btn btn--primary"
                >
                  Book a strategy call <span className="arr">↗</span>
                </button>
                <Link to="/case-studies" className="btn btn--ghost">
                  See case studies <span className="arr">→</span>
                </Link>
              </div>

              <button
                className={`cta__mail ${copied ? "is-copied" : ""}`}
                onClick={copyEmail}
                aria-label={`Copy email address ${CONTACT_EMAIL}`}
              >
                <span className="k">Or email us</span>
                <span className="v">{CONTACT_EMAIL}</span>
                <span className="act">{copied ? "Copied ✓" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
