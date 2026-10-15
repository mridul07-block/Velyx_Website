import { Link } from "react-router-dom";
import Tag from "./Tag";
import ProjectCover from "./ProjectCover";

/* Two product screenshots stacked in the card, each bleeding off an edge. */
function SpotShots({ project }) {
  return (
    <div className="spot__shots">
      {project.shots.map((s) => (
        <img key={s.src} src={s.src} width={s.w} height={s.h} alt={`${project.name} — ${s.alt}`} loading="lazy" />
      ))}
    </div>
  );
}

export default function ProjectSpotlight({ project, flip = false }) {
  return (
    <article className={`spot${flip ? " spot--flip" : ""}`}>
      <div className="spot__media">
        {project.shots ? <SpotShots project={project} /> : <ProjectCover project={project} />}
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
