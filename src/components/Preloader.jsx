import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ════════════════════════════════════════════════════════════════════════════
   VELYXLABS · CINEMATIC PRELOADER  ·  v3 — final polish
   A choreographed boot sequence in five acts.
   ════════════════════════════════════════════════════════════════════════════ */

// ─── TIMELINE (seconds) ────────────────────────────────────────────────────────
const T = {
  ignition: 0.20,   // grain + grid bleed in
  coreForm: 0.55,   // hex core assembles
  velyx: 1.30,   // "Velyx" rises
  labs: 1.62,   // "Labs" follows
  systems: 2.15,   // panels + telemetry stream in
  resolve: 4.70,   // settles to 100%
  exit: 5.55,   // curtain lift
};

const BOOT_LOG = [
  { at: 0, pct: 0, text: "vlx.kernel · v2.6.0" },
  { at: 430, pct: 9, text: "mounting agent mesh" },
  { at: 800, pct: 22, text: "calibrating eval harness" },
  { at: 1180, pct: 35, text: "linking inference layer" },
  { at: 1560, pct: 49, text: "hydrating knowledge graph" },
  { at: 1980, pct: 64, text: "spawning orchestrator fleet" },
  { at: 2440, pct: 78, text: "routing live workflows" },
  { at: 2900, pct: 89, text: "verifying guardrails" },
  { at: 3360, pct: 96, text: "warming render nodes" },
  { at: 3780, pct: 100, text: "all systems operational" },
];

