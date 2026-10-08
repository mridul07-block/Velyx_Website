import { CAL_ATTRS, CAL_URL } from "../lib/cal";

/* A real link to the booking page. When Cal's embed script has loaded
   (it registers <cal-modal-box>), it opens the popup from the data-cal-*
   attributes and we cancel the navigation. If the script is blocked
   (ad blockers), the link still opens cal.com in a new tab. */
function onClick(e) {
  if (window.customElements?.get("cal-modal-box")) e.preventDefault();
}

export default function CalButton({ children = "Book a free call", variant = "primary", size = "md", block = false, className = "" }) {
  const classes = ["btn", `btn--${variant}`, size === "sm" && "btn--sm", block && "btn--block", className]
    .filter(Boolean)
    .join(" ");
  return (
    <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className={classes} onClick={onClick} {...CAL_ATTRS}>
      {children}
    </a>
  );
}
