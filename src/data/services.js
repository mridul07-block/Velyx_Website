/* The five Velyx services, shown in Kargul's 3 + 2 card layout.
   TO CONFIRM: tag lists must match the stack Velyx actually uses. */
export const SERVICES = [
  {
    id: "agents",
    title: "Agentic AI automation",
    copy: "AI agents that answer, qualify, follow up and file — wired into your CRM, inbox and WhatsApp, with human approval where it matters.",
    tags: ["OpenAI", "Claude", "LangGraph", "n8n", "CRM", "Evals"],
    art: "agents",
  },
  {
    id: "saas",
    title: "AI SaaS & MVPs",
    copy: "From idea to paying users. Production apps with auth, billing, admin and AI features built on your data — made to grow, not to be rebuilt.",
    tags: ["Next.js", "React", "Node.js", "Supabase", "Postgres", "Stripe"],
    art: "saas",
  },
  {
    id: "whatsapp",
    title: "WhatsApp automation + CRM",
    copy: "Bookings, reminders, lead follow-up and re-engagement running on WhatsApp, with a simple CRM so your team sees every conversation.",
    tags: ["WhatsApp API", "CRM", "Webhooks", "Dashboards"],
    art: "whatsapp",
  },
  {
    id: "web",
    title: "Websites & landing pages",
    copy: "Fast, conversion-focused websites and landing pages with custom visuals and interactions — built to turn visitors into booked calls.",
    tags: ["Figma", "React", "Next.js", "Framer", "SEO", "Analytics"],
    art: "web",
    wide: true,
  },
  {
    id: "mobile",
    title: "Mobile apps",
    copy: "Cross-platform iOS and Android apps from one codebase — designed, built and shipped to the stores.",
    tags: ["React Native", "Expo", "Firebase", "App Store"],
    art: "mobile",
    wide: true,
  },
];
