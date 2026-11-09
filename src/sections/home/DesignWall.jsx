import { useState } from "react";
import DesignViewer from "../../components/DesignViewer";
import { WALL_DESIGNS } from "../../data/designs";

const COLS = 3;

/* After the services panel: our designs in a wall of columns drifting in
   turn up, down, up. Each column renders twice so the loop is seamless; the
   copy is hidden from assistive tech. A click opens the live design. */
export default function DesignWall() {
  const [open, setOpen] = useState(null);
  const cols = Array.from({ length: COLS }, (_, c) => WALL_DESIGNS.map((d, i) => ({ d, i })).filter(({ i }) => i % COLS === c));

  const card = ({ d, i }, hidden) => (
    <button
      key={d.slug}
      type="button"
      className="dwall__card"
      aria-label={hidden ? undefined : `Open the ${d.name} design`}
      tabIndex={hidden ? -1 : undefined}
      onClick={() => setOpen(i)}
    >
      <img src={d.shot.src} width={d.shot.w} height={d.shot.h} alt="" loading="lazy" decoding="async" />
      <span className="dwall__name">{d.name} <em>{d.kind}</em></span>
    </button>
  );

  return (
    <section id="design-wall" className="dwall">
      <div className="container">
        <header className="section-header section-header--center">
          <h2 className="h2">Designed and built by us</h2>
          <p className="section-header__sub">Landing pages, hero sections and dashboards. Open any of them to use it live.</p>
        </header>
      </div>
      <div className="dwall__frame">
        {cols.map((items, c) => (
          <div key={c} className={`dwall__col dwall__col--${c % 2 ? "down" : "up"}`}>
            <div className="dwall__track" style={{ animationDuration: `${60 + c * 8}s` }}>
              <div className="dwall__group">{items.map((x) => card(x, false))}</div>
              <div className="dwall__group" aria-hidden="true" inert>{items.map((x) => card(x, true))}</div>
            </div>
          </div>
        ))}
      </div>
      {open !== null && <DesignViewer items={WALL_DESIGNS} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </section>
  );
}
