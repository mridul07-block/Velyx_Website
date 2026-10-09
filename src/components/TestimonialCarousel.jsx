import { useState } from "react";

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* Bolds phrases that already exist in the quote. */
function Highlighted({ text, marks = [] }) {
  if (!marks.length) return text;
  const parts = text.split(new RegExp(`(${marks.map(escape).join("|")})`));
  return parts.map((part, i) => (marks.includes(part) ? <strong key={i}>{part}</strong> : part));
}

export default function TestimonialCarousel({ items }) {
  const [index, setIndex] = useState(0);
  const n = items.length;
  if (!n) return null;
  const t = items[index];
  const prev = () => setIndex((v) => (v - 1 + n) % n);
  const next = () => setIndex((v) => (v + 1) % n);
  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  return (
    <section id="testimonials" className="tpanel">
      <div className="container">
        <div className="tcard" role="group" aria-roledescription="carousel" aria-label="Testimonials" onKeyDown={onKeyDown}>
          <div className="tcard__head">
            <h2 className="h2">Testimonials</h2>
            <div className="tcard__nav">
              <button type="button" aria-label="Previous testimonial" onClick={prev}>←</button>
              <button type="button" aria-label="Next testimonial" onClick={next}>→</button>
            </div>
          </div>
          <figure key={t.name} className="tcard__body" aria-live="polite">
            <span className="tcard__avatar" aria-hidden="true">{t.avatar}</span>
            <div>
              <blockquote className="tcard__quote">“<Highlighted text={t.q} marks={t.highlights} />”</blockquote>
              <figcaption className="tcard__who">
                <span className="tcard__name">{t.name}</span>
                <span className="tcard__role">{t.role}</span>
              </figcaption>
            </div>
          </figure>
          <p className="tcard__count" aria-hidden="true">{index + 1} / {n}</p>
        </div>
      </div>
    </section>
  );
}
