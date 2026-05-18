import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor";
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };
    window.addEventListener("mousemove", onMove);
    let raf;
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onOverInteractive = (e) => {
      const t = e.target.closest("a, button, [data-hover]");
      if (t) {
        dot.classList.add("lg");
        ring.style.opacity = "0";
      } else {
        dot.classList.remove("lg");
        ring.style.opacity = "0.4";
      }
    };
    document.addEventListener("mouseover", onOverInteractive);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOverInteractive);
      dot.remove();
      ring.remove();
    };
  }, []);
  return null;
}
