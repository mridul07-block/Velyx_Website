import { Link } from "react-router-dom";
import Tag from "./Tag";
import ProjectCover from "./ProjectCover";
import ProductFilm from "./ProductFilm";

/* Kargul-style card: tags above, cover in a thin white frame, the name
   under the cover inside the frame so nothing of the screenshot is hidden.
   The live site sits under the card, outside the case-study link. */
export default function ProjectCard({ project }) {
  const domain = project.url && new URL(project.url).hostname.replace(/^www\./, "");
  return (
    <div className="pcard-wrap">
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
      {domain && (
        <a href={project.url} className="pcard__site" target="_blank" rel="noopener noreferrer">
          {domain} <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  );
}
