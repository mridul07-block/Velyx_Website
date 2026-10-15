import { Link } from "react-router-dom";
import Tag from "./Tag";
import ProjectCover from "./ProjectCover";
import ProductFilm from "./ProductFilm";

/* Kargul-style card: tags above, cover in a thin white frame, the name
   under the cover inside the frame so nothing of the screenshot is hidden. */
export default function ProjectCard({ project }) {
  return (
    <Link to={`/work/${project.slug}`} className="pcard">
      <div className="tags pcard__tags">
        <Tag>{project.industry}</Tag>
        <Tag>{project.audience}</Tag>
      </div>
      <div className="pcard__media">
        {project.cardVideo ? <ProductFilm project={project} className="cover cover--film" /> : <ProjectCover project={project} />}
        <h2 className="pcard__name">{project.name}</h2>
      </div>
    </Link>
  );
}
