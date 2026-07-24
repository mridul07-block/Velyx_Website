import LegalPage from "./LegalPage";
import Seo from "../components/Seo";

const SECTIONS = [
  {
    h: "Who we are",
    body: [
      "Velyx Labs (“Velyx Labs”, “we”, “us”, or “our”) is a software studio that builds agentic systems, AI-native SaaS, and custom software for founders and businesses. We are based in Bangalore, India.",
      "This Privacy Policy explains what information we collect through this website, how we use it, and the choices you have. It applies to velyxlabs.in and the services offered through it, not to any separate product or client system we build under a specific agreement.",
    ],
  },
  {
    h: "Information we collect",
    body: [
      "We collect only what we need to respond to you and run this site:",
      {
        list: [
          "Information you give us — your name, email address, company, and anything you write when you fill in the contact form, subscribe to our dispatch, or book a call.",
          "Booking information — when you schedule a call, our scheduling provider processes the details needed to confirm and manage that booking.",
          "Automatically collected data — basic technical and usage information such as your browser type, device, approximate location, referring pages, and interactions with the site, collected through cookies and similar technologies.",
        ],
      },
    ],
  },
  {
    h: "How we use your information",
    body: [
      "We use the information we collect to:",
      {
        list: [
          "Respond to enquiries and communicate with you about a potential or ongoing engagement.",
          "Schedule and manage calls you book with us.",
          "Send our newsletter or dispatch if you have subscribed (you can unsubscribe at any time).",
          "Operate, maintain, secure, and improve the website.",
          "Comply with legal obligations and enforce our terms.",
        ],
      },
      "We do not sell your personal information.",
    ],
  },
  {
    h: "Cookies and analytics",
    body: [
      "We use cookies and similar technologies to keep the site working and to understand how it is used through privacy-respecting analytics. You can control or block cookies through your browser settings; some parts of the site may not function as intended if you do.",
    ],
  },
  {
    h: "Third-party services",
    body: [
      "We rely on trusted third-party providers to run this site and our operations — for example, hosting, analytics, scheduling, and email. These providers process data only as needed to deliver their service to us, under their own privacy and security obligations.",
      "The site may also link to third-party websites. We are not responsible for the privacy practices of those sites, and we encourage you to read their policies.",
    ],
  },
  {
    h: "Data retention",
    body: [
      "We keep personal information only for as long as needed for the purposes described here — to respond to you, maintain our relationship, meet legal or accounting requirements, and resolve disputes. When it is no longer needed, we delete or anonymise it.",
    ],
  },
  {
    h: "Your rights",
    body: [
      "Depending on where you live, you may have the right to access, correct, delete, or restrict the use of your personal information, and to withdraw consent or unsubscribe at any time. To make a request, email us at the address below and we will respond within a reasonable period.",
    ],
  },
  {
    h: "Security",
    body: [
      "We take reasonable technical and organisational measures to protect your information. No method of transmission or storage is completely secure, however, so we cannot guarantee absolute security.",
    ],
  },
  {
    h: "Children",
    body: [
      "This site is not directed to children under 16, and we do not knowingly collect personal information from them.",
    ],
  },
  {
    h: "Changes to this policy",
    body: [
      "We may update this Privacy Policy from time to time. When we do, we will revise the “last updated” date above. Significant changes may be highlighted on this page.",
    ],
  },
  {
    h: "Contact us",
    body: [
      "If you have any questions about this Privacy Policy or how we handle your information, email us at velyxlabs@gmail.com.",
    ],
  },
];

export default function Privacy() {
  return (
    <>
      <Seo title="Privacy Policy" description="How Velyx Labs collects, uses, and protects the information you share through this website." path="/privacy" />
      <LegalPage
      kicker="PRIVACY"
      title="Privacy"
      titleSerif="policy."
      updated="24 JULY 2026"
      intro="How Velyx Labs collects, uses, and protects the information you share through this website."
      sections={SECTIONS}
      />
    </>
  );
}
