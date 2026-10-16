/* ------------------------------------------------------------------
   TESTIMONIALS + ENGAGEMENTS

   QUOTES      — what each client says about the work. A quote marked
                 `draft` was written for the client from the work we did
                 and is waiting for their OK: it shows on the local
                 preview only. Delete `draft` once they approve the words.
   ENGAGEMENTS — who we work with and what we build for them. No quote,
                 no attributed praise — just the relationship.
------------------------------------------------------------------ */

export const TESTIMONIAL_QUOTES = [
  {
    kind: "quote",
    name: "Prasannata",
    role: "Founder · Overshoot Newsletter",
    avatar: "P",
    photo: "/testimonials/prasannata.webp",
    q: "Velyx Labs built a complete, production-ready web application for us from the ground up. Their engineering velocity and attention to detail transformed our vision into reality.",
    highlights: ["production-ready web application"],
  },
  {
    kind: "quote",
    draft: true,
    name: "Jon Stewart",
    role: "Founder · Lexicon One & YorkScreenPlay",
    avatar: "JS",
    photo: "/testimonials/jon-stewart.webp",
    q: "Velyx Labs built two very different sites for me: a polished home for Lexicon One, and a cinematic stage for YORK with a live auction for the screenplay rights. Each one feels exactly like the brand behind it.",
    highlights: ["a live auction for the screenplay rights"],
  },
  {
    kind: "quote",
    name: "Dr. Parita",
    role: "Founder · Sacred Basil",
    avatar: "DP",
    photo: "/testimonials/dr-parita.webp",
    q: "They didn't just build our complete e-commerce brand; they conducted a deep audit of our business operations. The strategic insights and execution were unparalleled.",
    highlights: ["deep audit of our business operations"],
  },
  {
    kind: "quote",
    name: "Nishant",
    role: "Founder · NarayanKripa",
    avatar: "N",
    photo: "/testimonials/nishant.webp",
    q: "Velyx delivered a robust, AI-integrated web application that immediately scaled our operations. They are true partners who deeply care about our business outcomes.",
    highlights: ["immediately scaled our operations"],
  },
  {
    kind: "quote",
    draft: true,
    name: "Titos Koropoulis",
    role: "Founder · Getlandy AI",
    avatar: "TK",
    photo: "/testimonials/titos-koropoulis.webp",
    q: "Velyx Labs built Landy end to end: the AI agents, the verified profile, the job tracker and the subscription experience. They think like product people and ship like our own team.",
    highlights: ["built Landy end to end"],
  },
  {
    kind: "quote",
    draft: true,
    name: "Rob Vigurrs",
    role: "Co-Founder · Getlandy AI",
    avatar: "RV",
    photo: "/testimonials/rob-vigurrs.webp",
    q: "They took Landy's agents, long-term memory and evidence engine from the whiteboard to production, and kept the quality high with every release. It never felt like working with an outside agency.",
    highlights: ["from the whiteboard to production"],
  },
  {
    kind: "quote",
    draft: true,
    name: "Ikram Ansari",
    role: "Founder · Fitoholix",
    avatar: "IA",
    photo: "/testimonials/ikram-ansari.webp",
    q: "Velyx Labs turned our Total Transformation Protocol into a site that explains it clearly, step by step, and brings people straight to a free consultation on WhatsApp. Fast, sharp and easy to work with.",
    highlights: ["a free consultation on WhatsApp"],
  },
  {
    kind: "quote",
    draft: true,
    name: "Bianca",
    role: "Founder · Scanva & Co",
    avatar: "B",
    photo: "/testimonials/bianca.webp",
    q: "Velyx Labs is the technical team behind our delivery. Whenever a client needs a website, an automation or AI, they build it quickly and to a standard we're proud to put our name on. A genuinely great collaboration.",
    highlights: ["the technical team behind our delivery"],
  },
];

/* What the site shows: every quote on the local preview, and only the
   client-approved ones (no `draft`) in a production build. */
export function quotesFor(isDev) {
  return isDev ? TESTIMONIAL_QUOTES : TESTIMONIAL_QUOTES.filter((q) => !q.draft);
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
