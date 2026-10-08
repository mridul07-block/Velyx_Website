import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* On navigation: scroll to the #hash target (waiting for lazy pages to
   render it, up to ~30 frames), otherwise to the top. */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    let tries = 0;
    let frame;
    const find = () => {
      const el = document.getElementById(hash.slice(1));
      if (el) el.scrollIntoView();
      else if (tries++ < 30) frame = requestAnimationFrame(find);
    };
    find();
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}
