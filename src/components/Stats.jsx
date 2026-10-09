import { STATS } from "../data/stats";

export default function Stats() {
  if (!STATS.length) return null;
  return (
    <section id="numbers" className="section stats">
      <dl className="container stats__grid">
        {STATS.map((s) => (
          <div key={s.label} className="stats__item">
            <dt className="stats__label">{s.label}</dt>
            <dd className="stats__value">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
