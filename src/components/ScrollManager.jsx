import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* On navigation: scroll to the #hash target, otherwise to the top.
   Lazy pages may render the target late (slow networks), so poll for
   it every 100ms for up to 5s. Timers, unlike animation frames, keep
   running in background tabs. */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    let tries = 0;
    let timer;
    const find = () => {
      const el = document.getElementById(hash.slice(1));
      if (el) el.scrollIntoView();
      else if (tries++ < 50) timer = setTimeout(find, 100);
    };
    find();
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
