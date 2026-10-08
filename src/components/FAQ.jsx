export default function FAQ({ items }) {
  return (
    <div className="faq">
      {items.map(({ q, a }) => (
        <details key={q} className="faq__item">
          <summary className="faq__q">{q}</summary>
          <p className="faq__a">{a}</p>
        </details>
      ))}
    </div>
  );
}
