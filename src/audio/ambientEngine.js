/* ------------------------------------------------------------------
   AMBIENT ENGINE — a smooth generative groove synthesised in-browser.

   No audio file. A lush progression (Fmaj7 · Dm7 · B♭maj7 · C) on a
   detuned pad, a warm pentatonic pluck lead through delay + reverb, a
   round sub bass, and a soft swung beat with a reverbed backbeat rim.
   A light sidechain lets the music "breathe" under each kick.

   Module-level singleton so it persists across route changes; the
   master gain fades it in and out.
------------------------------------------------------------------ */

let engine = null;

const BPM = 82;
const SIXTEENTH = 60 / BPM / 4;
const SWING = SIXTEENTH * 0.2; // light shuffle on odd 16ths

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Four bars, one chord each (MIDI)
const PROG = [
  { chord: [53, 57, 60, 64], bass: 41 }, // Fmaj7
  { chord: [50, 53, 57, 60], bass: 38 }, // Dm7
  { chord: [46, 53, 57, 62], bass: 34 }, // B♭maj7
  { chord: [48, 52, 55, 58], bass: 36 }, // C7
];

// F-major pentatonic lead pool (F G A C D, up high) + a flowing motif
const LEAD = [65, 67, 69, 72, 74];
const MOTIF = [0, 2, 1, 3, 2, 4, 3, 1];

