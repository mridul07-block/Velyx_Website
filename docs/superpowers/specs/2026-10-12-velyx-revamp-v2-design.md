# Velyx Labs revamp v2: design spec

Date: 2026-10-12 · Branch: `revamp/clean-site` · Status: awaiting user review

## Goal

Raise the Velyx Labs site to the level of the five references the user chose, without losing what already works. More founders should take the next step: an intro call (Cal.com) or the trial week.

## What the user decided

- **Keep the bones (option 1):**
  - black-and-white theme
  - the Kargul type scale from commit `79df807`
  - the isometric service-card animations
  - the dome-and-lattice footer scene
- **New official logo:** a black geometric "V" (`~/Downloads/Minimalist Black V Emblem.png`). It replaces the old mark everywhere.
- **Pricing:** the trial week plus tiers. No "Book a call" button in pricing.
- **Booking:** the main navbar CTA and the hero CTA open a page with the Cal.com calendar.
- **Section choices, in page order:**
  - Navbar (Altair) with a free-audit row above it (Kargul).
  - Hero (Kargul, as now) with a Maydit-style "Intro call" button.
  - Clients: Kargul layout, Bricx popup and hover sound.
  - Services: as now (Kargul).
  - One statement plus numbers.
  - Selected work and More work (Altair).
  - Process, "three weeks, one trajectory" (Altair).
  - Founders.
  - Testimonials (Bricx styling and headline pattern).
  - Pricing (925 Studios structure), also as its own page.
  - Tools: as now.
  - **No FAQ.**
  - Footer: as now, laid out like Altair's.

## Assumptions (user can override)

1. **No invented proof.**
   - Every quote, client result, price and number must be real.
   - Anything missing ships as a visible-in-code `TO CONFIRM` placeholder, following the existing convention.
   - Placeholder prices render as "Custom" rather than fake numbers.
2. **Free-audit row:** goes to `/intro-call?for=audit`. That page switches its heading to "Free product audit".
3. **Intro-call button icon:** a neutral video-camera icon. If the user confirms calls run on Google Meet, swap in the Meet glyph.
4. **Testimonials:**
   - We have 3 real quotes and no photos, so cards use a monogram until the user sends photos.
   - The data model gains an optional `photo`. When it is set, the card renders the full-photo Bricx treatment.
   - The drift only runs when there are at least 6 cards, so the duplicated loop never shows the same 3 faces twice in view. With fewer cards, the row sits still and the arrows scroll it.
5. **Headline copy:**
   - Use the references' two-tone *patterns* with Velyx wording, not their exact phrases.
   - Process: "Three weeks. / One clear path." Testimonials: "Don't take our word. / Take theirs."
6. **Stack:**
   - No new runtime animation library: CSS keyframes plus small React hooks, as today.
   - Lighthouse mobile must stay ≥ 95 performance and 100 accessibility.
   - Every animation stops under `prefers-reduced-motion`.

## Page structure: Home (`/`)

### 0. Announcement row (Kargul)

- **Layout:**
  - Full-width bar, 36px tall, background `#232323`, white text.
  - Text is 13px / 600 / 18px line-height, centred.
- **Copy:** "Get your product or website audited. For free" plus a right arrow.
- **Link:** the whole bar links to `/intro-call?for=audit`.
- **Arrow hover:** the arrow nudges 3px right.
- **Not dismissible.**
- **Effect on the rest of the page:**
  - The fixed nav sits below the bar.
  - `--nav-h` and `scroll-padding-top` account for the bar.

### 1. Navbar (Altair)

- **Structure:** a floating pill nav, centred. Three separate white pills with soft shadows (this is the current structure):
  1. Logo circle with the new V mark, 42×42.
  2. Links pill: Recent Work · Pricing · Swipe file.
  3. CTA pill.
- **CTA pill:**
  - "Intro call" with a camera icon, dark (`--ink` background, white text).
  - Links to `/intro-call`.
- **Scrolling:** the navbar stays visible. Altair's hide-on-scroll is deliberately not copied, so the CTA never disappears while reading.
- **Mobile menu:** gains Pricing and Start a project.

### 2. Hero (Kargul, as now)

- **Unchanged:**
  - the big mark behind the status pill
  - status pill
  - h1
  - lead
  - "See our work"
- **New mark:** the big mark becomes the new V logo, light grey (`#d6d6d6`), same overlap.
- **Primary button:**
  - "Start a project" becomes "Intro call" in the Maydit style: dark pill, camera icon on the left, label 15/700.
  - Links to `/intro-call`.
