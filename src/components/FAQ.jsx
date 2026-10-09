export default function FAQ({ items }) {
  return (
    <div className="faq">
      {items.map(({ q, a }, i) => (
        <details key={q} className="faq__item" open={i === 0}>
          <summary className="faq__q">{q}</summary>
          <p className="faq__a">{a}</p>
        </details>
      ))}
    </div>
  );
}
