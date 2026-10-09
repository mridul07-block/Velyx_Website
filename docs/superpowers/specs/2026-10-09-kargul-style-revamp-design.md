# Velyx Labs — Kargul-Style Revamp — Design Spec

Date: 2026-10-09
Status: Draft for review
Builds on: branch `revamp/clean-site` (spec `2026-10-08-website-revamp-design.md`). This spec **supersedes** that spec's visual design, home sections, and page list. It keeps that spec's infrastructure: Vitest suite, Cal.com booking (`velyx-labs/30min`), Web3Forms contact delivery, `scripts/routes.mjs` → sitemap and prerender, `vercel.json` 301s, `Seo`, GA4 tracking, and the performance fixes.

## 1. Goal

Rebuild velyxlabs.in in the visual style and section structure of kargul.studio, with Velyx Labs' own services, clients, team and offer. The primary conversion is **Start a project**: booking a call or sending a brief. The secondary conversion is the **$1500 trial week**.

Success criteria:
- Home has the 11 sections in §5, in that order. Pages in §4 exist and are linked from the nav.
- Visually reads as Kargul's system (§6): light gray page, dark rounded panels, white cards, pill tags, line illustrations, centered pill nav.
- Animation at "Kargul level" (§7) and fully disabled under `prefers-reduced-motion`.
- Lighthouse mobile Performance ≥ 90 and Accessibility ≥ 95 on `/` and `/work`. No horizontal scroll at 375px.
- No fabricated content (§9).

## 2. Decisions (from user)

| Topic | Decision |
|---|---|
| Style | Same as kargul.studio: **light theme**. Light gray page with dark rounded panels for Services and Projects |
| Base | Build on `revamp/clean-site` |
| Animation | Kargul level: animated service illustrations, logo marquee, hover lifts, animated closing CTA. No preloader, custom cursor, 3D or audio |
| Work detail | Each project gets its own page `/work/:slug` |
| Pages | Home, Recent Work, Swipe File, Start a Project (contact) |
| Trial | "Start with a trial week for only $1500" |
| Services | Velyx Labs' own (§5.3) |

Changes from the previous spec, made because the user explicitly asked for them: pricing ($1500 trial) and project case studies are now **in**. The font changes from Inter to **Geist**, to match Kargul. Geist is a one-token swap back if the user prefers Inter.

## 3. Reference: Kargul visual system (observed 2026-10-09)

- Page background `#efefef`. White cards `#ffffff`. Dark panels `#232323`, with full-bleed rounded panels of radius ~40px inset 12px from the viewport edge. Inner cards on dark `#2b2b2b`. Text `#171717`, muted `#6b6b6b`. On dark: text `#fafafa`, muted `#a3a3a3`.
- Font: Geist, weights 400/500/600. Headings are tight (letter-spacing about −0.03em) and centered.
- Nav: centered and floating. A circular logo button, a white pill holding "Recent Work · Swipe file", and a white pill CTA "Start a project".
- Buttons: dark pill (primary) and white pill (secondary), 44–48px tall.
- Tags: small uppercase pills (11px, letter-spacing 0.04em). On dark panels they are `#1f1f1f` with light text.
- Services: dark panel. Top row has 3 cards, bottom row 2 wider cards. Each card holds a line-art isometric illustration at the top, a title, 2–3 lines of copy and tool tags.
- Numbers: 4 large numerals in a row on the light page, each with a muted caption.
- Project spotlights: dark panel, 3 alternating rows of image | text. Each row has a title, paragraphs, tags and a full-width "See case study →" pill.
- Team: centered grid of illustrated round avatars, each with name and role.
- Testimonials: a large white card with a photo, the quote with **bold highlight** phrases, attribution, and prev/next arrows.
- Tools: a white pill strip of tool logos.
- Trial: a white rounded card, centered. The price sits in a tilted gray pill. Copy, then a dark CTA.
- FAQ: centered column of white pill accordions with a chevron.
- Closing: "Let's build something amazing", animated, with CTAs. Then a simple footer.

## 4. Site map & redirects

| Route | Page |
|---|---|
| `/` | Home (§5) |
| `/work` | Recent Work: filterable grid (§8.1) |
| `/work/:slug` | Case study (§8.2) |
| `/swipe-file` | Swipe File: filterable image grid (§8.3) |
| `/start-a-project` | Start a Project: brief form and calendar (§8.4) |
| `/start` | Ads landing page, restyled to the new system with nav links removed |
| `/privacy`, `/terms`, `*` (404) | Restyled |

