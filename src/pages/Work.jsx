import { useSearchParams } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import FilterPills from "../components/FilterPills";
import ProjectCard from "../components/ProjectCard";
import ClosingCTA from "../components/ClosingCTA";
import { PROJECTS } from "../data/projects";
import { WORK_FILTERS, pickFilter } from "../data/filters";

export default function Work() {
  const [params, setParams] = useSearchParams();
  const type = pickFilter(WORK_FILTERS, params.get("type"));
  const list = type === "all" ? PROJECTS : PROJECTS.filter((p) => p.types.includes(type));

  return (
    <Layout>
      <Seo
        title="Recent work"
        description="A selection of Velyx Labs' recent work across AI systems, SaaS products, websites and apps."
        path="/work"
      />
      <section className="page-head">
        <div className="container">
          <SectionHeader
            as="h1"
            align="center"
            title="Latest projects"
            sub="A selection of our recent work across AI systems, SaaS products, websites and apps."
          />
          <FilterPills
            label="Filter projects"
            options={WORK_FILTERS}
            value={type}
            onChange={(key) => setParams(key === "all" ? {} : { type: key }, { replace: true })}
          />
        </div>
      </section>
      <section className="section section--tight">
        <div className="container work-grid">
          {list.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
        {list.length === 0 && <p className="container muted center">No projects in this category yet.</p>}
      </section>
      <ClosingCTA />
    </Layout>
  );
}
