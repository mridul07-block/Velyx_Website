import { useEffect, useRef, useState } from "react";
import Tag from "./Tag";

/* One live design in a card: the complete page rendered at the width it was
   designed at and scaled to the card, scrollable inside. The iframe only
   exists while the card is near the screen, so two dozen WebGL pages never
   run at once; until then (and in tests) the hero screenshot stands in. */
export default function DesignFrame({ design, onOpen }) {
  const W = design.vw;
  const H = design.vh || (W * 10) / 16;
  const boxRef = useRef(null);
  const [near, setNear] = useState(false);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "300px 0px" });
    io.observe(el);
    const fit = () => setScale(el.clientWidth / W);
    fit();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(fit) : null;
    ro?.observe(el);
    return () => { io.disconnect(); ro?.disconnect(); };
  }, [W]);

  return (
    <article className="dcard">
      <div className="tags dcard__tags">
        <Tag>{design.kind}</Tag>
        <Tag>Concept</Tag>
      </div>
      <div className="dcard__media">
        <div ref={boxRef} className="dcard__box">
          <img src={design.shot.src} width={design.shot.w} height={design.shot.h} alt="" loading="lazy" className="dcard__poster" />
          {near && (
            <iframe
              src={design.src}
              title={`${design.name} — ${design.kind}`}
              loading="lazy"
              className="dcard__frame"
              style={{ width: W, height: H, transform: `scale(${scale})` }}
            />
          )}
        </div>
        <div className="dcard__foot">
          <h2 className="pcard__name dcard__name">{design.name}</h2>
          <button type="button" className="pcard__site" onClick={onOpen}>
            Full screen <span aria-hidden="true">⤢</span>
          </button>
        </div>
      </div>
    </article>
  );
}
