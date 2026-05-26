
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------
   SHIP PARTICLES â€” 5-phase morphing particle field as background
   Phases map to the 5 ship phases. Particles smoothly interpolate
   between target positions and color shifts as you scroll.
------------------------------------------------------------------ */

function ShipParticles({ progressRef }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const isMobile = mount.clientWidth < 768;
    const COUNT = isMobile ? 800 : 2200;

    // Five target shapes â€” one per ship phase
    // 0: Agentic   â€” clustered nodes (8 clusters)
    // 1: SaaS MVPs â€” folded grid/screen plane
    // 2: Copilots  â€” two chat-bubble cluster groups
    // 3: Workflows â€” toroidal flow ribbon
    // 4: Strategy  â€” concentric timeline rings
    const positions = [
      new Float32Array(COUNT * 3),
      new Float32Array(COUNT * 3),
      new Float32Array(COUNT * 3),
      new Float32Array(COUNT * 3),
      new Float32Array(COUNT * 3),
    ];

    // Phase 0 â€” agent clusters
    const clusters = [];
    for (let i = 0; i < 8; i++) {
      const phi = Math.acos(-1 + (2 * i) / 8);
      const theta = Math.sqrt(8 * Math.PI) * phi;
      clusters.push([
        2.8 * Math.cos(theta) * Math.sin(phi),
        2.0 * Math.sin(theta) * Math.sin(phi),
        2.2 * Math.cos(phi),
      ]);
    }

    for (let i = 0; i < COUNT; i++) {
      // 0 â€” agent clusters with jitter
      const ci = i % clusters.length;
      const c = clusters[ci];
      positions[0][i * 3 + 0] = c[0] + (Math.random() - 0.5) * 0.7;
      positions[0][i * 3 + 1] = c[1] + (Math.random() - 0.5) * 0.7;
      positions[0][i * 3 + 2] = c[2] + (Math.random() - 0.5) * 0.7;

      // 1 â€” folded plane (screen tilted)
      const u = (i / COUNT) - 0.5;
      const v = ((i * 17) % 50) / 50 - 0.5;
      positions[1][i * 3 + 0] = u * 8.5;
      positions[1][i * 3 + 1] = v * 5.0 + Math.sin(u * 6) * 0.3;
      positions[1][i * 3 + 2] = Math.cos(u * 4) * 0.6;

      // 2 â€” two chat-bubble cluster groups
      const side = i % 2 === 0 ? -1.8 : 1.8;
      const r = Math.pow(Math.random(), 0.7) * 1.5;
      const a = Math.random() * Math.PI * 2;
      positions[2][i * 3 + 0] = side + r * Math.cos(a);
      positions[2][i * 3 + 1] = (i % 2 === 0 ? 0.6 : -0.6) + r * Math.sin(a) * 0.8;
      positions[2][i * 3 + 2] = (Math.random() - 0.5) * 0.6;

      // 3 â€” toroidal flow ribbon
      const t = (i / COUNT) * Math.PI * 8;
      const b = ((i * 13) % 30) / 30 * Math.PI * 2;
      const R = 2.9;
      const rr = 0.55;
      positions[3][i * 3 + 0] = (R + rr * Math.cos(b)) * Math.cos(t) * 0.95;
      positions[3][i * 3 + 1] = (R + rr * Math.cos(b)) * Math.sin(t) * 0.55;
      positions[3][i * 3 + 2] = rr * Math.sin(b);

      // 4 â€” concentric rings (strategy timeline)
      const ring = i % 4;
      const radius = 1.0 + ring * 0.7;
      const ang = (i / COUNT) * Math.PI * 20 + ring;
      positions[4][i * 3 + 0] = radius * Math.cos(ang);
      positions[4][i * 3 + 1] = radius * Math.sin(ang) * 0.85;
      positions[4][i * 3 + 2] = Math.sin(ring * 1.4) * 0.4;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
    geometry.setAttribute("p0", new THREE.BufferAttribute(positions[0], 3));
    geometry.setAttribute("p1", new THREE.BufferAttribute(positions[1], 3));
    geometry.setAttribute("p2", new THREE.BufferAttribute(positions[2], 3));
    geometry.setAttribute("p3", new THREE.BufferAttribute(positions[3], 3));
    geometry.setAttribute("p4", new THREE.BufferAttribute(positions[4], 3));

    const sizes = new Float32Array(COUNT);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      sizes[i] = 0.4 + Math.random() * 1.8;
      seeds[i] = Math.random();
    }
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));

    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 }, // 0..4
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uColorWarm: { value: new THREE.Color("#f6cf8c") },
      uColorAmber: { value: new THREE.Color("#d77a2a") },
      uColorChartreuse: { value: new THREE.Color("#dff48a") },
      uColorWhite: { value: new THREE.Color("#f5f5f0") },
    };

    const vertexShader = `
      uniform float uTime;
      uniform float uProgress;
      uniform float uPixelRatio;
      attribute vec3 p0;
      attribute vec3 p1;
      attribute vec3 p2;
      attribute vec3 p3;
      attribute vec3 p4;
      attribute float size;
      attribute float seed;
      varying float vGlow;
      varying float vPhase;
      varying float vSeed;

      vec3 mix5(vec3 a, vec3 b, vec3 c, vec3 d, vec3 e, float t) {
        float ft = clamp(t, 0.0, 4.0);
        if (ft < 1.0) return mix(a, b, smoothstep(0.0, 1.0, ft));
        if (ft < 2.0) return mix(b, c, smoothstep(0.0, 1.0, ft - 1.0));
        if (ft < 3.0) return mix(c, d, smoothstep(0.0, 1.0, ft - 2.0));
        return mix(d, e, smoothstep(0.0, 1.0, ft - 3.0));
      }

      void main() {
        vec3 pos = mix5(p0, p1, p2, p3, p4, uProgress);
        // Gentle drift
        float drift = sin(uTime * 0.5 + seed * 50.0) * 0.04;
        pos.x += drift;
        pos.y += cos(uTime * 0.4 + seed * 30.0) * 0.04;
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        float baseSize = size * 8.0;
        gl_PointSize = baseSize * uPixelRatio * (1.0 / -mv.z);
        vGlow = 0.5 + 0.5 * sin(uTime * 1.5 + seed * 12.0);
        vPhase = uProgress;
        vSeed = seed;
      }
    `;

    const fragmentShader = `
      uniform vec3 uColorWarm;
      uniform vec3 uColorAmber;
      uniform vec3 uColorChartreuse;
      uniform vec3 uColorWhite;
      varying float vGlow;
      varying float vPhase;
      varying float vSeed;

      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float core = smoothstep(0.5, 0.0, d);
        float halo = smoothstep(0.5, 0.15, d) * 0.45;

        // Color shifts with phase
        vec3 col = uColorWhite;
        col = mix(col, uColorWarm,       smoothstep(0.0, 1.0, vPhase));
        col = mix(col, uColorAmber,      smoothstep(1.0, 2.4, vPhase));
        col = mix(col, uColorChartreuse, smoothstep(2.4, 3.4, vPhase));
        col = mix(col, uColorAmber,      smoothstep(3.4, 4.0, vPhase));

        // Sparkle accents on a few particles
        float sparkle = step(0.93, vSeed) * vGlow * 0.6;
        col += sparkle;

        float a = (core + halo) * (0.55 + vGlow * 0.5);
        if (a < 0.02) discard;
        gl_FragColor = vec4(col, a);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Constellation lines between cluster centers â€” only visible in phase 0 + 4
    const lineGeo = new THREE.BufferGeometry();
    const linePos = [];
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const dx = clusters[i][0] - clusters[j][0];
        const dy = clusters[i][1] - clusters[j][1];
        const dz = clusters[i][2] - clusters[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 4.5) {
          linePos.push(...clusters[i]);
          linePos.push(...clusters[j]);
        }
      }
    }
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xf6cf8c,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;

      const p = (progressRef.current ?? 0) * 4;
      uniforms.uProgress.value += (p - uniforms.uProgress.value) * Math.min(1, dt * 4.5);

      points.rotation.y += dt * 0.05;
      points.rotation.x = Math.sin(t * 0.12) * 0.08;
      lines.rotation.copy(points.rotation);

      // Lines fade in only around phases 0 and 4
      const phaseVal = uniforms.uProgress.value;
      const phase0Strength = Math.max(0, 1 - phaseVal);
      const phase4Strength = Math.max(0, phaseVal - 3);
      lineMat.opacity = Math.min(0.28, phase0Strength * 0.18 + phase4Strength * 0.22);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [progressRef]);

  return <div ref={mountRef} className="ship__particles" aria-hidden="true" />;
}

/* ------------------------------------------------------------------
   SHIP â€” 5-phase pinned scroll. Each scroll-step swaps the entire
   left/right content with a fade+slide. Right side renders a unique
   "mockup" per phase. The mockups are static-but-rich UIs that hint
   at the product being described.
------------------------------------------------------------------ */

const PHASES = [
  {
    code: "01 / AGENTIC SYSTEMS",
    title: "Agentic systems",
    titleSerif: "that run themselves.",
    body: "Multi-agent fleets that own end-to-end workflows â€” qualification, ops, finance, research. Observable. Evaluable. Always on. Replace 30 hours of weekly busywork with software that improves every quarter.",
    tags: ["Multi-agent orchestration", "Tool use", "Eval harness", "Human-in-loop", "Slack / email / API"],
  },
  {
    code: "02 / SAAS MVPs",
    title: "SaaS MVPs",
    titleSerif: "shipped in 6 weeks.",
    body: "AI-native products from blank canvas to paying users in under 45 days. We design, build, and launch your MVP with the same agent-first architecture we use internally â€” so it's ready to scale, not rewrite.",
    tags: ["Next.js / TypeScript", "Stripe + auth", "Vector DB", "Agent backbone", "Deployed on launch day"],
  },
  {
    code: "03 / INTERNAL COPILOTS",
    title: "Internal copilots",
    titleSerif: "for every team.",
    body: "Custom AI coworkers for sales, support, finance, and ops. Trained on your data, wired into your tools, designed around how your team actually works. Instead of a chatbot, you get a colleague.",
    tags: ["RAG over private docs", "Custom UI", "Permissions & audit", "Voice + chat", "Slack / Notion / Linear"],
  },
  {
    code: "04 / CUSTOM WORKFLOWS",
    title: "Custom workflows",
    titleSerif: "stitched into your stack.",
    body: "Bespoke automations and internal tools wired across your existing stack. We don't replace your tools â€” we connect them, augment them, and replace the manual glue work with reliable AI pipelines.",
    tags: ["ETL & data pipelines", "Webhook orchestration", "Document intelligence", "Voice ops", "Reporting"],
  },
  {
    code: "05 / AI STRATEGY",
    title: "AI strategy",
    titleSerif: "as a founding partner.",
    body: "For founders who want a thinking partner. We embed with your leadership team to audit your operations, identify highest-leverage AI bets, and write the 12-month roadmap that turns AI into compounding advantage.",
    tags: ["Operating audit", "Roadmap + sequencing", "Hiring + vendor plan", "Quarterly reviews", "Board materials"],
  },
];

/* ---------- MOCKUPS ---------- */

function MockAgents() {
  return (
    <div className="ship__mock">
      <div className="ship__mock-head">
        <span className="dot" /><span className="dot" /><span className="dot" />
        <span className="title">vlx://agents/control-room</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(6px, 2vw, 12px)" }}>
        {[
          { name: "sales/qualify", status: "running", calls: 14, c: "var(--accent-2)" },
          { name: "ops/invoicing", status: "running", calls: 8, c: "var(--accent-2)" },
          { name: "research/intel", status: "queued", calls: 0, c: "var(--fg-mute)" },
          { name: "finance/recon", status: "running", calls: 3, c: "var(--accent-2)" },
        ].map((a) => (
          <div key={a.name} style={{
            border: "1px solid var(--line-soft)", borderRadius: "clamp(6px, 2vw, 10px)", padding: "clamp(8px, 2.5vw, 12px) clamp(10px, 2.5vw, 14px)",
            background: "oklch(0.12 0.012 60)",
          }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(9px, 2.5vw, 11px)", color: "var(--accent)", marginBottom: 4 }}>{a.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-mono)", fontSize: "clamp(8.5px, 2.3vw, 10.5px)", color: "var(--fg-mute)" }}>
              <span style={{ width: 6, height: 6, background: a.c, borderRadius: "50%", boxShadow: `0 0 8px ${a.c}` }} />
              {a.status} Â· {a.calls} active
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "clamp(10px, 3vw, 18px)", padding: "clamp(8px, 2.5vw, 12px)", background: "oklch(0.12 0.012 60)", border: "1px solid var(--line-soft)", borderRadius: "clamp(6px, 2vw, 10px)", fontFamily: "var(--font-mono)", fontSize: "clamp(9px, 2.5vw, 11px)", lineHeight: 1.7 }}>
        <div style={{ color: "var(--fg-mute)" }}>â†’ Inbound lead: Acme Corp, $40k ARR potential</div>
        <div style={{ color: "var(--accent-2)" }}>âœ“ Qualified Â· routed to founder Â· 0.8s</div>
        <div style={{ color: "var(--fg-mute)" }}>â†’ Invoice #4421 disputed by vendor</div>
        <div style={{ color: "var(--accent-2)" }}>âœ“ Researched contract Â· drafted response</div>
      </div>
      <div style={{ marginTop: "clamp(8px, 2.5vw, 14px)", display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "clamp(8px, 2.2vw, 10.5px)", color: "var(--fg-mute)" }}>
        <span>184 ACTIONS TODAY</span>
        <span>P95 1.2s</span>
        <span>$0.04 / ACTION</span>
      </div>
    </div>
  );
}

function MockSaas() {
  return (
    <div className="ship__mock" style={{ padding: 0 }}>
      <div className="ship__mock-head" style={{ padding: "18px 22px 16px" }}>
        <span className="dot" /><span className="dot" /><span className="dot" />
        <span className="title">launch.your-product.io</span>
      </div>
      <div style={{ padding: "8px 22px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", letterSpacing: ".08em", marginBottom: 14 }}>
          <span style={{ width: 6, height: 6, background: "var(--accent-2)", borderRadius: "50%" }} />
          LIVE Â· DAY 38 SINCE KICKOFF
        </div>
        <div style={{ fontSize: 28, lineHeight: 1, letterSpacing: "-0.025em", fontWeight: 500, marginBottom: 10 }}>
          AI-native CRM for solo founders.
        </div>
        <div style={{ fontSize: 13, color: "var(--fg-dim)", lineHeight: 1.5, marginBottom: 18 }}>
          Auto-enriched contacts. AI follow-ups. No data entry. Ever.
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <div style={{ background: "var(--fg)", color: "#14110a", padding: "9px 14px", borderRadius: 100, fontSize: 12, fontWeight: 500 }}>
            Start free trial â†’
          </div>
          <div style={{ border: "1px solid var(--line)", padding: "9px 14px", borderRadius: 100, fontSize: 12, color: "var(--fg-dim)" }}>
            Watch demo
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: "clamp(10px, 3vw, 18px)", paddingTop: "clamp(10px, 3vw, 18px)", borderTop: "1px solid var(--line-soft)" }}>
          {[
            { v: "146", l: "BETA USERS" },
            { v: "$4.2K", l: "MRR" },
            { v: "38", l: "DAYS TO LIVE" },
          ].map((m) => (
            <div key={m.l}>
              <div style={{ fontSize: "clamp(16px, 4.5vw, 22px)", letterSpacing: "-0.02em", fontWeight: 500 }}>{m.v}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(8px, 2.2vw, 10px)", color: "var(--fg-mute)", letterSpacing: ".06em", marginTop: 2 }}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MockCopilot() {
  return (
    <div className="ship__mock">
      <div className="ship__mock-head">
        <span className="dot" /><span className="dot" /><span className="dot" />
        <span className="title">finance-copilot Â· slack</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "var(--font-mono)", fontSize: 12 }}>
        <div style={{ background: "oklch(0.16 0.012 60)", borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ fontSize: 10, color: "var(--fg-mute)", marginBottom: 4, letterSpacing: ".04em" }}>SARAH Â· CFO Â· 9:42 AM</div>
          <div style={{ color: "var(--fg-dim)", lineHeight: 1.5 }}>What did we spend on AWS last quarter vs forecast?</div>
        </div>
        <div style={{ background: "oklch(0.78 0.16 65 / 0.08)", border: "1px solid oklch(0.78 0.16 65 / 0.25)", borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ fontSize: 10, color: "var(--accent)", marginBottom: 4, letterSpacing: ".04em" }}>FINANCE-COPILOT Â· 9:42 AM</div>
          <div style={{ color: "var(--fg)", lineHeight: 1.5, marginBottom: 10 }}>
            AWS Q1: <span style={{ color: "var(--accent)" }}>$84,210</span> vs forecast $72k.
            <br />Variance: +16.9% â€” mostly Bedrock inference (+$9.8k).
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["Show breakdown", "Compare Q4", "Why so high?"].map((q) => (
              <div key={q} style={{ fontSize: 10.5, padding: "4px 10px", border: "1px solid var(--line)", borderRadius: 100, color: "var(--fg-dim)" }}>{q}</div>
            ))}
          </div>
        </div>
        <div style={{ background: "oklch(0.16 0.012 60)", borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ fontSize: 10, color: "var(--fg-mute)", marginBottom: 4, letterSpacing: ".04em" }}>SARAH Â· 9:43 AM</div>
          <div style={{ color: "var(--fg-dim)", lineHeight: 1.5 }}>Why so high?</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: "var(--fg-mute)", letterSpacing: ".04em" }}>
          <span style={{ width: 4, height: 4, background: "var(--accent-2)", borderRadius: "50%", animation: "pulse 1.4s infinite" }} />
          FINANCE-COPILOT IS TYPINGâ€¦
        </div>
      </div>
    </div>
  );
}

function MockWorkflow() {
  // SVG node graph
  return (
    <div className="ship__mock">
      <div className="ship__mock-head">
        <span className="dot" /><span className="dot" /><span className="dot" />
        <span className="title">workflow Â· invoice-to-ledger</span>
      </div>
      <svg viewBox="0 0 400 320" style={{ width: "100%", height: "auto", maxHeight: 280 }}>
        <defs>
          <linearGradient id="wfFlow" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.16 65)" stopOpacity="0" />
            <stop offset="50%" stopColor="oklch(0.78 0.16 65)" />
            <stop offset="100%" stopColor="oklch(0.78 0.16 65)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* edges */}
        <g stroke="oklch(0.4 0.01 60)" strokeWidth="1" fill="none">
          <path d="M70,60 L180,60" />
          <path d="M180,60 L290,60" />
          <path d="M180,60 L180,160" />
          <path d="M180,160 L290,160" />
          <path d="M180,160 L180,260" />
          <path d="M180,260 L290,260" />
        </g>
        {/* animated flow */}
        <g stroke="url(#wfFlow)" strokeWidth="2" fill="none">
          <path d="M70,60 L290,60">
            <animate attributeName="stroke-dashoffset" from="0" to="-220" dur="3s" repeatCount="indefinite" />
          </path>
        </g>
        {/* nodes */}
        {[
          { x: 70, y: 60, label: "EMAIL", t: "trigger", color: "var(--accent-2)" },
          { x: 180, y: 60, label: "PARSE PDF", t: "agent" },
          { x: 290, y: 60, label: "VALIDATE", t: "rule" },
          { x: 180, y: 160, label: "MATCH PO", t: "agent" },
          { x: 290, y: 160, label: "QUICKBOOKS", t: "tool" },
          { x: 180, y: 260, label: "NOTIFY", t: "tool" },
          { x: 290, y: 260, label: "SLACK", t: "tool" },
        ].map((n, i) => (
          <g key={i}>
            <rect x={n.x - 50} y={n.y - 16} width="100" height="32" rx="8"
              fill="oklch(0.16 0.012 60)"
              stroke={n.color || "oklch(0.78 0.16 65 / 0.5)"}
              strokeWidth="1" />
            <text x={n.x} y={n.y - 2} fill="oklch(0.96 0.005 80)" fontSize="9.5"
              fontFamily="Geist Mono" textAnchor="middle" letterSpacing="0.04em">{n.label}</text>
            <text x={n.x} y={n.y + 9} fill="oklch(0.55 0.012 65)" fontSize="7.5"
              fontFamily="Geist Mono" textAnchor="middle" letterSpacing="0.06em">{n.t.toUpperCase()}</text>
          </g>
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "clamp(8px, 2.2vw, 10.5px)", color: "var(--fg-mute)", paddingTop: 12, borderTop: "1px solid var(--line-soft)" }}>
        <span>7 NODES</span>
        <span>RUNS 412Ã—/DAY</span>
        <span><span style={{ color: "var(--accent-2)" }}>â— </span>HEALTHY</span>
      </div>
    </div>
  );
}

function MockStrategy() {
  return (
    <div className="ship__mock">
      <div className="ship__mock-head">
        <span className="dot" /><span className="dot" /><span className="dot" />
        <span className="title">strategy Â· 12-month roadmap</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { q: "Q1", t: "Operating audit + agent #1 (sales)", c: "done" },
          { q: "Q2", t: "Agents #2â€“4 (ops, finance, research)", c: "now" },
          { q: "Q3", t: "Internal copilot for full team", c: "next" },
          { q: "Q4", t: "Customer-facing AI feature in product", c: "next" },
        ].map((row, i) => {
          const colors = {
            done: "var(--accent-2)",
            now: "var(--accent)",
            next: "var(--fg-mute)",
          };
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "36px 1fr auto", gap: "clamp(8px, 2.5vw, 14px)", alignItems: "center",
              padding: "clamp(8px, 2.5vw, 12px) clamp(10px, 2.5vw, 14px)", border: "1px solid var(--line-soft)", borderRadius: "clamp(6px, 2vw, 10px)",
              background: row.c === "now" ? "oklch(0.78 0.16 65 / 0.06)" : "oklch(0.12 0.012 60)",
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(10px, 2.8vw, 12px)", color: colors[row.c], letterSpacing: ".04em" }}>{row.q}</span>
              <span style={{ fontSize: "clamp(11px, 3vw, 13px)", color: "var(--fg)" }}>{row.t}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(8px, 2.2vw, 10px)", color: colors[row.c], textTransform: "uppercase", letterSpacing: ".06em" }}>{row.c}</span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: "clamp(10px, 3vw, 18px)", padding: "clamp(10px, 2.5vw, 14px)", border: "1px dashed var(--line)", borderRadius: "clamp(6px, 2vw, 10px)", fontFamily: "var(--font-mono)", fontSize: "clamp(9px, 2.5vw, 11px)", color: "var(--fg-dim)", lineHeight: 1.5 }}>
        <div style={{ color: "var(--accent)", marginBottom: 6, letterSpacing: ".04em" }}>NORTH STAR</div>
        Founder operates two layers above the work.<br />
        Team of 8 ships like a team of 40.
      </div>
    </div>
  );
}

const MOCKS = [MockAgents, MockSaas, MockCopilot, MockWorkflow, MockStrategy];

function ShipScroll() {
  const wrapRef = useRef(null);
  const progressRef = useRef(0);
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf;
    const update = () => {
      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      progressRef.current = p;
      setProgress(p);
      const idx = Math.min(PHASES.length - 1, Math.floor(p * PHASES.length * 0.9999));
      setStage(idx);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Per-segment progress (0..1 within current stage)
  const segP = progress * PHASES.length - stage;

  return (
    <section className="ship" ref={wrapRef} data-screen-label="05 What We Ship">
      <div className="ship__pin">
        <div className="ship__bg" />
        <div className="ship__grid" />
        <ShipParticles progressRef={progressRef} />

        <div className="ship__top">
          <span className="label">VLX / WHAT WE SHIP</span>
          <span>FRAME {String(stage + 1).padStart(2, "0")} / {String(PHASES.length).padStart(2, "0")}</span>
          <span>{(progress * 100).toFixed(0).padStart(3, "0")}%</span>
        </div>

        <div className="ship__inner">
          <div className="ship__left">
            {(() => {
              const p = PHASES[stage];
              return (
                <div key={stage} className="ship__stage active">
                  <div className="ship__kicker">
                    <span className="barcode">
                      {Array.from({ length: 14 }).map((_, j) => <span key={j} />)}
                    </span>
                    {p.code}
                    <span className="ship__num">{String(stage + 1).padStart(2, "0")} / {String(PHASES.length).padStart(2, "0")}</span>
                  </div>
                  <h2 className="ship__heading">
                    {p.title} <span className="serif">{p.titleSerif}</span>
                  </h2>
                  <p className="ship__body">{p.body}</p>
                  <div className="ship__tags">
                    {p.tags.map((t) => <span key={t} className="ship__tag">{t}</span>)}
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="ship__right">
            {(() => {
              const M = MOCKS[stage];
              return (
                <div key={stage} className="ship__stage active">
                  <M />
                </div>
              );
            })()}
          </div>
        </div>

        <div className="ship__progress">
          {PHASES.map((_, i) => (
            <span
              key={i}
              className={i < stage ? "done" : i === stage ? "active" : ""}
              style={i === stage ? { "--p": segP } : {}}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShipScroll;

