/* Velyx film kit: draws one frame of a film at time t (seconds). Pure
   function of t — frame-exact, seamless 12 s loop. Load from a scene
   HTML with <script src="kit.js"> then call film(spec). */
const W = 1600, H = 1000, FPS = 60, DUR = 12, EXIT = 11.3;
const C = { bg: "#1b1b1b", stage: "#232323", card: "#2d2d2d", card2: "#353535", line: "#ffffff1c", line2: "#ffffff33", ink: "#efefef", muted: "#9d9d9d", dim: "#6b6b6b", ok: "#22c55e", okTint: "#1f3a28" };
const SX = 650, SY = 110, SW = 870, SH = 780; // the stage
const c01 = (u) => Math.max(0, Math.min(1, u));
const span = (t, a, b) => c01((t - a) / (b - a));
const out = (u) => 1 - Math.pow(1 - u, 4);
const inout = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const FONT = (s, w = 500) => `${w} ${s}px Geist`;

let ctx;
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function fillStroke(fill, stroke = C.line, lw = 1.5) { if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } }
function text(s, x, y, size, color = C.ink, weight = 500, align = "left") { ctx.font = FONT(size, weight); ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "alphabetic"; ctx.fillText(s, x, y); }
function typed(s, u) { return s.slice(0, Math.round(s.length * c01(u))); }
function wrap(s, maxW, size, weight = 500) {
  ctx.font = FONT(size, weight); const words = s.split(" "); const lines = []; let cur = "";
  for (const w of words) { const next = cur ? `${cur} ${w}` : w; if (ctx.measureText(next).width > maxW && cur) { lines.push(cur); cur = w; } else cur = next; }
  if (cur) lines.push(cur); return lines;
}
function check(x, y, r, u = 1) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = C.ok; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - r * 0.45, y); ctx.lineTo(x - r * 0.1, y + r * 0.35); ctx.lineTo(x + r * 0.5, y - r * 0.35);
  ctx.strokeStyle = "#0b2414"; ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.setLineDash([r * 2, r * 2]); ctx.lineDashOffset = r * 2 * (1 - c01(u)); ctx.stroke(); ctx.setLineDash([]);
}
function shadow(on) { ctx.shadowColor = on ? "#00000066" : "transparent"; ctx.shadowBlur = on ? 40 : 0; ctx.shadowOffsetY = on ? 16 : 0; }

