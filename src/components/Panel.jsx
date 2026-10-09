export default function Panel({ id, className = "", children }) {
  return (
    <section id={id} className={["panel", className].filter(Boolean).join(" ")}>
      <div className="container">{children}</div>
    </section>
  );
}
