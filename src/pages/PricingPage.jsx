import Seo from "../components/Seo";
import Layout from "../components/Layout";
import Pricing from "../sections/Pricing";

export default function PricingPage() {
  return (
    <Layout>
      <Seo title="Pricing" description="Start with a $1500 trial week, then a product sprint or a monthly partnership with the Velyx Labs founders." path="/pricing" />
      <div className="pricing-page">
        <Pricing headingLevel={1} reveal={false} />
      </div>
    </Layout>
  );
}
