import { useEffect, useState } from "react";
import CalButton from "./CalButton";

/* Mobile-only bottom booking bar (hidden ≥900px via CSS). */
export default function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;
  return (
    <div className="sticky-cta">
      <CalButton block />
    </div>
  );
}
