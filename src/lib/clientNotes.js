import { PROJECTS } from "../data/projects";
import { ENGAGEMENTS } from "../data/testimonials";

/* What we built for a client, for the clients-grid popup. Built only from
   real project and engagement copy; null when we have nothing to say. */
const TYPE_LABEL = { ai: "AI", saas: "SaaS", web: "Web", mobile: "Mobile" };
const firstSentence = (s) => (s.match(/^.*?[.!?](\s|$)/) || [s])[0].trim();

export function noteFor(name) {
  const project = PROJECTS.find((p) => p.name === name || p.name.startsWith(`${name} `));
  if (project) return { line: project.summary, chips: project.types.map((t) => TYPE_LABEL[t]).filter(Boolean) };
  const work = ENGAGEMENTS.find((e) => e.name === name);
  if (work) return { line: firstSentence(work.d), chips: work.rel ? [work.rel] : [] };
  return null;
}
