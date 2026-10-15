export default function ProjectCover({ project, className = "" }) {
  // a wide product screenshot is shown whole in the work grid rather than cropped
  const shot = project.cover && project.cover.w / project.cover.h >= 1.6;
  const classes = ["cover", shot && "cover--shot", className].filter(Boolean).join(" ");
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
