# Service pages and Case Studies — design

Date: 2026-10-17 · Status: approved in chat, awaiting spec review

## Goal

Turn each of the six services into its own page that sells the agents we can
deliver, and add a Case Studies section for three industries. Every new page
opens with a high-quality motion-graphic film that explains the offer at a
glance.

## What the user asked for (verbatim intent)

- Each service card has a **"Get your agent"** button that opens a page with
  all the agents for that service.
- The hero of each service page has a motion-graphic video, edited well,
  easy to understand, high standard.
- A **Case Studies** link in the navbar. That page lists Healthcare, Real
  estate and Automobiles; each opens its own page with a high-standard
  motion-graphic video and the services we can provide that industry.
- Agents list = "what agents we can provide them".

## Assumptions (correct me if wrong)

- The existing `/services` overview page stays; its six sections and the six
  home cards gain the "Get your agent" button.
- Agent names and descriptions are written by us from what Velyx builds; no
  invented client numbers, prices or results.
- "Get this agent" books an intro call; there is no checkout.
- Case-study pages show related portfolio projects that already exist in
  `src/data/projects.js`; no new client claims.

## Routes

| Route | Page |
|---|---|
| `/services/:slug` | Service page (6) |
| `/case-studies` | Industry index |
| `/case-studies/:slug` | Industry page (3) |

Service slugs: `ai-agents`, `voice-agents`, `ai-saas-mvps`,
`whatsapp-automation`, `web-apps`, `mobile-apps`.
Industry slugs: `healthcare`, `real-estate`, `automobile`.
Unknown slugs render the existing NotFound page. All 10 new URLs are added to
`scripts/routes.mjs` so the sitemap and prerendered share tags cover them.

Navbar order: Recent Work · Case Studies · Services · Pricing (desktop pill
nav and the mobile menu).

## Data

`src/data/services.js` — each core service gains:

- `slug` (above)
- `film`: `{ src, poster, w: 1600, h: 1000 }`
- `agents`: 3–5 of `{ name, does, plugsInto: string[] }`

`src/data/industries.js` (new) — three entries, reusing the copy, tags,
`includes` and `niches` already on the `healthcare`, `realestate` and
`automotive` service records (which move here; `SERVICES` then holds only
the six core services and `INDUSTRY_IDS` / `CORE_SERVICES` are removed):

- `slug`, `title`, `copy`, `film`
- `problems`: 3–4 one-line pain points
- `agents`: 4–5, same shape as above
- `services`: core-service slugs we offer that industry (links to them)
- `work`: project slugs from `projects.js` shown as related work

### Agent lists

| Service | Agents |
|---|---|
| AI agents | Lead qualifier · Inbox triage · Follow-up agent · Document & invoice processor · Research & reporting agent |
| Voice agents | AI receptionist · Outbound lead caller · Appointment reminder & rescheduler · Support line agent · Feedback & survey caller |
| WhatsApp automation | Booking agent · Lead nurture agent · Order & payment updates · Re-engagement campaigns · Support FAQ agent |
| AI SaaS & MVPs | AI copilot in your product · Onboarding agent · Support agent · Analytics agent |
| Web apps | AI chat & lead-capture agent · SEO content agent · Booking agent |
| Mobile apps | In-app AI assistant · Push re-engagement agent · Support agent |

| Industry | Agents | Related work |
|---|---|---|
| Healthcare | AI receptionist · Patient intake agent · WhatsApp appointment reminders · Insurance & claims helper · Reports follow-up | get-credentialing-done, unitas-emergency |
| Real estate | Lead qualifier · Site-visit booking agent · Listing & enquiry agent on WhatsApp · CRM follow-up agent · Voice caller for new leads | aurelle-residence, plainstate, estatico |
| Automobile | Service booking agent · Repair-approval agent · Parts & status updates · Workshop dashboard insights · Feedback caller | audi-service-system |

## Pages

**Service page** (`src/pages/ServicePage.jsx`)
1. Hero: eyebrow (service short name), H1 (title), one-line copy, two
   buttons (**Get your agent** → `#agents`, **Book an intro call**), and the
   film below in a rounded dark frame.
