import Section from "../../components/Section";
import SectionHeader from "../../components/SectionHeader";
import FadeIn from "../../components/FadeIn";
import { TESTIMONIAL_QUOTES } from "../../data/testimonials";

export default function Testimonials() {
  return (
    <Section id="testimonials" alt>
      <SectionHeader eyebrow="Testimonials" title="What founders say" />
      <FadeIn className="grid-3">
        {TESTIMONIAL_QUOTES.map((t) => (
          <figure key={t.name} className="card quote">
            <blockquote className="quote__text">“{t.q}”</blockquote>
            <figcaption className="quote__who">
              <span className="quote__avatar" aria-hidden="true">{t.avatar}</span>
              <span>
                <span className="quote__name">{t.name}</span>
                <span className="quote__role">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </FadeIn>
    </Section>
  );
}