Redirects in `vercel.json` (permanent):
- `/portfolio`, `/portfolio/:slug*`, `/case-studies`, `/case-studies/:slug*` → `/work` (was `/services`)
- `/services` → `/#services`
- `/contact` → `/start-a-project`
- `/blog`, `/blog/:slug*`, `/testimonials` → `/` (unchanged)

`scripts/routes.mjs` lists `/`, `/work`, every `/work/:slug` (from `src/data/projects.js`), `/swipe-file`, `/start-a-project`, `/privacy` and `/terms`, each with its own title and description. Sitemap and prerender come from this list.

## 5. Home page (order fixed by user)

1. **Hero** (light)
   - Status pill with green dot: "Now booking projects for Q4 2026". **TO CONFIRM:** Kargul's "Accepting 3 more projects" style is allowed only if the number is true.
   - H1, centered, max ~18ch: "An AI and engineering partner for founders and growing businesses."
   - Sub: "We design and build AI agents, SaaS products, WhatsApp systems, websites and apps, end to end, with the founders in the room."
   - CTAs: **Start a project** (dark pill → `/start-a-project`) and **See our work** (white pill → `/work`).
   - Faint large Velyx "V" mark behind the badge, as Kargul does with its "K".
2. **Trusted by startups and industry leaders.** A grayscale wordmark grid of the real clients in `src/data/clients.js`. Text wordmarks until logo files are supplied (**TO CONFIRM**). Two rows on desktop; a slow marquee on mobile.
3. **Services** (dark panel, `id="services"`). Header "Services" with sub "Everything you need to launch and scale, from AI agents to the product your customers use." Five cards in a 3 + 2 layout:
   1. **Agentic AI automation**: agents that answer, qualify, follow up and file. Tags: OPENAI, CLAUDE, LANGGRAPH, N8N, CRM, EVALS.
   2. **AI SaaS & MVPs**: idea to paying users, with auth, billing and AI features. Tags: NEXT.JS, REACT, NODE.JS, SUPABASE, POSTGRES, STRIPE.
   3. **WhatsApp automation + CRM**: bookings, reminders, lead follow-up on WhatsApp. Tags: WHATSAPP API, CRM, WEBHOOKS, DASHBOARDS.
   4. **Websites & landing pages** (wide): fast, conversion-focused sites. Tags: FIGMA, REACT, NEXT.JS, FRAMER, SEO, ANALYTICS.
   5. **Mobile apps** (wide): cross-platform iOS and Android. Tags: REACT NATIVE, EXPO, FIREBASE, APP STORE.
   Each card has its own inline-SVG line illustration (§7). **TO CONFIRM:** tag lists must match the stack Velyx actually uses.
4. **Numbers.** Four stats from `src/data/stats.js`. **TO CONFIRM, all four.** Defaults derived only from facts already on the site: "11+ clients and partners", "5 services under one roof", "100% founder-led projects", and "30 min free first call". The section renders only stats present in the file.
5. **Client projects** (dark panel). Header "Project spotlights" with sub "A closer look at some of the projects we've shipped." It shows the 3 projects with `featured: true` in `projects.js`, alternating image left/right, each with a full-width "See case study →" pill linking to `/work/:slug`.
   - Default featured: **Getlandy AI** (AI personal-brand studio, SaaS), **Sacred Basil** (e-commerce brand plus business audit, which has a quote) and **YorkScreenPlay** (online auction platform).
   - Screenshots come from `~/VelyxLabs /`. **Kettler** and **Priya** appear on `/work` once described (**TO CONFIRM**).
