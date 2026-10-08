import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import CalButton from "../components/CalButton";

export default function NotFound() {
  return (
    <Layout>
      <Seo title="Page not found" path="/404" noindex />
      <section className="page-hero not-found">
        <div className="container">
          <SectionHeader as="h1" eyebrow="404" title="Page not found" sub="The page you're looking for doesn't exist or has moved." />
          <div className="hero__actions">
            <Link to="/" className="btn btn--secondary">Back to home</Link>
            <CalButton />
          </div>
        </div>
      </section>
    </Layout>
  );
}
