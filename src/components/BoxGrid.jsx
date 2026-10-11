import { useEffect, useRef } from "react";
import { CELL, GLOWS } from "../lib/boxGrid";

/* The X banner's boxed background: a fixed field of dark rounded tiles, a
   few glowing orange and slowly breathing, and the tiles brightening a
   little around the cursor. Pure CSS animation; reduced motion holds the
   glows at rest. */
export default function BoxGrid() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    let frame = 0;
    const move = (e) => {
      if (e.pointerType === "touch") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--cx", `${e.clientX}px`);
        el.style.setProperty("--cy", `${e.clientY}px`);
        el.classList.add("is-hot");
      });
    };
    const leave = () => el.classList.remove("is-hot");
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className="boxgrid" aria-hidden="true">
      <div className="boxgrid__hot" />
      {GLOWS.map((g, i) => (
        <span
          key={i}
          className="boxgrid__glow"
          style={{ left: `${g.col * CELL}px`, top: `${g.row * CELL}px`, "--a": g.a, animationDuration: `${g.dur}s`, animationDelay: `${g.delay}s` }}
        />
      ))}
    </div>
  );
}
