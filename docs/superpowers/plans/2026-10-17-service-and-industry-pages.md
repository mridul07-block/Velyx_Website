# Service Pages and Case Studies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Six service pages that list the agents we can deliver, a Case Studies section for Healthcare / Real estate / Automobile, and nine motion-graphic films that open those pages.

**Architecture:** Data-driven pages, like the rest of the site: services and industries carry `slug`, `film` and `agents`; three new route components render them with one shared `AgentGrid`. Films are canvas scenes (pure functions of `t`) drawn by one shared kit, rendered frame-exact with Puppeteer and encoded with ffmpeg into `public/films/`.

**Tech Stack:** React 19, React Router 7, Vite 8, Vitest + Testing Library; Puppeteer-core + Chrome + ffmpeg + cwebp for films.

**Spec:** `docs/superpowers/specs/2026-10-17-service-and-industry-pages-design.md`

## Global Constraints

- Service slugs: `ai-agents`, `voice-agents`, `ai-saas-mvps`, `whatsapp-automation`, `web-apps`, `mobile-apps`.
- Industry slugs: `healthcare`, `real-estate`, `automobile`.
- Navbar order: Recent Work · Case Studies · Services · Pricing (desktop and mobile).
- No invented client numbers, prices or results anywhere (data test `BANNED` regex must keep passing).
- "Get this agent" books an intro call: `/intro-call?agent=<name>`; no checkout.
- Films: 1600×1000, 60 fps, 12 s seamless loop, H.264 `yuv420p` `+faststart`, ≤ 3 MB each, WebP poster; site dark palette (`#232323` panel, `#efefef` ink, `#9d9d9d` muted, `#22c55e` ok), Geist type.
- Every new page works at 390 px wide with no horizontal scroll.

## Review Focus

1. `?agent=` carrying text that isn't one of our agents (typo, spoofed link) → ignored; the page and the Cal notes stay unchanged. (Task 5 test)
2. Unknown slug like `/services/foo` or `/case-studies/bar` → the NotFound page, not a crash. (Tasks 2, 4 tests)
3. A film file missing or misnamed → caught by a test that every `film.src` and `film.poster` exists in `public/`. (Task 7 test)
4. An industry pointing at a project or service slug that doesn't exist → caught by a data test. (Task 1 test)
5. Reduced motion → films sit on their poster (existing `ProductFilm` behaviour; the hero passes `preload="metadata"` only). (Task 2 test asserts the poster attribute)

---

### Task 1: Data — slugs, agents, films; industries in their own module

**Files:**
- Modify: `src/data/services.js` (add `slug`, `film`, `agents` to the six; remove the three industry records, `INDUSTRY_IDS`, `CORE_SERVICES`)
- Create: `src/data/industries.js`
- Modify: `src/sections/home/ServicesPanel.jsx`, `src/pages/Services.jsx` (`CORE_SERVICES` → `SERVICES`)
- Modify: `src/components/ServiceCard.jsx`, `src/pages/Services.jsx`, `src/components/illustrations/IndustryArt.jsx` (remove the now-unused industry art)
- Test: `src/test/data.test.js`

**Interfaces:**
- Produces: `SERVICES: Array<{ id, slug, wide, short, title, copy, tags, art, includes, niches, film: { src, poster, w, h }, agents: Array<{ name, does, plugsInto: string[] }> }>`
- Produces: `INDUSTRIES: Array<{ slug, short, title, copy, tags, includes, niches, film, problems: string[], agents, services: string[] /* service slugs */, work: string[] /* project slugs */ }>`
- Produces: `filmFor(slug) → { src: "/films/<slug>.mp4", poster: "/films/<slug>.webp", w: 1600, h: 1000 }` exported from `services.js`.

- [ ] **Step 1: Write the failing tests** — in `src/test/data.test.js`, replace the first test in `describe("content data")` and add an industries block. Add `import { INDUSTRIES } from "../data/industries";` and `import { PROJECTS } from "../data/projects";` at the top if not already imported (PROJECTS already is).

```js
  it("has six Velyx services in a 2 + 2 + 2 layout, each with its page slug", () => {
    expect(SERVICES.map((s) => s.id)).toEqual(["agents", "voice", "saas", "whatsapp", "web", "mobile"]);
    expect(SERVICES.every((s) => s.wide)).toBe(true);
    expect(SERVICES.map((s) => s.slug)).toEqual(["ai-agents", "voice-agents", "ai-saas-mvps", "whatsapp-automation", "web-apps", "mobile-apps"]);
    for (const s of SERVICES) expect(s.tags.length).toBeGreaterThanOrEqual(4);
  });

  it("gives every service and industry 3–5 agents and a film named after its slug", () => {
    for (const x of [...SERVICES, ...INDUSTRIES]) {
      expect(x.agents.length, x.slug).toBeGreaterThanOrEqual(3);
      expect(x.agents.length, x.slug).toBeLessThanOrEqual(5);
      for (const a of x.agents) {
        expect(a.name).toBeTruthy();
        expect(a.does.length).toBeGreaterThan(30);
        expect(a.plugsInto.length).toBeGreaterThanOrEqual(2);
      }
      expect(x.film).toEqual({ src: `/films/${x.slug}.mp4`, poster: `/films/${x.slug}.webp`, w: 1600, h: 1000 });
    }
  });

  it("has the three industries, each linking only to real services and projects", () => {
    expect(INDUSTRIES.map((i) => i.slug)).toEqual(["healthcare", "real-estate", "automobile"]);
    const services = new Set(SERVICES.map((s) => s.slug));
    const projects = new Set(PROJECTS.map((p) => p.slug));
    for (const i of INDUSTRIES) {
      expect(i.problems.length).toBeGreaterThanOrEqual(3);
      for (const s of i.services) expect(services.has(s), s).toBe(true);
      for (const w of i.work) expect(projects.has(w), w).toBe(true);
    }
  });
```

Also add `INDUSTRIES` to the `BANNED` scan: change `JSON.stringify([SERVICES, STATS, ...` to `JSON.stringify([SERVICES, INDUSTRIES, STATS, ...`.

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run src/test/data.test.js`
Expected: FAIL — cannot resolve `../data/industries`.

- [ ] **Step 3: Implement.** In `src/data/services.js`:

Header comment becomes:
```js
/* The six Velyx services: wide cards (2 + 2 + 2) on the home page and
   /services, and one page each at /services/<slug> with its film and the
   agents we build. `includes` and `niches` are the detail on /services.
   TO CONFIRM: tag lists must match the stack Velyx actually uses, and the
   includes/niches lists must match what Velyx actually sells. */
export const filmFor = (slug) => ({ src: `/films/${slug}.mp4`, poster: `/films/${slug}.webp`, w: 1600, h: 1000 });
```

Add to each record, directly after `id` / `wide`:

| id | slug |
|---|---|
| agents | `slug: "ai-agents", film: filmFor("ai-agents"),` |
| voice | `slug: "voice-agents", film: filmFor("voice-agents"),` |
| saas | `slug: "ai-saas-mvps", film: filmFor("ai-saas-mvps"),` |
| whatsapp | `slug: "whatsapp-automation", film: filmFor("whatsapp-automation"),` |
| web | `slug: "web-apps", film: filmFor("web-apps"),` |
| mobile | `slug: "mobile-apps", film: filmFor("mobile-apps"),` |

and after `niches`, an `agents` array:

```js
    // agents
    agents: [
      { name: "Lead qualifier", does: "Replies to every new enquiry in minutes, asks the questions you would, and scores the lead before it reaches you.", plugsInto: ["Website forms", "Email", "WhatsApp", "CRM"] },
      { name: "Inbox triage agent", does: "Reads the shared inbox, sorts what matters, drafts replies for approval and files the rest.", plugsInto: ["Gmail", "Outlook", "Slack"] },
      { name: "Follow-up agent", does: "Chases quotes, proposals and unpaid invoices on a schedule, and stops the moment someone replies.", plugsInto: ["Email", "WhatsApp", "CRM"] },
      { name: "Document & invoice processor", does: "Pulls the fields out of invoices, forms and PDFs, checks them and pushes them into your sheets or accounting tool.", plugsInto: ["Google Drive", "Sheets", "Zoho Books", "Tally"] },
      { name: "Research & reporting agent", does: "Gathers the numbers from your tools each week and sends a short written report with what changed and why.", plugsInto: ["Sheets", "CRM", "Slack", "Email"] },
    ],
```
voice:
```js
    agents: [
      { name: "AI receptionist", does: "Answers every call in a natural voice, day or night, handles the common questions and books the appointment.", plugsInto: ["Phone line", "Calendar", "CRM"] },
      { name: "Outbound lead caller", does: "Calls new leads within minutes of them signing up, qualifies them and books a call with your team.", plugsInto: ["Ads & forms", "CRM", "Calendar"] },
      { name: "Appointment reminder & rescheduler", does: "Calls or messages before each appointment, confirms it, and moves it if the customer can't make it.", plugsInto: ["Calendar", "WhatsApp", "SMS"] },
      { name: "Support line agent", does: "Handles order status, FAQs and simple requests on the phone, and hands complex calls to a person with a summary.", plugsInto: ["Phone line", "Helpdesk", "Order system"] },
      { name: "Feedback & survey caller", does: "Calls customers after a visit or delivery, collects a rating and comments, and flags anyone unhappy.", plugsInto: ["CRM", "Sheets", "Slack"] },
    ],
```
saas:
```js
    agents: [
      { name: "AI copilot in your product", does: "An assistant inside your app that answers questions about the user's own data and takes actions for them.", plugsInto: ["Your app", "Your database", "Claude / OpenAI"] },
      { name: "Onboarding agent", does: "Walks each new user through setup, fills in what it can and nudges them until they reach the first win.", plugsInto: ["Your app", "Email", "Analytics"] },
      { name: "Support agent", does: "Answers product questions from your docs and the user's account, and opens a ticket when it can't.", plugsInto: ["Your docs", "Helpdesk", "Your app"] },
      { name: "Analytics agent", does: "Lets your team ask questions about usage and revenue in plain English and get a chart back.", plugsInto: ["Postgres", "Stripe", "Analytics"] },
    ],
```
whatsapp:
```js
    agents: [
      { name: "Booking agent", does: "Takes bookings on WhatsApp: offers open slots, confirms the choice and adds it to your calendar.", plugsInto: ["WhatsApp API", "Calendar", "CRM"] },
      { name: "Lead nurture agent", does: "Replies to every ad and website lead on WhatsApp, answers questions and keeps warm leads moving.", plugsInto: ["WhatsApp API", "Meta ads", "CRM"] },
      { name: "Order & payment updates", does: "Sends order, payment and delivery updates automatically, and answers 'where is my order?' on its own.", plugsInto: ["WhatsApp API", "Shopify", "Payments"] },
      { name: "Re-engagement campaigns", does: "Brings back past customers with timed, personal messages and books them straight from the chat.", plugsInto: ["WhatsApp API", "CRM", "Calendar"] },
      { name: "Support FAQ agent", does: "Answers the questions your team gets every day from your own policies, and hands over to a person when needed.", plugsInto: ["WhatsApp API", "Helpdesk", "Your docs"] },
    ],
