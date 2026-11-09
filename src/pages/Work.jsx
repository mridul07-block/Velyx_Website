import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import FilterPills from "../components/FilterPills";
import ProjectCard from "../components/ProjectCard";
import DesignFrame from "../components/DesignFrame";
import DesignViewer from "../components/DesignViewer";
import { DESIGNS } from "../data/designs";
import { PROJECTS } from "../data/projects";
import { WORK_FILTERS, pickFilter } from "../data/filters";

export default function Work() {
  const [params, setParams] = useSearchParams();
  const type = pickFilter(WORK_FILTERS, params.get("type"));
  const list = type === "all" ? PROJECTS : PROJECTS.filter((p) => p.types.includes(type));
  const [open, setOpen] = useState(null);

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
      <section id="designs" className="section">
        <div className="container">
          <SectionHeader
            align="center"
            title="Design lab"
            sub="Landing pages, hero sections and dashboards we designed and built in code. Each one is live: scroll inside it, or open it full screen."
          />
          <div className="work-grid design-grid">
            {DESIGNS.map((d, i) => <DesignFrame key={d.slug} design={d} onOpen={() => setOpen(i)} />)}
          </div>
        </div>
        {open !== null && <DesignViewer items={DESIGNS} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
      </section>
    </Layout>
  );
}
