/* Pricing (925 Studios structure): the trial week, then two plans.
   TO CONFIRM: plan names, prices and features. A plan with price: null
   shows "Custom" — never a made-up number. */
export const TRIAL = {
  price: "$1500",
  line: "One week with the founders: a kickoff call, a scoped plan and a first working deliverable.",
  cta: "Start your trial week",
  href: "/start-a-project?plan=trial",
};

export const PLANS = [
  {
    id: "partner",
    title: "Monthly partner",
    tagline: "Ongoing design, AI and engineering for teams that keep shipping.",
    price: null,
    unit: "/mo",
    dark: true,
    features: [
      "A dedicated, founder-led team on your product",
      "We work inside your tools and the process you already run",
      "New features, agents and fixes every week",
      "Priority turnaround on what matters most",
      "Weekly check-ins plus async updates",
      "Pause or stop at the end of any month",
    ],
  },
  {
    id: "sprint",
    title: "Product sprint",
    tagline: "A fixed scope with milestone delivery — an MVP, an AI agent or a website.",
    price: null,
    unit: "from",
    dark: false,
    features: [
      "The founders on your project end to end",
      "A clear scope and written plan before we start",
      "Milestone-based delivery, usually 2–8 weeks",
      "Design, AI and engineering in one team",
      "Progress you can open and click every day",
      "Clean code and docs you own",
    ],
  },
];

export const PLAN_NOTE = "Not the right fit after the trial week? You still walk away with a clear plan.";
