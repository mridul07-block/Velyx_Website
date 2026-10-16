/* Seamless CSS loop: children render twice; the copy is hidden from
   assistive tech and from the keyboard. On wide screens CSS shows a
   static wrapped row instead. */
export default function Marquee({ label, className = "", children }) {
  return (
    <div className={`marquee ${className}`.trim()} role="region" aria-label={label}>
      <div className="marquee__track">
        <div className="marquee__group">{children}</div>
        <div className="marquee__group marquee__dup" aria-hidden="true" inert>{children}</div>
      </div>
    </div>
  );
}
