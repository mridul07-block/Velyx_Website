import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import BtnLabel from "../components/BtnLabel";
import IntroCallButton from "../components/IntroCallButton";
import ProductFilm from "../components/ProductFilm";
import AgentGrid from "../components/AgentGrid";
import NotFound from "./NotFound";
import { INDUSTRIES } from "../data/industries";

const HOW = [
  { title: "Map", copy: "We map your workflow and find where time and revenue leak." },
  { title: "Build", copy: "We build the agents and connect them to the tools you already use." },
  { title: "Scale", copy: "We launch, measure what moves, and scale what works." },
];

/* One industry, all value: the promise and film, what changes for you,
   how we get you there, and the agents you get. */
export default function IndustryPage() {
  const { slug } = useParams();
  const ind = INDUSTRIES.find((x) => x.slug === slug);
  if (!ind) return <NotFound />;

  return (
    <Layout>
      <Seo title={`${ind.short} — case study`} description={ind.copy} path={`/case-studies/${ind.slug}`} />
      <section className="page-head offer">
        <div className="container offer__head">
          <Link to="/case-studies" className="case__back">← All case studies</Link>
          <span className="eyebrow">Case study</span>
          <h1 className="h1">{ind.short}</h1>
          <p className="lead">{ind.promise}</p>
          <div className="hero__actions">
            <a href="#agents" className="btn btn--intro"><BtnLabel>Get your agent</BtnLabel></a>
            <IntroCallButton className="btn--light">Book a call</IntroCallButton>
          </div>
        </div>
        <div className="container">
          <div className="offer__film">
            <ProductFilm project={{ name: ind.title, video: ind.film }} preload="metadata" />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeader align="center" title="What changes for you" />
          <ul className="outcomes">
            {ind.outcomes.map((o) => (
              <li key={o.from} className="outcome">
                <span className="outcome__from">{o.from}</span>
                <span className="outcome__arrow" aria-hidden="true">→</span>
                <span className="outcome__to">{o.to}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeader align="center" title="How we get you there" />
          <ol className="how">
            {HOW.map((s, i) => (
              <li key={s.title}>
                <span className="how__n">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="h3">{s.title}</h3>
                <p>{s.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section id="agents" className="section">
        <div className="container">
          <SectionHeader align="center" title="The agents you get" sub="Built around your tools and your team, with a person in the loop where it matters." />
          <AgentGrid agents={ind.agents} />
        </div>
      </section>
    </Layout>
  );
}
