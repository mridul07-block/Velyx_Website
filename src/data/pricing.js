/* Pricing as a three-step ladder: start with the trial week, then a sprint,
   then an ongoing partnership. TO CONFIRM: names, prices and features. A
   tier with price: null shows "Custom quote" — never a made-up number. */
export const TIERS = [
  {
    id: "trial",
    step: "01 · Start here",
    title: "Trial week",
    desc: "One week with the founders, to see how we work before you commit.",
    price: "$1500",
    unit: "one week",
    features: ["A kickoff call with the founders", "A scoped plan for your product", "A first working deliverable"],
    cta: "Start your trial week",
    href: "/start-a-project?plan=trial",
    hero: true,
  },
  {
    id: "sprint",
    step: "02 · Then",
    title: "Product sprint",
    desc: "A fixed scope with milestone delivery — an MVP, an AI agent or a website.",
    price: null,
    features: ["A clear scope and written plan", "Milestone delivery, usually 2–8 weeks", "Design, AI and engineering in one team", "Clean code and docs you own"],
    cta: "Start a project",
    href: "/start-a-project?plan=sprint",
  },
  {
    id: "partner",
    step: "03 · Ongoing",
    title: "Monthly partner",
    desc: "Ongoing design, AI and engineering for teams that keep shipping.",
    price: null,
    features: ["A dedicated, founder-led team", "New features and agents every week", "Weekly check-ins plus async updates", "Pause or stop at the end of any month"],
    cta: "Start a project",
    href: "/start-a-project?plan=partner",
  },
];

export const PLAN_NOTE = "Not the right fit after the trial week? You still walk away with a clear plan.";