6. **Team.** Round avatars with name and role from `src/data/team.js`: Atharv Golait (CEO & Co-founder) and Mridul (Founder). Avatars are monogram circles in Kargul's style until illustrated or real avatars are supplied (**TO CONFIRM:** other team members, avatar style).
7. **Testimonials.** A white card carousel of the 3 real quotes in `testimonials.js`, verbatim. Bold highlights mark phrases already in each quote, e.g. "**production-ready web application**". Prev/next arrow buttons and keyboard support. No autoplay.
8. **Tools we've mastered.** A white pill strip of tool logos from `src/data/tools.js` (Figma, React, Next.js, Node.js, Supabase, Postgres, OpenAI, Claude, n8n, WhatsApp, Stripe, Vercel). Logos are inline SVG or Simple Icons. Marquee on overflow. **TO CONFIRM:** the list.
9. **Trial week.** White card: "Start with a trial week for only [$1500]", with the price in a tilted gray pill. Copy (**TO CONFIRM:** what the week includes): "Work with the founders for one week. You get a kickoff call, a scoped plan and a first deliverable, so you can see how we work before committing to the full project." No conversion-rate claim (Kargul's "95%" is not ours). CTA: **Start your trial week** → `/start-a-project?plan=trial`.
10. **FAQ.** Pill accordions with 7 questions in Kargul's spirit, answers in Velyx terms:
    - "Why Velyx Labs?"
    - "Who will we work with?"
    - "How do we work together?"
    - "How does the trial week work?"
    - "What if priorities change?"
    - "Can you work with our existing tools and team?"
    - "Who owns the work?"
    Answers reuse the already-approved FAQ wording where it applies. New answers make no numeric claims.
11. **Let's build something amazing** (animated closing CTA, §7) with **Start a project** and **See our work**, then the footer: logo, © year, email, X and LinkedIn, Privacy and Terms.

## 6. Visual system (tokens)

`src/styles.css` is rewritten with these tokens; component styles follow.

```
--page: #efefef;  --card: #ffffff;  --panel: #232323;  --panel-card: #2b2b2b;
--ink: #171717;   --muted: #6b6b6b; --line: #e3e3e3;
--on-panel: #fafafa; --on-panel-muted: #a3a3a3; --panel-line: #ffffff14;
--tag-dark: #1f1f1f; --ok: #22c55e;   (status dot)
--font: "Geist", ui-sans-serif, system-ui, sans-serif;
--radius-panel: 40px; --radius-card: 24px; --radius-pill: 999px;
--container: 1120px; --gutter: clamp(16px, 4vw, 40px);
```

- Type: body 16–17px / 1.6. H1 clamp(40px, 6vw, 64px), weight 600, letter-spacing −0.035em, line-height 1.05, centered. H2 clamp(30px, 4vw, 44px), centered. Card titles 18–20px, weight 600.
- Panels: `margin-inline: 12px`, padding clamp(56px, 8vw, 96px). Inner content uses `.container`.
- Accent: none. Kargul is monochrome; the only color is the green status dot. The Velyx amber is kept only inside the logo mark.
- Focus rings are visible on light and dark (2px `--ink` / `--on-panel`).

## 7. Motion

- All motion uses CSS, IntersectionObserver or small inline SVG. **No new animation library.** Framer Motion and Three.js stay removed.
- **Service illustrations:** each card has a line-art isometric SVG (stroke `--on-panel-muted`, 1.25px) with a subtle looping animation, such as a stroke-dash "draw", layers floating 4–6px, or a pulsing node. Animation runs only while the card is in view (IntersectionObserver sets `.is-playing`).
- **Logo marquees:** CSS `translateX` loop at 40s, paused on hover.
- **Cards:** on hover, lift translateY(−4px) and deepen the shadow over 200ms.
- **Reveal:** the existing `FadeIn` (12px fade-up) on section blocks.
- **Closing CTA "Let's build something amazing":** a large headline whose words rise in sequence when scrolled into view, at 60ms stagger and 600ms each. Behind it, a slow-drifting field of the five service illustrations at low opacity. After the reveal, the CTA buttons fade in. **TO CONFIRM:** the user may share a recording of Kargul's version if a closer match is wanted.
- **Testimonial carousel:** crossfade at 250ms.
- `prefers-reduced-motion: reduce` turns off every loop, marquee, stagger and lift. Content is fully visible and static.

## 8. Pages

### 8.1 Recent Work (`/work`)
- Header "Latest projects" with sub "A selection of our recent work across AI systems, SaaS products, websites and apps."
- Filter pills: **All · AI & Automation · SaaS & Product · Websites · Mobile**. Filtering is client-side and reflected in `?type=`.
- Grid of 2 columns (1 on mobile). Each card shows the cover image, name and two tags (industry and audience, e.g. "E-COMMERCE · B2C") and links to `/work/:slug`.
- Data comes from `src/data/projects.js`. Only real projects are listed.
- Ends with the closing CTA section.

### 8.2 Case study (`/work/:slug`)
- Back link "← All work". Title, one-line summary, tags.
- Hero image, then sections: **The brief**, **What we built**, **Stack** (pill tags), **Result** (shown only if a real result is supplied) and the client quote (shown only if it exists in `testimonials.js`).
- Then a gallery of extra screenshots, a "Next project" link, and the closing CTA.
- Unknown slug → 404 page.

### 8.3 Swipe File (`/swipe-file`)
- Header "Swipe file" with sub "A raw look at recent design work across products, websites and brands."
- Filter pills: All · Product · Web · Brand.
- Masonry-style grid with no captions. Click opens the image in a lightbox (Esc and arrow keys; focus trapped while open).
- Data: `src/data/swipe.js` with `{ src, w, h, type }`. Images are lazy-loaded with explicit dimensions and served through Cloudinary transforms (`w_800,f_auto,q_auto`).
- **TO CONFIRM:** source images. Initial set: the 14 images in `~/VelyxLabs /`, uploaded to the existing Cloudinary account (or to `public/swipe/` if no Cloudinary access).

### 8.4 Start a Project (`/start-a-project`)
- Two columns. Left: header "Start a project" with sub "Tell us what you're building. We reply within one working day (**TO CONFIRM**)." Right: the brief form.
- **Form fields:**
  - Name, email and company (company optional).
  - Website (optional).
  - "What do you need?": multi-select pills of the 5 services.
  - Budget: pills "Trial week ($1500)", "$3k–$10k", "$10k–$25k" and "$25k+". **TO CONFIRM** the ranges.
  - Timeline: pills "ASAP", "1–3 months" and "Exploring".
  - "Tell us about the project": textarea.
  - `?plan=trial` pre-selects the trial budget.
- **Submit:** Web3Forms (existing delivery code and error handling, extended with the new fields). On success: "Thanks — we got your brief", followed by the inline Cal.com calendar to book the kickoff call.
- Below the form: "Prefer to talk first?", the inline Cal.com embed and an email fallback.

## 9. Content rules (unchanged, re-stated)

- Only real clients, projects, people, quotes and numbers. Kargul's figures ($1B+, 210M+, 75+, 95%) and project names are never reused.
- Every **TO CONFIRM** item ships only after the user confirms or supplies it. Until then, its data file holds the default described above. Sections whose data is empty do not render.
- Quotes are verbatim. Bold highlights may only emphasize existing words.

## 10. Code structure

- **Data:** `src/data/` holds `clients.js`, `services.js` (rewritten: 5 services with tags and an illustration key), `stats.js`, `projects.js` (`{ slug, name, summary, industry, audience, types[], featured, cover, gallery[], brief, built, stack[], result?, quoteName? }`), `team.js`, `tools.js`, `swipe.js` and `faq.js` (rewritten). `testimonials.js` is kept.
- **New components:**
  - `PillNav`
  - `Panel` (dark rounded section)
  - `Tag`
  - `ServiceCard` + `illustrations/*.jsx` (5 SVGs)
  - `Marquee`
  - `Stats`
  - `ProjectSpotlight`
  - `ProjectCard`
  - `TeamGrid`
  - `TestimonialCarousel`
  - `ToolsStrip`
  - `TrialCard`
  - `FilterPills`
  - `Lightbox`
  - `BriefForm`
  - `ClosingCTA`
- **Reused:** `Layout` (new nav and footer inside), `Seo`, `FAQ` (restyled), `CalEmbed`, `CalButton` (still used for "book a call" links), `FadeIn`/`useInView`, `ScrollManager`, `AppRoutes`.
- **Removed once replaced:** `Nav`, `Footer`, `StickyCta`, `ClientStrip`, `ProcessSteps`, `FinalCTA`, `sections/home/*`, `pages/Services.jsx`, `pages/Contact.jsx` (logic moves into `BriefForm`), `data/process.js`.
- **Font:** Geist via Google Fonts with the existing non-blocking load pattern. Remove Inter.

## 11. Verification

- `npm test`, `npm run lint` and `npm run build` pass. New tests cover:
  - Home section order
  - `/work` filters and `?type=`
  - The case-study page, including unknown slug → 404
  - Swipe filters and lightbox keyboard handling
  - BriefForm submit success, error and no-key fallback, plus `?plan=trial` pre-selection
  - Redirects
  - Routes listed in sitemap and prerender
  - A content guard that bans Kargul's numbers and names and Northwind/Sable/Halcyon
  - Reduced motion: the `is-playing` class is not applied
- Browser checks at 375px and 1440px: no horizontal scroll, the nav pill fits on mobile (it collapses to logo + "Start a project" + menu), animations run smoothly, and the Cal popup and inline calendar work.
- Lighthouse mobile ≥ 90 Performance and ≥ 95 Accessibility on `/` and `/work`.

## 12. Out of scope

CMS, blog, light/dark toggle, client logins, multi-language, and payment for the trial week (the trial is booked through the brief form and the call, not paid online).
