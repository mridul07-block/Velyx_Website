import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import Tag from "../components/Tag";
import BtnLabel from "../components/BtnLabel";
import IntroCallButton from "../components/IntroCallButton";
import ProductFilm from "../components/ProductFilm";
import AgentGrid from "../components/AgentGrid";
import NotFound from "./NotFound";
import { SERVICES } from "../data/services";

/* One service: its film, the agents we build for it, and what's included. */
export default function ServicePage() {
  const { slug } = useParams();
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) return <NotFound />;

  return (
    <Layout>
      <Seo title={s.title} description={s.copy} path={`/services/${s.slug}`} />
      <section className="page-head offer">
        <div className="container offer__head">
          <Link to="/services" className="case__back">← All services</Link>
          <span className="eyebrow">{s.short}</span>
          <h1 className="h1">{s.title}</h1>
          <p className="lead">{s.copy}</p>
          <div className="hero__actions">
            <a href="#agents" className="btn btn--intro"><BtnLabel>Get your agent</BtnLabel></a>
            <IntroCallButton className="btn--light">Book an intro call</IntroCallButton>
          </div>
        </div>
        <div className="container">
          <div className="offer__film">
            <ProductFilm project={{ name: s.title, video: s.film }} preload="metadata" />
          </div>
        </div>
      </section>
      <section id="agents" className="section">
        <div className="container">
          <SectionHeader align="center" title="Agents we can build for you" sub="Each one is built around your tools and your team, with a person in the loop where it matters." />
          <AgentGrid agents={s.agents} />
        </div>
      </section>
      <section className="section offer__more">
        <div className="container offer__cols">
          <div>
            <h2 className="h3">What's included</h2>
            <ul className="svc-detail__list offer__list">
              {s.includes.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="h3">Built for</h2>
            <div className="tags tags--light">{s.niches.map((n) => <Tag key={n}>{n}</Tag>)}</div>
            <h2 className="h3 offer__tools">Tools</h2>
            <div className="tags tags--light">{s.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