```
web:
```js
    agents: [
      { name: "AI chat & lead-capture agent", does: "A chat on your site that answers visitors from your own content, captures their details and books the call.", plugsInto: ["Your website", "CRM", "Calendar"] },
      { name: "SEO content agent", does: "Drafts and updates service, location and blog pages from your expertise, ready for your review.", plugsInto: ["CMS", "Search Console", "Analytics"] },
      { name: "Booking agent", does: "Turns your site's contact form into instant booking, with reminders sent by email or WhatsApp.", plugsInto: ["Your website", "Calendar", "WhatsApp"] },
    ],
```
mobile:
```js
    agents: [
      { name: "In-app AI assistant", does: "An assistant inside your app that answers questions and does tasks for the user in a tap.", plugsInto: ["iOS & Android", "Your backend", "Claude / OpenAI"] },
      { name: "Push re-engagement agent", does: "Sends the right push notification at the right moment to bring inactive users back.", plugsInto: ["Push", "Analytics", "Your backend"] },
      { name: "Support agent", does: "Answers help questions in the app from your docs and the user's account, and escalates with context.", plugsInto: ["Your app", "Helpdesk", "Your docs"] },
    ],
```

Add `wide: true` stays on all six (already). Delete the `healthcare`, `realestate` and `automotive` records and the two trailing exports (`INDUSTRY_IDS`, `CORE_SERVICES`).

Create `src/data/industries.js` — the three records move here unchanged in `title`, `copy`, `tags`, `includes`, `niches` (copy them from the deleted service records), with:

```js
/* The industries on /case-studies: each has its own page with a film, the
   problems we solve, the agents we build, the services we use and related
   work from projects.js. */
import { filmFor } from "./services.js"; // with extension: scripts/routes.mjs loads this in Node

export const INDUSTRIES = [
  {
    slug: "healthcare",
    short: "Healthcare",
    title: "Healthcare automation & agents",
    copy: /* from the old healthcare record */,
    tags: /* … */, includes: /* … */, niches: /* … */,
    film: filmFor("healthcare"),
    problems: [
      "Phones ring all day and missed calls are missed patients",
      "Intake forms are re-typed by the front desk",
      "No-shows leave empty slots in the schedule",
      "Claims and credentialing follow-up eats staff hours",
    ],
    agents: [
      { name: "Clinic receptionist", does: "Answers patient calls and WhatsApp messages, books, moves and cancels appointments around the clock.", plugsInto: ["Phone line", "WhatsApp", "Clinic calendar"] },
      { name: "Patient intake agent", does: "Collects history, insurance and consent before the visit and fills your system, so nobody re-types forms.", plugsInto: ["Forms", "EHR / clinic software", "WhatsApp"] },
      { name: "Appointment reminders", does: "Confirms each appointment on WhatsApp, reschedules on request and fills cancelled slots from the waitlist.", plugsInto: ["WhatsApp API", "Clinic calendar"] },
      { name: "Claims & credentialing helper", does: "Tracks every claim and credentialing step, chases what's missing and tells staff what needs them.", plugsInto: ["Billing system", "Email", "Dashboards"] },
      { name: "Reports follow-up", does: "Lets patients know when results are ready and books the follow-up visit in the same message.", plugsInto: ["Lab system", "WhatsApp", "Clinic calendar"] },
    ],
    services: ["voice-agents", "whatsapp-automation", "ai-agents", "web-apps"],
    work: ["get-credentialing-done", "unitas-emergency"],
  },
  {
    slug: "real-estate",
    short: "Real estate",
    title: "Real estate automation & agents",
    /* copy, tags, includes, niches from the old realestate record */
    film: filmFor("real-estate"),
    problems: [
      "Portal and ad leads wait hours for a first reply",
      "Most enquiries aren't qualified before a visit is booked",
      "Follow-ups stop after the second message",
      "Owner statements and reports are built by hand",
    ],
    agents: [
      { name: "Lead qualifier", does: "Replies to portal, ad and WhatsApp leads in minutes, asks budget, location and timeline, and scores each buyer.", plugsInto: ["Property portals", "Meta ads", "WhatsApp", "CRM"] },
      { name: "Site-visit booking agent", does: "Offers visit slots that fit the sales team's calendar, confirms on WhatsApp and sends the location pin.", plugsInto: ["WhatsApp API", "Calendar", "Maps"] },
      { name: "Listing enquiry agent", does: "Answers questions about price, size, amenities and availability from your inventory, at any hour.", plugsInto: ["Inventory sheet", "WhatsApp", "Website"] },
      { name: "CRM follow-up agent", does: "Keeps every lead moving with timed follow-ups until they book, buy or opt out, and logs it all in the CRM.", plugsInto: ["CRM", "WhatsApp", "Email"] },
      { name: "New-lead voice caller", does: "Calls fresh leads within minutes in a natural voice, qualifies them and books the visit.", plugsInto: ["Phone line", "CRM", "Calendar"] },
    ],
    services: ["ai-agents", "voice-agents", "whatsapp-automation", "web-apps"],
    work: ["aurelle-residence", "plainstate", "estatico"],
  },
  {
    slug: "automobile",
    short: "Automobile",
    title: "Automobile automation & agents",
    /* copy, tags, includes, niches from the old automotive record */
    film: filmFor("automobile"),
    problems: [
      "Service bookings come in by phone and get lost",
      "Customers call again and again to ask for status",
      "Repair approvals stall while the car waits",
      "Parts delays aren't visible until it's too late",
    ],
    agents: [
      { name: "Service booking agent", does: "Books services by phone, WhatsApp or website, picks the slot and sends reminders before the visit.", plugsInto: ["Phone line", "WhatsApp", "DMS"] },
      { name: "Repair-approval agent", does: "Sends the estimate with photos on WhatsApp and records the customer's approval in one tap.", plugsInto: ["WhatsApp API", "DMS", "Payments"] },
      { name: "Status & parts updates", does: "Tells customers where their car is at each stage and alerts advisors when a part is late.", plugsInto: ["DMS", "WhatsApp", "Parts system"] },
      { name: "Workshop insights agent", does: "Turns the day's jobs into a live dashboard and a morning summary of what's at risk.", plugsInto: ["DMS", "Dashboards", "Email"] },
      { name: "Feedback caller", does: "Calls or messages after delivery, collects a rating and flags unhappy customers to the manager.", plugsInto: ["Phone line", "WhatsApp", "CRM"] },
    ],
    services: ["ai-agents", "voice-agents", "whatsapp-automation", "web-apps"],
    work: ["audi-service-system"],
  },
];
```
(The `/* from the old … record */` markers are copy instructions for this step, not code: paste the literal `copy`, `tags`, `includes` and `niches` values from the deleted records.)

`src/sections/home/ServicesPanel.jsx`: import `SERVICES` instead of `CORE_SERVICES` and map `SERVICES`. `src/pages/Services.jsx`: same (two `.map` calls).

Remove the now-unused industry art: in `ServiceCard.jsx` and `pages/Services.jsx` the import becomes `import { VoiceArt } from "./illustrations/IndustryArt";` (`"../components/illustrations/IndustryArt"` in Services) and the `ART` maps drop `healthcare`, `realestate`, `automotive`. In `IndustryArt.jsx` delete `HealthcareArt`, `RealEstateArt`, `AutomotiveArt` and their comments; keep `HubScene`, `calendar` and `VoiceArt`.

- [ ] **Step 4: Run the suite**

Run: `npx vitest run`
Expected: PASS, all tests. Then `npx eslint src` — no output.

- [ ] **Step 5: Commit**

```bash
git add src/data src/sections/home/ServicesPanel.jsx src/pages/Services.jsx src/components/ServiceCard.jsx src/components/illustrations/IndustryArt.jsx src/test/data.test.js
git commit -m "data: service slugs, agents and films; industries in their own module"
```

---

### Task 2: Service pages with the agents grid

**Files:**
- Create: `src/components/AgentGrid.jsx`, `src/pages/ServicePage.jsx`
- Modify: `src/AppRoutes.jsx`, `src/components/ProductFilm.jsx` (optional `preload` prop), `src/styles.css`
- Test: `src/test/service-pages.test.jsx`

**Interfaces:**
- Consumes: `SERVICES` (Task 1).
- Produces: `<AgentGrid agents={Agent[]} />` rendering `ul.agents > li.agent` with an `a.agent__cta` to `/intro-call?agent=<encoded name>`; route `/services/:slug`.

- [ ] **Step 1: Write the failing test** — `src/test/service-pages.test.jsx`:

```jsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import AppRoutes from "../AppRoutes";
import { SERVICES } from "../data/services";

