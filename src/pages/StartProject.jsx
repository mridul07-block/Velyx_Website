import { useSearchParams } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import BriefForm from "../components/BriefForm";
import CalEmbed from "../components/CalEmbed";
import CalButton from "../components/CalButton";

const EMAIL = "velyxlabs@gmail.com";

export default function StartProject() {
  const [params] = useSearchParams();
  const formKey = import.meta.env.VITE_WEB3FORMS_KEY;
  const initialBudget = params.get("plan") === "trial" ? "trial" : "";

  return (
    <Layout>
      <Seo
        title="Start a project"
        description="Tell Velyx Labs what you're building — send a brief or book a free 30-minute call."
        path="/start-a-project"
      />
      <section className="page-head">
        <div className="container intro">
          <div className="intro__copy">
            {/* TO CONFIRM: the reply-time promise. */}
            <SectionHeader as="h1" title="Start a project" sub="Tell us what you're building. We reply within one working day." />
            <p className="muted">
              Prefer email? <a href={`mailto:${EMAIL}`} className="intro__link">{EMAIL}</a>
            </p>
          </div>
          {formKey ? (
            <BriefForm formKey={formKey} initialBudget={initialBudget} />
          ) : (
            <div className="card">
              <h2 className="h3">Email us your brief</h2>
              <p className="muted">
                Write to <a href={`mailto:${EMAIL}`} className="intro__link">{EMAIL}</a> and we'll get back to you.
              </p>
            </div>
          )}
        </div>
      </section>
      <section id="book" className="section">
        <div className="container">
          <SectionHeader align="center" title="Prefer to talk first?" sub="Book a free 30-minute call with the founders." />
          <CalEmbed />
          <p className="final-cta__alt">
            Calendar not loading? <CalButton variant="secondary" size="sm">Open booking page</CalButton> or email{" "}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
        </div>
      </section>
    </Layout>
  );
}
