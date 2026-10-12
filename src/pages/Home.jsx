import Seo from "../components/Seo";
import { SITE } from "../components/seoConfig";
import Layout from "../components/Layout";
import Stats from "../components/Stats";
import TeamGrid from "../components/TeamGrid";
import Testimonials from "../components/Testimonials";
import ToolsStrip from "../components/ToolsStrip";
import Pricing from "../sections/Pricing";
import Hero from "../sections/home/Hero";
import TrustedBy from "../sections/home/TrustedBy";
import ServicesPanel from "../sections/home/ServicesPanel";
import SelectedWork from "../sections/home/SelectedWork";
import MoreWork from "../sections/home/MoreWork";
import Process from "../sections/home/Process";
import Statement from "../sections/home/Statement";
import { TESTIMONIAL_QUOTES } from "../data/testimonials";

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${SITE.url}#org`, name: "Velyx Labs", url: SITE.url, logo: SITE.ogImage, description: SITE.defaultDescription, sameAs: ["https://x.com/VelyxLabs", "https://www.linkedin.com/company/velyx-labs/", "https://github.com/ATHARVISM2804"], founder: { "@id": `${SITE.url}#atharv` } },
    { "@type": "Person", "@id": `${SITE.url}#atharv`, name: "Atharv Golait", jobTitle: "CEO & Co-founder", worksFor: { "@id": `${SITE.url}#org` }, url: "https://atharvgolait.dev/", sameAs: ["https://atharvgolait.dev/", "https://www.linkedin.com/in/atharv-golait-9048772ab/", "https://x.com/Atharv_Golait"] },
    { "@type": "WebSite", "@id": `${SITE.url}#website`, url: SITE.url, name: "Velyx Labs", publisher: { "@id": `${SITE.url}#org` } },
  ],
};

export default function Home() {
  return (
    <Layout>
      <Seo path="/" jsonLd={JSON_LD} />
      <Hero />
      <TrustedBy />
      <ServicesPanel />
      <Statement />
      <Stats />
      <SelectedWork />
      <MoreWork />
      <Process />
      <TeamGrid />
      <Testimonials items={TESTIMONIAL_QUOTES} />
      <Pricing />
      <ToolsStrip />
    </Layout>
  );
}
