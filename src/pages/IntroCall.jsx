import { useSearchParams } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import CalEmbed from "../components/CalEmbed";
import { CAL_URL } from "../lib/cal";

/* The booking page every "Intro call" and the free-audit row lead to. */
export default function IntroCall() {
  const [params] = useSearchParams();
  const audit = params.get("for") === "audit";
  const title = audit ? "Free product audit" : "Book an intro call";
  const sub = audit
    ? "30 minutes with the founders: we look at your product or website and tell you what we'd change. Free."
    : "30 minutes with the founders. No pitch deck needed.";

  return (
    <Layout>
      <Seo title={title} description={sub} path="/intro-call" />
      <section className="page-head intro-call">
        <div className="container">
          <SectionHeader as="h1" align="center" title={title} sub={sub} />
          <CalEmbed eager />
          <p className="final-cta__alt">
            Calendar not loading? <a href={CAL_URL} target="_blank" rel="noopener noreferrer">Open the booking page</a>
          </p>
        </div>
      </section>
    </Layout>
  );
}
