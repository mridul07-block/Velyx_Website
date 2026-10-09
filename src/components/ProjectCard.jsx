import { Link } from "react-router-dom";
import Tag from "./Tag";
import ProjectCover from "./ProjectCover";

export default function ProjectCard({ project }) {
  return (
    <Link to={`/work/${project.slug}`} className="pcard">
      <div className="pcard__media">
        <ProjectCover project={project} />
      </div>
      <div className="pcard__meta">
        <h2 className="h3">{project.name}</h2>
        <div className="tags tags--light">
          <Tag>{project.industry}</Tag>
          <Tag>{project.audience}</Tag>
        </div>
      </div>
    </Link>
  );
}
