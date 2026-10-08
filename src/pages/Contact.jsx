import { useState } from "react";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import CalEmbed from "../components/CalEmbed";
import { track } from "../lib/analytics";

const EMAIL = "velyxlabs@gmail.com";

function ContactForm({ formKey }) {
  const [status, setStatus] = useState("idle");

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: formKey,
          subject: "New enquiry — velyxlabs.in",
          from_name: "Velyx Labs website",
          ...fields,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Send failed");
      form.reset();
      setStatus("sent");
      track("contact_submit", { location: "/contact" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card form-done" role="status">
        <h2 className="h3">Thanks — we got your message.</h2>
        <p className="muted">We reply within one working day. Want to talk sooner? Book a time on the calendar.</p>
      </div>
    );
  }

  return (
    <form className="card form" aria-label="Contact form" onSubmit={onSubmit}>
      <label className="field">
        <span>Name</span>
        <input name="name" type="text" autoComplete="name" required />
      </label>
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label className="field">
        <span>Company <span className="muted">(optional)</span></span>
        <input name="company" type="text" autoComplete="organization" />
      </label>
      <label className="field">
        <span>What do you want to build?</span>
        <textarea name="message" rows="5" required />
      </label>
      <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {status === "error" && (
        <p className="form-error" role="alert">
          Sorry, we couldn't send that. Please email us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      )}
      <button type="submit" className="btn btn--primary btn--block" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

export default function Contact() {
  const formKey = import.meta.env.VITE_WEB3FORMS_KEY;

  return (
    <Layout>
      <Seo
        title="Contact — book a free call"
        description="Book a free 30-minute call with Velyx Labs, or send us a message about what you want to build."
        path="/contact"
      />
      <section className="page-hero">
        <div className="container">
          <SectionHeader
            as="h1"
            eyebrow="Contact"
            title="Tell us what you want to build"
            sub="Book a free 30-minute call, or send a message and we'll get back to you."
          />
        </div>
      </section>
      <section className="section contact">
        <div className="container contact__grid">
          <div className="contact__form">
            {formKey ? (
              <ContactForm formKey={formKey} />
            ) : (
              <div className="card">
                <h2 className="h3">Email us</h2>
                <p className="muted">
                  Write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and we'll get back to you.
                </p>
              </div>
            )}
            <p className="contact__direct muted">
              Prefer email? <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              {" · "}
              <a href="https://www.linkedin.com/company/velyx-labs/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </p>
          </div>
          <CalEmbed />
        </div>
      </section>
    </Layout>
  );
}
