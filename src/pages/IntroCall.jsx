import { Link, useSearchParams } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import CalEmbed from "../components/CalEmbed";
import { CAL_URL } from "../lib/cal";
import Marquee from "../components/Marquee";
import { PROJECTS } from "../data/projects";
import { SERVICES } from "../data/services";
import { INDUSTRIES } from "../data/industries";

// Only names we actually offer can appear on the page or in the booking.
const AGENT_NAMES = new Set([...SERVICES, ...INDUSTRIES].flatMap((x) => x.agents.map((a) => a.name)));

// Every project's hero screenshot (wide covers only, not logos).
const HEROES = PROJECTS.filter((p) => p.cover && p.cover.w / p.cover.h >= 1.6);

/* The booking page every "Intro call" and the free-audit row lead to. */
export default function IntroCall() {
  const [params] = useSearchParams();
  const audit = params.get("for") === "audit";
  const agent = AGENT_NAMES.has(params.get("agent")) ? params.get("agent") : null;
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
          {agent && <p className="intro-call__about">About: {agent}</p>}
          <CalEmbed eager notes={agent ? `Interested in: ${agent}` : undefined} />
          <p className="final-cta__alt">
            Calendar not loading? <a href={CAL_URL} target="_blank" rel="noopener noreferrer">Open the booking page</a>
          </p>
        </div>
      </section>
      <Marquee label="Our work" className="work-strip">
        {HEROES.map((p) => (
          <Link key={p.slug} to={`/work/${p.slug}`} className="work-strip__shot" aria-label={p.name}>
            <img src={p.cover.src} width={p.cover.w} height={p.cover.h} alt="" loading="lazy" />
          </Link>
        ))}
      </Marquee>
    </Layout>
  );
}