/* ─── STELLAR / CONSTELLATION FIELD ──────────────────────────────────────────── */
function StellarField({ intensity }) {
  const ref = useRef(null);
  const iRef = useRef(intensity);
  iRef.current = intensity;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf, W, H, current = 0.25;

    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = W < 400 ? 60 : 130;
    const pts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.3 + 0.25,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      o: Math.random() * 0.4 + 0.05,
      tw: Math.random() * Math.PI * 2,
      amber: Math.random() > 0.7,
    }));

    let t = 0;
    const draw = () => {
      t += 0.016;
      current += (iRef.current - current) * 0.04;   // eased intensity
      const k = current;
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < COUNT; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
      }

      ctx.lineWidth = 0.45;
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const a = pts[i], b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 17500) {
            const d = Math.sqrt(d2);
            ctx.strokeStyle = `rgba(255,150,40,${(1 - d / 132) * 0.09 * k})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < COUNT; i++) {
        const p = pts[i];
        const tw = 0.55 + 0.45 * Math.sin(t * 1.6 + p.tw);
        const a = p.o * tw * k;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.amber
          ? `rgba(255,168,58,${a})`
          : `rgba(255,248,235,${a * 0.5})`;
        ctx.fill();
        if (p.amber && p.r > 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,140,30,${a * 0.06})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }} />;
}

/* ─── CORE SIGIL — self-drawing hex ──────────────────────────────────────────── */
function CoreSigil() {
  const verts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return [60 + 46 * Math.cos(a), 60 + 46 * Math.sin(a)];
  });
  const hex = verts.map((v, i) => `${i ? "L" : "M"}${v[0].toFixed(1)},${v[1].toFixed(1)}`).join(" ") + " Z";

  return (
    <motion.svg
      width="116" height="116" viewBox="0 0 120 120" fill="none"
      initial={{ opacity: 0, scale: 0.68 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: T.coreForm }}
      style={{ filter: "drop-shadow(0 0 26px rgba(232,133,10,0.35))" }}
    >
      <defs>
        <radialGradient id="vlxCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe0b0" />
          <stop offset="42%" stopColor="#f0920f" />
          <stop offset="100%" stopColor="#7a3c04" />
        </radialGradient>
        <linearGradient id="vlxStrut" x1="0" y1="0" x2="120" y2="120">
          <stop offset="0%" stopColor="#ffdda4" />
          <stop offset="100%" stopColor="#c96a08" />
        </linearGradient>
      </defs>

      <motion.g style={{ transformOrigin: "60px 60px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}>
        <path d={hex} stroke="rgba(232,133,10,0.15)" strokeWidth="6"
          strokeDasharray="9 13" fill="none" />
      </motion.g>

      <motion.path d={hex}
        stroke="url(#vlxStrut)" strokeWidth="1.1" fill="none" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1], delay: T.coreForm + 0.15 }} />

      {verts.map(([x, y], i) => (
        <motion.line key={i} x1="60" y1="60" x2={x} y2={y}
          stroke="url(#vlxStrut)" strokeWidth="0.7"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.55 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: T.coreForm + 0.45 + i * 0.06 }} />
      ))}

      <motion.g style={{ transformOrigin: "60px 60px" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 19, ease: "linear", repeat: Infinity }}>
        <circle cx="60" cy="60" r="24" stroke="rgba(255,205,140,0.24)"
          strokeWidth="3.5" strokeDasharray="5 9" fill="none" />
      </motion.g>

      <motion.circle cx="60" cy="60" r="8.5" fill="url(#vlxCore)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.15, 1], opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: T.coreForm + 0.7 }} />
      <motion.circle cx="60" cy="60" r="8.5" fill="none" stroke="#ffce8a" strokeWidth="0.8"
        animate={{ r: [8.5, 24], opacity: [0.6, 0] }}
        transition={{ duration: 2.4, ease: "easeOut", repeat: Infinity, delay: T.coreForm + 0.9 }} />
      <circle cx="60" cy="60" r="3" fill="#fff6e6" />
    </motion.svg>
  );
}

/* ─── STREAMING TERMINAL TEXT ─────────────────────────────────────────────────── */
function TerminalText({ text }) {
  const [out, setOut] = useState("");
  const prev = useRef("");
  useEffect(() => {
    if (text === prev.current) return;
    prev.current = text;
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i++; setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 24);
    return () => clearInterval(id);
  }, [text]);
  return <span>{out}</span>;
}

/* ─── LIVE CLOCK ──────────────────────────────────────────────────────────────── */
function LiveClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => {
      const d = new Date();
      return [d.getHours(), d.getMinutes(), d.getSeconds()]
        .map(n => String(n).padStart(2, "0")).join(":");
    };
    setT(f());
    const id = setInterval(() => setT(f()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: T.systems }}
      style={{
        position: "absolute", top: "clamp(12px, 3vh, 30px)", right: "clamp(12px,4vw,72px)", zIndex: 12,
        display: "flex", alignItems: "center", gap: 6,
      }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%", background: "#e8850a",
        boxShadow: "0 0 7px #e8850a", animation: "vlxBeat 2s ease-in-out infinite",
      }} />
      <span style={{
        fontFamily: "var(--font-mono,'JetBrains Mono',monospace)",
        fontSize: "clamp(8px, 2.2vw, 10px)", letterSpacing: "0.13em", color: "rgba(255,255,255,0.32)",
      }}>{t} BLR</span>
    </motion.div>
  );
}

/* ─── AGENT TELEMETRY PANEL ──────────────────────────────────────────────────── */
const AGENTS = [
  { id: "sales/qualify", base: 14, live: true },
  { id: "ops/invoicing", base: 8, live: true },
  { id: "research/intel", base: 0, live: false },
  { id: "finance/recon", base: 3, live: true },
];

function TelemetryPanel({ show, isMobile, isSmall }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(n => n + 1), 1500);
    return () => clearInterval(id);
  }, []);

  const mobileStyle = isMobile ? {
    position: "relative", top: "auto", right: "auto", transform: "none",
    margin: isSmall ? "24px auto 0" : "40px auto 0",
    width: isSmall ? "min(92%, 280px)" : "min(90%, 320px)",
  } : {
    position: "absolute", top: "50%", right: "clamp(24px,5vw,72px)", transform: "translateY(-50%)",
    width: 320,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 20 : 0, x: isMobile ? 0 : 36, filter: "blur(6px)" }}
      animate={show
        ? { opacity: 1, y: 0, x: 0, filter: "blur(0px)" }
        : { opacity: 0, y: isMobile ? 20 : 0, x: isMobile ? 0 : 36, filter: "blur(6px)" }}
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: T.systems }}
      style={{
        ...mobileStyle, zIndex: 11,
        background: "linear-gradient(180deg, rgba(28,21,11,0.84), rgba(16,12,5,0.84))",
        border: "1px solid rgba(255,150,30,0.17)", borderRadius: 8,
        padding: isSmall ? "14px 16px" : isMobile ? "20px 24px" : "24px 28px", backdropFilter: "blur(14px)",
        boxShadow: "0 26px 64px rgba(0,0,0,0.55)",
      }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        paddingBottom: 16, marginBottom: 18,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        <span style={{ display: "flex", gap: 6 }}>
          {["#ff5f57", "#ffbd2e", "#28c840"].map(c => (
            <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.85 }} />
          ))}
        </span>
        <span style={{
          fontFamily: "var(--font-mono,monospace)", fontSize: isSmall ? 9 : 11,
          letterSpacing: "0.07em", color: "rgba(255,255,255,0.34)",
        }}>vlx://agents/control-room</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isSmall ? "10px 12px" : "16px 20px", marginBottom: isSmall ? 12 : 18 }}>
        {AGENTS.map((a, i) => (
          <div key={a.id}>
            <div style={{
              fontFamily: "var(--font-mono,monospace)", fontSize: isSmall ? 10 : 12,
              color: "#e8850a", letterSpacing: "0.03em", marginBottom: isSmall ? 3 : 6,
            }}>{a.id}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: a.live ? "#e8850a" : "rgba(255,255,255,0.16)",
                boxShadow: a.live ? "0 0 6px #e8850a" : "none",
                animation: a.live ? `vlxBeat 1.7s ease-in-out ${i * 0.28}s infinite` : "none",
              }} />
              <span style={{
                fontFamily: "var(--font-mono,monospace)", fontSize: isSmall ? 9 : 11,
                color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em",
              }}>
                {a.live ? "running" : "queued"} · {a.base + (a.live && tick % 4 === i ? 1 : 0)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
        <div style={{ fontFamily: "var(--font-mono,monospace)", fontSize: isSmall ? 9 : 11, color: "rgba(255,255,255,0.22)", marginBottom: isSmall ? 3 : 6 }}>
          ↑ orchestrator fleet online
        </div>
        <div style={{ fontFamily: "var(--font-mono,monospace)", fontSize: isSmall ? 9 : 11, color: "#e8850a" }}>
          ↳ p95 {(0.8 + (tick % 5) * 0.04).toFixed(2)}s · 100 actions
        </div>
      </div>
    </motion.div>
  );
}

/* ─── BOTTOM STATUS STRIP ─────────────────────────────────────────────────────── */
function StatusStrip({ pct, isMobile, isSmall }) {
  const items = [
    `LIVE · ${Math.floor(20 * pct / 100)} AGENTS DEPLOYED`,
    "SHIPPED  100  SYSTEMS",
    "AVG.  11.4×  THROUGHPUT",
    "BLR / SF / REMOTE",
    "vlx.kernel · 2.6.0",
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: T.systems + 0.1 }}
      style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 11,
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: isSmall ? "8px 12px" : isMobile ? "11px 24px" : "11px clamp(24px,5vw,72px)",
        display: "flex", justifyContent: isMobile ? "center" : "space-between", alignItems: "center",
        gap: isSmall ? 6 : isMobile ? 12 : 24, flexWrap: "wrap",
        background: "linear-gradient(180deg, transparent, rgba(8,6,0,0.6))",
        backdropFilter: "blur(8px)",
      }}>
      {items.map((it, i) => (
        <span key={i} style={{
          fontFamily: "var(--font-mono,monospace)", fontSize: isSmall ? 6.5 : isMobile ? 8 : 9,
          letterSpacing: isSmall ? "0.08em" : "0.15em", textTransform: "uppercase", whiteSpace: "nowrap",
          color: i === 0 ? "rgba(232,133,10,0.78)" : "rgba(255,255,255,0.17)",
          display: isMobile && i !== 0 && i !== items.length - 1 ? "none" : "block",
        }}>{it}</span>
      ))}
    </motion.div>
  );
}

/* ─── WINDOW SIZE HOOK ───────────────────────────────────────────────────────── */
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN PRELOADER
   ════════════════════════════════════════════════════════════════════════════ */
export default function Preloader({ onComplete }) {
  const { width, height } = useWindowSize();
  const isMobile = width <= 768;
  const isSmall = width <= 400;
  const isShortScreen = height <= 700;

  const [pct, setPct] = useState(0);
  const [log, setLog] = useState(BOOT_LOG[0].text);
  const [cursor, setCursor] = useState(true);
  const [phase, setPhase] = useState(0);
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setCursor(c => !c), 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const marks = [
      setTimeout(() => setPhase(1), T.coreForm * 1000),
      setTimeout(() => setPhase(2), T.velyx * 1000),
      setTimeout(() => setPhase(3), T.systems * 1000),
      setTimeout(() => setPhase(4), T.resolve * 1000),
    ];
    return () => marks.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const offset = T.systems * 1000 - 200;
    const timers = BOOT_LOG.map(step =>
      setTimeout(() => {
        setPct(step.pct);
        setLog(step.text);
        if (step.pct === 100) setFlash(true);
      }, offset + step.at)
    );
    const finish = setTimeout(() => {
      setDone(true);
      setTimeout(() => onComplete && onComplete(), 1250);
    }, T.exit * 1000 + 650);
    return () => { timers.forEach(clearTimeout); clearTimeout(finish); };
  }, [onComplete]);

  const fieldIntensity = phase >= 1 ? 1 : 0.25;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="velyxlabs-preloader"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"],
            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] },
          }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "var(--bg, #080600)",
            overflow: isMobile ? "auto" : "hidden",
            display: "flex", flexDirection: "column",
            justifyContent: isMobile ? "flex-start" : "center",
            alignItems: isMobile ? "center" : "flex-start",
            paddingTop: isMobile ? "max(env(safe-area-inset-top, 0px), 60px)" : 0,
            paddingBottom: isMobile ? "max(env(safe-area-inset-bottom, 0px), 50px)" : 0,
          }}>

          {/* ── keyframes ── */}
          <style>{`
            @keyframes vlxBeat {
              0%,100% { opacity: 0.5; transform: scale(1); }
              50%     { opacity: 1;   transform: scale(1.45); }
            }
            @keyframes vlxScan {
              0%   { transform: translateY(-2px); opacity: 0; }
              5%   { opacity: 1; }
              95%  { opacity: 1; }
              100% { transform: translateY(100vh); opacity: 0; }
            }
            @keyframes vlxEq {
              0%,100% { transform: scaleY(0.35); }
              50%     { transform: scaleY(1); }
            }
            @keyframes vlxGrain {
              0%,100% { transform: translate(0,0); }
              25%     { transform: translate(-2%,1%); }
              50%     { transform: translate(1%,-2%); }
              75%     { transform: translate(2%,2%); }
            }
            @keyframes vlxDrift {
              0%,100% { transform: translate(0,0) scale(1); }
              50%     { transform: translate(3%,-4%) scale(1.06); }
            }
            @keyframes vlxShimmer {
              0%   { background-position: -180% 0; }
              100% { background-position: 180% 0; }
            }
          `}</style>

          {/* ── L0 · stellar field ── */}
          <StellarField intensity={fieldIntensity} />

          {/* ── L1 · breathing volumetric glows ── */}
          <div style={{
            position: "absolute", top: "-25%", right: "-12%",
            width: "62vw", height: "62vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(196,92,14,0.17) 0%, rgba(112,48,8,0.08) 42%, transparent 72%)",
            zIndex: 2, pointerEvents: "none", animation: "vlxDrift 14s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", bottom: "-30%", left: "-15%",
            width: "50vw", height: "50vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,54,9,0.11) 0%, transparent 70%)",
            zIndex: 2, pointerEvents: "none", animation: "vlxDrift 18s ease-in-out infinite reverse",
          }} />

          {/* ── L2 · masked fine grid ── */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: T.ignition }}
            style={{
              position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.022) 1px, transparent 1px)," +
                "linear-gradient(to bottom, rgba(255,255,255,0.022) 1px, transparent 1px)",
              backgroundSize: "46px 46px",
              maskImage: "radial-gradient(ellipse 75% 70% at 40% 50%, #000 35%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 40% 50%, #000 35%, transparent 100%)",
            }} />

          {/* ── L3 · film grain ── */}
          <div style={{
            position: "absolute", inset: "-50%", zIndex: 8, pointerEvents: "none",
            opacity: 0.05, mixBlendMode: "overlay",
            animation: "vlxGrain 0.6s steps(3) infinite",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px",
          }} />

          {/* ── L4 · descending scan line ── */}
          <div style={{
            position: "absolute", left: 0, right: 0, top: 0, height: 1, zIndex: 7,
            pointerEvents: "none",
            background: "linear-gradient(90deg, transparent, rgba(232,133,10,0.5) 50%, transparent)",
            boxShadow: "0 0 14px rgba(232,133,10,0.35)",
            animation: "vlxScan 5s linear 0.6s infinite",
          }} />

          {/* ── L5 · cinematic vignette ── */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none",
            background: "radial-gradient(ellipse 82% 74% at 40% 50%, transparent 24%, rgba(6,4,0,0.85) 100%)",
          }} />

          {/* ── completion light bloom ── */}
          <AnimatePresence>
            {flash && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.45, 0] }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                style={{
                  position: "absolute", inset: 0, zIndex: 9, pointerEvents: "none",
                  background: "radial-gradient(ellipse 58% 52% at 40% 44%, rgba(255,196,118,0.55), transparent 70%)",
                }} />
            )}
          </AnimatePresence>

          {/* ════ top-left brand stamp ════ */}
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: T.systems }}
            style={{
              position: "absolute", top: "clamp(12px, 3vh, 30px)", left: "clamp(12px,4vw,72px)", zIndex: 12,
              display: "flex", alignItems: "center", gap: isSmall ? 6 : 11,
            }}>
            <img
              src="https://res.cloudinary.com/dmhabztbf/image/upload/v1779688104/ChatGPT_Image_May_25__2026__11_15_18_AM-removebg-preview_hy48ex.png"
              alt="VelyxLabs"
              style={{ width: isSmall ? 28 : 44, height: isSmall ? 28 : 44, objectFit: "contain" }}
            />
            <span style={{
              fontFamily: "var(--font-mono,monospace)", fontSize: isSmall ? 7.5 : 10,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.24)",
            }}>VLX · KERNEL 2.6.0</span>
          </motion.div>

          <LiveClock />

          {/* ════ CENTER STAGE ════ */}
          <div style={{
            position: "relative", zIndex: 12, width: "100%",
            paddingLeft: isSmall ? "14px" : isMobile ? "24px" : "clamp(24px,8vw,120px)",
            paddingRight: isSmall ? "14px" : isMobile ? "24px" : "clamp(24px,8vw,60px)",
            maxWidth: 820,
            display: "flex", flexDirection: "column",
            alignItems: isMobile ? "center" : "flex-start",
            textAlign: isMobile ? "center" : "left",
          }}>

            {/* core sigil — VelyxLabs logo */}
            <div style={{ marginBottom: isShortScreen ? 10 : 20, marginLeft: isMobile ? 0 : -6, display: "flex", justifyContent: isMobile ? "center" : "flex-start" }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.68 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: T.coreForm }}
                style={{ filter: "drop-shadow(0 0 26px rgba(232,133,10,0.35))" }}
              >
                <img
                  src="https://res.cloudinary.com/dmhabztbf/image/upload/v1779688104/ChatGPT_Image_May_25__2026__11_15_18_AM-removebg-preview_hy48ex.png"
                  alt="VelyxLabs Logo"
                  style={{
                    width: isSmall ? 80 : isMobile ? 120 : 160,
                    height: isSmall ? 80 : isMobile ? 120 : 160,
                    objectFit: "contain",
                  }}
                />
              </motion.div>
            </div>

            {/* eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: T.velyx - 0.15 }}
              style={{
                display: "flex", alignItems: "center", gap: isSmall ? 7 : 11, marginBottom: isShortScreen ? 12 : 22,
                fontFamily: "var(--font-mono,monospace)", fontSize: isSmall ? 8 : 10,
                letterSpacing: isSmall ? "0.16em" : "0.24em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.32)",
                justifyContent: isMobile ? "center" : "flex-start",
              }}>
              <span style={{ display: "flex", gap: 2.5, alignItems: "flex-end", height: 12 }}>
                {[0.4, 1, 0.65, 1, 0.5, 0.9, 0.6, 1, 0.45, 0.85, 0.55].map((h, i) => (
                  <span key={i} style={{
                    width: 2, height: `${h * 12}px`, background: "#e8850a",
                    opacity: 0.78, borderRadius: 1, transformOrigin: "bottom",
                    animation: `vlxEq ${0.55 + i * 0.06}s ease-in-out ${i * 0.04}s infinite alternate`,
                  }} />
                ))}
              </span>
              <span>Initializing intelligence</span>
            </motion.div>

            {/* ══ WORDMARK · VelyxLabs — single line, two textures ══ */}
            <h1 style={{
              margin: 0, padding: 0, lineHeight: 0.92,
              fontSize: isSmall ? "clamp(2rem, 12vw, 3rem)" : isMobile ? "clamp(2.8rem, 11vw, 4.2rem)" : "clamp(3.4rem, 10.5vw, 8.8rem)",
              letterSpacing: "-0.045em",
              display: "flex", alignItems: "baseline", flexWrap: "nowrap",
              whiteSpace: "nowrap",
              justifyContent: isMobile ? "center" : "flex-start",
            }}>
              {/* "Velyx" — sans, ivory, clip-mask rise */}
              <span style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.06em" }}>
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: T.velyx }}
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-sans,'Cabinet Grotesk','Helvetica Neue',sans-serif)",
                    fontWeight: 500,
                    color: "var(--fg, #f6f1e7)",
                  }}>
                  Velyx
                </motion.span>
              </span>

              {/* "Labs" — serif italic, AMBER (hardcoded so it never inherits a link color) */}
              <span style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.06em" }}>
                <motion.span
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: T.labs }}
                  style={{
                    display: "inline-block",
                    fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                    fontStyle: "italic",
                    fontWeight: 500,
                    letterSpacing: "-0.015em",
                    marginLeft: "0.04em",
                    color: "#f0920f",
                    textShadow: "0 0 32px rgba(240,146,15,0.45), 0 0 70px rgba(232,133,10,0.22)",
                  }}>
                  Labs
                </motion.span>
              </span>
            </h1>

            {/* underline sweep + shimmer */}
            <motion.div
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1], delay: T.labs + 0.4 }}
              style={{
                height: 1.5, width: isSmall ? "min(260px, 85%)" : "min(360px, 82%)", transformOrigin: isMobile ? "center" : "left",
                margin: isShortScreen ? "12px auto 10px" : isMobile ? "22px auto 18px" : "22px 0 18px",
                background: isMobile ? "linear-gradient(90deg, rgba(232,133,10,0.04) 0%, #f0920f 50%, rgba(232,133,10,0.04) 100%)" : "linear-gradient(90deg, #f0920f 0%, #e8850a 40%, rgba(232,133,10,0.04) 100%)",
              }} />

            {/* tagline */}
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: T.labs + 0.6 }}
              style={{
                margin: isMobile ? "0 auto" : 0, maxWidth: isSmall ? 280 : 440,
                fontFamily: "var(--font-mono,monospace)",
                fontSize: isSmall ? 10 : 11.5, letterSpacing: "0.07em", lineHeight: 1.7,
                color: "rgba(255,255,255,0.36)",
              }}>
              Operating at the speed of intelligence.
            </motion.p>

            {/* ══ PROGRESS SYSTEM ══ */}
            <motion.div
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: T.systems }}
              style={{ width: isSmall ? "min(280px, 94%)" : "min(440px, 92%)", marginTop: isShortScreen ? 20 : isSmall ? 28 : 46, marginInline: isMobile ? "auto" : "0" }}>

              {/* streaming log */}
              <div style={{
                fontFamily: "var(--font-mono,monospace)", fontSize: isSmall ? 9.5 : 11.5,
                letterSpacing: "0.05em", marginBottom: isSmall ? 10 : 14, minHeight: 16,
                display: "flex", alignItems: "center", gap: 7,
                justifyContent: isMobile ? "center" : "flex-start",
                color: "#f0920f",
              }}>
                <span style={{ color: "rgba(255,255,255,0.22)" }}>›</span>
                <TerminalText text={log} />
                <span style={{ opacity: cursor ? 1 : 0, color: "rgba(240,146,15,0.8)" }}>▌</span>
              </div>

              {/* track */}
              <div style={{
                position: "relative", width: "100%", height: 2,
                background: "rgba(255,255,255,0.07)", borderRadius: 2,
              }}>
                {[25, 50, 75].map(m => (
                  <span key={m} style={{
                    position: "absolute", left: `${m}%`, top: -2.5, width: 1, height: 7,
                    background: "rgba(255,255,255,0.12)",
                  }} />
                ))}
                <motion.div
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                  style={{
                    position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 2,
                    background: "linear-gradient(90deg, rgba(232,133,10,0.4), #ffae3e)",
                    boxShadow: "0 0 12px rgba(232,133,10,0.55)",
                  }}>
                  <span style={{
                    position: "absolute", right: -4, top: "50%",
                    transform: "translateY(-50%)",
                    width: 9, height: 9, borderRadius: "50%", background: "#ffd699",
                    boxShadow: "0 0 11px #e8850a, 0 0 24px rgba(232,133,10,0.65)",
                  }} />
                </motion.div>
              </div>

              {/* readout */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
                marginTop: 13,
              }}>
                <span style={{
                  fontFamily: "var(--font-mono,monospace)", fontSize: isSmall ? 7.5 : 9,
                  letterSpacing: isSmall ? "0.1em" : "0.16em", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.22)",
                }}>
                  {pct === 100 ? "boot complete" : "system loading"}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono,monospace)",
                  fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em",
                  display: "flex", alignItems: "baseline", gap: 2,
                }}>
                  <motion.span
                    key={pct}
                    initial={{ opacity: 0.4, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      fontSize: isSmall ? 18 : 24, fontWeight: 500,
                      color: pct === 100 ? "#ffae3e" : "var(--fg,#f6f1e7)",
                    }}>{pct}</motion.span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.32)" }}>%</span>
                </span>
              </div>
            </motion.div>
          </div>

          {/* ════ telemetry ════ */}
          <TelemetryPanel show={phase >= 3} isMobile={isMobile} isSmall={isSmall} />
          <StatusStrip pct={pct} isMobile={isMobile} isSmall={isSmall} />

        </motion.div>
      )}
    </AnimatePresence>
  );
}