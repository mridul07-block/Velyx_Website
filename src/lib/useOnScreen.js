import { useEffect, useRef, useState } from "react";

/* True while the element is on screen; flips back to false when it leaves.
   Used to run looping animations only while visible. Without
   IntersectionObserver support it stays false (static is fine). */
export default function useOnScreen(rootMargin = "0px") {
  const ref = useRef(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || !ref.current) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { rootMargin });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [rootMargin]);

  return [ref, onScreen];
}
