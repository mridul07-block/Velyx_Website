import CineNav from "../components/CineNav";
import CineFooter from "../components/CineFooter";
import CustomCursor from "../components/CustomCursor";
import ProgressUpdater from "../components/ProgressUpdater";
import Seo from "../components/Seo";
import { SITE } from "../components/seoConfig";
import NavIndex from "../components/NavIndex";
import Hero from "../sections/Hero";
import ShipScroll from "../sections/ShipScroll";
import Founders from "../sections/Founders";
import { Marquee, Pillars, Process, Cta } from "../sections/Sections";
import { TestimonialsPreview } from "../sections/ExtraSections";

const sections = [
  { id: "hero", label: "Hero" },
  { id: "work", label: "Systems" },
  { id: "ship", label: "What we ship" },
  { id: "founders", label: "Founders" },
  { id: "testimonials", label: "Testimonials" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
];

export default function Home() {
  return (
    <>
      <Seo path="/" jsonLd={{
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "Organization", "@id": `${SITE.url}#org`, name: "Velyx Labs", url: SITE.url, logo: SITE.ogImage, description: SITE.defaultDescription, sameAs: ["https://x.com/VelyxLabs", "https://www.linkedin.com/company/velyx-labs/", "https://github.com/ATHARVISM2804"], founder: { "@id": `${SITE.url}#atharv` } },
          { "@type": "Person", "@id": `${SITE.url}#atharv`, name: "Atharv Golait", jobTitle: "CEO & Co-founder", worksFor: { "@id": `${SITE.url}#org` }, url: "https://atharvgolait.dev/", sameAs: ["https://atharvgolait.dev/", "https://www.linkedin.com/in/atharv-golait-9048772ab/", "https://x.com/Atharv_Golait"] },
          { "@type": "WebSite", "@id": `${SITE.url}#website`, url: SITE.url, name: "Velyx Labs", publisher: { "@id": `${SITE.url}#org` } },
        ],
      }} />
      <CustomCursor />
      <ProgressUpdater />
      <CineNav active="home" />
      <NavIndex sections={sections} />

      <div id="hero"><Hero /></div>
      <Marquee />
      <Pillars />
      <div id="ship"><ShipScroll /></div>
      <Founders />
      <TestimonialsPreview />
      <Process />
      <Cta />
      <CineFooter />
    </>
  );
}