/* Item painters — (item, t, local u since appear) in stage coordinates. */
const PAINT = {
  win(it) {
    shadow(true); rr(it.x, it.y, it.w, it.h, 18); fillStroke(C.card, C.line); shadow(false);
    rr(it.x, it.y, it.w, 44, [18, 18, 0, 0]); ctx.fillStyle = "#ffffff08"; ctx.fill();
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(it.x + 22 + i * 16, it.y + 22, 4.5, 0, Math.PI * 2); ctx.fillStyle = C.line2; ctx.fill(); }
    text(it.title, it.x + 80, it.y + 28, 15, C.muted, 600);
  },
  row(it, t) {
    const done = it.done != null && t >= it.done; const du = it.done != null ? span(t, it.done, it.done + 0.35) : 0;
    rr(it.x, it.y, it.w, 50, 12); fillStroke(it.hot ? C.card2 : "transparent", it.hot ? C.line2 : C.line);
    if (done) check(it.x + 26, it.y + 25, 10, du); else { ctx.beginPath(); ctx.arc(it.x + 26, it.y + 25, 9, 0, Math.PI * 2); ctx.strokeStyle = C.line2; ctx.lineWidth = 1.5; ctx.stroke(); }
    text(it.label, it.x + 48, it.y + 31, 16, it.dim ? C.dim : C.ink, 500);
    if (it.pill) {
      const label = done ? it.pill[1] : it.pill[0]; ctx.font = FONT(12, 600); const pw = ctx.measureText(label).width + 20;
      rr(it.x + it.w - pw - 14, it.y + 14, pw, 22, 11); fillStroke(done ? C.okTint : "#ffffff0d", done ? C.ok : C.line);
      text(label, it.x + it.w - pw / 2 - 14, it.y + 29, 12, done ? C.ok : C.muted, 600, "center");
    }
  },
  bubble(it, t, u) {
    const lines = wrap(it.text, it.w - 36, 16); const h = 22 + lines.length * 23 + 8;
    const x = it.side === "out" ? it.x + (it.right ?? 0) : it.x;
    rr(x, it.y, it.w, h, 18); fillStroke(it.side === "out" ? C.okTint : C.card2, it.side === "out" ? "#22c55e66" : C.line);
    if (u < 0.35) { for (let i = 0; i < 3; i++) { const b = Math.sin((t * 8) - i) * 0.5 + 0.5; ctx.beginPath(); ctx.arc(x + 26 + i * 14, it.y + h / 2, 4, 0, Math.PI * 2); ctx.fillStyle = `rgba(239,239,239,${0.3 + b * 0.5})`; ctx.fill(); } return; }
    const shown = typed(it.text, span(u, 0.35, 0.35 + it.text.length / 70)); const sl = wrap(shown, it.w - 36, 16);
    sl.forEach((l, i) => text(l, x + 18, it.y + 30 + i * 23, 16, C.ink, 500));
  },
  chip(it, t) {
    const done = it.done != null && t >= it.done; ctx.font = FONT(15, 500); const w = ctx.measureText(it.text).width + 56;
    rr(it.x, it.y, w, 38, 19); fillStroke(done ? C.okTint : "#ffffff0a", done ? "#22c55e88" : C.line);
    if (done) check(it.x + 19, it.y + 19, 8, span(t, it.done, it.done + 0.3));
    else if (it.done == null) { ctx.beginPath(); ctx.arc(it.x + 19, it.y + 19, 7, 0, Math.PI * 2); ctx.strokeStyle = C.line2; ctx.lineWidth = 1.5; ctx.stroke(); }
    else { ctx.save(); ctx.translate(it.x + 19, it.y + 19); ctx.rotate(t * 6); ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 1.4); ctx.strokeStyle = C.muted; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }
    text(it.text, it.x + 38, it.y + 24, 15, done ? C.ink : C.muted, 500);
  },
  wave(it, t) {
    const live = t < (it.until ?? 99); const n = Math.floor(it.w / 10);
    for (let i = 0; i < n; i++) {
      const env = Math.sin((i / n) * Math.PI); const v = live ? (0.25 + 0.75 * Math.abs(Math.sin(t * 7 + i * 0.55) * Math.cos(t * 3.1 + i * 0.21))) * env : 0.06;
      const h = Math.max(3, v * it.h); rr(it.x + i * 10, it.y + (it.h - h) / 2, 5, h, 2.5); ctx.fillStyle = live ? C.ok : C.dim; ctx.fill();
    }
  },
  ring(it, t) {
    const live = t < (it.until ?? 99);
    if (live) for (let k = 0; k < 3; k++) { const p = ((t * 0.9 + k / 3) % 1); ctx.beginPath(); ctx.arc(it.x, it.y, 34 + p * 60, 0, Math.PI * 2); ctx.strokeStyle = `rgba(34,197,94,${0.5 * (1 - p)})`; ctx.lineWidth = 2; ctx.stroke(); }
    ctx.beginPath(); ctx.arc(it.x, it.y, 34, 0, Math.PI * 2); ctx.fillStyle = live ? C.ok : C.card2; ctx.fill();
    const s = live ? Math.sin(t * 30) * 0.12 : 0; ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(s);
    ctx.beginPath(); ctx.roundRect(-9, -15, 18, 30, 5); ctx.strokeStyle = live ? "#0b2414" : C.ink; ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore();
    if (it.label) text(it.label, it.x, it.y + 70, 14, C.muted, 600, "center");
  },
  cal(it, t) {
    rr(it.x, it.y, it.w, it.h, 16); fillStroke(C.card, C.line);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]; const cw = (it.w - 40) / 5; const rows = 4; const rh = (it.h - 70) / rows;
    days.forEach((d, i) => text(d, it.x + 20 + cw * i + cw / 2, it.y + 36, 13, C.muted, 600, "center"));
    for (let c = 0; c < 5; c++) for (let r = 0; r < rows; r++) {
      const picked = it.slot[0] === c && it.slot[1] === r && t >= it.pick; const busy = (c * 3 + r * 5) % 4 === 0;
      rr(it.x + 24 + cw * c, it.y + 54 + rh * r, cw - 8, rh - 8, 8);
      fillStroke(picked ? C.ok : busy ? "#ffffff10" : "transparent", picked ? null : C.line);
      if (picked) { const u = span(t, it.pick, it.pick + 0.35); check(it.x + 24 + cw * c + (cw - 8) / 2, it.y + 54 + rh * r + (rh - 8) / 2, 9 * out(u) + 0.01, u); }
    }
  },
  toast(it) {
    shadow(true); rr(it.x, it.y, it.w, 74, 16); fillStroke("#3a3a3a", C.line2); shadow(false);
    ctx.beginPath(); ctx.arc(it.x + 28, it.y + 37, 7, 0, Math.PI * 2); ctx.fillStyle = C.ok; ctx.fill();
    text(it.title, it.x + 50, it.y + 32, 16, C.ink, 600); text(it.sub, it.x + 50, it.y + 55, 14, C.muted, 500);
  },
  kanban(it, t) {
    const cw = (it.w - 16 * (it.cols.length - 1)) / it.cols.length;
    it.cols.forEach((name, i) => { const x = it.x + i * (cw + 16); rr(x, it.y, cw, it.h, 16); fillStroke("#ffffff06", C.line); text(name, x + 18, it.y + 32, 14, C.muted, 600); });
    (it.ghosts ?? []).forEach(([col, row]) => { rr(it.x + col * (cw + 16) + 14, it.y + 52 + row * 64, cw - 28, 52, 10); fillStroke("#ffffff08", C.line); });
    const m = inout(span(t, it.card.move, it.card.move + 0.9)); const col = it.card.from + (it.card.to - it.card.from) * m;
    const x = it.x + col * (cw + 16) + 14, y = it.y + 52 + Math.sin(m * Math.PI) * -26;
    shadow(m > 0 && m < 1); rr(x, y, cw - 28, 52, 10); fillStroke(m >= 1 ? C.okTint : C.card2, m >= 1 ? "#22c55e88" : C.line2); shadow(false);
    text(it.card.label, x + 16, y + 32, 15, C.ink, 600);
  },
  bars(it, t) {
    rr(it.x, it.y, it.w, it.h, 16); fillStroke(C.card, C.line); if (it.title) text(it.title, it.x + 20, it.y + 34, 14, C.muted, 600);
    const n = it.vals.length; const bw = (it.w - 40) / n;
    it.vals.forEach((v, i) => { const u = out(span(t, it.a + 0.3 + i * 0.08, it.a + 0.9 + i * 0.08)); const h = v * (it.h - 80) * u;
      rr(it.x + 20 + i * bw + 6, it.y + it.h - 20 - h, bw - 12, h, 6); ctx.fillStyle = i === n - 1 ? C.ok : "#ffffff26"; ctx.fill(); });
  },
  phone(it) {
    shadow(true); rr(it.x, it.y, it.w, it.h, 34); fillStroke("#202020", C.line2, 2); shadow(false);
    rr(it.x + it.w / 2 - 36, it.y + 14, 72, 18, 9); ctx.fillStyle = "#000"; ctx.fill();
    if (it.title) text(it.title, it.x + it.w / 2, it.y + 62, 14, C.muted, 600, "center");
  },
  browser(it) {
    shadow(true); rr(it.x, it.y, it.w, it.h, 18); fillStroke(C.card, C.line); shadow(false);
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(it.x + 22 + i * 16, it.y + 22, 4.5, 0, Math.PI * 2); ctx.fillStyle = C.line2; ctx.fill(); }
    rr(it.x + 80, it.y + 10, it.w - 100, 24, 12); fillStroke("#ffffff0a", null); text(it.url, it.x + 96, it.y + 27, 13, C.muted, 500);
  },
  block(it, t, u) {
    rr(it.x, it.y, it.w, it.h, 12); fillStroke(it.fill ?? "#ffffff0a", C.line);
    (it.lines ?? []).forEach(([lx, ly, lw, lh = 12, col = "#ffffff26"], i) => { const p = out(span(u, 0.15 + i * 0.12, 0.6 + i * 0.12)); rr(it.x + lx, it.y + ly, lw * p, lh, lh / 2); ctx.fillStyle = col; ctx.fill(); });
    if (it.label) text(it.label, it.x + 18, it.y + 30, 15, C.ink, 600);
  },
  label(it) { text(it.text, it.x, it.y, it.size ?? 15, it.color ?? C.muted, it.weight ?? 600, it.align ?? "left"); },
  wire(it, t, u) {
    const p = out(c01(u / 0.6)); const pts = it.pts; let total = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); total += d; }
    ctx.setLineDash([5, 7]); ctx.strokeStyle = C.line2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(...pts[0]);
    let left = total * p; for (let i = 1; i < pts.length && left > 0; i++) { const f = Math.min(1, left / seg[i - 1]); ctx.lineTo(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f); left -= seg[i - 1]; }
    ctx.stroke(); ctx.setLineDash([]);
    if (p >= 1) { let d = ((t * 220) % total); for (let i = 1; i < pts.length; i++) { if (d <= seg[i - 1]) { const f = d / seg[i - 1]; ctx.beginPath(); ctx.arc(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f, 4, 0, Math.PI * 2); ctx.fillStyle = C.ok; ctx.fill(); break; } d -= seg[i - 1]; } }
  },
  cursor(it, t) {
    const path = it.path; let x = path[0][0], y = path[0][1];
    for (let i = 1; i < path.length; i++) { const m = inout(span(t, path[i - 1][2], path[i][2])); if (t >= path[i - 1][2]) { x = path[i - 1][0] + (path[i][0] - path[i - 1][0]) * m; y = path[i - 1][1] + (path[i][1] - path[i - 1][1]) * m; } }
    if (it.click != null && t > it.click && t < it.click + 0.5) { const p = span(t, it.click, it.click + 0.5); ctx.beginPath(); ctx.arc(x, y, 8 + p * 26, 0, Math.PI * 2); ctx.strokeStyle = `rgba(239,239,239,${0.6 * (1 - p)})`; ctx.lineWidth = 2; ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 26); ctx.lineTo(x + 7, y + 19); ctx.lineTo(x + 18, y + 19); ctx.closePath(); ctx.fillStyle = C.ink; ctx.fill(); ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke();
  },
};

