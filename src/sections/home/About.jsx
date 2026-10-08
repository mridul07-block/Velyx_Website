import Section from "../../components/Section";
import SectionHeader from "../../components/SectionHeader";
import FadeIn from "../../components/FadeIn";

const FOUNDERS_PHOTO =
  "https://res.cloudinary.com/dmhabztbf/image/upload/w_720,f_auto,q_auto/v1784752931/Founders_Profile_VelyxLabs_ywryqa.jpg";

const POINTS = [
  ["Founders on every project", "You talk to the people who build your system — not an account manager."],
  ["Built for production, not demos", "We ship systems your team relies on every day."],
  ["You own the code", "Code, designs and accounts are yours at handover."],
  ["Clear scope and timeline", "A written plan before we start, so there are no surprises."],
];

const FOUNDERS = [
  { name: "Atharv Golait", role: "CEO & Co-founder", linkedin: "https://www.linkedin.com/in/atharv-golait-9048772ab/" },
  { name: "Mridul", role: "Founder" },
];

export default function About() {
  return (
    <Section id="about">
      <div className="about">
        <div>
          <SectionHeader eyebrow="Why Velyx" title="Built by founders, not account managers" />
          <FadeIn>
            <ul className="about__points">
              {POINTS.map(([title, text]) => (
                <li key={title}>
                  <h3 className="h3">{title}</h3>
                  <p className="muted">{text}</p>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
        <FadeIn className="about__founders card">
          <img src={FOUNDERS_PHOTO} alt="Atharv Golait and Mridul, founders of Velyx Labs" width="720" height="960" loading="lazy" className="about__photo" />
          <ul className="about__people">
            {FOUNDERS.map((f) => (
              <li key={f.name}>
                <span className="about__name">{f.name}</span>
                <span className="muted">{f.role}</span>
                {f.linkedin && (
                  <a href={f.linkedin} target="_blank" rel="noopener noreferrer" className="about__link">LinkedIn</a>
                )}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </Section>
  );
}
