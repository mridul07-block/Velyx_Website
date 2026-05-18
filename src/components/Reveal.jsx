import { useEffect, useRef } from "react";

export default function Reveal({ children, delay = 0, as: Tag = "div", className = "", ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.setAttribute("data-pending", "1");
    let done = false;
    const check = () => {
      if (done) return;
      const r = el.getBoundingClientRect();
      const triggerLine = window.innerHeight * 0.88;
      if (r.top < triggerLine) {
        done = true;
        window.removeEventListener("scroll", check);
        setTimeout(() => {
          el.removeAttribute("data-pending");
          el.classList.add("in");
        }, delay);
      }
    };
    requestAnimationFrame(() => requestAnimationFrame(check));
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [delay]);
  return (
    <Tag ref={ref} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
