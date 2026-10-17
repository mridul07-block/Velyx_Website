import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import BtnLabel from "../components/BtnLabel";
import IntroCallButton from "../components/IntroCallButton";
import ProductFilm from "../components/ProductFilm";
import AgentGrid from "../components/AgentGrid";
import ProjectCard from "../components/ProjectCard";
import NotFound from "./NotFound";
import { INDUSTRIES } from "../data/industries";
import { SERVICES } from "../data/services";
import { PROJECTS } from "../data/projects";

/* One industry: its film, the problems we solve, the agents and services
   we bring, and related work. */
export default function IndustryPage() {
  const { slug } = useParams();
  const ind = INDUSTRIES.find((x) => x.slug === slug);
  if (!ind) return <NotFound />;
  const services = ind.services.map((s) => SERVICES.find((x) => x.slug === s));
  const work = ind.work.map((w) => PROJECTS.find((p) => p.slug === w));

  return (
    <Layout>
      <Seo title={`${ind.short} — case study`} description={ind.copy} path={`/case-studies/${ind.slug}`} />
      <section className="page-head offer">
        <div className="container offer__head">
          <Link to="/case-studies" className="case__back">← All case studies</Link>
          <span className="eyebrow">Case study</span>
          <h1 className="h1">{ind.short}</h1>
          <p className="lead">{ind.copy}</p>
          <div className="hero__actions">
            <a href="#agents" className="btn btn--intro"><BtnLabel>Get your agent</BtnLabel></a>
            <IntroCallButton className="btn--light">Book an intro call</IntroCallButton>
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
          <SectionHeader align="center" title="What we fix" />
          <ul className="problems">
            {ind.problems.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </section>
      <section id="agents" className="section">
        <div className="container">
          <SectionHeader align="center" title={`Agents we build for ${ind.short.toLowerCase()}`} sub="Built around your tools and your team, with a person in the loop where it matters." />
          <AgentGrid agents={ind.agents} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeader align="center" title="Services we provide" />
          <ul className="industry-services">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`}>
                  <span className="h3">{s.title}</span>
                  <span className="industry-services__copy">{s.copy}</span>
                  <span aria-hidden="true" className="industry-services__arrow">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeader align="center" title="Related work" />
          <div className="work-grid industry-work">
            {work.map((p) => <ProjectCard key={p.slug} project={p} />)}
          </div>
        </div>
      </section>
    </Layout>
  );
}
