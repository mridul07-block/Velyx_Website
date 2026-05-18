import CineNav from "../components/CineNav";
import CineFooter from "../components/CineFooter";
import CustomCursor from "../components/CustomCursor";
import ProgressUpdater from "../components/ProgressUpdater";
import NavIndex from "../components/NavIndex";
import Hero from "../sections/Hero";
import ShipScroll from "../sections/ShipScroll";
import { Marquee, Pillars, Capabilities, Results, Manifesto, Process, Cta } from "../sections/Sections";
import { StatsBar, TestimonialsPreview, FAQ } from "../sections/ExtraSections";

const sections = [
  { id: "hero", label: "Hero" },
  { id: "work", label: "Services" },
  { id: "ship", label: "What we ship" },
  { id: "capabilities", label: "Capabilities" },
  { id: "stats", label: "Numbers" },
  { id: "testimonials", label: "Testimonials" },
  { id: "process", label: "Process" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export default function Home() {
  return (
    <>
      <CustomCursor />
      <ProgressUpdater />
      <CineNav active="home" />
      <NavIndex sections={sections} />

      <div id="hero"><Hero /></div>
      <Marquee />
      <Pillars />
      <div id="ship"><ShipScroll /></div>
      <Capabilities />
      <div id="stats"><StatsBar /></div>
      <Results />
      <Manifesto />
      <TestimonialsPreview />
      <Process />
      <FAQ />
      <Cta />
      <CineFooter />
    </>
  );
}
