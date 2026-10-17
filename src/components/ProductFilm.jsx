import { useEffect, useRef } from "react";
import useOnScreen from "../lib/useOnScreen";
import useReducedMotion from "../lib/useReducedMotion";

/* A muted product film that loads and plays only while on screen;
   with reduced motion it stays on its poster frame. */
export default function ProductFilm({ project, className = "film", preload = "none" }) {
  const [ref, onScreen] = useOnScreen("200px");
  const reduced = useReducedMotion();
  const started = useRef(false);
  const play = onScreen && !reduced;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (play) {
      started.current = true;
      v.play()?.catch?.(() => {});
    } else if (started.current) {
      v.pause();
    }
  }, [play, ref]);

  const { src, poster, w, h } = project.video;
  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      width={w}
      height={h}
      muted
      loop
      playsInline
      preload={preload}
      aria-label={`${project.name} — product film`}
    />
  );
}
