import { Link } from "react-router-dom";
import Tag from "./Tag";
import ProjectCover from "./ProjectCover";

/* Kargul-style card: tags above, cover in a thin white frame, name in a
   white tab over the cover's bottom-left corner. */
export default function ProjectCard({ project }) {
  return (
    <Link to={`/work/${project.slug}`} className="pcard">
      <div className="tags pcard__tags">
        <Tag>{project.industry}</Tag>
        <Tag>{project.audience}</Tag>
      </div>
      <div className="pcard__media">
        <ProjectCover project={project} />
        <h2 className="pcard__name">{project.name}</h2>
      </div>
    </Link>
  );
}
