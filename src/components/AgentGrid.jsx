import { Link } from "react-router-dom";
import Tag from "./Tag";

/* The agents we build for a service or an industry: what each one does,
   what it plugs into, and a link that books the intro call about it. */
export default function AgentGrid({ agents }) {
  return (
    <ul className="agents">
      {agents.map((a) => (
        <li key={a.name} className="agent">
          <h3 className="h3">{a.name}</h3>
          <p className="agent__does">{a.does}</p>
          <div className="tags tags--light">
            {a.plugsInto.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>
          <Link to={`/intro-call?agent=${encodeURIComponent(a.name)}`} className="agent__cta">
            Get this agent <span aria-hidden="true">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