- **Status pill:** gets Kargul's ripple dot. Two expanding rings behind the dot loop on 1.6s, offset 300ms.

### 3. Clients: "Trusted by founders and startups" (Kargul layout, Bricx popup and sound)

- **Desktop layout (≥ 761px):**
  - Kargul grid: 6 columns of 153px.
  - Cells 108px tall with a 60px inner tile.
  - The final cell is a white pill reading "And many more".
- **Mobile (< 761px):** keeps the current marquee.
- **Logos:** wordmarks in our type (17px/700, grey `#9a9a9a`). Real logo images go in when the user provides them (`logo` field on each client, optional).
- **Hover pill (Kargul):**
  - A single white pill (150×60, radius 999) sits behind the hovered tile.
  - It slides between tiles with a 250ms `cubic-bezier(.65,0,.35,1)` transition.
  - The hovered wordmark turns ink, and a 6px ink dot appears under it.
  - Keyboard focus moves the pill too: tiles are `<button>`s.
- **Popup (Bricx):**
  - **Position:** a dark card above the active tile, centred on it.
  - **Size:** max 340px wide, padding 14px 14px 12px.
  - **Look:** radius 12, background `rgba(24,24,24,.94)`, backdrop blur 8px, a 6px arrow.
  - **Content:**
    1. One sentence about what Velyx built for the client: 14/500, white.
    2. Optional "Result" line in muted white.
    3. 1–3 small chips (radius 999, `#ffffff14`) for the service types, e.g. "AI agent", "Web app".
  - **Data:** comes from `projects.js` and `testimonials.js` ENGAGEMENTS. Clients without any copy show no popup (pill only).
  - **Motion:** fades and rises 6px in 160ms.
  - **Hidden on touch devices.** A tap only moves the pill.
- **Hover sound (Bricx):**
  - **What plays:** a short soft tick from WebAudio, with no audio file.
    - sine wave at 1100–1300Hz, pitch stepping by column
    - gain envelope 0 → 0.04 → 0 over 70ms
  - **When it plays:** only after the visitor's first click or key press on the page (browser autoplay rule), and never under reduced motion.
  - **Mute:** a small speaker icon button in the section corner. It remembers the choice in `localStorage`, wrapped in try/catch.

### 4. Services (as now)

No change except copy that references "book a call".

### 5. Statement + numbers (Dualite reveal, Kargul numbers)

- **Statement:**
  - One paragraph, max 760px, centred, 28px/500/1.3, letter-spacing -0.02em.
  - **Scroll reveal:** words go from 18% to 100% opacity as the paragraph crosses the viewport, from 85% down to 40% of viewport height.
  - Built with one scroll listener writing a `--p` progress variable. Each word's opacity is computed from its index.
  - Reduced motion: shows fully.
  - Copy (draft, TO CONFIRM):
    > "Velyx Labs is a small founder-led team. We design the product, build the AI and ship the code — one team from first call to launch, so nothing gets lost in a handoff."
- **Numbers:**
  - The existing `Stats` component (72px/700), directly below.
  - Values stay `TO CONFIRM` real figures.
  - Numbers count up once when they enter view, over 1.2s ease-out. Reduced motion shows the final values.

### 6. Selected work + More work (Altair)

**Selected work:** two large dark case cards (`#161616`, radius 36, full container width).

- **Grid:** `1.25fr 1fr`.
- **Copy side (padding 64px):**
  1. Mono eyebrow, e.g. "AI · B2C SAAS": Geist Mono 11px, uppercase, 0.16em, `#8a8a8a`.
  2. Name: 48px/700/-0.03em, white.
  3. Problem: 17px, muted `#a8a8a8`.
  4. What we built: 17px, white.
  5. Outcome: 17px, muted. Hidden when no real result exists.
  6. Tag chips: mono 11px, `#ffffff12`.
  7. "Visit site ↗" (white pill), when a URL exists, and "Read the case study →" (underlined link).
- **Media side:**
  - A faint 24px grid background holding up to 3 overlapping screenshots at different depths.
  - It reuses `ProjectCover` when there is only 1 image or none.
- **Order:** cards alternate sides.
- **Which projects:** the 2 `featured` projects with the most content: Sacred Basil and Getlandy AI (TO CONFIRM).
- **Data:** each project gains `problem`, `outcome` and `url`, all optional.

**More work:** a table of rows.

- **Label:** "MORE WORK" in mono.
- **Rows:** 1px rules (`#1c1c1c1f`). Columns are `40% 1fr 1fr 48px`:
  - name at 40px/700/-0.03em
  - category at 17px muted
  - mono status (e.g. "LIVE · SACREDBASIL.COM" or "BUILT")
  - a 40px circular arrow button
