import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { getAmbient } from "../audio/ambientEngine";

/* ------------------------------------------------------------------
   VOICE AGENT — a browser-based conversational guide.

   Listens on the mic (Web Speech recognition), understands the intent,
   speaks back (speech synthesis), and drives the site — redirecting to
   a section or running a slow guided tour. No backend, no API keys.
   A text box is provided as a fallback where the mic isn't available.
------------------------------------------------------------------ */

const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

/* Where each intent takes the visitor */
const ACTIONS = {
  projects: { route: "/portfolio", sel: ".pf-group", say: "Sure — taking you to our portfolio. These are real products we've shipped, grouped into web apps, SaaS, and agentic systems. Click any card to go deeper." },
  services: { route: "/services", sel: ".svc-detail", say: "Here are our services — from agentic systems and SaaS builds to website and app development. Each one shows exactly what you get." },
  caseStudies: { route: "/case-studies", sel: ".cs-grid", say: "These are our case studies — eight industries, with the full breakdown of how we help each one leverage AI." },
  testimonials: { route: "/", sel: "#testimonials", say: "Here's what the founders we've worked with have to say, and the products we've built for them." },
  founders: { route: "/", sel: "#founders", say: "Meet the founders — Atharv and Mridul. Velyx Labs is small on purpose, so you always talk to the people building your system." },
  process: { route: "/", sel: "#process", say: "This is how we work: four moves, from the first call to a system that compounds quarter over quarter." },
  ship: { route: "/", sel: "#ship", say: "Here's a look at what we actually ship — production-grade systems, not slideware." },
  contact: { route: "/", sel: "#contact", say: "Let's get you a conversation. You can book a strategy call right here whenever you're ready." },
  home: { route: "/", sel: "#hero", say: "Taking you back to the top." },
};

const PRICING_REPLY = "We scope every engagement to the project rather than a fixed price list, so the best next step is a quick strategy call. Want me to take you there?";
const HELP_REPLY = "I can walk you through our projects, our services, our case studies, the founders, or how we work — or I can give you the full tour. What would you like?";
const GREETING = "Hi, I'm your guide at Velyx Labs. You can ask me to show you our projects, services, case studies, or take the full tour. What would you like to see?";

/* The slow guided tour */
const TOUR = [
  { sel: "#hero", say: "Let's start at the top. Velyx Labs builds agentic systems and AI-native software that give founders compounding leverage." },
  { route: "/", sel: "#work", say: "These are our core practices — the ways we put AI to work for you." },
  { route: "/", sel: "#ship", say: "Here's what we actually ship: real, production-grade systems." },
  { route: "/", sel: "#founders", say: "The founders, Atharv and Mridul. You'll always talk to the people building your system." },
  { route: "/", sel: "#testimonials", say: "The operators we've worked with, and the products we built for them." },
  { route: "/", sel: "#process", say: "And this is how an engagement runs — four moves, start to finish." },
  { route: "/portfolio", sel: ".pf-group", say: "Here's the full portfolio — explore any card to see the details." },
  { route: "/", sel: "#contact", say: "That's the tour. When you're ready, book a strategy call right here. I'll stop here — ask me anything else any time." },
];

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
const has = (t, words) => words.some((w) => t.includes(w));

