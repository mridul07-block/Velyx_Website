import { Link } from "react-router-dom";
import Section from "../../components/Section";
import SectionHeader from "../../components/SectionHeader";
import FadeIn from "../../components/FadeIn";
import { SERVICES } from "../../data/services";

export default function ServicesGrid() {
  return (
    <Section id="services" alt>
      <SectionHeader eyebrow="Services" title="What we build" sub="Four ways we help founders put AI and software to work." />
      <FadeIn className="grid-2">
        {SERVICES.map((s) => (
          <article key={s.id} className="card service-card">
            <h3 className="h3">{s.title}</h3>
            <p className="muted">{s.summary}</p>
            <ul className="service-card__examples">
              {s.examples.slice(0, 3).map(([title]) => <li key={title}>{title}</li>)}
            </ul>
            <Link to={`/services#${s.id}`} className="service-card__link">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </FadeIn>
    </Section>
  );
}
