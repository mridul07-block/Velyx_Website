import VelyxMark from "../../components/VelyxMark";
import { COMPARE } from "../../data/compare";

/* Kargul's "How we compare": a label column, our column raised as a white
   card with the logo, then the alternatives. Scrolls sideways on phones. */
export default function Compare() {
  return (
    <section id="compare" className="section cmp">
      <div className="container">
        <h2 className="h2 cmp__title">How we compare</h2>
        <div className="cmp__scroll">
          <table className="cmp__table">
            <thead>
              <tr>
                <th scope="col"><span className="sr-only">Compared on</span></th>
                <th scope="col" className="cmp__us cmp__us--head" aria-label="Velyx Labs">
                  <span className="cmp__logo" aria-hidden="true"><VelyxMark /> Velyx Labs</span>
                </th>
                <th scope="col">In-house hire</th>
                <th scope="col">Freelancers</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((r) => (
                <tr key={r.label}>
                  <th scope="row">{r.label}</th>
                  {r.cells.map((c, j) => <td key={j} className={j === 0 ? "cmp__us" : undefined}>{c}</td>)}
                </tr>
              ))}
              {/* Kargul's finish: our column's card runs on a little past the last line. */}
              <tr className="cmp__end" aria-hidden="true">
                <td />
                <td className="cmp__us" />
                <td />
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