function caption(spec, t) {
  const x = 96;
  text("VELYX LABS", x, 150, 13, C.muted, 700); text(spec.title.toUpperCase(), x + 108, 150, 13, C.ok, 700);
  spec.beats.forEach((b, i) => {
    const t0 = i * 4;
    // beat 0 is fully shown at t=0 and fades back in at the loop seam
    let vis = i === 0 ? Math.max(1 - span(t, 3.6, 4), out(span(t, 11.6, 12))) : span(t, t0, t0 + 0.5) * (1 - span(t, t0 + 3.6, t0 + 4));
    if (i === 0 && t < 11.6 && t >= 4) vis = 0;
    if (vis <= 0) return;
    const enter = i === 0 && t < 4 ? 1 : out(span(t, i === 0 ? 11.6 : t0, (i === 0 ? 11.6 : t0) + 0.5));
    ctx.save(); ctx.globalAlpha = vis; ctx.translate(0, (1 - enter) * 28);
    text(`0${i + 1}`, x, 420, 18, C.ok, 700); text(" / 03", x + 26, 420, 18, C.dim, 600);
    b.head.forEach((l, k) => text(l, x, 490 + k * 64, 54, C.ink, 700));
    wrap(b.sub, 470, 21).forEach((l, k) => text(l, x, 490 + b.head.length * 64 + 18 + k * 30, 21, C.muted, 500));
    ctx.restore();
  });
  for (let i = 0; i < 3; i++) {
    const fill = t >= 11.8 ? 0 : span(t, i * 4, i * 4 + 4);
    rr(x + i * 64, 840, 52, 4, 2); ctx.fillStyle = "#ffffff1f"; ctx.fill();
    rr(x + i * 64, 840, 52 * fill, 4, 2); ctx.fillStyle = C.ok; ctx.fill();
  }
}