2. **Agents** (`#agents`): a grid of agent cards — name, what it does,
   "Plugs into" tags, and a **Get this agent** link to
   `/intro-call?agent=<name>`.
3. What we build: the existing `includes` list and `niches` tags.
4. Tools: the existing `tags`.
5. Closing CTA (existing component).

**Case Studies index** (`src/pages/CaseStudies.jsx`): page head + three
large cards (film poster, title, copy, "See how we help →").

**Industry page** (`src/pages/IndustryPage.jsx`): hero with film, problems
we solve, agents grid (same card component), services we provide (links to
the service pages), related work (existing `ProjectCard`s), closing CTA.

**Buttons on existing cards:** each `ServiceCard` on the home page and each
section on `/services` gets a **Get your agent →** link to its service page.

**Intro call:** `/intro-call?agent=<name>` shows "About: <name>" under the
heading and pre-fills the Cal.com booking notes with it via `CAL_CONFIG`
(`notes`). Without the param, the page is unchanged.

## Motion-graphic films (9)

Same pipeline as the Audi film: a canvas scene in a standalone HTML file that
is a pure function of `t`, rendered frame-exact with Puppeteer at 1600×1000,
60 fps, then encoded with ffmpeg (H.264, `yuv420p`, `+faststart`, CRF tuned
so each film is ≤ 3 MB) plus a WebP poster. Sources live in
`scripts/films/<slug>.html` with one shared renderer, so films can be
re-rendered; outputs go to `public/films/`.

Style: the site's dark panel, Geist type, the isometric line-art language of
the current service illustrations, green accent for "done" states.

Each film is a 12-second seamless loop telling one story in three beats,
with kinetic captions so it reads without sound:

| Film | Story |
|---|---|
| AI agents | Message lands in inbox → agent reads, qualifies, drafts reply → CRM card moves to "Qualified", owner pinged |
| Voice agents | Phone rings at 11 pm → live waveform + transcript as the agent answers → slot booked in calendar, summary sent |
| WhatsApp | Customer asks to book → chat bubbles with slot buttons → confirmation + reminder scheduled |
| AI SaaS & MVPs | Wireframe assembles into a live dashboard → AI panel answers a question → "Shipped" with users ticking up (no fake metric labels) |
| Web apps | Browser frame builds section by section → chat widget captures a lead → lead lands in inbox |
| Mobile apps | Three phone screens slide in → in-app assistant replies → push notification brings the user back |
| Healthcare | Patient call/WhatsApp → intake form auto-filled → appointment + reminder, claim checklist ticked |
| Real estate | Ad lead arrives → qualified by agent → site visit booked on map, CRM follow-up scheduled |
| Automobile | Car checked in → repair-approval message sent and approved → status updates to "Ready", feedback call |

In the browser the film uses the existing `ProductFilm` behaviour: muted,
looping, `playsInline`, plays only on screen, poster frame under reduced
motion, `preload="none"` below the fold and `metadata` in the hero.

## Testing

- Data: every core service has a unique slug, a film whose files exist on
  disk, and 3–5 agents with name, does and plugsInto; every industry's
  `services` and `work` slugs resolve.
- Routes: each of the 10 new URLs renders its H1; unknown slugs render
  NotFound.
- Service page: renders one agent card per agent, each "Get this agent"
  link carries the agent name; hero film element present.
- Cards: every home `ServiceCard` and `/services` section links to
  `/services/<slug>`.
- Nav: "Case Studies" link to `/case-studies` in desktop and mobile menus.
- Intro call: `?agent=` shows the line and puts it in Cal notes; absent →
  unchanged.
- Sitemap/meta: the 10 routes are in `scripts/routes.mjs`.
- Visual check of every new page at 1440 and 390 wide, no horizontal
  scroll; review a contact sheet of each film before shipping.

## Out of scope

Payments or self-serve signup, per-agent pricing, CMS, new client
testimonials or metrics, sound on films.