describe("service pages", () => {
  it.each(SERVICES.map((s) => [s.slug, s]))("/services/%s shows its title, film and every agent", async (slug, s) => {
    const { container } = renderWithProviders(<AppRoutes />, { route: `/services/${slug}` });
    expect(await screen.findByRole("heading", { level: 1, name: s.title })).toBeInTheDocument();
    const film = container.querySelector(".offer__film video");
    expect(film).toHaveAttribute("src", s.film.src);
    expect(film).toHaveAttribute("poster", s.film.poster);
    expect(film).toHaveAttribute("preload", "metadata");
    const cards = container.querySelectorAll("#agents li.agent");
    expect(cards).toHaveLength(s.agents.length);
    s.agents.forEach((a, i) => {
      expect(cards[i].querySelector("h3").textContent).toBe(a.name);
      expect(cards[i].querySelector("a.agent__cta")).toHaveAttribute("href", `/intro-call?agent=${encodeURIComponent(a.name)}`);
    });
    expect(screen.getByRole("link", { name: "Get your agent" })).toHaveAttribute("href", "#agents");
  });

  it("sends an unknown service to the not-found page", async () => {
    renderWithProviders(<AppRoutes />, { route: "/services/teleportation" });
    expect(await screen.findByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/test/service-pages.test.jsx`
Expected: FAIL — headings not found (route renders NotFound).

- [ ] **Step 3: Implement.**

`src/components/ProductFilm.jsx`: signature becomes `export default function ProductFilm({ project, className = "film", preload = "none" })` and the `<video>` uses `preload={preload}`.

`src/components/AgentGrid.jsx`:
```jsx
import { Link } from "react-router-dom";
import Tag from "./Tag";

/* The agents we build for a service or an industry: what each one does,
   what it plugs into, and a link that books the intro call about it. */
export default function AgentGrid({ agents }) {
  return (
    <ul className="agents">
      {agents.map((a) => (
        <li key={a.name} className="agent">
          <h3 className="h3">{a.name}</h3>
          <p className="agent__does">{a.does}</p>
          <div className="tags tags--light">
            {a.plugsInto.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>
          <Link to={`/intro-call?agent=${encodeURIComponent(a.name)}`} className="agent__cta">
            Get this agent <span aria-hidden="true">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

`src/pages/ServicePage.jsx`:
```jsx
import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import Tag from "../components/Tag";
import BtnLabel from "../components/BtnLabel";
import IntroCallButton from "../components/IntroCallButton";
import ProductFilm from "../components/ProductFilm";
import AgentGrid from "../components/AgentGrid";
import NotFound from "./NotFound";
import { SERVICES } from "../data/services";

/* One service: its film, the agents we build for it, and what's included. */
export default function ServicePage() {
  const { slug } = useParams();
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) return <NotFound />;

  return (
    <Layout>
      <Seo title={s.title} description={s.copy} path={`/services/${s.slug}`} />
      <section className="page-head offer">
        <div className="container offer__head">
          <Link to="/services" className="case__back">← All services</Link>
          <span className="eyebrow">{s.short}</span>
          <h1 className="h1">{s.title}</h1>
          <p className="lead">{s.copy}</p>
          <div className="hero__actions">
            <a href="#agents" className="btn btn--intro"><BtnLabel>Get your agent</BtnLabel></a>
            <IntroCallButton className="btn--light">Book an intro call</IntroCallButton>
          </div>
        </div>
        <div className="container">
          <div className="offer__film">
            <ProductFilm project={{ name: s.title, video: s.film }} preload="metadata" />
          </div>
        </div>
      </section>
      <section id="agents" className="section">
        <div className="container">
          <SectionHeader align="center" title="Agents we can build for you" sub="Each one is built around your tools and your team, with a person in the loop where it matters." />
          <AgentGrid agents={s.agents} />
        </div>
      </section>
      <section className="section offer__more">
        <div className="container offer__cols">
          <div>
            <h2 className="h3">What's included</h2>
            <ul className="svc-detail__list offer__list">
              {s.includes.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="h3">Built for</h2>
            <div className="tags tags--light">{s.niches.map((n) => <Tag key={n}>{n}</Tag>)}</div>
            <h2 className="h3 offer__tools">Tools</h2>
            <div className="tags tags--light">{s.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
```

`src/AppRoutes.jsx`: add `const ServicePage = lazy(() => import("./pages/ServicePage"));` beside `Services`, and `<Route path="/services/:slug" element={<ServicePage />} />` after the `/services` route.

`src/styles.css` — append after the `.svc-detail` block:
```css
/* Service and industry pages */
.offer__head { display: flex; flex-direction: column; align-items: center; text-align: center; }
.offer__head .case__back { align-self: flex-start; margin-bottom: 24px; }
.offer__head .eyebrow { margin-bottom: 12px; }
.offer__head .lead { margin-top: 14px; max-width: 36em; }
.offer__film { margin-top: clamp(32px, 5vw, 56px); overflow: hidden; border-radius: var(--radius-panel); background: var(--panel); box-shadow: 0 30px 80px #0000001f; }
.offer__film .film { aspect-ratio: 16 / 10; }
.agents { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin-top: 40px; }
@media (max-width: 980px) { .agents { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 640px) { .agents { grid-template-columns: 1fr; } }
.agent { display: flex; flex-direction: column; gap: 14px; padding: 26px; border-radius: var(--radius-card); background: var(--card); box-shadow: 0 1px 2px #0000000a; transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s; }
.agent:hover { transform: translateY(-4px); box-shadow: 0 22px 50px #00000014; }
.agent__does { flex: 1; font-size: 14px; line-height: 22px; font-weight: 500; color: var(--muted); }
.agent .tags--light .tag { background: var(--page); }
.agent__cta { align-self: flex-start; margin-top: 4px; font-size: 14px; font-weight: 600; color: var(--ink); }
.agent__cta:hover { text-decoration: underline; text-underline-offset: 3px; }
.offer__cols { display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px 64px; }
@media (max-width: 780px) { .offer__cols { grid-template-columns: 1fr; } }
.offer__cols .h3 { margin-bottom: 14px; }
.offer__list { color: var(--ink); }
.offer__tools { margin-top: 28px; }
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/test/service-pages.test.jsx` → PASS. Then `npx vitest run` → all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/AgentGrid.jsx src/pages/ServicePage.jsx src/AppRoutes.jsx src/components/ProductFilm.jsx src/styles.css src/test/service-pages.test.jsx
git commit -m "feat: a page for each service with its film and the agents we build"
```

---

### Task 3: "Get your agent" on every service card and /services section

**Files:**
- Modify: `src/components/ServiceCard.jsx`, `src/pages/Services.jsx`, `src/styles.css`
- Test: `src/test/home-top.test.jsx`, `src/test/routes.test.jsx`

**Interfaces:**
- Consumes: `service.slug` (Task 1), route `/services/:slug` (Task 2).

- [ ] **Step 1: Write the failing tests.** In `home-top.test.jsx` inside `describe("ServicesPanel")`:
```jsx
  it("gives every card a Get your agent link to its service page", () => {
    const { container } = renderWithProviders(<ServicesPanel />);
    const links = [...container.querySelectorAll(".svc-card a.svc-card__cta")];
    expect(links.map((a) => a.getAttribute("href"))).toEqual(SERVICES.map((s) => `/services/${s.slug}`));
    for (const a of links) expect(a.textContent).toMatch(/^Get your agent/);
  });
```
In `routes.test.jsx` after the `/services details…` test:
```jsx
  it("/services links each section to its own page", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/services" });
    await screen.findByRole("heading", { level: 1, name: "Services" });
    for (const s of SERVICES) {
      expect(container.querySelector(`section#${s.id} a[href="/services/${s.slug}"]`)?.textContent).toMatch(/^Get your agent/);
    }
  });
```
(add `import { SERVICES } from "../data/services";` to `routes.test.jsx`).

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run src/test/home-top.test.jsx src/test/routes.test.jsx`
Expected: 2 FAIL (no links).

- [ ] **Step 3: Implement.**

`ServiceCard.jsx`: add `import { Link } from "react-router-dom";` and after the `.tags` div:
```jsx
      <Link to={`/services/${service.slug}`} className="svc-card__cta">
        Get your agent <span aria-hidden="true">→</span>
      </Link>
```
`pages/Services.jsx` `ServiceDetail`: add `import { Link } from "react-router-dom";` and replace the `IntroCallButton` line with
```jsx
        <div className="svc-detail__actions">
          <Link to={`/services/${service.slug}`} className="btn btn--intro svc-detail__agent"><BtnLabel>Get your agent</BtnLabel></Link>
          <IntroCallButton className="svc-detail__cta">Book an intro call</IntroCallButton>
        </div>
```
(add `import BtnLabel from "../components/BtnLabel";`).

CSS, append near `.svc-card` rules:
```css
.svc-card__cta { position: relative; z-index: 1; align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; margin-top: 18px; padding: 10px 16px; border-radius: var(--radius-pill); background: var(--on-panel); color: var(--ink); font-size: 13px; font-weight: 600; transition: background-color 0.2s, transform 0.2s; }
.svc-card__cta:hover { background: #fff; transform: translateX(2px); }
.svc-detail__actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 32px; }
.svc-detail__actions .svc-detail__cta { margin-top: 0; background: var(--panel-card); color: var(--on-panel); }
.svc-detail .svc-detail__agent { background: var(--on-panel); color: var(--ink); }
```
Check `.svc-card` is `display: flex; flex-direction: column` (`src/styles.css` ~line 354); if not, `align-self` is harmless and the link sits on its own line because it follows a block `div`.

- [ ] **Step 4: Run tests** — `npx vitest run` → all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ServiceCard.jsx src/pages/Services.jsx src/styles.css src/test/home-top.test.jsx src/test/routes.test.jsx
git commit -m "feat: Get your agent on every service card and /services section"
```

---

### Task 4: Case Studies index, industry pages and the navbar link

**Files:**
- Create: `src/pages/CaseStudies.jsx`, `src/pages/IndustryPage.jsx`, `src/test/case-studies.test.jsx`
- Modify: `src/AppRoutes.jsx`, `src/components/PillNav.jsx`, `src/styles.css`, `src/test/shell.test.jsx`

**Interfaces:**
- Consumes: `INDUSTRIES` (Task 1), `AgentGrid` (Task 2), `ProjectCard` (existing, `project` prop), `ProductFilm` with `preload`.
- Produces: routes `/case-studies`, `/case-studies/:slug`.

- [ ] **Step 1: Write the failing tests.** `src/test/case-studies.test.jsx`:
```jsx
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import AppRoutes from "../AppRoutes";
import { INDUSTRIES } from "../data/industries";
import { SERVICES } from "../data/services";

describe("case studies", () => {
  it("lists the three industries, each linking to its page", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/case-studies" });
    expect(await screen.findByRole("heading", { level: 1, name: "Case studies" })).toBeInTheDocument();
    const links = [...container.querySelectorAll("a.industry-card")].map((a) => a.getAttribute("href"));
    expect(links).toEqual(["/case-studies/healthcare", "/case-studies/real-estate", "/case-studies/automobile"]);
  });

  it.each(INDUSTRIES.map((i) => [i.slug, i]))("/case-studies/%s shows film, problems, agents, services and work", async (slug, ind) => {
    const { container } = renderWithProviders(<AppRoutes />, { route: `/case-studies/${slug}` });
    expect(await screen.findByRole("heading", { level: 1, name: ind.short })).toBeInTheDocument();
    expect(container.querySelector(".offer__film video")).toHaveAttribute("src", ind.film.src);
    expect(container.querySelectorAll(".problems li")).toHaveLength(ind.problems.length);
    expect(container.querySelectorAll("#agents li.agent")).toHaveLength(ind.agents.length);
    const svc = [...container.querySelectorAll(".industry-services a")].map((a) => a.getAttribute("href"));
    expect(svc).toEqual(ind.services.map((s) => `/services/${s}`));
    for (const s of ind.services) expect(SERVICES.some((x) => x.slug === s)).toBe(true);
    expect(container.querySelectorAll(".industry-work .pcard")).toHaveLength(ind.work.length);
  });

  it("sends an unknown industry to the not-found page", async () => {
    renderWithProviders(<AppRoutes />, { route: "/case-studies/space" });
    expect(await screen.findByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
  });
});
```
In `shell.test.jsx`, the PillNav test title becomes `"has Recent Work, Case Studies, Services, Pricing and the Start a project CTA"` and gains:
```jsx
    expect(within(nav).getAllByRole("link", { name: "Case Studies" })[0]).toHaveAttribute("href", "/case-studies");
    expect([...nav.querySelectorAll(".pnav__links a")].map((a) => a.textContent)).toEqual(["Recent Work", "Case Studies", "Services", "Pricing"]);
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run src/test/case-studies.test.jsx src/test/shell.test.jsx`
Expected: FAIL (NotFound headings; missing nav link).

- [ ] **Step 3: Implement.**

`src/components/PillNav.jsx` `LINKS`:
```js
const LINKS = [
  { label: "Recent Work", to: "/work" },
  { label: "Case Studies", to: "/case-studies" },
  { label: "Services", to: "/services" },
  { label: "Pricing", to: "/pricing" },
];
```

`src/pages/CaseStudies.jsx`:
```jsx
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import { INDUSTRIES } from "../data/industries";

/* The industries we build agents for, each opening its own page. */
export default function CaseStudies() {
  return (
    <Layout>
      <Seo title="Case studies" description="How Velyx Labs builds AI agents and automation for healthcare, real estate and automobile businesses." path="/case-studies" />
      <section className="page-head">
        <div className="container">
          <SectionHeader as="h1" align="center" title="Case studies" sub="The industries we build agents for, and what changes when they're running." />
          <div className="industries">
            {INDUSTRIES.map((i) => (
              <Link key={i.slug} to={`/case-studies/${i.slug}`} className="industry-card">
                <img src={i.film.poster} width={i.film.w} height={i.film.h} alt="" loading="lazy" />
                <span className="industry-card__body">
                  <span className="h3">{i.short}</span>
                  <span className="industry-card__copy">{i.copy}</span>
                  <span className="industry-card__more">See how we help <span aria-hidden="true">→</span></span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
```

`src/pages/IndustryPage.jsx`:
```jsx
import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import Layout from "../components/Layout";
import SectionHeader from "../components/SectionHeader";
import BtnLabel from "../components/BtnLabel";
import IntroCallButton from "../components/IntroCallButton";
import ProductFilm from "../components/ProductFilm";
import AgentGrid from "../components/AgentGrid";
import ProjectCard from "../components/ProjectCard";
import NotFound from "./NotFound";
import { INDUSTRIES } from "../data/industries";
import { SERVICES } from "../data/services";
import { PROJECTS } from "../data/projects";

/* One industry: its film, the problems we solve, the agents and services
   we bring, and related work. */
export default function IndustryPage() {
  const { slug } = useParams();
  const ind = INDUSTRIES.find((x) => x.slug === slug);
  if (!ind) return <NotFound />;
  const services = ind.services.map((s) => SERVICES.find((x) => x.slug === s));
  const work = ind.work.map((w) => PROJECTS.find((p) => p.slug === w));

  return (
    <Layout>
      <Seo title={`${ind.short} — case study`} description={ind.copy} path={`/case-studies/${ind.slug}`} />
      <section className="page-head offer">
        <div className="container offer__head">
          <Link to="/case-studies" className="case__back">← All case studies</Link>
          <span className="eyebrow">Case study</span>
          <h1 className="h1">{ind.short}</h1>
          <p className="lead">{ind.copy}</p>
          <div className="hero__actions">
            <a href="#agents" className="btn btn--intro"><BtnLabel>Get your agent</BtnLabel></a>
            <IntroCallButton className="btn--light">Book an intro call</IntroCallButton>
          </div>
        </div>
        <div className="container">
          <div className="offer__film">
            <ProductFilm project={{ name: ind.title, video: ind.film }} preload="metadata" />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeader align="center" title="What we fix" />
          <ul className="problems">
            {ind.problems.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </section>
      <section id="agents" className="section">
        <div className="container">
          <SectionHeader align="center" title={`Agents we build for ${ind.short.toLowerCase()}`} sub="Built around your tools and your team, with a person in the loop where it matters." />
          <AgentGrid agents={ind.agents} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeader align="center" title="Services we provide" />
          <ul className="industry-services">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`}>
                  <span className="h3">{s.title}</span>
                  <span className="industry-services__copy">{s.copy}</span>
                  <span aria-hidden="true" className="industry-services__arrow">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeader align="center" title="Related work" />
          <div className="work-grid industry-work">
            {work.map((p) => <ProjectCard key={p.slug} project={p} />)}
          </div>
        </div>
      </section>
    </Layout>
  );
}
```
Before writing, check the class name the Work page uses around its `ProjectCard` list (`src/pages/Work.jsx:40`'s parent) and use that class in place of `work-grid` so cards get the existing grid styles.

`src/AppRoutes.jsx`: lazy imports `CaseStudies`, `IndustryPage`; routes `<Route path="/case-studies" element={<CaseStudies />} />` and `<Route path="/case-studies/:slug" element={<IndustryPage />} />` after the services routes.

CSS, append to the "Service and industry pages" block:
```css
.industries { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin-top: 40px; }
@media (max-width: 980px) { .industries { grid-template-columns: 1fr; max-width: 560px; margin-inline: auto; } }
.industry-card { display: flex; flex-direction: column; overflow: hidden; border-radius: var(--radius-card); background: var(--card); box-shadow: 0 1px 2px #0000000a; transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s; }
.industry-card:hover { transform: translateY(-6px); box-shadow: 0 28px 60px #00000017; }
.industry-card img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 10; object-fit: cover; background: var(--panel); }
.industry-card__body { display: flex; flex-direction: column; gap: 10px; padding: 22px 24px 26px; }
.industry-card__copy { font-size: 14px; line-height: 22px; font-weight: 500; color: var(--muted); }
.industry-card__more { margin-top: 6px; font-size: 14px; font-weight: 600; }
.problems { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; max-width: 920px; margin: 32px auto 0; }
@media (max-width: 640px) { .problems { grid-template-columns: 1fr; } }
.problems li { position: relative; padding: 20px 22px 20px 50px; border-radius: 18px; background: var(--card); font-size: 15px; line-height: 23px; font-weight: 500; }
.problems li::before { content: ""; position: absolute; left: 22px; top: 27px; width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--ok); }
.industry-services { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; max-width: 920px; margin: 32px auto 0; }
@media (max-width: 640px) { .industry-services { grid-template-columns: 1fr; } }
.industry-services a { position: relative; display: flex; flex-direction: column; gap: 8px; height: 100%; padding: 24px 56px 24px 24px; border-radius: var(--radius-card); background: var(--panel); color: var(--on-panel); transition: background-color 0.2s; }
.industry-services a:hover { background: #000; }
.industry-services__copy { font-size: 14px; line-height: 22px; color: var(--on-panel-muted); }
.industry-services__arrow { position: absolute; right: 24px; top: 24px; font-size: 18px; }
.industry-work { margin-top: 32px; }
```

- [ ] **Step 4: Run tests** — `npx vitest run` → all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/CaseStudies.jsx src/pages/IndustryPage.jsx src/AppRoutes.jsx src/components/PillNav.jsx src/styles.css src/test/case-studies.test.jsx src/test/shell.test.jsx
git commit -m "feat: Case Studies in the navbar, with a page per industry"
```

---

### Task 5: Intro call knows which agent you asked about

**Files:**
- Modify: `src/pages/IntroCall.jsx`, `src/components/CalEmbed.jsx`, `src/styles.css`
- Test: `src/test/intro-call.test.jsx`

**Interfaces:**
- Consumes: agent names from `SERVICES` and `INDUSTRIES`.
- Produces: `<CalEmbed eager notes?: string />` merging `{ notes }` into `CAL_CONFIG`.

- [ ] **Step 1: Write the failing tests** (append to `intro-call.test.jsx`; it already imports `renderWithProviders`, `IntroCall`, `screen`):
```jsx
  it("names the agent you asked about", () => {
    renderWithProviders(<IntroCall />, { route: "/intro-call?agent=AI%20receptionist" });
    expect(screen.getByText("About: AI receptionist")).toBeInTheDocument();
  });

  it("ignores an agent name we don't offer", () => {
    const { container } = renderWithProviders(<IntroCall />, { route: "/intro-call?agent=Free%20money%20bot" });
    expect(container.textContent).not.toMatch(/Free money bot/);
    expect(container.querySelector(".intro-call__about")).toBeNull();
  });
```
And for the embed (new describe in the same file; add `import CalEmbed from "../components/CalEmbed";` and `import { vi } from "vitest";` if absent):
```jsx
describe("CalEmbed notes", () => {
  it("passes the agent into the booking notes", async () => {
    vi.resetModules();
    const seen = [];
    vi.doMock("@calcom/embed-react", () => ({ default: (props) => { seen.push(props.config); return null; } }));
    const { default: Embed } = await import("../components/CalEmbed");
    renderWithProviders(<Embed eager notes="Interested in: AI receptionist" />);
    expect(seen.at(-1)).toMatchObject({ layout: "month_view", notes: "Interested in: AI receptionist" });
    vi.doUnmock("@calcom/embed-react");
  });
});
```
(Remove the unused static `CalEmbed` import if lint flags it.)

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run src/test/intro-call.test.jsx`
Expected: FAIL on "names the agent" and "passes the agent into the booking notes".

- [ ] **Step 3: Implement.**

`CalEmbed.jsx`: signature `export default function CalEmbed({ eager = false, notes })`, and `config={notes ? { ...CAL_CONFIG, notes } : CAL_CONFIG}`.

`IntroCall.jsx`: add imports `import { SERVICES } from "../data/services";` and `import { INDUSTRIES } from "../data/industries";`, then above the component:
```js
// Only names we actually offer can appear on the page or in the booking.
const AGENT_NAMES = new Set([...SERVICES, ...INDUSTRIES].flatMap((x) => x.agents.map((a) => a.name)));
```
inside the component after `audit`:
```js
  const agent = AGENT_NAMES.has(params.get("agent")) ? params.get("agent") : null;
```
and render below the `SectionHeader`:
```jsx
          {agent && <p className="intro-call__about">About: {agent}</p>}
          <CalEmbed eager notes={agent ? `Interested in: ${agent}` : undefined} />
```
CSS:
```css
.intro-call__about { width: fit-content; margin: -8px auto 20px; padding: 6px 14px; border-radius: var(--radius-pill); background: var(--card); font-size: 13px; font-weight: 600; }
```

- [ ] **Step 4: Run tests** — `npx vitest run` → all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/IntroCall.jsx src/components/CalEmbed.jsx src/styles.css src/test/intro-call.test.jsx
git commit -m "feat: intro call names the agent you asked about and notes it in the booking"
```

---

### Task 6: Sitemap and share tags for the 10 new pages

**Files:**
- Modify: `scripts/routes.mjs`
- Test: `src/test/meta.test.js`

- [ ] **Step 1: Write the failing test** (append inside the describe):
```js
  it("lists every service and case-study page for the sitemap and share tags", () => {
    const paths = ROUTES.map((r) => r.path);
    for (const p of ["/case-studies", "/case-studies/healthcare", "/case-studies/real-estate", "/case-studies/automobile",
      "/services/ai-agents", "/services/voice-agents", "/services/ai-saas-mvps", "/services/whatsapp-automation", "/services/web-apps", "/services/mobile-apps"]) {
      expect(paths, p).toContain(p);
    }
  });
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run src/test/meta.test.js` → FAIL.

- [ ] **Step 3: Implement** — in `scripts/routes.mjs` add imports
```js
import { SERVICES } from "../src/data/services.js";
import { INDUSTRIES } from "../src/data/industries.js";
```
After the `/services` entry:
```js
  ...SERVICES.map((s) => ({ path: `/services/${s.slug}`, title: s.title, desc: s.copy, priority: 0.8, changefreq: "monthly" })),
  { path: "/case-studies", title: "Case studies", desc: "How Velyx Labs builds AI agents and automation for healthcare, real estate and automobile businesses.", priority: 0.8, changefreq: "monthly" },
  ...INDUSTRIES.map((i) => ({ path: `/case-studies/${i.slug}`, title: `${i.short} — case study`, desc: i.copy, priority: 0.7, changefreq: "monthly" })),
```

- [ ] **Step 4: Verify** — `npx vitest run` → all PASS; `npm run build` → "sitemap.xml written — N URLs" with N 10 higher than before, and `prerender-meta: wrote` count 10 higher.

- [ ] **Step 5: Commit**

```bash
git add scripts/routes.mjs src/test/meta.test.js public/sitemap.xml
git commit -m "seo: sitemap and share tags for service and case-study pages"
```

---

### Task 7: The nine films

**Files:**
- Create: `scripts/films/kit.js`, `scripts/films/render.mjs`, `scripts/films/<slug>.html` ×9
- Create: `public/films/<slug>.mp4` and `public/films/<slug>.webp` ×9
- Test: `src/test/data.test.js`

**Interfaces:**
- Consumes: `film.src` / `film.poster` paths from Task 1.
- Produces: `film(spec)` in `kit.js` → sets `window.ready = { DUR, FPS }` and `window.draw(t)`; `node scripts/films/render.mjs <slug> [preview]`.

- [ ] **Step 1: Write the failing test** (append to `describe("content data")`):
```js
  it("has every film and poster on disk, each film under 3 MB", async () => {
    const { existsSync, statSync } = await import("node:fs");
    for (const x of [...SERVICES, ...INDUSTRIES]) {
      expect(existsSync(`public${x.film.src}`), x.film.src).toBe(true);
      expect(existsSync(`public${x.film.poster}`), x.film.poster).toBe(true);
      expect(statSync(`public${x.film.src}`).size, x.film.src).toBeLessThanOrEqual(3 * 1024 * 1024);
    }
  });
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run src/test/data.test.js` → FAIL on `/films/ai-agents.mp4`.

- [ ] **Step 3: Write the kit** — `scripts/films/kit.js`. A film is three 4-second beats. The left column carries the kinetic caption (step, two-line headline, sub line, progress ticks); the right is a dark stage where items appear on cue. Every item fades and rises in over 0.5 s at `a`, and everything leaves together over 11.3–11.8 s so frame 12.0 equals frame 0.0. A slow sinusoidal camera drift keeps the stage alive and loops exactly.

```js
/* Velyx film kit: draws one frame of a film at time t (seconds). Pure
   function of t — frame-exact, seamless 12 s loop. Load from a scene
   HTML with <script src="kit.js"> then call film(spec). */
const W = 1600, H = 1000, FPS = 60, DUR = 12, EXIT = 11.3;
const C = { bg: "#1b1b1b", stage: "#232323", card: "#2d2d2d", card2: "#353535", line: "#ffffff1c", line2: "#ffffff33", ink: "#efefef", muted: "#9d9d9d", dim: "#6b6b6b", ok: "#22c55e", okTint: "#1f3a28" };
const SX = 650, SY = 110, SW = 870, SH = 780; // the stage
const c01 = (u) => Math.max(0, Math.min(1, u));
const span = (t, a, b) => c01((t - a) / (b - a));
const out = (u) => 1 - Math.pow(1 - u, 4);
const inout = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const FONT = (s, w = 500) => `${w} ${s}px Geist`;

let ctx;
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function fillStroke(fill, stroke = C.line, lw = 1.5) { if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } }
function text(s, x, y, size, color = C.ink, weight = 500, align = "left") { ctx.font = FONT(size, weight); ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "alphabetic"; ctx.fillText(s, x, y); }
function typed(s, u) { return s.slice(0, Math.round(s.length * c01(u))); }
function wrap(s, maxW, size, weight = 500) {
  ctx.font = FONT(size, weight); const words = s.split(" "); const lines = []; let cur = "";
  for (const w of words) { const next = cur ? `${cur} ${w}` : w; if (ctx.measureText(next).width > maxW && cur) { lines.push(cur); cur = w; } else cur = next; }
  if (cur) lines.push(cur); return lines;
}
function check(x, y, r, u = 1) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = C.ok; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - r * 0.45, y); ctx.lineTo(x - r * 0.1, y + r * 0.35); ctx.lineTo(x + r * 0.5, y - r * 0.35);
  ctx.strokeStyle = "#0b2414"; ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.setLineDash([r * 2, r * 2]); ctx.lineDashOffset = r * 2 * (1 - c01(u)); ctx.stroke(); ctx.setLineDash([]);
}
function shadow(on) { ctx.shadowColor = on ? "#00000066" : "transparent"; ctx.shadowBlur = on ? 40 : 0; ctx.shadowOffsetY = on ? 16 : 0; }

/* Item painters — (item, t, local u since appear) in stage coordinates. */
const PAINT = {
  win(it) {
    shadow(true); rr(it.x, it.y, it.w, it.h, 18); fillStroke(C.card, C.line); shadow(false);
    rr(it.x, it.y, it.w, 44, [18, 18, 0, 0]); ctx.fillStyle = "#ffffff08"; ctx.fill();
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(it.x + 22 + i * 16, it.y + 22, 4.5, 0, Math.PI * 2); ctx.fillStyle = C.line2; ctx.fill(); }
    text(it.title, it.x + 80, it.y + 28, 15, C.muted, 600);
  },
  row(it, t) {
    const done = it.done != null && t >= it.done; const du = it.done != null ? span(t, it.done, it.done + 0.35) : 0;
    rr(it.x, it.y, it.w, 50, 12); fillStroke(it.hot ? C.card2 : "transparent", it.hot ? C.line2 : C.line);
    if (done) check(it.x + 26, it.y + 25, 10, du); else { ctx.beginPath(); ctx.arc(it.x + 26, it.y + 25, 9, 0, Math.PI * 2); ctx.strokeStyle = C.line2; ctx.lineWidth = 1.5; ctx.stroke(); }
    text(it.label, it.x + 48, it.y + 31, 16, it.dim ? C.dim : C.ink, 500);
    if (it.pill) {
      const label = done ? it.pill[1] : it.pill[0]; ctx.font = FONT(12, 600); const pw = ctx.measureText(label).width + 20;
      rr(it.x + it.w - pw - 14, it.y + 14, pw, 22, 11); fillStroke(done ? C.okTint : "#ffffff0d", done ? C.ok : C.line);
      text(label, it.x + it.w - pw / 2 - 14, it.y + 29, 12, done ? C.ok : C.muted, 600, "center");
    }
  },
  bubble(it, t, u) {
    const lines = wrap(it.text, it.w - 36, 16); const h = 22 + lines.length * 23 + 8;
    const x = it.side === "out" ? it.x + (it.right ?? 0) : it.x;
    rr(x, it.y, it.w, h, 18); fillStroke(it.side === "out" ? C.okTint : C.card2, it.side === "out" ? "#22c55e66" : C.line);
    if (u < 0.35) { for (let i = 0; i < 3; i++) { const b = Math.sin((t * 8) - i) * 0.5 + 0.5; ctx.beginPath(); ctx.arc(x + 26 + i * 14, it.y + h / 2, 4, 0, Math.PI * 2); ctx.fillStyle = `rgba(239,239,239,${0.3 + b * 0.5})`; ctx.fill(); } return; }
    const shown = typed(it.text, span(u, 0.35, 0.35 + it.text.length / 70)); const sl = wrap(shown, it.w - 36, 16);
    sl.forEach((l, i) => text(l, x + 18, it.y + 30 + i * 23, 16, C.ink, 500));
  },
  chip(it, t) {
    const done = it.done != null && t >= it.done; ctx.font = FONT(15, 500); const w = ctx.measureText(it.text).width + 56;
    rr(it.x, it.y, w, 38, 19); fillStroke(done ? C.okTint : "#ffffff0a", done ? "#22c55e88" : C.line);
    if (done) check(it.x + 19, it.y + 19, 8, span(t, it.done, it.done + 0.3));
    else { ctx.save(); ctx.translate(it.x + 19, it.y + 19); ctx.rotate(t * 6); ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 1.4); ctx.strokeStyle = C.muted; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }
    text(it.text, it.x + 38, it.y + 24, 15, done ? C.ink : C.muted, 500);
  },
  wave(it, t) {
    const live = t < (it.until ?? 99); const n = Math.floor(it.w / 10);
    for (let i = 0; i < n; i++) {
      const env = Math.sin((i / n) * Math.PI); const v = live ? (0.25 + 0.75 * Math.abs(Math.sin(t * 7 + i * 0.55) * Math.cos(t * 3.1 + i * 0.21))) * env : 0.06;
      const h = Math.max(3, v * it.h); rr(it.x + i * 10, it.y + (it.h - h) / 2, 5, h, 2.5); ctx.fillStyle = live ? C.ok : C.dim; ctx.fill();
    }
  },
  ring(it, t) {
    const live = t < (it.until ?? 99);
    if (live) for (let k = 0; k < 3; k++) { const p = ((t * 0.9 + k / 3) % 1); ctx.beginPath(); ctx.arc(it.x, it.y, 34 + p * 60, 0, Math.PI * 2); ctx.strokeStyle = `rgba(34,197,94,${0.5 * (1 - p)})`; ctx.lineWidth = 2; ctx.stroke(); }
    ctx.beginPath(); ctx.arc(it.x, it.y, 34, 0, Math.PI * 2); ctx.fillStyle = live ? C.ok : C.card2; ctx.fill();
    const s = live ? Math.sin(t * 30) * 0.12 : 0; ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(s);
    ctx.beginPath(); ctx.roundRect(-9, -15, 18, 30, 5); ctx.strokeStyle = live ? "#0b2414" : C.ink; ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore();
    if (it.label) text(it.label, it.x, it.y + 70, 14, C.muted, 600, "center");
  },
  cal(it, t) {
    rr(it.x, it.y, it.w, it.h, 16); fillStroke(C.card, C.line);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]; const cw = (it.w - 40) / 5; const rows = 4; const rh = (it.h - 70) / rows;
    days.forEach((d, i) => text(d, it.x + 20 + cw * i + cw / 2, it.y + 36, 13, C.muted, 600, "center"));
    for (let c = 0; c < 5; c++) for (let r = 0; r < rows; r++) {
      const picked = it.slot[0] === c && it.slot[1] === r && t >= it.pick; const busy = (c * 3 + r * 5) % 4 === 0;
      rr(it.x + 24 + cw * c, it.y + 54 + rh * r, cw - 8, rh - 8, 8);
      fillStroke(picked ? C.ok : busy ? "#ffffff10" : "transparent", picked ? null : C.line);
      if (picked) { const u = span(t, it.pick, it.pick + 0.35); check(it.x + 24 + cw * c + (cw - 8) / 2, it.y + 54 + rh * r + (rh - 8) / 2, 9 * out(u) + 0.01, u); }
    }
  },
  toast(it) {
    shadow(true); rr(it.x, it.y, it.w, 74, 16); fillStroke("#3a3a3a", C.line2); shadow(false);
    ctx.beginPath(); ctx.arc(it.x + 28, it.y + 37, 7, 0, Math.PI * 2); ctx.fillStyle = C.ok; ctx.fill();
    text(it.title, it.x + 50, it.y + 32, 16, C.ink, 600); text(it.sub, it.x + 50, it.y + 55, 14, C.muted, 500);
  },
  kanban(it, t) {
    const cw = (it.w - 16 * (it.cols.length - 1)) / it.cols.length;
    it.cols.forEach((name, i) => { const x = it.x + i * (cw + 16); rr(x, it.y, cw, it.h, 16); fillStroke("#ffffff06", C.line); text(name, x + 18, it.y + 32, 14, C.muted, 600); });
    (it.ghosts ?? []).forEach(([col, row]) => { rr(it.x + col * (cw + 16) + 14, it.y + 52 + row * 64, cw - 28, 52, 10); fillStroke("#ffffff08", C.line); });
    const m = inout(span(t, it.card.move, it.card.move + 0.9)); const col = it.card.from + (it.card.to - it.card.from) * m;
    const x = it.x + col * (cw + 16) + 14, y = it.y + 52 + Math.sin(m * Math.PI) * -26;
    shadow(m > 0 && m < 1); rr(x, y, cw - 28, 52, 10); fillStroke(m >= 1 ? C.okTint : C.card2, m >= 1 ? "#22c55e88" : C.line2); shadow(false);
    text(it.card.label, x + 16, y + 32, 15, C.ink, 600);
  },
  bars(it, t) {
    rr(it.x, it.y, it.w, it.h, 16); fillStroke(C.card, C.line); if (it.title) text(it.title, it.x + 20, it.y + 34, 14, C.muted, 600);
    const n = it.vals.length; const bw = (it.w - 40) / n;
    it.vals.forEach((v, i) => { const u = out(span(t, it.a + 0.3 + i * 0.08, it.a + 0.9 + i * 0.08)); const h = v * (it.h - 80) * u;
      rr(it.x + 20 + i * bw + 6, it.y + it.h - 20 - h, bw - 12, h, 6); ctx.fillStyle = i === n - 1 ? C.ok : "#ffffff26"; ctx.fill(); });
  },
  phone(it) {
    shadow(true); rr(it.x, it.y, it.w, it.h, 34); fillStroke("#202020", C.line2, 2); shadow(false);
    rr(it.x + it.w / 2 - 36, it.y + 14, 72, 18, 9); ctx.fillStyle = "#000"; ctx.fill();
    if (it.title) text(it.title, it.x + it.w / 2, it.y + 62, 14, C.muted, 600, "center");
  },
  browser(it) {
    shadow(true); rr(it.x, it.y, it.w, it.h, 18); fillStroke(C.card, C.line); shadow(false);
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(it.x + 22 + i * 16, it.y + 22, 4.5, 0, Math.PI * 2); ctx.fillStyle = C.line2; ctx.fill(); }
    rr(it.x + 80, it.y + 10, it.w - 100, 24, 12); fillStroke("#ffffff0a", null); text(it.url, it.x + 96, it.y + 27, 13, C.muted, 500);
  },
  block(it, t, u) {
    rr(it.x, it.y, it.w, it.h, 12); fillStroke(it.fill ?? "#ffffff0a", C.line);
    (it.lines ?? []).forEach(([lx, ly, lw, lh = 12, col = "#ffffff26"], i) => { const p = out(span(u, 0.15 + i * 0.12, 0.6 + i * 0.12)); rr(it.x + lx, it.y + ly, lw * p, lh, lh / 2); ctx.fillStyle = col; ctx.fill(); });
    if (it.label) text(it.label, it.x + 18, it.y + 30, 15, C.ink, 600);
  },
  label(it) { text(it.text, it.x, it.y, it.size ?? 15, it.color ?? C.muted, it.weight ?? 600, it.align ?? "left"); },
  wire(it, t, u) {
    const p = out(c01(u / 0.6)); const pts = it.pts; let total = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); total += d; }
    ctx.setLineDash([5, 7]); ctx.strokeStyle = C.line2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(...pts[0]);
    let left = total * p; for (let i = 1; i < pts.length && left > 0; i++) { const f = Math.min(1, left / seg[i - 1]); ctx.lineTo(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f); left -= seg[i - 1]; }
    ctx.stroke(); ctx.setLineDash([]);
    if (p >= 1) { let d = ((t * 220) % total); for (let i = 1; i < pts.length; i++) { if (d <= seg[i - 1]) { const f = d / seg[i - 1]; ctx.beginPath(); ctx.arc(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f, 4, 0, Math.PI * 2); ctx.fillStyle = C.ok; ctx.fill(); break; } d -= seg[i - 1]; } }
  },
  cursor(it, t) {
    const path = it.path; let x = path[0][0], y = path[0][1];
    for (let i = 1; i < path.length; i++) { const m = inout(span(t, path[i - 1][2], path[i][2])); if (t >= path[i - 1][2]) { x = path[i - 1][0] + (path[i][0] - path[i - 1][0]) * m; y = path[i - 1][1] + (path[i][1] - path[i - 1][1]) * m; } }
    if (it.click != null && t > it.click && t < it.click + 0.5) { const p = span(t, it.click, it.click + 0.5); ctx.beginPath(); ctx.arc(x, y, 8 + p * 26, 0, Math.PI * 2); ctx.strokeStyle = `rgba(239,239,239,${0.6 * (1 - p)})`; ctx.lineWidth = 2; ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 26); ctx.lineTo(x + 7, y + 19); ctx.lineTo(x + 18, y + 19); ctx.closePath(); ctx.fillStyle = C.ink; ctx.fill(); ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5; ctx.stroke();
  },
};

function caption(spec, t) {
  const x = 96;
  text("VELYX LABS", x, 150, 13, C.muted, 700); text(spec.title.toUpperCase(), x + 108, 150, 13, C.ok, 700);
  spec.beats.forEach((b, i) => {
    const t0 = i * 4;
    // beat 0 is fully shown at t=0 and fades back in at the loop seam
    let vis = i === 0 ? Math.max(1 - span(t, 3.6, 4), out(span(t, 11.6, 12))) : span(t, t0, t0 + 0.5) * (1 - span(t, t0 + 3.6, t0 + 4));
    if (i === 0 && t < 11.6 && t >= 4) vis = 0;
    if (vis <= 0) return;
    const enter = i === 0 && t < 4 ? 1 : out(span(t, i === 0 ? 11.6 : t0, (i === 0 ? 11.6 : t0) + 0.5));
    ctx.save(); ctx.globalAlpha = vis; ctx.translate(0, (1 - enter) * 28);
    text(`0${i + 1}`, x, 420, 18, C.ok, 700); text(" / 03", x + 26, 420, 18, C.dim, 600);
    b.head.forEach((l, k) => text(l, x, 490 + k * 64, 54, C.ink, 700));
    wrap(b.sub, 470, 21).forEach((l, k) => text(l, x, 490 + b.head.length * 64 + 18 + k * 30, 21, C.muted, 500));
    ctx.restore();
  });
  for (let i = 0; i < 3; i++) {
    const fill = t >= 11.8 ? 0 : span(t, i * 4, i * 4 + 4);
    rr(x + i * 64, 840, 52, 4, 2); ctx.fillStyle = "#ffffff1f"; ctx.fill();
    rr(x + i * 64, 840, 52 * fill, 4, 2); ctx.fillStyle = C.ok; ctx.fill();
  }
}

function film(spec) {
  const canvas = document.getElementById("c"); ctx = canvas.getContext("2d");
  window.ready = { DUR, FPS };
  window.draw = async (t) => {
    await document.fonts.ready;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#ffffff07"; ctx.lineWidth = 1;
    for (let gx = 0; gx <= W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx + 0.5, 0); ctx.lineTo(gx + 0.5, H); ctx.stroke(); }
    for (let gy = 0; gy <= H; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy + 0.5); ctx.lineTo(W, gy + 0.5); ctx.stroke(); }
    caption(spec, t);
    // stage + slow drift that loops exactly
    const z = 1.015 + 0.015 * Math.sin((t / DUR) * Math.PI * 2);
    const dx = 6 * Math.sin((t / DUR) * Math.PI * 2), dy = 4 * Math.cos((t / DUR) * Math.PI * 2);
    rr(SX, SY, SW, SH, 32); fillStroke(C.stage, C.line);
    ctx.save(); rr(SX, SY, SW, SH, 32); ctx.clip();
    ctx.translate(SX + SW / 2 + dx, SY + SH / 2 + dy); ctx.scale(z, z); ctx.translate(-SW / 2, -SH / 2);
    const leave = out(span(t, EXIT, EXIT + 0.5));
    for (const it of spec.items) {
      if (t < it.a) continue;
      const u = t - it.a; const e = out(c01(u / 0.5));
      const gone = it.d != null ? out(span(t, it.d, it.d + 0.4)) : leave;
      const alpha = e * (1 - gone); if (alpha <= 0.001) continue;
      ctx.save(); ctx.globalAlpha = alpha; ctx.translate(0, (1 - e) * 18 + gone * 12);
      PAINT[it.k](it, t, u); ctx.restore();
    }
    ctx.restore();
  };
  window.draw(0);
}
window.film = film;
```

- [ ] **Step 4: Write the renderer** — `scripts/films/render.mjs`:
```js
/* Renders scripts/films/<slug>.html to public/films/<slug>.mp4 + .webp.
   `preview` writes a contact sheet to the system temp dir instead.
   Needs Chrome, ffmpeg and cwebp; puppeteer-core is resolved from
   PUPPETEER_CORE (a path) or the package name. */
import { spawn, execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const [, , slug, mode] = process.argv;
const puppeteer = (await import(process.env.PUPPETEER_CORE || "puppeteer-core")).default;
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", args: ["--allow-file-access-from-files"] });
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 1000 });
page.on("pageerror", (e) => { console.error("PAGEERR", e.message); process.exitCode = 1; });
await page.goto(`file://${resolve("scripts/films", `${slug}.html`)}`, { waitUntil: "load" });
const { DUR, FPS } = await page.evaluate(() => window.ready);
const frame = (t) => page.evaluate(async (tt) => { await window.draw(tt); return document.getElementById("c").toDataURL("image/png"); }, t).then((d) => Buffer.from(d.split(",")[1], "base64"));

if (mode === "preview") {
  const dir = mkdtempSync(join(tmpdir(), `film-${slug}-`));
  const times = [0.6, 1.6, 3, 4.6, 5.6, 7, 8.6, 9.6, 11];
  for (let i = 0; i < times.length; i++) writeFileSync(join(dir, `${i}.png`), await frame(times[i]));
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", join(dir, "%d.png"), "-vf", "scale=800:-1,tile=3x3", "-frames:v", "1", join(dir, "sheet.jpg")]);
  console.log(join(dir, "sheet.jpg"));
} else {
  const crf = process.env.CRF || "26";
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", crf, "-pix_fmt", "yuv420p", "-movflags", "+faststart", `public/films/${slug}.mp4`], { stdio: ["pipe", "inherit", "inherit"] });
  const n = Math.round(DUR * FPS);
  for (let i = 0; i < n; i++) { if (!ff.stdin.write(await frame(i / FPS))) await new Promise((r) => ff.stdin.once("drain", r)); }
  ff.stdin.end(); await new Promise((r) => ff.on("close", r));
  const poster = join(tmpdir(), `${slug}-poster.png`); writeFileSync(poster, await frame(9.6));
  execFileSync("cwebp", ["-quiet", "-q", "82", poster, "-o", `public/films/${slug}.webp`]);
  console.log(`public/films/${slug}.mp4`);
}
await browser.close();
```
Run from the project root: `mkdir -p public/films`, then `PUPPETEER_CORE=/Users/atharvism/.npm/_npx/702923228c2ce1e6/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js node scripts/films/render.mjs <slug> [preview]`.

- [ ] **Step 5: Write the nine scenes.** Every scene file is this HTML with its own `film({...})` spec:
```html
<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=block">
<style>html,body{margin:0;background:#000}canvas{display:block}</style></head><body>
<canvas id="c" width="1600" height="1000"></canvas>
<script src="kit.js"></script>
<script>
film(/* SPEC */);
</script></body></html>
```
Stage coordinates run 0–870 across and 0–780 down. Specs:

`ai-agents.html`
```js
{ title: "AI agents",
  beats: [
    { head: ["A lead writes in", "at 11:42 pm."], sub: "Your inbox, forms and WhatsApp, watched all night." },
    { head: ["The agent reads,", "qualifies, replies."], sub: "Checks the fit, drafts the answer, sends it in your voice." },
    { head: ["Your CRM updates", "itself."], sub: "The lead moves to Qualified and you get a ping." } ],
  items: [
    { k: "win", a: 0.3, x: 40, y: 40, w: 390, h: 300, title: "Inbox" },
    { k: "row", a: 0.9, x: 60, y: 100, w: 350, label: "Priya S. · Pricing for 20 seats?", hot: true },
    { k: "row", a: 1.1, x: 60, y: 160, w: 350, label: "Weekly report", dim: true },
    { k: "row", a: 1.3, x: 60, y: 220, w: 350, label: "Invoice #2041", dim: true },
    { k: "wire", a: 4.1, pts: [[410, 125], [460, 125]] },
    { k: "win", a: 4.2, x: 460, y: 40, w: 370, h: 430, title: "Velyx agent" },
    { k: "chip", a: 4.6, x: 480, y: 100, text: "Reading the message", done: 5.3 },
    { k: "chip", a: 5.3, x: 480, y: 150, text: "Team size: 40 · good fit", done: 6.0 },
    { k: "chip", a: 6.0, x: 480, y: 200, text: "Buying this quarter", done: 6.7 },
    { k: "bubble", a: 6.7, x: 480, y: 260, w: 330, side: "out", text: "Hi Priya, 20 seats works. Here's a 15-minute slot tomorrow." },
    { k: "kanban", a: 8.1, x: 40, y: 500, w: 790, h: 240, cols: ["New", "Qualified", "Booked"], ghosts: [[1, 1], [2, 0]], card: { label: "Priya S. · 20 seats", from: 0, to: 1, move: 8.8 } },
    { k: "toast", a: 9.9, x: 470, y: 400, w: 360, title: "You've got a qualified lead", sub: "Priya S. · reply already sent" } ] }
```

`voice-agents.html`
```js
{ title: "Voice agents",
  beats: [
    { head: ["The phone rings", "after hours."], sub: "No missed calls. The agent picks up on the first ring." },
    { head: ["It talks like", "your best rep."], sub: "Natural voice, live transcript, answers from your info." },
    { head: ["Booked, logged,", "summarised."], sub: "The slot is in your calendar and the summary in your CRM." } ],
  items: [
    { k: "ring", a: 0.4, x: 200, y: 200, until: 4.3, label: "Incoming · +91 98•• ••4410" },
    { k: "label", a: 0.8, x: 360, y: 190, text: "11:07 pm", size: 34, color: "#efefef", weight: 700 },
    { k: "label", a: 1.0, x: 360, y: 226, text: "Office closed · agent on", size: 16 },
    { k: "win", a: 4.2, x: 40, y: 320, w: 790, h: 250, title: "Live call" },
    { k: "wave", a: 4.4, x: 70, y: 380, w: 300, h: 70, until: 8.2 },
    { k: "bubble", a: 4.8, x: 400, y: 372, w: 400, side: "in", text: "Hi, can I get a check-up this week?" },
    { k: "bubble", a: 6.0, x: 400, y: 462, w: 400, side: "out", text: "Of course. Thursday 10 am or Friday 4 pm?" },
    { k: "cal", a: 8.2, x: 40, y: 600, w: 470, h: 170, slot: [3, 1], pick: 8.9 },
    { k: "toast", a: 9.6, x: 530, y: 640, w: 300, title: "Booked · Thu 10:00", sub: "Summary saved to CRM" } ] }
```

`whatsapp-automation.html`
```js
{ title: "WhatsApp automation",
  beats: [
    { head: ["A customer asks", "on WhatsApp."], sub: "Where they already are, any time of day." },
    { head: ["The agent offers", "real slots."], sub: "Live availability, one tap to pick." },
    { head: ["Confirmed, with", "a reminder set."], sub: "Your calendar fills itself. No-shows drop." } ],
  items: [
    { k: "phone", a: 0.3, x: 60, y: 30, w: 360, h: 720, title: "WhatsApp" },
    { k: "bubble", a: 0.9, x: 86, y: 110, w: 280, side: "in", text: "Hi! Do you have a slot this Saturday?" },
    { k: "bubble", a: 4.2, x: 86, y: 220, w: 300, side: "out", text: "Yes! Pick one that suits you:" },
    { k: "chip", a: 4.9, x: 100, y: 318, text: "Sat 11:00" },
    { k: "chip", a: 5.1, x: 100, y: 368, text: "Sat 12:30", done: 6.6 },
    { k: "chip", a: 5.3, x: 100, y: 418, text: "Sat 15:00" },
    { k: "cursor", a: 5.6, path: [[330, 560, 5.6], [190, 386, 6.4]], click: 6.5 },
    { k: "bubble", a: 7.0, x: 86, y: 480, w: 300, side: "out", text: "Done ✓ Saturday 12:30. See you then!" },
    { k: "cal", a: 8.2, x: 470, y: 60, w: 360, h: 300, slot: [4, 1], pick: 8.8 },
    { k: "row", a: 9.2, x: 470, y: 400, w: 360, label: "Reminder · Fri 18:00", pill: ["Scheduled", "Set"], done: 9.8 },
    { k: "toast", a: 10.0, x: 470, y: 480, w: 360, title: "New booking", sub: "Saturday 12:30 · via WhatsApp" } ] }
```

`ai-saas-mvps.html`
```js
{ title: "AI SaaS & MVPs",
  beats: [
    { head: ["From a sketch", "to a product."], sub: "We design and build the whole thing, end to end." },
    { head: ["AI that works", "on your data."], sub: "Your users ask in plain English and get answers." },
    { head: ["Shipped, and", "ready to grow."], sub: "Auth, billing and admin built in, not bolted on." } ],
  items: [
    { k: "browser", a: 0.3, x: 40, y: 40, w: 790, h: 480, url: "app.yourproduct.com" },
    { k: "block", a: 0.8, x: 60, y: 96, w: 170, h: 404, lines: [[18, 24, 110], [18, 60, 90], [18, 92, 120], [18, 124, 80]] },
    { k: "block", a: 1.3, x: 250, y: 96, w: 560, h: 60, lines: [[18, 24, 220, 14, "#ffffff40"]] },
    { k: "bars", a: 1.8, x: 250, y: 176, w: 330, h: 324, title: "Active users", vals: [0.25, 0.35, 0.3, 0.48, 0.55, 0.7, 0.86] },
    { k: "block", a: 2.3, x: 600, y: 176, w: 210, h: 150, lines: [[18, 30, 120], [18, 70, 160, 28, "#ffffff1f"]] },
    { k: "block", a: 2.6, x: 600, y: 346, w: 210, h: 154, lines: [[18, 30, 100], [18, 70, 150, 28, "#ffffff1f"]] },
    { k: "win", a: 4.3, x: 380, y: 300, w: 450, h: 260, title: "Ask AI" },
    { k: "bubble", a: 4.8, x: 400, y: 360, w: 410, side: "in", text: "Which customers are likely to churn?" },
    { k: "bubble", a: 6.0, x: 400, y: 440, w: 410, side: "out", text: "3 accounts dropped usage 40%. Want a check-in email for each?" },
    { k: "chip", a: 8.3, x: 40, y: 600, text: "Auth & roles", done: 8.7 },
    { k: "chip", a: 8.6, x: 230, y: 600, text: "Billing", done: 9.0 },
    { k: "chip", a: 8.9, x: 380, y: 600, text: "Admin panel", done: 9.3 },
    { k: "chip", a: 9.2, x: 570, y: 600, text: "Deployed", done: 9.6 },
    { k: "toast", a: 9.9, x: 40, y: 670, w: 420, title: "v1.0 is live", sub: "Built to grow, not to be rebuilt" } ] }
```

`web-apps.html`
```js
{ title: "Web apps",
  beats: [
    { head: ["A site built", "section by section."], sub: "Designed for your buyers, fast on every device." },
    { head: ["A chat that", "captures leads."], sub: "Answers visitors from your content, day and night." },
    { head: ["Leads land in", "your inbox."], sub: "With the call already booked." } ],
  items: [
    { k: "browser", a: 0.3, x: 40, y: 40, w: 560, h: 700, url: "yourbusiness.com" },
    { k: "block", a: 0.8, x: 64, y: 96, w: 512, h: 200, fill: "#ffffff10", lines: [[28, 50, 300, 22, "#ffffff4d"], [28, 90, 220, 22, "#ffffff4d"], [28, 140, 120, 30, "#22c55e"]] },
    { k: "block", a: 1.5, x: 64, y: 316, w: 160, h: 150, lines: [[16, 24, 80], [16, 56, 120], [16, 80, 100]] },
    { k: "block", a: 1.8, x: 240, y: 316, w: 160, h: 150, lines: [[16, 24, 80], [16, 56, 120], [16, 80, 100]] },
    { k: "block", a: 2.1, x: 416, y: 316, w: 160, h: 150, lines: [[16, 24, 80], [16, 56, 120], [16, 80, 100]] },
    { k: "block", a: 2.5, x: 64, y: 486, w: 512, h: 230, lines: [[28, 40, 260], [28, 74, 380], [28, 108, 330]] },
    { k: "win", a: 4.3, x: 420, y: 380, w: 410, h: 340, title: "Chat with us" },
    { k: "bubble", a: 4.8, x: 440, y: 440, w: 370, side: "in", text: "Do you build booking systems?" },
    { k: "bubble", a: 5.9, x: 440, y: 520, w: 370, side: "out", text: "Yes! Want a quick call? Leave your email." },
    { k: "bubble", a: 7.0, x: 440, y: 620, w: 260, side: "in", text: "rahul@studio.in" },
    { k: "wire", a: 8.1, pts: [[620, 380], [620, 320], [650, 320]] },
    { k: "win", a: 8.2, x: 650, y: 40, w: 180, h: 300, title: "Inbox" },
    { k: "toast", a: 8.8, x: 420, y: 140, w: 410, title: "New lead · Rahul", sub: "Call booked for Tue 11:00" } ] }
```

`mobile-apps.html`
```js
{ title: "Mobile apps",
  beats: [
    { head: ["One codebase,", "iOS and Android."], sub: "Designed, built and shipped to the stores." },
    { head: ["An assistant", "inside the app."], sub: "Users get answers and tasks done in a tap." },
    { head: ["Bring users", "back, on time."], sub: "The right nudge at the right moment." } ],
  items: [
    { k: "phone", a: 0.3, x: 40, y: 60, w: 250, h: 520, title: "Home" },
    { k: "phone", a: 0.6, x: 310, y: 20, w: 250, h: 520, title: "Assistant" },
    { k: "phone", a: 0.9, x: 580, y: 60, w: 250, h: 520, title: "Orders" },
    { k: "block", a: 1.3, x: 62, y: 110, w: 206, h: 120, fill: "#ffffff10", lines: [[16, 30, 120, 16, "#ffffff4d"], [16, 70, 80, 24, "#22c55e"]] },
    { k: "block", a: 1.6, x: 62, y: 250, w: 206, h: 70, lines: [[16, 28, 140]] },
    { k: "block", a: 1.8, x: 602, y: 110, w: 206, h: 70, lines: [[16, 28, 120]] },
    { k: "block", a: 2.0, x: 602, y: 196, w: 206, h: 70, lines: [[16, 28, 150]] },
    { k: "bubble", a: 4.4, x: 326, y: 100, w: 218, side: "in", text: "Reorder my usual?" },
    { k: "bubble", a: 5.4, x: 326, y: 190, w: 218, side: "out", text: "Done. Arrives tomorrow by 10 am." },
    { k: "chip", a: 6.6, x: 334, y: 310, text: "Order placed", done: 7.2 },
    { k: "toast", a: 8.4, x: 160, y: 620, w: 550, title: "Your favourites are back in stock", sub: "Tap to reorder in one step" },
    { k: "cursor", a: 9.4, path: [[700, 760, 9.4], [480, 660, 10.1]], click: 10.2 } ] }
```

`healthcare.html`
```js
{ title: "Healthcare",
  beats: [
    { head: ["A patient calls", "the clinic."], sub: "Answered at once, even at 8 am on a Sunday." },
    { head: ["Intake done", "before the visit."], sub: "History, insurance and consent, filled in for staff." },
    { head: ["Booked, reminded,", "and followed up."], sub: "Fewer no-shows. Claims tracked to the end." } ],
  items: [
    { k: "ring", a: 0.4, x: 170, y: 170, until: 4.2, label: "Patient · new appointment" },
    { k: "bubble", a: 1.2, x: 300, y: 120, w: 500, side: "in", text: "Hi, I need to see a dermatologist this week." },
    { k: "win", a: 4.2, x: 40, y: 290, w: 480, h: 300, title: "Patient intake" },
    { k: "row", a: 4.6, x: 60, y: 350, w: 440, label: "Name & date of birth", pill: ["Asking", "Filled"], done: 5.2 },
    { k: "row", a: 4.9, x: 60, y: 410, w: 440, label: "Medical history", pill: ["Asking", "Filled"], done: 6.0 },
    { k: "row", a: 5.2, x: 60, y: 470, w: 440, label: "Insurance & consent", pill: ["Asking", "Filled"], done: 6.8 },
    { k: "cal", a: 8.1, x: 540, y: 290, w: 290, h: 300, slot: [2, 2], pick: 8.7 },
    { k: "row", a: 9.0, x: 40, y: 620, w: 380, label: "WhatsApp reminder · day before", pill: ["Queued", "Set"], done: 9.6 },
    { k: "row", a: 9.3, x: 440, y: 620, w: 390, label: "Claim checklist", pill: ["Open", "Ready"], done: 10.0 },
    { k: "toast", a: 10.1, x: 230, y: 690, w: 420, title: "Wed 4:30 pm · Dr. Mehta", sub: "Intake complete · reminder set" } ] }
```

`real-estate.html`
```js
{ title: "Real estate",
  beats: [
    { head: ["A portal lead", "arrives."], sub: "Answered in minutes, not hours." },
    { head: ["Qualified before", "anyone calls."], sub: "Budget, area and timeline, asked and scored." },
    { head: ["Site visit booked,", "CRM up to date."], sub: "Follow-ups keep going until they buy or opt out." } ],
  items: [
    { k: "win", a: 0.3, x: 40, y: 40, w: 420, h: 220, title: "New lead · 99acres" },
    { k: "label", a: 0.8, x: 64, y: 140, text: "Ananya R.", size: 26, color: "#efefef", weight: 700 },
    { k: "label", a: 1.0, x: 64, y: 176, text: "3 BHK · Whitefield · enquiry 9:14 pm", size: 16 },
    { k: "bubble", a: 4.2, x: 480, y: 40, w: 350, side: "out", text: "Hi Ananya! What budget and move-in date are you planning?" },
    { k: "bubble", a: 5.3, x: 480, y: 150, w: 350, side: "in", text: "Around 1.4 Cr, within 3 months." },
    { k: "chip", a: 6.2, x: 480, y: 250, text: "Budget fits", done: 6.6 },
    { k: "chip", a: 6.5, x: 650, y: 250, text: "Ready to buy", done: 6.9 },
    { k: "kanban", a: 8.1, x: 40, y: 320, w: 790, h: 210, cols: ["New", "Qualified", "Visit booked"], ghosts: [[0, 1], [1, 1]], card: { label: "Ananya R. · 3 BHK", from: 0, to: 2, move: 8.8 } },
    { k: "cal", a: 9.0, x: 40, y: 560, w: 420, h: 190, slot: [4, 0], pick: 9.6 },
    { k: "toast", a: 10.0, x: 480, y: 600, w: 350, title: "Site visit · Sat 11 am", sub: "Location pin sent on WhatsApp" } ] }
```

`automobile.html`
```js
{ title: "Automobile",
  beats: [
    { head: ["A car checks in", "for service."], sub: "Booked by WhatsApp, tracked from the gate." },
    { head: ["Approvals in", "one tap."], sub: "The estimate goes out with photos. The customer says yes." },
    { head: ["Ready, on time.", "Customer told."], sub: "Status updates go out without a single phone call." } ],
  items: [
    { k: "win", a: 0.3, x: 40, y: 40, w: 500, h: 330, title: "Job card · KA 03 MN 4410" },
    { k: "row", a: 0.9, x: 60, y: 100, w: 460, label: "Checked in · 9:02 am", pill: ["Now", "Done"], done: 1.6 },
    { k: "row", a: 1.4, x: 60, y: 160, w: 460, label: "Inspection", pill: ["Running", "Done"], done: 3.2 },
    { k: "row", a: 1.8, x: 60, y: 220, w: 460, label: "Repair approval", pill: ["Waiting", "Approved"], done: 6.9 },
    { k: "row", a: 2.2, x: 60, y: 280, w: 460, label: "Ready for delivery", pill: ["Pending", "Ready"], done: 9.2 },
    { k: "phone", a: 4.2, x: 570, y: 40, w: 260, h: 520, title: "WhatsApp" },
    { k: "bubble", a: 4.7, x: 590, y: 100, w: 220, side: "out", text: "Front brake pads worn. Replace for ₹4,200?" },
    { k: "block", a: 5.2, x: 590, y: 226, w: 220, h: 110, fill: "#ffffff10", lines: [[16, 20, 120], [16, 46, 160, 40, "#ffffff1f"]] },
    { k: "chip", a: 5.8, x: 600, y: 356, text: "Approve", done: 6.8 },
    { k: "cursor", a: 6.0, path: [[760, 520, 6.0], [650, 374, 6.6]], click: 6.7 },
    { k: "bars", a: 8.2, x: 40, y: 400, w: 500, h: 240, title: "Today's workshop", vals: [0.5, 0.65, 0.4, 0.8, 0.7, 0.9] },
    { k: "toast", a: 9.4, x: 300, y: 670, w: 530, title: "Your car is ready", sub: "Sent to the customer · 4:45 pm, as promised" } ] }
```

- [ ] **Step 6: Preview each film and tune.** For each slug run the renderer in `preview` mode and open the printed `sheet.jpg`. Check: captions never overlap the stage (stage starts at x=650); nothing spills outside the stage; typed bubbles finish before the beat ends; frame 11 shows everything leaving. Adjust positions in the spec if needed and re-preview. Record any layout change as a ruling.

- [ ] **Step 7: Render all nine.** For each slug run the renderer without `preview`. If a file is over 3 MB, re-run that slug with `CRF=28`. Then `ls -la public/films`.

- [ ] **Step 8: Run tests** — `npx vitest run` → all PASS (including the film-size test); `npx eslint .` → no output.

- [ ] **Step 9: Commit**

```bash
git add scripts/films public/films src/test/data.test.js
git commit -m "feat: nine motion-graphic films for the service and case-study pages"
```

---

### Task 8: Visual check and ship

**Files:** none new (fixes go where they're found, each with a test where behaviour changes).

- [ ] **Step 1:** With the dev server on `http://localhost:5177`, screenshot `/services/ai-agents`, `/services/voice-agents`, `/case-studies`, `/case-studies/healthcare`, the home services panel and `/services` at 1440 and 390 wide; assert `document.documentElement.scrollWidth` equals the viewport width on each. Look at every screenshot.
- [ ] **Step 2:** Play one film in headful Chrome and confirm it loops without a visible jump.
- [ ] **Step 3:** `npx vitest run` → all PASS; `npm run build` → succeeds; `npx eslint .` → clean.
- [ ] **Step 4:** Push: `git push origin revamp/clean-site` and `git push origin revamp/clean-site:master`, then confirm `https://www.velyxlabs.in/films/ai-agents.mp4` returns `video/mp4` with the local file's size.
