import { useState } from "react";
import CalEmbed from "./CalEmbed";
import { track } from "../lib/analytics";
import { SERVICES } from "../data/services";

const EMAIL = "velyxlabs@gmail.com";
/* TO CONFIRM: budget ranges. */
const BUDGETS = [["trial", "Trial week ($1500)"], ["3-10k", "$3k–$10k"], ["10-25k", "$10k–$25k"], ["25k+", "$25k+"]];
const TIMELINES = [["asap", "ASAP"], ["1-3m", "1–3 months"], ["exploring", "Exploring"]];

function Choices({ legend, options, selected, onToggle }) {
  return (
    <fieldset className="choices">
      <legend>{legend}</legend>
      <div className="choices__list">
        {options.map(([key, label]) => (
          <button key={key} type="button" className="filter" aria-pressed={selected.includes(key)} onClick={() => onToggle(key)}>
            {label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

const labelOf = (options, key) => options.find(([k]) => k === key)?.[1] ?? "";

export default function BriefForm({ formKey, initialBudget = "", plan }) {
  const [status, setStatus] = useState("idle");
  const [services, setServices] = useState([]);
  const [budget, setBudget] = useState(initialBudget);
  const [timeline, setTimeline] = useState("");
  const serviceOptions = SERVICES.map((s) => [s.id, s.title]);

  const toggleService = (id) => setServices((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));

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
          subject: "New project brief — velyxlabs.in",
          from_name: "Velyx Labs website",
          ...fields,
          services: services.map((id) => labelOf(serviceOptions, id)).join(", "),
          budget: labelOf(BUDGETS, budget),
          timeline: labelOf(TIMELINES, timeline),
          ...(plan ? { plan } : {}),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Send failed");
      form.reset();
      setStatus("sent");
      track("brief_submit", { budget, plan, location: "/start-a-project" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card brief-done" role="status">
        <h2 className="h3">Thanks — we got your brief.</h2>
        <p className="muted">Pick a time below for a kickoff call, or wait for our reply by email.</p>
        <CalEmbed />
      </div>
    );
  }

  return (
    <form className="card brief" aria-label="Project brief" onSubmit={onSubmit}>
      {plan && <p className="brief__plan">Plan: {plan}</p>}
      <div className="brief__row">
        <label className="field"><span>Name</span><input name="name" type="text" autoComplete="name" required /></label>
        <label className="field"><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
      </div>
      <div className="brief__row">
        <label className="field"><span>Company <span className="muted">(optional)</span></span><input name="company" type="text" autoComplete="organization" /></label>
        <label className="field"><span>Website <span className="muted">(optional)</span></span><input name="website" type="text" inputMode="url" autoComplete="url" /></label>
      </div>
      <Choices legend="What do you need?" options={serviceOptions} selected={services} onToggle={toggleService} />
      <Choices legend="Budget" options={BUDGETS} selected={[budget]} onToggle={(k) => setBudget((v) => (v === k ? "" : k))} />
      <Choices legend="Timeline" options={TIMELINES} selected={[timeline]} onToggle={(k) => setTimeline((v) => (v === k ? "" : k))} />
      <label className="field"><span>Tell us about the project</span><textarea name="message" rows="5" required /></label>
      <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {status === "error" && (
        <p className="form-error" role="alert">
          Sorry, we couldn't send that. Please email us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      )}
      <button type="submit" className="btn btn--primary btn--block" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send brief"}
      </button>
    </form>
  );
}
