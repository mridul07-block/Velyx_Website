import { useEffect, useRef, useState } from "react";
import Marquee from "../../components/Marquee";
import VelyxMark from "../../components/VelyxMark";
import { CLIENTS } from "../../data/clients";
import { noteFor } from "../../lib/clientNotes";
import { isMuted, setMuted, tick, unlock } from "../../lib/tick";

const COLS = 6;
const NOTES = CLIENTS.map(noteFor);

/* Kargul's layout: a 6-column wordmark grid where one white pill slides to
   the hovered (or focused) client. Bricx's touch: a dark popup saying what
   we built for them, and a soft tick per hover. Phones keep the marquee. */
export default function TrustedBy() {
  const gridRef = useRef(null);
  const lastPointer = useRef("mouse");
  const [active, setActive] = useState(null); // { i, x, y, w, h, pop }
  const [muted, setMutedState] = useState(isMuted);

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

  const show = (i, el, pop) => {
    setActive({ i, x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight, pop: pop && Boolean(NOTES[i]) });
    tick(i % COLS);
  };
  const toggleMute = () => {
    setMuted(!muted);
    setMutedState(!muted);
  };

  const note = active && NOTES[active.i];

  return (
    <section id="trusted" className="trusted">
      <div className="container trusted__inner">
        {/* Kargul's watermark: the brand mark, large and faint, behind the grid. */}
        <VelyxMark className="trusted__mark" />
        <h2 className="trusted__title">Trusted by founders and industry leaders</h2>

        <div ref={gridRef} className="cgrid" onPointerLeave={(e) => e.pointerType !== "touch" && setActive(null)}>
          <span
            className={`cpill${active ? " is-on" : ""}`}
            aria-hidden="true"
            style={active ? { transform: `translate(${active.x + (active.w - 150) / 2}px, ${active.y + (active.h - 60) / 2}px)` } : undefined}
          />
          {CLIENTS.map((name, i) => (
            <button
              key={name}
              type="button"
              className={`ctile${active?.i === i ? " is-active" : ""}`}
              aria-label={NOTES[i] ? `${name}: ${NOTES[i].line}` : name}
              onPointerEnter={(e) => {
                lastPointer.current = e.pointerType;
                show(i, e.currentTarget, e.pointerType !== "touch");
              }}
              onPointerDown={(e) => (lastPointer.current = e.pointerType)}
              onFocus={(e) => show(i, e.currentTarget, lastPointer.current !== "touch")}
              onBlur={() => setActive(null)}
            >
              <span className={`ctile__name${name.length > 15 ? " ctile__name--long" : ""}`}>{name}</span>
            </button>
          ))}
          <span className="ctile ctile--more"><span>And many more</span></span>
          <div
            className={`cpop${active?.pop ? " is-on" : ""}`}
            aria-hidden="true"
            style={active ? { left: active.x + active.w / 2, top: active.y + (active.h - 60) / 2 } : undefined}
          >
            {note && (
              <>
                <p className="cpop__line">{note.line}</p>
                {note.chips.length > 0 && (
                  <span className="cpop__chips">{note.chips.map((c) => <span key={c} className="cpop__chip">{c}</span>)}</span>
                )}
              </>
            )}
          </div>
          <button type="button" className="cmute" aria-pressed={muted} aria-label={muted ? "Turn hover sound on" : "Mute hover sound"} onClick={toggleMute}>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 8h3l4-3v10l-4-3H3z" />
              {muted ? <path d="M13 8l4 4m0-4l-4 4" /> : <path d="M13.5 7.5a3.5 3.5 0 010 5M15.5 5.5a6.5 6.5 0 010 9" />}
            </svg>
          </button>
        </div>

        <div className="trusted__marquee">
          <Marquee label="Clients">
            {CLIENTS.map((c) => <span key={c} className="trusted__name">{c}</span>)}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