- **Row hover:** the arrow fills ink and the name shifts 4px right.
- **Last row (CTA):**
  - "Your product, next." in grey `#9a9a9a`, with "Two founding places this quarter…" copy (TO CONFIRM) and a filled ink arrow.
  - Links to `/intro-call`.
- **Below the table:** an "All work and case studies →" link to `/work`.
- **Mobile:** each row stacks into 2 lines (name + arrow, then category · status).

### 7. Process: "Three weeks. / One clear path." (Altair)

A dark panel (as now).

- **Header:**
  - Two-tone h2. The first line is `#8a8a8a`, the second white, at 52px/700/-0.04em.
  - Sub-copy in muted.
- **Arc:**
  - Full-width SVG with `pathLength=1`.
  - It draws from 0 to 1 once on scroll-in over 1.6s ease-out.
  - 4 nodes, each a white dot with a pulsing halo: `@keyframes halo`, scale 1 → 1.35, opacity .55 → .2, 2.4s.
  - Each node has a dashed drop-line to its card.
- **Step cards:**
  - 4 cards: `#1f1f1f`, radius 24, 1px `#ffffff14`.
  - Each card holds a 180px isometric illustration, then a mono label "01 · DAY 1", then a title at 22/600, then copy at 15/500 muted.
  - Steps (draft, TO CONFIRM):
    1. **Intro call.** Day 1: what you're building, who it's for, what done looks like.
    2. **Trial week.** Week 1: scope, plan and a first working deliverable.
    3. **Design and build.** Weeks 2–3: design, AI and code with progress you can open every day.
    4. **Launch and handoff.** Week 3: live, measured, documented, and code you own.
- **Illustrations:** built from our existing iso kit (`iso.jsx`, `isoMatrix.js`). Each has its own looping CSS layer motion (lift, split, drop; 5–8s).
- **CTA bar inside the panel:** "Want to know what we'd change in your product?" plus an "Intro call" white pill.
- **Mobile:** the arc is hidden and the cards stack.

### 8. Founders

- The existing `TeamGrid`, retitled "Founders".
- Sizes stay as measured from Kargul (18px names, 14px roles).
- Monograms until the user sends photos.

### 9. Testimonials (Bricx)

- **Header row:**
  - Two-tone h2, 48px/500/-0.02em: line 1 at 35% black, line 2 ink.
  - "Don't take our word. / Take theirs."
  - The h2 is left-aligned. Prev/next buttons sit on the right (40×40, radius 10, `#fafafa`).
- **Track:**
  - Horizontal scroller with scroll-snap.
  - Desktop runs full-bleed from the container's left edge. Mobile has 19px padding.
- **Cards:**
  - Desktop 443×618, mobile `min(340px, 100vw - 38px)`.
  - Radius 14, 1px `#dcdde0`, 16px gap.
- **With photo:**
  - full-bleed portrait at `scale(1.05)`, going to 1 on hover over 500ms
  - a bottom gradient
  - quote 17/500/1.3 white
  - name 18/500, role "Founder @Company" 14px at 60% white
  - company logo 32px, white
- **Without photo (now):**
  - dark `#1c1c1c` card
  - huge monogram, 160px/700, `#ffffff10`, centred upper
  - the same bottom text block
- **Hover reveal:** a row rises in (grid-rows 0fr → 1fr, 300ms) with "Read the case study →" when the client has a case study. Otherwise no reveal.
- **Motion:**
  - Auto-drift at 40px/s through a rAF loop on `scrollLeft`, with the list rendered twice and wrapping at half width. Only when the card count is at least 6.
  - Pauses on hover, focus-within, touch and while the tab is hidden. Off under reduced motion.
  - Arrows `scrollBy` one card.
  - Arrows show at all widths. This fixes Bricx's weak spot of hiding them on mobile.

### 10. Pricing (925 Studios), on Home and at `/pricing`

- **Header:**
  - Mono eyebrow with a ⊕ glyph: "Simple pricing".
  - Two-tone h2: "Start small. / Scale when it works."
- **Trial week strip, first:**
  - A full-width white card, radius 24.
  - Left: "Trial week", the tilted price chip `$1500`, one line of what you get.
  - Right: a "Start your trial week" ink pill linking to `/start-a-project?plan=trial`.
