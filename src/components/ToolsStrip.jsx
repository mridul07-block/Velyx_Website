import Marquee from "./Marquee";
import { TOOLS } from "../data/tools";

export default function ToolsStrip() {
  return (
    <section id="tools" className="section tools">
      <div className="container">
        <h2 className="h2 center tools__title">Tools we've mastered</h2>
        <div className="tools__pill">
          <Marquee label="Tools">
            {TOOLS.map((t) => (
              <span key={t.name} className="tools__item">
                {t.icon && (
                  <img src={`https://cdn.simpleicons.org/${t.icon}/6b6b6b`} alt="" width="22" height="22" loading="lazy" />
                )}
                {t.name}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
