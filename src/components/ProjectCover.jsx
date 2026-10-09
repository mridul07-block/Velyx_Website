export default function ProjectCover({ project, className = "" }) {
  const classes = ["cover", className].filter(Boolean).join(" ");
  if (!project.cover) {
    return (
      <div className={`${classes} cover--empty`} aria-hidden="true">
        <span>{project.name}</span>
      </div>
    );
  }
  return (
    <img
      src={project.cover.src}
      width={project.cover.w}
      height={project.cover.h}
      alt={`${project.name} — screenshot`}
      loading="lazy"
      className={classes}
    />
  );
}
