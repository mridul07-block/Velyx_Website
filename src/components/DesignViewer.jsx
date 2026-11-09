import { useEffect, useRef, useState } from "react";

/* Full-screen viewer for a live design: the complete page in an iframe,
   rendered at the width it was designed at and scaled down to fit (fixed-size
   pages fit whole). Esc closes, arrows step through the list (wrapping),
   focus returns to the opener on close. */
export default function DesignViewer({ items, index, onIndex, onClose }) {
  const closeRef = useRef(null);
  const n = items.length;
  const item = items[index];
  const stageRef = useRef(null);
  const [box, setBox] = useState(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const fit = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  let frame = { width: "100%", height: "100%" };
  if (box && box.w) {
    const scale = Math.min(1, box.w / item.vw, item.vh ? box.h / item.vh : 1);
    const h = item.vh || box.h / scale;
    frame = { width: item.vw, height: h, transform: `scale(${scale})`, marginLeft: (box.w - item.vw * scale) / 2, marginTop: item.vh ? Math.max(0, (box.h - h * scale) / 2) : 0 };
  }

  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      if (opener && typeof opener.focus === "function") opener.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onIndex((index + 1) % n);
      else if (e.key === "ArrowLeft") onIndex((index - 1 + n) % n);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, n, onClose, onIndex]);

  return (
    <div className="dviewer" role="dialog" aria-modal="true" aria-label={`${item.name} design`}>
      <div className="dviewer__bar">
        <p className="dviewer__name">{item.name} <span>{item.kind}</span></p>
        <div className="dviewer__ctrls">
          <button type="button" aria-label="Previous design" onClick={() => onIndex((index - 1 + n) % n)}>←</button>
          <span className="dviewer__count">{index + 1} / {n}</span>
          <button type="button" aria-label="Next design" onClick={() => onIndex((index + 1) % n)}>→</button>
          <button ref={closeRef} type="button" aria-label="Close" onClick={onClose}>×</button>
        </div>
      </div>
      <div ref={stageRef} className="dviewer__stage">
        <iframe key={item.slug} src={item.src} title={`${item.name} — ${item.kind}`} className="dviewer__frame" style={frame} />
      </div>
    </div>
  );
}
