export default function Section({ id, className = "", alt = false, children }) {
  const classes = ["section", alt && "section--alt", className].filter(Boolean).join(" ");
  return (
    <section id={id} className={classes}>
      <div className="container">{children}</div>
    </section>
  );
}
