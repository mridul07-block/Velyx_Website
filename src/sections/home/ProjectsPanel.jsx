import Panel from "../../components/Panel";
import SectionHeader from "../../components/SectionHeader";
import ProjectSpotlight from "../../components/ProjectSpotlight";
import FadeIn from "../../components/FadeIn";
import { PROJECTS } from "../../data/projects";

export default function ProjectsPanel() {
  const featured = PROJECTS.filter((p) => p.featured);
  return (
    <Panel id="projects">
      <SectionHeader align="center" title="Project spotlights" sub="A closer look at some of the projects we've shipped." />
      <div className="spot-list">
        {featured.map((p, i) => (
          <FadeIn key={p.slug}>
            <ProjectSpotlight project={p} flip={i % 2 === 1} />
          </FadeIn>
        ))}
      </div>
    </Panel>
  );
}
