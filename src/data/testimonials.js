/* ------------------------------------------------------------------
   TESTIMONIALS + ENGAGEMENTS

   QUOTES      — words a client actually said. Never write one of these
                 on a client's behalf; leave the list short and true.
   ENGAGEMENTS — who we work with and what we build for them. No quote,
                 no attributed praise — just the relationship.
------------------------------------------------------------------ */

export const TESTIMONIAL_QUOTES = [
  {
    kind: "quote",
    name: "Prasannata",
    role: "Founder · Overshoot Newsletter",
    avatar: "P",
    q: "Velyx Labs built a complete, production-ready web application for us from the ground up. Their engineering velocity and attention to detail transformed our vision into reality.",
    highlights: ["production-ready web application"],
  },
  {
    kind: "quote",
    name: "Dr. Parita",
    role: "Founder · Sacred Basil",
    avatar: "DP",
    q: "They didn't just build our complete e-commerce brand; they conducted a deep audit of our business operations. The strategic insights and execution were unparalleled.",
    highlights: ["deep audit of our business operations"],
  },
  {
    kind: "quote",
    name: "Nishant",
    role: "Founder · NarayanKripa",
    avatar: "N",
    q: "Velyx delivered a robust, AI-integrated web application that immediately scaled our operations. They are true partners who deeply care about our business outcomes.",
    highlights: ["immediately scaled our operations"],
  },
];

/* DUMMY — seven placeholder quotes so the carousel shows ten cards on the
   local preview. Fictional people at fictional companies; they are NOT
   client words. quotesFor(false) — every production build — leaves them
   out. TO CONFIRM: replace with real quotes, then delete this list. */
export const DUMMY_QUOTES = !import.meta.env.DEV ? [] : [
  { name: "Sample Client", role: "Founder · Acme", avatar: "SC", q: "Placeholder quote — the founders were in every call and shipped what they promised, on time." },
  { name: "Sample Client", role: "CEO · Globex", avatar: "SC", q: "Placeholder quote — clear plan in week one and a working product by week three." },
  { name: "Sample Client", role: "Founder · Initech", avatar: "SC", q: "Placeholder quote — our WhatsApp follow-ups now run themselves." },
  { name: "Sample Client", role: "COO · Hooli", avatar: "SC", q: "Placeholder quote — one team for design, AI and code made everything faster." },
  { name: "Sample Client", role: "Founder · Vandelay", avatar: "SC", q: "Placeholder quote — honest about scope, fast to iterate, easy to work with." },
  { name: "Sample Client", role: "Head of Product · Wonka", avatar: "SC", q: "Placeholder quote — the AI agent handles our first replies around the clock." },
  { name: "Sample Client", role: "Founder · Umbrella", avatar: "SC", q: "Placeholder quote — we'd hire them again for the next product." },
].map((q, i) => ({ kind: "quote", dummy: true, highlights: [], ...q, name: `${q.name} ${i + 1}` }));

/* What the carousel shows: the real quotes, plus the dummies only on a
   development build (the local preview). */
export function quotesFor(isDev) {
  return isDev ? [...TESTIMONIAL_QUOTES, ...DUMMY_QUOTES] : TESTIMONIAL_QUOTES;
}

export const ENGAGEMENTS = [
  {
    kind: "work",
    name: "Getlandy AI",
    meta: "Netherlands · SaaS",
    avatar: "GL",
    d: "An AI-powered personal brand studio and career operating system. Landy helps high-signal professionals design career strategy, hold a credible online presence, and build long-term career leverage — beyond job searching.",
    rel: "Built by Velyx Labs",
    metric: "$10",
    note: "per month subscription",
  },
  {
    kind: "work",
    name: "Orange Production",
    meta: "Bangalore · Marketing",
    avatar: "OP",
    d: "A Bangalore-based marketing agency. We work with them in collaboration with Mr Ikram.",
    rel: "Collaboration",
  },
  {
    kind: "work",
    name: "Scanva & Co",
    meta: "Marketing agency",
    avatar: "SC",
    d: "A marketing agency we partner with, where Velyx Labs provides the technical support behind their delivery.",
    rel: "Technical partner",
  },
  {
    kind: "work",
    name: "SparklingTimes",
    meta: "Custom web application",
    avatar: "ST",
    d: "A custom web application built for Elise Q Rao.",
    rel: "Built by Velyx Labs",
  },
  {
    kind: "work",
    name: "YorkScreenPlay",
    meta: "Online auction platform",
    avatar: "YS",
    d: "An online auction and bidding platform, built for Jon Stewart.",
    rel: "Built by Velyx Labs",
  },
];

export const RING_ITEMS = [...TESTIMONIAL_QUOTES, ...ENGAGEMENTS];
