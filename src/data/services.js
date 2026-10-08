/* The four services. `id` is the anchor on /services (#agents …). */
export const SERVICES = [
  {
    id: "agents",
    title: "Agentic automation",
    summary: "AI agents that answer, qualify, follow up and file — the repetitive work your team shouldn't be doing.",
    description:
      "We map the work that repeats every day and build AI agents that do it inside the tools you already use. People stay in control where it matters, with approval steps for anything sensitive.",
    deliverables: [
      "A map of the process we automate",
      "Agents connected to your CRM, email, WhatsApp and docs",
      "Human approval steps where it matters",
      "Monitoring and handover documentation",
    ],
    examples: [
      ["Inbound qualification agent", "Only the conversations worth your hour."],
      ["Outbound research & outreach", "SDR-team leverage, without the SDR team."],
      ["Customer support copilot", "Support that scales as fast as you sign."],
      ["Finance & back-office ops agent", "Clear the work that eats your week."],
    ],
  },
  {
    id: "saas",
    title: "AI SaaS & MVPs",
    summary: "From idea to a production product — auth, billing, AI features and analytics included.",
    description:
      "We take your product from idea to paying users. You get a real, production-ready app built to grow, not a prototype that has to be rebuilt later.",
    deliverables: [
      "Product scoping and UX design",
      "Production app with auth, billing and admin",
      "AI features built on your data",
      "Deployment, analytics and handover",
    ],
    examples: [
      ["AI-native vertical SaaS", "Zero to paying customers, built for year three."],
      ["“Chat with your data” product", "Your knowledge, turned into an answer engine."],
      ["Embedded AI copilot", "Drop an AI copilot into the product you already have."],
      ["Document intelligence platform", "Turn documents into structured, trusted data."],
    ],
  },
  {
    id: "whatsapp",
    title: "WhatsApp automation + CRM",
    summary: "Bookings, reminders, lead follow-up and re-engagement, running on WhatsApp.",
    description:
      "Your customers already live on WhatsApp. We automate the conversations that win and keep them — bookings, reminders, follow-ups — with a simple CRM so your team sees every lead.",
    deliverables: [
      "WhatsApp Business API setup",
      "Automated booking, reminder and follow-up flows",
      "CRM with lead and conversation history",
      "Team training and handover",
    ],
    examples: [
      ["WhatsApp CRM for clinics", "Fewer no-shows, fuller chairs."],
      ["WhatsApp CRM for real estate", "Every lead answered in seconds."],
      ["Lead nurture & re-engagement", "Bring past enquiries back automatically."],
    ],
  },
  {
    id: "web",
    title: "Websites & mobile apps",
    summary: "Fast, modern websites and cross-platform apps that look like the company you're becoming.",
    description:
      "We design and build websites and apps that load fast, read clearly and turn visitors into customers — from marketing sites to full custom platforms.",
    deliverables: [
      "UX and visual design",
      "Responsive build, fast and SEO-ready",
      "Analytics and forms connected",
      "Launch and ongoing support",
    ],
    examples: [
      ["Marketing websites", "Clear, fast sites built to convert."],
      ["Custom web applications", "Portals, dashboards and platforms around your workflow."],
      ["Cross-platform mobile apps", "One codebase for iOS and Android."],
    ],
  },
];
