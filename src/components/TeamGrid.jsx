import SectionHeader from "./SectionHeader";
import { TEAM } from "../data/team";

export default function TeamGrid() {
  return (
    <section id="team" className="section">
      <div className="container">
        <SectionHeader align="center" title="Team" />
        <ul className="team">
          {TEAM.map((m) => (
            <li key={m.name} className="team__member">
              <span className="team__avatar" aria-hidden="true">{m.initials}</span>
              {m.linkedin ? (
                <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="team__name">{m.name}</a>
              ) : (
                <span className="team__name">{m.name}</span>
              )}
              <span className="team__role">{m.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
