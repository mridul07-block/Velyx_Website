import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import { INDUSTRIES } from "../data/industries";

/* The industries we build agents for, each opening its own page. */
export default function CaseStudies() {
  return (
    <Layout>
      <Seo title="Case studies" description="How Velyx Labs builds AI agents and automation for healthcare, real estate and automobile businesses." path="/case-studies" />
      <section className="page-head">
        <div className="container">
          <SectionHeader as="h1" align="center" title="Case studies" sub="The industries we build agents for, and what changes when they're running." />
          <div className="industries">
            {INDUSTRIES.map((i) => (
              <Link key={i.slug} to={`/case-studies/${i.slug}`} className="industry-card">
                <img src={i.film.poster} width={i.film.w} height={i.film.h} alt="" loading="lazy" />
                <span className="industry-card__body">
                  <span className="h3">{i.short}</span>
                  <span className="industry-card__copy">{i.copy}</span>
                  <span className="industry-card__more">See how we help <span aria-hidden="true">→</span></span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
