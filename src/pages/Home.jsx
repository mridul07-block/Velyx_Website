import CineNav from "../components/CineNav";
import CineFooter from "../components/CineFooter";
import CustomCursor from "../components/CustomCursor";
import ProgressUpdater from "../components/ProgressUpdater";
import NavIndex from "../components/NavIndex";
import Hero from "../sections/Hero";
import ShipScroll from "../sections/ShipScroll";
import { Marquee, Pillars, Process, Cta } from "../sections/Sections";
import { TestimonialsPreview } from "../sections/ExtraSections";

const sections = [
  { id: "hero", label: "Hero" },
  { id: "work", label: "Systems" },
  { id: "ship", label: "What we ship" },
  { id: "testimonials", label: "Testimonials" },
  { id: "process", label: "Process" },
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
      <TestimonialsPreview />
      <Process />
      <Cta />
      <CineFooter />
    </>
  );
}
