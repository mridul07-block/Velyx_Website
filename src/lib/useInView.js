import { useEffect, useRef, useState } from "react";

/* True once the element has entered the viewport (never flips back).
   Without IntersectionObserver support, content is shown immediately.
   `fallbackMs` (optional) forces it true after that delay, for observers
   that never report (broken webviews, headless renderers). */
export default function useInView(rootMargin = "0px", fallbackMs) {
  const ref = useRef(null);
  const [inView, setInView] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    if (inView || !ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(ref.current);
    const timer = fallbackMs ? setTimeout(() => setInView(true), fallbackMs) : undefined;
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [inView, rootMargin, fallbackMs]);

  return [ref, inView];
}
