import { useEffect, useState } from "react";

export default function NavIndex({ sections }) {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight / 3;
      let current = sections[0]?.id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= y) current = s.id;
      }
      setActiveId(current);

      const footer = document.querySelector('footer');
      if (footer) {
        const rect = footer.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
          setHide(true);
        } else {
          setHide(false);
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  return (
    <nav className={`nav__index ${hide ? "hide" : ""}`}>
      {sections.map((s, i) => (
        <a key={s.id} href={`#${s.id}`} className={activeId === s.id ? "active" : ""}>
          <span className="tick" />
          <span>{String(i + 1).padStart(2, "0")} {s.label}</span>
        </a>
      ))}
    </nav>
  );
}
