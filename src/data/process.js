/* The three-week path (Altair's "trajectory"). TO CONFIRM: step copy. */
export const PROCESS = [
  { n: "01", when: "Day 1", title: "Intro call", copy: "What you're building, who it's for and what done looks like. Thirty minutes to know if we're the right team.", art: "call" },
  { n: "02", when: "Week 1", title: "Trial week", copy: "Scope, plan and a first working deliverable — so you see how we work before you commit to more.", art: "trial" },
  { n: "03", when: "Weeks 2 to 3", title: "Design and build", copy: "Product, AI and code built together, with progress you can open and click every day.", art: "build" },
  { n: "04", when: "Week 3", title: "Launch and handoff", copy: "Live, measured and documented. Clean code you own, and we stay reachable after launch.", art: "launch" },
];

/* The arc: a quadratic curve across the panel, high in the middle. */
const P0 = [0, 210];
const P1 = [664, -10];
const P2 = [1328, 210];
export const ARC_D = `M${P0} Q${P1} ${P2}`;
export const ARC_VIEW = "0 70 1328 150";

export function arcPoint(t) {
  const u = 1 - t;
  return { x: u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0], y: u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1] };
}

export const NODE_T = [0.125, 0.375, 0.625, 0.875];
