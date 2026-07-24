/* ------------------------------------------------------------------
   AMBIENT ENGINE — a generative lo-fi loop synthesised in the browser.

   No audio file. A warm four-chord progression (Fmaj7 · Em7 · Dm7 ·
   Cmaj7) on a soft pad, a gentle bell arpeggio through delay + reverb,
   a rounded bass, and a subtle kick + shaker beat — sequenced on the
   Web Audio clock. Module-level singleton so it persists across route
   changes; the master gain fades it in and out.
------------------------------------------------------------------ */

let engine = null;

const BPM = 72;
const SIXTEENTH = 60 / BPM / 4; // seconds per 16th note

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Four bars, one chord each (MIDI notes)
const PROG = [
  { chord: [53, 57, 60, 64], bass: 41 }, // Fmaj7
  { chord: [52, 55, 59, 62], bass: 40 }, // Em7
  { chord: [50, 53, 57, 60], bass: 38 }, // Dm7
  { chord: [48, 52, 55, 59], bass: 36 }, // Cmaj7
];

function build() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();

  // master (fade) → destination
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // glue compressor so transients never clip
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.knee.value = 24;
  comp.ratio.value = 3;
  comp.attack.value = 0.006;
  comp.release.value = 0.25;
  comp.connect(master);

  // reverb send (synthesised impulse) → compressor
  const reverb = ctx.createConvolver();
  reverb.buffer = makeIR(ctx, 2.2, 2.6);
  const reverbGain = ctx.createGain();
  reverbGain.gain.value = 0.9;
  reverb.connect(reverbGain);
  reverbGain.connect(comp);

  // ping delay for the arp → compressor
  const delay = ctx.createDelay(1.0);
  delay.delayTime.value = SIXTEENTH * 3;
  const fb = ctx.createGain();
  fb.gain.value = 0.32;
  const delayWet = ctx.createGain();
  delayWet.gain.value = 0.28;
  delay.connect(fb);
  fb.connect(delay);
  delay.connect(delayWet);
  delayWet.connect(comp);

  // instrument buses
  const padBus = busGain(ctx, 0.5, comp, reverb);
  const arpBus = busGain(ctx, 0.34, comp, reverb, delay);
  const bassBus = busGain(ctx, 0.55, comp);
  const drumBus = busGain(ctx, 0.42, comp);

  let timer = null;
  let step = 0;
  let nextTime = 0;

  function schedule(s, t) {
    const bar = Math.floor(s / 16) % PROG.length;
    const inBar = s % 16;
    const { chord, bass } = PROG[bar];

    // Pad — new chord at the top of each bar
    if (inBar === 0) playPad(ctx, padBus, chord, t, SIXTEENTH * 16);

    // Bass — root on beats 1 and 3
    if (inBar === 0 || inBar === 8) playBass(ctx, bassBus, mtof(bass), t);

    // Kick — beats 1 and 3
    if (inBar === 0 || inBar === 8) playKick(ctx, drumBus, t);

    // Shaker — offbeat eighths, soft
    if (inBar % 4 === 2) playShaker(ctx, drumBus, t, 0.5);
    if (inBar % 4 === 0 && inBar !== 0) playShaker(ctx, drumBus, t, 0.28);

    // Arp — gentle bell on eighth notes, climbing the chord
    if (inBar % 2 === 0) {
      const eighth = inBar / 2; // 0..7
      const note = chord[eighth % chord.length] + 12; // up an octave
      playBell(ctx, arpBus, mtof(note), t, eighth % 4 === 3 ? 0.55 : 0.85);
    }
  }

  function loop() {
    while (nextTime < ctx.currentTime + 0.12) {
      schedule(step, nextTime);
      nextTime += SIXTEENTH;
      step = (step + 1) % (16 * PROG.length);
    }
    timer = setTimeout(loop, 25);
  }

  return {
    get state() {
      return ctx.state;
    },
    async start(target = 0.24) {
      if (ctx.state === "suspended") {
        try {
          await ctx.resume();
        } catch {
          /* blocked until a user gesture */
        }
      }
      if (!timer) {
        nextTime = ctx.currentTime + 0.08;
        loop();
      }
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(target, now + 1.4);
    },
    stop() {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 0.6);
      setTimeout(() => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      }, 700);
    },
  };
}

