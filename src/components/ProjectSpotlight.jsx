import { Link } from "react-router-dom";
import Tag from "./Tag";
import ProjectCover from "./ProjectCover";

export default function ProjectSpotlight({ project, flip = false }) {
  return (
    <article className={`spot${flip ? " spot--flip" : ""}`}>
      <div className="spot__media">
        <ProjectCover project={project} />
      </div>
      <div className="spot__body">
        <div className="spot__text">
          <h3 className="h3">{project.name}</h3>
          <p>{project.summary}</p>
          <p>{project.built}</p>
          <div className="tags">
            <Tag>{project.industry}</Tag>
            <Tag>{project.audience}</Tag>
            {project.stack.map((s) => <Tag key={s}>{s}</Tag>)}
          </div>
        </div>
        <Link to={`/work/${project.slug}`} className="btn btn--panel">
          See case study <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