- **Two tier cards (925 anatomy):**
  - 2-column grid with a 16px gap. Below 810px it becomes 1 column.
  - Card 1 is dark `#171717`. Card 2 is white.
  - Radius 15, padding 24, inner gap 42 (32 on mobile).
  - Card contents, top to bottom:
    1. 42px icon tile (radius 8)
    2. title 30/500
    3. tagline 16/500 muted
    4. **price line** (our addition): "From $X" / "$X/mo" at 36/700, or "Custom" when unconfirmed
    5. full-width CTA pill, 54px tall, inverted against the card. Label "Start a project", links to `/start-a-project?plan=<id>`. Never "Book a call".
    6. "Plan includes:" at 14/500
    7. 6–7 feature rows, each an 18px ⊕ bullet and 16/500 text
    8. closing line with a check icon: "Not the right fit after week one? You keep the plan and the work."
  - Tiers (draft, TO CONFIRM names, prices, features):
    - **Product sprint:** fixed scope, milestone delivery (2–8 weeks).
    - **Monthly partner:** ongoing design, AI and engineering capacity, pause anytime.
- **Motion:**
  - Cards and rows fade up and un-blur (blur 8px → 0, 500ms, staggered 40ms) on scroll-in.
  - Buttons use the label roll on hover: two stacked labels, `translateY(-100%)`, 300ms. This becomes the site-wide `.btn` hover.
- **`/pricing` page:** the same section, plus a short "What's included in every plan" line and the footer.

### 11. Tools (as now)

### 12. Footer (as now, Altair layout)

- **Closing block:**
  - "Let's build something amazing" over the dome scene (unchanged).
  - Adds a sub-line: "You get a reply within one working day, and an honest answer if it's not the right fit." (TO CONFIRM)
  - One "Intro call" button (Altair has a single CTA) plus a quiet "See our work" text link.
- **Bottom row:** "© 2026 Velyx Labs" on the left, links on the right:
  - email · X · LinkedIn · Work · Pricing · Privacy · Terms
  - 14/500, muted
  - wraps centred on mobile
- **"Ask AI about Velyx Labs" row (Bricx/Maydit):**
  - A small row of 4 icon links (ChatGPT, Claude, Perplexity, Gemini).
  - Each opens the tool with a pre-filled prompt "Tell me about Velyx Labs (velyxlabs.in)", URL-encoded.
  - It sends nothing about the visitor.

## New page: `/intro-call`

- **Layout:** the Layout with nav and footer, then a page head.
  - h1 "Book an intro call", or "Free product audit" when `?for=audit`.
  - Sub-line: "30 minutes with the founders. No pitch deck needed."
  - A full-width `CalEmbed`, 720px tall.
- **Embed loading:** loads immediately, since this page exists only for it.
- **Fallback:** an "Open the booking page" link if the script is blocked. This reuses the existing `CalButton` fallback.
- **Pre-render and SEO:** pre-rendered like the other routes, with its own title and description, and added to `sitemap.xml`.

## Removed

- The FAQ section on Home: the component and data stay in the repo, unused.
- The "Start a project" hero button: moves to pricing and the mobile menu.
- The old logo assets:
  - Cloudinary `LOGO_ICON`
  - `velyx-mark-hero.webp`, `velyx-mark-nav.webp`
  - favicons and OG image, once the new ones are generated

## New logo assets

- **Vector:** potrace the 1254px PNG into `public/brand/velyx-v.svg`, a single path, viewBox trimmed.
  - Render it inline, so a `currentColor` fill works on light and dark.
  - Keep the PNG as `public/brand/velyx-v-source.png`, git-ignored if it is large.
- **Favicons:** regenerate 32, 192, 512 and the 180 apple-touch icon: white V on `#232323`, rounded.
- **OG image:** regenerate at 1200×630 on `#efefef` with the V and the wordmark.

## Non-functional requirements

- **Accessibility:**
  - Lighthouse mobile accessibility 100 on `/`, `/pricing` and `/intro-call`.
  - Every interactive tile is a real `<button>` or `<a>`.
  - The popup is `aria-hidden`, and its sentence also lives in the tile's `aria-label`.
  - The sound is never the only feedback.
- **Performance:**
  - Lighthouse mobile performance ≥ 95, CLS < 0.05.
  - No new dependencies over 5KB gzipped.
  - The testimonial loop and the scroll reveal pause offscreen.
- **Motion:** every loop stops under reduced motion, and content is visible by default (no content hidden behind JS).
- **Layout:** no horizontal page scroll at 390px and 1280px.
- **Tests:** existing tests stay green. New tests are listed in the plan.

## Out of scope

- Real logo images, client photos, prices and stats: those are content the user supplies.
- A CMS.
- Dark theme.
- Swipe file page changes.
- Case study page redesign, beyond the new optional fields.
