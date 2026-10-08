import Layout from "../components/Layout";

/* ------------------------------------------------------------------
   Shared layout for legal pages (Privacy, Terms).
   `sections`: [{ h, body: [string | {list:[...]}] }]
------------------------------------------------------------------ */
export default function LegalPage({ kicker, title, titleSerif, updated, intro, sections }) {
  return (
    <Layout>
      <section className="page-hero">
        <div className="container legal">
          <span className="eyebrow">{kicker}</span>
          <h1 className="h1 legal__title">{[title, titleSerif].filter(Boolean).join(" ")}</h1>
          <p className="lead">{intro}</p>
          <p className="legal__updated">Last updated · {updated}</p>
        </div>
      </section>
      <div className="container legal legal__body">
        {sections.map((s) => (
          <section key={s.h} className="legal__block">
            <h2 className="h3">{s.h}</h2>
            {s.body.map((b, j) =>
              typeof b === "string" ? (
                <p key={j}>{b}</p>
              ) : (
                <ul key={j} className="legal__list">
                  {b.list.map((li) => <li key={li}>{li}</li>)}
                </ul>
              )
            )}
          </section>
        ))}
      </div>
    </Layout>
  );
}
