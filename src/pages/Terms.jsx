import LegalPage from "./LegalPage";
import Seo from "../components/Seo";

const SECTIONS = [
  {
    h: "Agreement to terms",
    body: [
      "These Terms of Service (“Terms”) govern your access to and use of the Velyx Labs website at velyxlabs.in (the “Site”). By using the Site, you agree to these Terms. If you do not agree, please do not use the Site.",
    ],
  },
  {
    h: "About the Site",
    body: [
      "Velyx Labs is a software studio that builds agentic systems, AI-native SaaS, and custom software. The Site is informational — it describes our work and lets you get in touch. Nothing on the Site is an offer, guarantee, or binding commitment to provide services.",
    ],
  },
  {
    h: "Engagements are governed separately",
    body: [
      "Any project, retainer, or paid work between you and Velyx Labs is governed by a separate written agreement — such as a proposal, statement of work, or contract — signed by both parties. Where those documents differ from these Terms, the signed agreement controls for that engagement.",
      "Descriptions of our services, offerings, and past work on the Site are for general information and do not form part of any contract unless expressly included in a signed agreement.",
    ],
  },
  {
    h: "Intellectual property",
    body: [
      "The Site and its content — including text, design, graphics, logos, and code — are owned by Velyx Labs or its licensors and are protected by applicable intellectual property laws. You may view and share the Site for personal or informational use, but you may not copy, reproduce, or reuse its content for commercial purposes without our written permission.",
      "Ownership of any work product created during a paid engagement is addressed in the relevant signed agreement, not here.",
    ],
  },
  {
    h: "Acceptable use",
    body: [
      "When using the Site, you agree not to:",
      {
        list: [
          "Use it for any unlawful, harmful, or fraudulent purpose.",
          "Attempt to gain unauthorised access to the Site, its systems, or related networks.",
          "Interfere with or disrupt the Site's operation, security, or availability.",
          "Scrape, harvest, or misuse content or contact details from the Site.",
        ],
      },
    ],
  },
  {
    h: "Third-party links and tools",
    body: [
      "The Site may link to or rely on third-party websites and services, such as scheduling and analytics tools. We do not control those services and are not responsible for their content, availability, or practices. Your use of them is subject to their own terms.",
    ],
  },
  {
    h: "Disclaimers",
    body: [
      "The Site is provided on an “as is” and “as available” basis, without warranties of any kind, whether express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free of harmful components, or that any information on it is complete or current.",
    ],
  },
  {
    h: "Limitation of liability",
    body: [
      "To the maximum extent permitted by law, Velyx Labs will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or goodwill, arising from your use of the Site. Nothing in these Terms limits liability that cannot be limited under applicable law.",
    ],
  },
  {
    h: "Governing law",
    body: [
      "These Terms are governed by the laws of India, and the courts of Bangalore, Karnataka will have jurisdiction over any dispute relating to the Site, subject to applicable law.",
    ],
  },
  {
    h: "Changes to these terms",
    body: [
      "We may update these Terms from time to time. When we do, we will revise the “last updated” date above. Your continued use of the Site after changes take effect means you accept the updated Terms.",
    ],
  },
  {
    h: "Contact us",
    body: [
      "Questions about these Terms? Email us at velyxlabs@gmail.com.",
    ],
  },
];

export default function Terms() {
  return (
    <>
      <Seo title="Terms of Service" description="The terms that govern your use of the Velyx Labs website." path="/terms" />
      <LegalPage
      kicker="TERMS"
      title="Terms of"
      titleSerif="service."
      updated="24 JULY 2026"
      intro="The terms that govern your use of the Velyx Labs website."
      sections={SECTIONS}
      />
    </>
  );
}
