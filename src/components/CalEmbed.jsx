import Cal from "@calcom/embed-react";
import useInView from "../lib/useInView";
import { CAL_CONFIG, CAL_LINK, CAL_NAMESPACE } from "../lib/cal";

/* Inline Cal.com calendar. Mounts only when near the viewport so the
   iframe doesn't slow down first load. */
export default function CalEmbed() {
  const [ref, inView] = useInView("300px");
  return (
    <div ref={ref} className="cal-embed">
      {inView && (
        <Cal
          namespace={CAL_NAMESPACE}
          calLink={CAL_LINK}
          config={CAL_CONFIG}
          style={{ width: "100%", height: "100%", overflow: "auto" }}
        />
      )}
    </div>
  );
}
