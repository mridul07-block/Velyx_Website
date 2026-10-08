import { CLIENTS } from "../data/clients";

export default function ClientStrip({ label = "Trusted by founders at" }) {
  return (
    <div className="clients">
      <p className="eyebrow">{label}</p>
      <ul className="clients__list">
        {CLIENTS.map((c) => <li key={c}>{c}</li>)}
      </ul>
    </div>
  );
}
