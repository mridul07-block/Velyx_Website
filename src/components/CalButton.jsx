import { CAL_ATTRS } from "../lib/cal";

export default function CalButton({ children = "Book a free call", variant = "primary", size = "md", block = false, className = "" }) {
  const classes = ["btn", `btn--${variant}`, size === "sm" && "btn--sm", block && "btn--block", className]
    .filter(Boolean)
    .join(" ");
  return (
    <button type="button" className={classes} {...CAL_ATTRS}>
      {children}
    </button>
  );
}
