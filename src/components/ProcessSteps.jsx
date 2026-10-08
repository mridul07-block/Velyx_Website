import Section from "./Section";
import SectionHeader from "./SectionHeader";
import CalButton from "./CalButton";
import FadeIn from "./FadeIn";
import { PROCESS } from "../data/process";

export default function ProcessSteps() {
  return (
    <Section id="process">
      <SectionHeader eyebrow="Process" title="How we work" sub="A simple path from first call to a system running in production." />
      <FadeIn>
        <ol className="steps grid-4">
          {PROCESS.map(([title, text], i) => (
            <li key={title} className="step card">
              <span className="step__num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="h3">{title}</h3>
              <p className="muted">{text}</p>
            </li>
          ))}
        </ol>
      </FadeIn>
      <div className="section-cta">
        <CalButton />
      </div>
    </Section>
  );
}
