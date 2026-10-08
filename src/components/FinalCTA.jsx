import Section from "./Section";
import SectionHeader from "./SectionHeader";
import CalEmbed from "./CalEmbed";
import CalButton from "./CalButton";

export default function FinalCTA() {
  return (
    <Section id="book" alt>
      <SectionHeader
        align="center"
        eyebrow="Book a call"
        title="Let's talk about what you want to build."
        sub="30 minutes. No pitch deck. You'll leave with a clear next step."
      />
      <CalEmbed />
      <p className="final-cta__alt">
        Calendar not loading? <CalButton variant="secondary" size="sm">Open booking page</CalButton> or email{" "}
        <a href="mailto:velyxlabs@gmail.com">velyxlabs@gmail.com</a>
      </p>
    </Section>
  );
}
