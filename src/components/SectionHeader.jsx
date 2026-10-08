export default function SectionHeader({ eyebrow, title, sub, align = "left", as: Heading = "h2" }) {
  return (
    <header className={`section-header section-header--${align}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Heading className={Heading === "h1" ? "h1" : "h2"}>{title}</Heading>
      {sub && <p className="section-header__sub">{sub}</p>}
    </header>
  );
}
