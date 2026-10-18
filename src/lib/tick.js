/* Bricx-style hover tick: a very short, quiet sine from WebAudio (no audio
   file). Browsers only allow sound after the visitor has interacted with
   the page, so nothing is created until unlock() runs on the first
   pointerdown/keydown. Never plays when muted or under reduced motion. */
const KEY = "velyx:mute";
let ctx = null;
let unlocked = false;
let muted = readMuted();

function readMuted() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function reducedMotion() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* Runs inside the visitor's first pointerdown/keydown, so the context is
   created (and resumed) within a real user gesture. */
export function unlock() {
  unlocked = true;
  if (typeof AudioContext === "undefined") return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") ctx.resume?.().catch(() => {});
  } catch {
    /* audio unavailable: hover still works silently */
  }
}

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = value;
  try {
    localStorage.setItem(KEY, value ? "1" : "0");
  } catch {
    /* storage blocked: the choice lasts for this visit only */
  }
}

export function tick(step = 0) {
  if (!unlocked || muted || reducedMotion() || typeof AudioContext === "undefined") return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") ctx.resume?.().catch(() => {});
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 1100 + step * 40;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.04, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  } catch {
    /* audio unavailable: hover still works silently */
  }
}

/* Kargul-style click: a 40 ms sine falling 1200 → 560 Hz with a 2 ms
   attack, layered with a 12 ms high-passed noise burst for the "tik". */
let noiseBuf = null;
export function click() {
  if (muted || reducedMotion() || typeof AudioContext === "undefined") return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") ctx.resume?.().catch(() => {});
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(560, t + 0.04);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.045, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.07);

    if (!noiseBuf) {
      const len = Math.round(0.012 * ctx.sampleRate);
      noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len / 6));
    }
    const noise = ctx.createBufferSource();
    const hp = ctx.createBiquadFilter();
    const ng = ctx.createGain();
    noise.buffer = noiseBuf;
    hp.type = "highpass";
    hp.frequency.value = 2800;
    ng.gain.value = 0.05;
    noise.connect(hp).connect(ng).connect(ctx.destination);
    noise.start(t);
  } catch {
    /* audio unavailable: clicks still work silently */
  }
}

const CLICKABLE = "a[href], button:not(:disabled), [role='button']:not([aria-disabled='true']), summary";

/* Plays click() when a mouse presses a link or button anywhere on the
   page. The press is itself the gesture that unlocks audio. Touch taps
   stay silent. Returns a cleanup function. */
export function initClickTick() {
  if (typeof document === "undefined") return () => {};
  const onDown = (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    if (!(e.target instanceof Element) || !e.target.closest(CLICKABLE)) return;
    unlock();
    click();
  };
  document.addEventListener("pointerdown", onDown, { passive: true });
  return () => document.removeEventListener("pointerdown", onDown);
}