function build() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();

  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.knee.value = 26;
  comp.ratio.value = 3;
  comp.attack.value = 0.006;
  comp.release.value = 0.22;
  comp.connect(master);

  // Sidechain bus — the music ducks under each kick
  const music = ctx.createGain();
  music.gain.value = 1;
  music.connect(comp);

  // Reverb send
  const reverb = ctx.createConvolver();
  reverb.buffer = makeIR(ctx, 2.4, 2.4);
  const reverbGain = ctx.createGain();
  reverbGain.gain.value = 0.85;
  reverb.connect(reverbGain);
  reverbGain.connect(comp);

  // Ping delay for the lead
  const delay = ctx.createDelay(1.0);
  delay.delayTime.value = SIXTEENTH * 3;
  const fb = ctx.createGain();
  fb.gain.value = 0.34;
  const delayWet = ctx.createGain();
  delayWet.gain.value = 0.3;
  delay.connect(fb);
  fb.connect(delay);
  delay.connect(delayWet);
  delayWet.connect(comp);

  const padBus = busGain(ctx, 0.5, music, reverb);
  const leadBus = busGain(ctx, 0.32, music, reverb, delay);
  const bassBus = busGain(ctx, 0.55, music);
  const drumBus = busGain(ctx, 0.5, comp); // drums bypass sidechain

  let timer = null;
  let step = 0;
  let nextTime = 0;

  function duck(t) {
    music.gain.cancelScheduledValues(t);
    music.gain.setValueAtTime(music.gain.value, t);
    music.gain.linearRampToValueAtTime(0.68, t + 0.03);
    music.gain.linearRampToValueAtTime(1, t + 0.3);
  }

  function schedule(s, t) {
    const bar = Math.floor(s / 16) % PROG.length;
    const inBar = s % 16;
    const { chord, bass } = PROG[bar];

    if (inBar === 0) playPad(ctx, padBus, chord, t, SIXTEENTH * 16);

    // Sub bass — root on 1, fifth pickup on the "and of 3"
    if (inBar === 0) playBass(ctx, bassBus, mtof(bass), t, SIXTEENTH * 6);
    if (inBar === 11) playBass(ctx, bassBus, mtof(bass + 7), t, SIXTEENTH * 3);

    // Smooth beat
    if (inBar === 0 || inBar === 10) { playKick(ctx, drumBus, t); duck(t); }
    if (inBar === 4 || inBar === 12) playRim(ctx, drumBus, reverb, t); // backbeat
    if (inBar % 2 === 0) playHat(ctx, drumBus, t, inBar % 4 === 2 ? 1 : 0.5);

    // Warm pluck lead on eighth notes
    if (inBar % 2 === 0) {
      const i = (Math.floor(s / 2)) % MOTIF.length;
      const note = LEAD[MOTIF[i]];
      playPluck(ctx, leadBus, mtof(note), t, i % 4 === 3 ? 0.6 : 0.9);
    }
  }

  function loop() {
    while (nextTime < ctx.currentTime + 0.12) {
      const swing = step % 2 === 1 ? SWING : 0;
      schedule(step, nextTime + swing);
      nextTime += SIXTEENTH;
      step = (step + 1) % (16 * PROG.length);
    }
    timer = setTimeout(loop, 25);
  }

  return {
    get state() {
      return ctx.state;
    },
    async start(target = 0.26) {
      // Build the scheduler + schedule the fade-in FIRST, so the graph is
      // ready even while the context is still suspended. resume() then only
      // unmutes it — never blocks the setup (that was the silent-audio bug).
      if (!timer) {
        nextTime = ctx.currentTime + 0.08;
        loop();
      }
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(target, now + 1.4);
      if (ctx.state !== "running") {
        try {
          await ctx.resume();
        } catch {
          /* blocked until a user gesture */
        }
      }
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

function makeIR(ctx, seconds, decay) {
  const rate = ctx.sampleRate;
  const len = Math.floor(seconds * rate);
  const buf = ctx.createBuffer(2, len, rate);
  for (let c = 0; c < 2; c++) {
    const ch = buf.getChannelData(c);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

function playPad(ctx, out, notes, t, dur) {
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(680, t);
  filter.frequency.linearRampToValueAtTime(1500, t + dur * 0.5);
  filter.frequency.linearRampToValueAtTime(560, t + dur);
  filter.Q.value = 0.6;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.11, t + 0.7);
  env.gain.setValueAtTime(0.11, t + dur - 0.8);
  env.gain.linearRampToValueAtTime(0, t + dur);
  filter.connect(env);
  env.connect(out);
  notes.forEach((m) => {
    [-7, 7].forEach((det) => {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = mtof(m);
      o.detune.value = det;
      const g = ctx.createGain();
      g.gain.value = 0.085;
      o.connect(g);
      g.connect(filter);
      o.start(t);
      o.stop(t + dur + 0.1);
    });
  });
}

function playBass(ctx, out, freq, t, dur) {
  const o = ctx.createOscillator();
  o.type = "triangle";
  o.frequency.value = freq;
  const o2 = ctx.createOscillator();
  o2.type = "sine";
  o2.frequency.value = freq;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 300;
  const env = ctx.createGain();
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

function playPluck(ctx, out, freq, t, vel = 1) {
  const o = ctx.createOscillator();
  o.type = "sawtooth";
  o.frequency.value = freq;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(4200, t);
  lp.frequency.exponentialRampToValueAtTime(900, t + 0.4);
  lp.Q.value = 1.2;
  const env = ctx.createGain();
  const dur = 0.9;
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.16 * vel, t + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  o.connect(lp);
  lp.connect(env);
  env.connect(out);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function playKick(ctx, out, t) {
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(125, t);
  o.frequency.exponentialRampToValueAtTime(44, t + 0.14);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.8, t + 0.006);
  env.gain.exponentialRampToValueAtTime(0.0008, t + 0.4);
  o.connect(env);
  env.connect(out);
  o.start(t);
  o.stop(t + 0.44);
}

function playRim(ctx, out, reverb, t) {
  // short noise crack + tonal body, sent to reverb for a smooth backbeat
  const len = Math.floor(ctx.sampleRate * 0.05);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1900;
  bp.Q.value = 1.1;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.22, t + 0.004);
  env.gain.exponentialRampToValueAtTime(0.0006, t + 0.09);
  src.connect(bp);
  bp.connect(env);
  env.connect(out);
  env.connect(reverb);
  src.start(t);
  src.stop(t + 0.1);
}

function playHat(ctx, out, t, vel = 1) {
  const len = Math.floor(ctx.sampleRate * 0.05);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 7500;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.05 * vel, t + 0.004);
  env.gain.exponentialRampToValueAtTime(0.0005, t + 0.04);
  src.connect(hp);
  hp.connect(env);
  env.connect(out);
  src.start(t);
  src.stop(t + 0.06);
}

export function getAmbient() {
  if (typeof window === "undefined") return null;
  if (!engine) engine = build();
  return engine;
}