function detect(raw) {
  const t = norm(raw);
  if (!t.trim()) return "none";
  if (has(t, ["stop", "quiet", "shut", "bye", "goodbye", "close", "exit", "that s all", "thats all", "nothing"])) return "bye";
  if (has(t, ["full tour", "whole tour", "complete tour", "give me a tour", "take a tour", "show me everything", "walk me through", "guide me", "tour"])) return "tour";
  if (has(t, ["project", "portfolio", "work you", "your work", "built", "examples", "showcase"])) return "projects";
  if (has(t, ["service", "what do you do", "what do you build", "offer", "capabilit", "practice"])) return "services";
  if (has(t, ["case stud", "industr", "results", "outcome"])) return "caseStudies";
  if (has(t, ["testimonial", "review", "client", "customer", "who have you", "feedback"])) return "testimonials";
  if (has(t, ["founder", "team", "who are you", "who built", "about you", "atharv", "mridul"])) return "founders";
  if (has(t, ["process", "how do you work", "how it works", "how does it work", "steps", "engagement"])) return "process";
  if (has(t, ["ship", "deliver", "what you make"])) return "ship";
  if (has(t, ["price", "pricing", "cost", "how much", "budget", "quote", "rate"])) return "pricing";
  if (has(t, ["contact", "book", "call", "talk to", "human", "meeting", "schedule", "get in touch", "reach"])) return "contact";
  if (has(t, ["home", "top", "start over", "beginning", "main page"])) return "home";
  if (has(t, ["help", "what can you", "options", "menu", "hi", "hello", "hey"])) return "help";
  return "unknown";
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
function waitFor(sel, timeout = 4500) {
  return new Promise((resolve) => {
    const f = document.querySelector(sel);
    if (f) return resolve(f);
    const t0 = Date.now();
    const id = setInterval(() => {
      const el = document.querySelector(sel);
      if (el || Date.now() - t0 > timeout) { clearInterval(id); resolve(el || null); }
    }, 120);
  });
}

export default function VoiceAgent() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | listening | thinking | speaking
  const [reply, setReply] = useState("");
  const [heard, setHeard] = useState("");
  const [typed, setTyped] = useState("");

  const recogRef = useRef(null);
  const voiceRef = useRef(null);
  const activeRef = useRef(false);
  const wantListenRef = useRef(false);
  const highlightRef = useRef(null);
  const runRef = useRef(0);
  const micSupported = !!SR;

  // Voice selection
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const pick = () => {
      const vs = synth.getVoices();
      voiceRef.current =
        vs.find((v) => /Google (UK|US) English/i.test(v.name)) ||
        vs.find((v) => v.lang === "en-US" && /(Samantha|Aria|Jenny|Female)/i.test(v.name)) ||
        vs.find((v) => v.lang && v.lang.startsWith("en")) || vs[0] || null;
    };
    pick();
    synth.onvoiceschanged = pick;
    return () => { synth.onvoiceschanged = null; };
  }, []);

  // Build recognition once
  useEffect(() => {
    if (!SR) return;
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = true;
    r.continuous = false;
    r.maxAlternatives = 1;

    r.onresult = (e) => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t; else interim += t;
      }
      setHeard(final || interim);
      if (final.trim()) {
        wantListenRef.current = false;
        try { r.stop(); } catch { /* noop */ }
        handle(final);
      }
    };
    r.onend = () => {
      if (activeRef.current && wantListenRef.current) {
        try { r.start(); } catch { /* noop */ }
      }
    };
    r.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        wantListenRef.current = false;
        setStatus("idle");
        setReply("I need microphone access to listen. You can enable it, or just type what you'd like below.");
      }
    };
    recogRef.current = r;
    return () => { try { r.abort(); } catch { /* noop */ } };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearHighlight = () => {
    if (highlightRef.current) { highlightRef.current.classList.remove("tour-focus"); highlightRef.current = null; }
  };

  const startListening = () => {
    if (!recogRef.current || !activeRef.current) return;
    wantListenRef.current = true;
    setHeard("");
    setStatus("listening");
    try { recogRef.current.start(); } catch { /* already running */ }
  };

  const speak = (text) =>
    new Promise((resolve) => {
      setReply(text);
      setStatus("speaking");
      const synth = window.speechSynthesis;
      if (!synth) { wait(Math.min(9000, 1800 + text.length * 42)).then(() => resolve()); return; }
      try { synth.cancel(); } catch { /* noop */ }
      const u = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) u.voice = voiceRef.current;
      u.rate = 1.0;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      synth.speak(u);
    });

  async function goTo(action) {
    const token = runRef.current;
    if (action.route && window.location.pathname !== action.route) {
      navigate(action.route);
      await wait(500);
    }
    if (token !== runRef.current) return;
    const el = action.sel ? await waitFor(action.sel) : null;
    if (token !== runRef.current) return;
    clearHighlight();
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("tour-focus");
      highlightRef.current = el;
    }
  }

  async function runTour() {
    const token = runRef.current;
    for (let i = 0; i < TOUR.length; i++) {
      if (token !== runRef.current) return;
      await goTo(TOUR[i]);
      if (token !== runRef.current) return;
      await wait(500);
      await speak(TOUR[i].say);
    }
    if (token !== runRef.current) return;
    if (activeRef.current) startListening();
  }

  async function handle(input) {
    runRef.current += 1;
    const token = runRef.current;
    setHeard(input);
    setStatus("thinking");
    wantListenRef.current = false;

    const intent = detect(input);

    if (intent === "bye") { await speak("Got it — closing the guide. Come back any time."); closeAgent(); return; }
    if (intent === "tour") { await speak("Great — let me walk you through the whole thing. Sit back."); if (token === runRef.current) runTour(); return; }
    if (intent === "pricing") { await goTo(ACTIONS.contact); await speak(PRICING_REPLY); if (token === runRef.current && activeRef.current) startListening(); return; }
    if (intent === "help" || intent === "unknown" || intent === "none") {
      await speak(intent === "unknown" ? "I didn't quite catch that. " + HELP_REPLY : HELP_REPLY);
      if (token === runRef.current && activeRef.current) startListening();
      return;
    }
    const action = ACTIONS[intent];
    await goTo(action);
    if (token !== runRef.current) return;
    await speak(action.say);
    if (token === runRef.current && activeRef.current) startListening();
  }

  const openAgent = async () => {
    setOpen(true);
    activeRef.current = true;
    setReply("");
    setHeard("");
    try { getAmbient()?.stop(); } catch { /* noop */ }
    // iOS unlock inside the gesture
    try { window.speechSynthesis?.speak(new SpeechSynthesisUtterance(" ")); } catch { /* noop */ }
    await speak(GREETING);
    if (activeRef.current) startListening();
  };

  const closeAgent = (resumeAudio = true) => {
    runRef.current += 1;
    activeRef.current = false;
    wantListenRef.current = false;
    clearHighlight();
    try { window.speechSynthesis?.cancel(); } catch { /* noop */ }
    try { recogRef.current?.abort(); } catch { /* noop */ }
    setOpen(false);
    setStatus("idle");
    if (resumeAudio && localStorage.getItem("velyx-audio") !== "off") {
      try { getAmbient()?.start(); } catch { /* noop */ }
    }
  };

  const micButton = () => {
    if (status === "listening") {
      wantListenRef.current = false;
      try { recogRef.current?.stop(); } catch { /* noop */ }
      setStatus("idle");
    } else {
      try { window.speechSynthesis?.cancel(); } catch { /* noop */ }
      startListening();
    }
  };

  const submitTyped = (e) => {
    e.preventDefault();
    const v = typed.trim();
    if (!v) return;
    setTyped("");
    handle(v);
  };

  useEffect(() => () => { try { window.speechSynthesis?.cancel(); } catch { /* noop */ } clearHighlight(); }, []);

  const statusLabel = { idle: "Tap the mic to talk", listening: "Listening…", thinking: "Thinking…", speaking: "Speaking…" }[status];

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            className="va-fab"
            onClick={openAgent}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Talk to the AI guide"
          >
            <span className="va-fab__orb" aria-hidden="true"><i /><i /><i /><i /></span>
            Talk to guide
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="tour-scrim" onClick={() => closeAgent()}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div
              className="va-panel"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="va-panel__top">
                <span className="va-panel__badge">
                  <span className={`va-panel__pip ${status === "speaking" ? "spk" : status === "listening" ? "lis" : ""}`} />
                  VLX · AI GUIDE
                </span>
                <button className="va-panel__x" onClick={() => closeAgent()} aria-label="Close">✕</button>
              </div>

              <div className={`va-orb va-orb--${status}`} aria-hidden="true">
                <span className="ring" /><span className="ring" /><span className="core" />
              </div>

              <div className="va-panel__reply">{reply || "…"}</div>
              {heard && <div className="va-panel__heard">“{heard}”</div>}
              <div className="va-panel__status">{statusLabel}</div>

              <div className="va-panel__actions">
                {micSupported ? (
                  <button className={`va-mic ${status === "listening" ? "is-live" : ""}`} onClick={micButton}>
                    {status === "listening" ? "◼ Stop" : "🎙 Speak"}
                  </button>
                ) : (
                  <span className="va-panel__nomic">Mic isn't supported in this browser — type below.</span>
                )}
              </div>

              <form className="va-panel__type" onSubmit={submitTyped}>
                <input
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  placeholder="…or type: projects, services, full tour"
                  aria-label="Type what you want to see"
                />
                <button type="submit" aria-label="Send">↵</button>
              </form>

              <div className="va-panel__chips">
                {["Projects", "Services", "Case studies", "Full tour", "Book a call"].map((c) => (
                  <button key={c} onClick={() => handle(c)}>{c}</button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
