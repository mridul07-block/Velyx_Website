import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import Tag from "../components/Tag";
import ProjectCover from "../components/ProjectCover";
import NotFound from "./NotFound";
import { PROJECTS } from "../data/projects";
import { TESTIMONIAL_QUOTES } from "../data/testimonials";

export default function CaseStudy() {
  const { slug } = useParams();
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  if (i < 0) return <NotFound />;
  const p = PROJECTS[i];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const quote = TESTIMONIAL_QUOTES.find((t) => t.name === p.quoteName);

  return (
    <Layout>
      <Seo title={`${p.name} — case study`} description={p.summary} path={`/work/${p.slug}`} />
      <article className="case">
        <header className="container case__head">
          <Link to="/work" className="case__back">← All work</Link>
          <h1 className="h1">{p.name}</h1>
          <p className="lead">{p.summary}</p>
          <div className="tags tags--light">
            <Tag>{p.industry}</Tag>
            <Tag>{p.audience}</Tag>
          </div>
        </header>
        <div className="container">
          <div className="case__hero"><ProjectCover project={p} /></div>
        </div>
        <div className="container case__body">
          <section>
            <h2 className="h3">The brief</h2>
            <p>{p.brief}</p>
          </section>
          <section>
            <h2 className="h3">What we built</h2>
            <p>{p.built}</p>
          </section>
          {p.stack.length > 0 && (
            <section>
              <h2 className="h3">Stack</h2>
              <div className="tags tags--light">{p.stack.map((s) => <Tag key={s}>{s}</Tag>)}</div>
            </section>
          )}
          {p.result && (
            <section>
              <h2 className="h3">Result</h2>
              <p>{p.result}</p>
            </section>
          )}
          {quote && (
            <figure className="case__quote">
              <blockquote>“{quote.q}”</blockquote>
              <figcaption>{quote.name} · {quote.role}</figcaption>
            </figure>
          )}
        </div>
        {p.gallery.length > 0 && (
          <div className="container case__gallery">
            {p.gallery.map((g) => (
              <img key={g.src} src={g.src} width={g.w} height={g.h} alt={`${p.name} — screenshot`} loading="lazy" />
            ))}
          </div>
        )}
        {next.slug !== p.slug && (
          <div className="container case__next">
            <Link to={`/work/${next.slug}`}>Next project: {next.name} <span aria-hidden="true">→</span></Link>
          </div>
        )}
      </article>
    </Layout>
  );
}
