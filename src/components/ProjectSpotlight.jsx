import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useOnScreen from "../lib/useOnScreen";
import useReducedMotion from "../lib/useReducedMotion";
import Tag from "./Tag";
import ProjectCover from "./ProjectCover";

/* A muted product walkthrough that loads and plays only while on screen;
   with reduced motion it stays on its poster frame. */
function SpotVideo({ project }) {
  const [ref, onScreen] = useOnScreen("200px");
  const reduced = useReducedMotion();
  const started = useRef(false);
  const play = onScreen && !reduced;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (play) {
      started.current = true;
      v.play()?.catch?.(() => {});
    } else if (started.current) {
      v.pause();
    }
  }, [play, ref]);

  return (
    <video
      ref={ref}
      className="cover"
      src={project.video.src}
      poster={project.video.poster}
      width="1200"
      height="750"
      muted
      loop
      playsInline
      preload="none"
      aria-label={`${project.name} — product walkthrough`}
    />
  );
}

export default function ProjectSpotlight({ project, flip = false }) {
  return (
    <article className={`spot${flip ? " spot--flip" : ""}`}>
      <div className="spot__media">
        {project.video ? <SpotVideo project={project} /> : <ProjectCover project={project} />}
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
