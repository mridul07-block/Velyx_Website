import useInView from "../lib/useInView";

export default function FadeIn({ className = "", children }) {
  const [ref, inView] = useInView("0px 0px -10% 0px");
  return (
    <div ref={ref} className={["fade", inView && "is-in", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
