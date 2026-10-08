import Seo from "../components/Seo";
import { SITE } from "../components/seoConfig";
import Layout from "../components/Layout";
import Section from "../components/Section";
import SectionHeader from "../components/SectionHeader";
import FAQ from "../components/FAQ";
import ProcessSteps from "../components/ProcessSteps";
import FinalCTA from "../components/FinalCTA";
import Hero from "../sections/home/Hero";
import ServicesGrid from "../sections/home/ServicesGrid";
import Testimonials from "../sections/home/Testimonials";
import About from "../sections/home/About";
import { FAQ_ITEMS } from "../data/faq";

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
      <ServicesGrid />
      <ProcessSteps />
      <Testimonials />
      <About />
      <Section id="faq">
        <SectionHeader align="center" eyebrow="FAQ" title="Questions founders ask" />
        <FAQ items={FAQ_ITEMS} />
      </Section>
      <FinalCTA />
    </Layout>
  );
}
