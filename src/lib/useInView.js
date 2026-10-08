import { useEffect, useRef, useState } from "react";

/* True once the element has entered the viewport (never flips back).
   Without IntersectionObserver support, content is shown immediately. */
export default function useInView(rootMargin = "0px") {
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
    return () => io.disconnect();
  }, [inView, rootMargin]);

  return [ref, inView];
}
