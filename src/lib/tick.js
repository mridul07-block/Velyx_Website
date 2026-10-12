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

export function unlock() {
  unlocked = true;
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
