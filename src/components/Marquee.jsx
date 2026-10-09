/* Seamless CSS loop: children render twice; the copy is hidden from
   assistive tech. On wide screens CSS shows a static wrapped row instead. */
export default function Marquee({ label, children }) {
  return (
    <div className="marquee" role="region" aria-label={label}>
      <div className="marquee__track">
        <div className="marquee__group">{children}</div>
        <div className="marquee__group marquee__dup" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
