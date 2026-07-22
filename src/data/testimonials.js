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
  },
  {
    kind: "quote",
    name: "Dr. Parita",
    role: "Founder · Sacred Basil",
    avatar: "DP",
    q: "They didn't just build our complete e-commerce brand; they conducted a deep audit of our business operations. The strategic insights and execution were unparalleled.",
  },
  {
    kind: "quote",
    name: "Nishant",
    role: "Founder · NarayanKripa",
    avatar: "N",
    q: "Velyx delivered a robust, AI-integrated web application that immediately scaled our operations. They are true partners who deeply care about our business outcomes.",
  },
];

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