/* ---------- helpers ---------- */

function busGain(ctx, value, ...dests) {
  const g = ctx.createGain();
  g.gain.value = value;
  dests.forEach((d) => g.connect(d));
  return g;
}

// Simple decaying-noise impulse response for the reverb
function makeIR(ctx, seconds, decay) {
  const rate = ctx.sampleRate;
  const len = Math.floor(seconds * rate);
  const buf = ctx.createBuffer(2, len, rate);
  for (let c = 0; c < 2; c++) {
    const ch = buf.getChannelData(c);
    for (let i = 0; i < len; i++) {
      ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buf;
}

function playPad(ctx, out, notes, t, dur) {
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(700, t);
  filter.frequency.linearRampToValueAtTime(1400, t + dur * 0.5);
  filter.frequency.linearRampToValueAtTime(600, t + dur);
  filter.Q.value = 0.6;

  const env = ctx.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.12, t + 0.6); // slow swell
  env.gain.setValueAtTime(0.12, t + dur - 0.7);
  env.gain.linearRampToValueAtTime(0, t + dur);
  filter.connect(env);
  env.connect(out);

  notes.forEach((m) => {
    [-6, 6].forEach((det) => {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = mtof(m);
      o.detune.value = det;
      const g = ctx.createGain();
      g.gain.value = 0.09;
      o.connect(g);
      g.connect(filter);
      o.start(t);
      o.stop(t + dur + 0.1);
    });
  });
}

function playBass(ctx, out, freq, t) {
  const o = ctx.createOscillator();
  o.type = "triangle";
  o.frequency.value = freq;
  const o2 = ctx.createOscillator();
  o2.type = "sine";
  o2.frequency.value = freq;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 320;
  const env = ctx.createGain();
  const dur = SIXTEENTH * 7;
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.5, t + 0.03);
  env.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  o.connect(lp);
  o2.connect(lp);
  lp.connect(env);
  env.connect(out);
  o.start(t);
  o2.start(t);
  o.stop(t + dur + 0.05);
  o2.stop(t + dur + 0.05);
}

function playBell(ctx, out, freq, t, vel = 1) {
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.value = freq;
  const o2 = ctx.createOscillator();
  o2.type = "triangle";
  o2.frequency.value = freq * 2.01;
  const h = ctx.createGain();
  h.gain.value = 0.18;
  o2.connect(h);
  const env = ctx.createGain();
  const dur = 1.1;
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.16 * vel, t + 0.012);
  env.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  o.connect(env);
  h.connect(env);
  env.connect(out);
  o.start(t);
  o2.start(t);
  o.stop(t + dur + 0.05);
  o2.stop(t + dur + 0.05);
}

function playKick(ctx, out, t) {
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(140, t);
  o.frequency.exponentialRampToValueAtTime(46, t + 0.13);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.85, t + 0.006);
  env.gain.exponentialRampToValueAtTime(0.0008, t + 0.32);
  o.connect(env);
  env.connect(out);
  o.start(t);
  o.stop(t + 0.36);
}

function playShaker(ctx, out, t, vel = 1) {
  const len = Math.floor(ctx.sampleRate * 0.06);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 6500;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.09 * vel, t + 0.005);
  env.gain.exponentialRampToValueAtTime(0.0006, t + 0.05);
  src.connect(hp);
  hp.connect(env);
  env.connect(out);
  src.start(t);
  src.stop(t + 0.07);
}

export function getAmbient() {
  if (typeof window === "undefined") return null;
  if (!engine) engine = build();
  return engine;
}