function film(spec) {
  const canvas = document.getElementById("c"); ctx = canvas.getContext("2d");
  window.ready = { DUR, FPS };
  window.draw = async (t) => {
    await document.fonts.ready;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#ffffff07"; ctx.lineWidth = 1;
    for (let gx = 0; gx <= W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx + 0.5, 0); ctx.lineTo(gx + 0.5, H); ctx.stroke(); }
    for (let gy = 0; gy <= H; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy + 0.5); ctx.lineTo(W, gy + 0.5); ctx.stroke(); }
    caption(spec, t);
    // stage + slow drift that loops exactly
    const z = 1.015 + 0.015 * Math.sin((t / DUR) * Math.PI * 2);
    const dx = 6 * Math.sin((t / DUR) * Math.PI * 2), dy = 4 * Math.cos((t / DUR) * Math.PI * 2);
    rr(SX, SY, SW, SH, 32); fillStroke(C.stage, C.line);
    ctx.save(); rr(SX, SY, SW, SH, 32); ctx.clip();
    ctx.translate(SX + SW / 2 + dx, SY + SH / 2 + dy); ctx.scale(z, z); ctx.translate(-SW / 2, -SH / 2);
    const leave = out(span(t, EXIT, EXIT + 0.5));
    for (const it of spec.items) {
      if (t < it.a) continue;
      const u = t - it.a; const e = out(c01(u / 0.5));
      const gone = it.d != null ? out(span(t, it.d, it.d + 0.4)) : leave;
      const alpha = e * (1 - gone); if (alpha <= 0.001) continue;
      ctx.save(); ctx.globalAlpha = alpha; ctx.translate(0, (1 - e) * 18 + gone * 12);
      PAINT[it.k](it, t, u); ctx.restore();
    }
    ctx.restore();
  };
  window.draw(0);
}
window.film = film;
