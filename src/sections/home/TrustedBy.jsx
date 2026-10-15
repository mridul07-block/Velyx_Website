import { useEffect, useRef, useState } from "react";
import Marquee from "../../components/Marquee";
import VelyxMark from "../../components/VelyxMark";
import { CLIENTS } from "../../data/clients";
import { tick, unlock } from "../../lib/tick";

const COLS = 6;

/* Kargul's layout: a 6-column wordmark grid where one white pill slides to
   the hovered (or focused) client, a dot for a cursor, a "15+ More" tile and
   a soft tick per hover (Bricx). Phones keep the marquee. */
export default function TrustedBy() {
  const gridRef = useRef(null);
  const cursorRef = useRef(null);
  const [active, setActive] = useState(null); // { i, x, y, w, h }

  useEffect(() => {
    // Only activation keys count as a user gesture for audio (not Esc/Tab).
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        unlock();
        window.removeEventListener("keydown", onKey);
      }
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const show = (i, el) => {
    setActive({ i, x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
    tick(i % COLS);
  };
  /* Kargul's cursor: over the grid the arrow becomes a dot that follows the mouse. */
  const moveCursor = (e) => {
    const dot = cursorRef.current;
    if (!dot || e.pointerType === "touch") return;
    const r = gridRef.current.getBoundingClientRect();
    dot.style.transform = `translate(${(e.clientX - r.left).toFixed(0)}px, ${(e.clientY - r.top).toFixed(0)}px)`;
    dot.classList.add("is-on");
  };
  const leaveGrid = (e) => {
    cursorRef.current?.classList.remove("is-on");
    if (e.pointerType !== "touch") setActive(null);
  };

  return (
    <section id="trusted" className="trusted">
      <div className="container trusted__inner">
        {/* Kargul's watermark: the brand mark, large and faint, behind the grid. */}
        <VelyxMark className="trusted__mark" />
        <h2 className="trusted__title">Trusted by founders and industry leaders</h2>

        <div ref={gridRef} className="cgrid" onPointerMove={moveCursor} onPointerLeave={leaveGrid}>
          <span ref={cursorRef} className="ccursor" aria-hidden="true" />
          <span
            className={`cpill${active ? " is-on" : ""}`}
            aria-hidden="true"
            style={active ? { transform: `translate(${active.x + (active.w - 150) / 2}px, ${active.y + (active.h - 60) / 2}px)` } : undefined}
          />
          {CLIENTS.map(({ name, logo }, i) => (
            <button
              key={name}
              type="button"
              aria-label={name}
              className={`ctile${active?.i === i ? " is-active" : ""}`}
              onPointerEnter={(e) => show(i, e.currentTarget)}
              onFocus={(e) => show(i, e.currentTarget)}
              onBlur={() => setActive(null)}
            >
              {logo ? (
                <img src={logo} alt="" className="ctile__logo" loading="lazy" decoding="async" />
              ) : (
                <span className={`ctile__name${name.length > 15 ? " ctile__name--long" : ""}`}>{name}</span>
              )}
            </button>
          ))}
          <span className="ctile ctile--more"><span>15+ More</span></span>
        </div>

        <div className="trusted__marquee">
          <Marquee label="Clients">
            {CLIENTS.map(({ name, logo }) =>
              logo ? <img key={name} src={logo} alt={name} className="trusted__logo" loading="lazy" decoding="async" /> : <span key={name} className="trusted__name">{name}</span>
            )}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
