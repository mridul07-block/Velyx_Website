# Velyx revamp v2: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the new V logo, the free-audit bar, the Altair nav, the Intro-call booking page, the Kargul/Bricx clients grid, the statement and numbers, Altair's work and process sections, Bricx testimonials, 925 pricing (plus `/pricing`) and the Altair footer layout. Everything else on the current site stays as it is.

**Architecture:**
- **Stack:** React 19 + Vite 8 + React Router 7. A single global stylesheet, `src/styles.css`.
- **Where new code goes:**
  - New sections live in `src/sections/home/`.
  - Shared parts live in `src/components/`.
  - Pure helpers live in `src/lib/` (unit-tested).
  - Content lives in `src/data/`. Unknown facts are `TO CONFIRM`.
- **Motion:** CSS keyframes, gated by `.is-playing` from `useOnScreen` and `useReducedMotion` (existing hooks).

**Tech stack:**
- Vitest + Testing Library + jsdom.
- ESLint with the React Compiler rules. Exports from component files must be components only; put constants in `src/lib/*.js`.
- potrace (Homebrew) and cwebp for assets, plus puppeteer-core for screenshots.

**Spec:** `docs/superpowers/specs/2026-10-12-velyx-revamp-v2-design.md`

## Global Constraints

- **Never invent proof.** Quotes, results, prices and numbers must be real. Unknowns stay as `TO CONFIRM` in code. Prices without a confirmed value render "Custom".
- **No "Book a call" label** anywhere in pricing. Pricing CTAs say "Start a project" or "Start your trial week".
- **Booking:** the nav CTA and hero CTA say "Intro call" and link to `/intro-call`. The audit bar links to `/intro-call?for=audit`.
- **Theme:** black and white. The tokens in `:root` stay unchanged except `--nav-h`.
- **Dependencies:** none new at runtime. Use the existing `@calcom/embed-react` for the calendar.
- **Motion:** every loop stops under `prefers-reduced-motion` (the global rule in styles.css), and content is visible without JS motion.
- **Lighthouse mobile:**
  - performance ≥ 95
  - accessibility 100 on `/`, `/pricing` and `/intro-call`
  - CLS < 0.05
- **Layout:** no horizontal overflow at 390px and 1280px.
- **Commits:** end every commit with `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`. Never push.

## Review Focus

1. **The sound on first hover, before any click.** Expect silence and no console error: the AudioContext is created lazily, only after a user gesture. *Test:* in Task 4, `tick()` before `unlock()` is a no-op.
2. **Testimonials with fewer than 6 quotes.** Expect no drift and no duplicated cards in the DOM. *Test:* in Task 8, with 3 items, the DOM shows exactly 3 cards and the drift loop never starts.
3. **`/intro-call` when the Cal script is blocked.** Expect a visible "Open the booking page" fallback link to cal.com. *Test:* in Task 2.
4. **Touch devices on the clients grid.** Expect no popup to get stuck open and the pill to follow the tap. *Test:* in Task 4, a `pointerType: "touch"` enter shows no popup.
5. **A client with no copy.** Expect the pill only, no empty popup. *Test:* in Task 4.

---

### Task 1: New V logo assets

**Files:**
- Create:
  - `scripts/build-logo.sh`
  - `public/brand/velyx-v.svg`
  - `src/components/VelyxMark.jsx`
  - `src/test/logo.test.jsx`
- Modify:
  - `src/components/PillNav.jsx`, `src/sections/home/Hero.jsx`, `src/components/Logo.jsx` (use VelyxMark)
  - `src/components/AgentsArt.jsx` (`illustrations/AgentsArt.jsx` uses the logo image; switch it to VelyxMark)
  - `public/favicon-32.png`, `favicon-192.png`, `favicon-512.png`, `apple-touch-icon.png`
  - `index.html` (og:image to a local `/og.png`)
  - `src/components/seoConfig.js` (ogImage)
- Delete:
  - `public/brand/velyx-mark-hero.webp`, `public/brand/velyx-mark-nav.webp`
  - `LOGO_ICON` in `src/lib/brand.js`, once it is unused

**Interfaces:**
- Produces: `<VelyxMark className? title? />` renders an inline `<svg viewBox=… fill="currentColor" role=img|presentation>`. When there is no `title`, it gets `aria-hidden="true"`.

- [ ] **Step 1: Vectorise the logo.** The script:
  ```sh
  #!/bin/sh
  # Usage: scripts/build-logo.sh "<source.png>"
  set -e
  SRC="$1"; OUT=public/brand
  magick "$SRC" -colorspace Gray -threshold 50% -trim +repage /tmp/velyx-v.pbm 2>/dev/null || sips -s format bmp "$SRC" --out /tmp/velyx-v.bmp
  potrace /tmp/velyx-v.pbm -s -o "$OUT/velyx-v.svg" --tight --turdsize 10 --alphamax 1.0 --opttolerance 0.2
  ```
  - If ImageMagick is missing, convert to PBM with ffmpeg: `ffmpeg -i src.png -vf format=monob /tmp/velyx-v.pbm`.
  - Open the SVG, keep the single `<path>`, and copy its `d` and `viewBox` into VelyxMark.
  - **Verify:** render VelyxMark in a puppeteer screenshot next to the PNG at 200px. The silhouettes must match, with no lost corners.

- [ ] **Step 2: Write the failing test.**
  ```jsx
  import { render } from "@testing-library/react";
  import { renderWithProviders } from "./renderWithProviders";
  import VelyxMark from "../components/VelyxMark";
  import PillNav from "../components/PillNav";
  import Hero from "../sections/home/Hero";

  describe("new Velyx V logo", () => {
    it("is an inline single-path SVG that inherits its colour", () => {
      const { container } = render(<VelyxMark />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("fill", "currentColor");
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg.querySelectorAll("path").length).toBe(1);
    });
    it("is the navbar and hero mark, and no old logo files are referenced", () => {
      const nav = renderWithProviders(<PillNav />).container;
      expect(nav.querySelector(".pnav__logo svg")).toBeTruthy();
      const hero = renderWithProviders(<Hero />).container;
      expect(hero.querySelector(".hero__mark")?.tagName.toLowerCase()).toBe("svg");
      expect(document.body.innerHTML).not.toMatch(/velyx-mark-(hero|nav)\.webp|removebg/);
    });
  });
  ```
  Also update `src/test/brand.test.jsx`, which asserts the old webp files: replace those assertions with the SVG ones above.

- [ ] **Step 3: Run it and watch it fail.**
  Run `npx vitest run src/test/logo.test.jsx`. Expect a FAIL because the VelyxMark module is not found.

- [ ] **Step 4: Implement.**
  - **`VelyxMark.jsx`:** an SVG with the traced path.
  - **Hero:** replace the `<img className="hero__mark">` with `<VelyxMark className="hero__mark" />`.
    - CSS: `.hero__mark { width: 190px; height: auto; color: #d6d6d6; margin-bottom: -58px; }`
    - Mobile: `width: 140px; margin-bottom: -40px`.
  - **Nav:** `<VelyxMark />` inside `.pnav__logo`, with `.pnav__logo svg { width: 22px; color: var(--ink); }`.
  - **AgentsArt:** replace `<image href={LOGO_ICON}>` with a `<g>` holding the path, filled `#fff`.
  - **Favicons:** export from the SVG on a `#232323` rounded square, with the V in white at 60% of the size, using puppeteer or `rsvg-convert`, then `cwebp`/png. Make `og.png` at 1200×630 on `#efefef`: the V at 220px plus "Velyx Labs" at 64px/700.
  - Remove the orphaned `LOGO_ICON` and the old webps.

- [ ] **Step 5: Run the whole suite and lint, and check everything passes.**
  Run `npx vitest run && npm run lint`.

- [ ] **Step 6: Commit** with `feat: new official Velyx V logo as inline SVG, favicons and OG image`.

---

### Task 2: Audit bar, Altair nav and the `/intro-call` page

**Files:**
- Create:
  - `src/components/AuditBar.jsx`
  - `src/components/IntroCallButton.jsx`
  - `src/pages/IntroCall.jsx`
  - `src/test/intro-call.test.jsx`
- Modify:
  - `src/components/Layout.jsx` (render AuditBar above PillNav)
  - `src/components/PillNav.jsx` (links: Recent Work, Pricing, Swipe file; CTA uses IntroCallButton; mobile menu adds Pricing and Start a project)
  - `src/AppRoutes.jsx` (`/intro-call`, lazy)
  - `scripts/prerender-meta.mjs` (route meta)
  - `public/sitemap.xml`
  - `src/styles.css`: `.audit`, `.pnav` top offset, `--nav-h`, `.btn--intro`

**Interfaces:**
- Produces: `<IntroCallButton className? size?="sm"|"md">` renders `<Link to="/intro-call" className="btn btn--intro …">` holding a camera svg and "Intro call". Tasks 3, 6, 7 and 12 use it.

- [ ] **Step 1: Write the failing tests.**
  ```jsx
  import { screen } from "@testing-library/react";
  import { renderWithProviders } from "./renderWithProviders";
  import Layout from "../components/Layout";
  import IntroCall from "../pages/IntroCall";

  describe("audit bar + nav + intro call", () => {
    it("shows the free-audit row above the nav, linking to the audit booking", () => {
      renderWithProviders(<Layout><p /></Layout>);
      const bar = screen.getByRole("link", { name: /audited\. for free/i });
      expect(bar).toHaveAttribute("href", "/intro-call?for=audit");
      expect(bar.compareDocumentPosition(screen.getByRole("navigation", { name: "Main" })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
    it("nav CTA is Intro call to /intro-call, with Pricing in the links", () => {
      renderWithProviders(<Layout><p /></Layout>);
      const nav = screen.getByRole("navigation", { name: "Main" });
      expect(nav.querySelector('a[href="/intro-call"]').textContent).toMatch(/Intro call/);
      expect(nav.querySelector('a[href="/pricing"]')).toBeTruthy();
    });
    it("intro-call page shows the calendar heading and a fallback link", () => {
      renderWithProviders(<IntroCall />, { route: "/intro-call" });
      expect(screen.getByRole("heading", { level: 1, name: "Book an intro call" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /open the booking page/i })).toHaveAttribute("href", "https://cal.com/velyx-labs/30min");
    });
    it("switches the heading for the free audit", () => {
      renderWithProviders(<IntroCall />, { route: "/intro-call?for=audit" });
      expect(screen.getByRole("heading", { level: 1, name: "Free product audit" })).toBeInTheDocument();
    });
  });
  ```
  - `IntroCall` reads `useSearchParams`.
  - The jsdom Cal embed: `CalEmbed` already mounts lazily through `useInView`. Check how `start-project.test.jsx` mocks it and do the same.

- [ ] **Step 2: Run it and watch it fail.** Run `npx vitest run src/test/intro-call.test.jsx`. Expect a FAIL because `IntroCall` doesn't exist and the link isn't found.

- [ ] **Step 3: Implement.**
  - **`AuditBar`:** `<Link to="/intro-call?for=audit" className="audit">Get your product or website audited. For free <ArrowRight/></Link>`.
    ```css
    .audit { position: fixed; inset: 0 0 auto; z-index: 101; height: 36px; display: flex; align-items: center; justify-content: center; gap: 6px; background: #232323; color: #fff; font-size: 13px; line-height: 18px; font-weight: 600; }
    .audit svg { transition: transform .2s; } .audit:hover svg { transform: translateX(3px); }
    .pnav { inset: 52px 0 auto 0; }
    :root { --nav-h: 124px; }
    ```
    `--nav-h` was 88px, plus 36px for the bar.
  - **`.btn--intro`:** `background: var(--ink); color: #fff;` with the svg at 16px and an 8px gap. In the nav it uses `height: 42px; padding: 0 18px; font-size: 13px`.
  - **`IntroCall` page:**
    - `page-head` with the h1 and a sub-line.
    - `<CalEmbed eager />`: add an `eager` prop that skips `useInView`.
    - Below it, a `.final-cta__alt` row holding `<a href={CAL_URL}>Open the booking page</a>`.
    - Seo title "Book an intro call" or "Free product audit". Path `/intro-call`.
  - **Routing:** add the route (lazy) plus its prerender entry and sitemap line.

- [ ] **Step 4: Run the suite and lint, and check everything passes.**

- [ ] **Step 5: Commit** with `feat: free-audit bar, Intro call nav CTA and /intro-call booking page`.

---

### Task 3: Hero (Kargul as is, Maydit "Intro call", ripple dot)

**Files:**
- Modify:
  - `src/sections/home/Hero.jsx`
  - `src/styles.css` (`.status__dot` ripple)
  - `src/test/home-top.test.jsx`

**Interfaces:**
- Consumes: `IntroCallButton` (Task 2) and `VelyxMark` (Task 1).

- [ ] **Step 1: Failing test.** Add it to `home-top.test.jsx`:
  ```jsx
  it("hero primary button is Intro call, with See our work kept", () => {
    renderWithProviders(<Hero />);
    expect(screen.getByRole("link", { name: /Intro call/ })).toHaveAttribute("href", "/intro-call");
    expect(screen.getByRole("link", { name: "See our work" })).toHaveAttribute("href", "/work");
    expect(screen.queryByRole("link", { name: "Start a project" })).toBeNull();
    expect(document.querySelectorAll(".status__ripple").length).toBe(2);
  });
  ```
- [ ] **Step 2: Watch it fail.**
- [ ] **Step 3: Implement.**
  - Hero buttons: `<IntroCallButton />` then `See our work`.
  - Wrap the status dot as `<span class="status__dot"><span class="status__ripple"/><span class="status__ripple"/></span>`:
    ```css
    .status__dot { position: relative; }
    .status__ripple { position: absolute; inset: 0; border-radius: 50%; background: var(--ok); animation: ripple 1.6s ease-out infinite; }
    .status__ripple + .status__ripple { animation-delay: .3s; }
    @keyframes ripple { to { transform: scale(2.6); opacity: 0; } }
    ```
  - Any older test that expects the hero "Start a project" link changes to Intro call.
- [ ] **Step 4: Suite and lint pass.**
- [ ] **Step 5: Commit** with `feat: hero Intro call button and live status ripple`.

---

### Task 4: Clients grid (Kargul layout, Bricx popup and tick sound)

**Files:**
- Create:
  - `src/lib/tick.js`
  - `src/lib/clientNotes.js`
  - `src/test/clients.test.jsx`
- Modify:
  - `src/sections/home/TrustedBy.jsx`
  - `src/data/clients.js`
  - `src/styles.css` (`.trusted` grid, `.cpill`, `.cpop`, `.cmute`)

**Interfaces:**
- **Produces:**
  - `tick.js` exports:
    - `unlock(): void`: creates the AudioContext on the first user gesture.
    - `tick(step: number): void`: plays a 70ms sine at `1100 + step*40` Hz, peak gain 0.04. It is a no-op before `unlock`, when muted, or under reduced motion.
    - `setMuted(b: boolean)` and `isMuted(): boolean`: persist in `localStorage["velyx:mute"]`, wrapped in try/catch.
  - `clientNotes.js` exports `noteFor(name): { line: string, chips: string[] } | null`. It builds from `PROJECTS` (summary + types) and `ENGAGEMENTS` (d). It returns null when there is no copy.
- **Data:** `clients.js` entries become `{ name, logo?: string }`. Update every `CLIENTS` consumer (`stats.js` uses `.length`, which is fine; `TrustedBy` maps names).

- [ ] **Step 1: Failing tests.**
  ```jsx
  import { describe, it, expect, vi, beforeEach } from "vitest";
  import { fireEvent, screen } from "@testing-library/react";
  import { renderWithProviders } from "./renderWithProviders";
  import TrustedBy from "../sections/home/TrustedBy";
  import { noteFor } from "../lib/clientNotes";
  import * as sound from "../lib/tick";

  describe("clients grid", () => {
    beforeEach(() => vi.restoreAllMocks());
    it("ends with an And many more tile and uses buttons for keyboard focus", () => {
      renderWithProviders(<TrustedBy />);
      expect(screen.getByText("And many more")).toBeInTheDocument();
      expect(screen.getAllByRole("button", { name: /Sacred Basil/ }).length).toBeGreaterThan(0);
    });
    it("shows a popup with what we built on hover, none on touch, none without copy", () => {
      renderWithProviders(<TrustedBy />);
      const tile = screen.getAllByRole("button", { name: /Sacred Basil/ })[0];
      fireEvent.pointerEnter(tile, { pointerType: "mouse" });
      expect(document.querySelector(".cpop").textContent).toMatch(/e-commerce/i);
      fireEvent.pointerLeave(tile);
      fireEvent.pointerEnter(tile, { pointerType: "touch" });
      expect(document.querySelector(".cpop.is-on")).toBeNull();
    });
    it("noteFor returns null for a client with no copy", () => {
      expect(noteFor("Estatico")).toBeNull();
      expect(noteFor("Sacred Basil").chips.length).toBeGreaterThan(0);
    });
    it("tick is silent before the first user gesture", () => {
      const spy = vi.fn(); globalThis.AudioContext = vi.fn(() => ({ createOscillator: spy }));
      sound.tick(1);
      expect(globalThis.AudioContext).not.toHaveBeenCalled();
    });
  });
  ```
  Before writing that assertion, check `noteFor("Estatico")`: confirm Estatico has no project and no engagement copy. If it has copy, pick a client that has none.
- [ ] **Step 2: Watch it fail.**
- [ ] **Step 3: Implement.**
  - **TrustedBy (≥ 761px):**
    - `.cgrid { display:grid; grid-template-columns: repeat(6,153px); justify-content:center; }`
    - Each `<button class="ctile" aria-label="{name}: {line}">` holds the wordmark.
    - The final cell is `<span class="ctile ctile--more">And many more</span>`.
  - **Pill:** one absolutely positioned `.cpill` (150×60, white, radius 999, `transition: transform .25s cubic-bezier(.65,0,.35,1), opacity .2s`). On pointer enter or focus, move it with `transform: translate(x,y)` from the tile's `offsetLeft`/`offsetTop`. It hides on grid leave.
  - **Popup:** a `.cpop` positioned above the tile centre. It gets `.is-on` only for `pointerType !== "touch"` and a non-null `noteFor`.
  - **Sound:**
    - Call `tick(colIndex)` on enter.
    - `unlock` runs on a `pointerdown` or `keydown` listener on `window`, `{ once: true }`, added in a `useEffect`.
  - **Mute button:** `<button class="cmute" aria-pressed={muted} aria-label="Mute hover sound">` in the section's top-right corner.
  - **Below 761px:** keep the current `<Marquee>` of names.
  - **CSS:** wordmark 17/700 `#9a9a9a`; active tile ink; `.ctile.is-active::after` is a 6px ink dot under the logo.
- [ ] **Step 4: Suite and lint pass.**
- [ ] **Step 5: Commit** with `feat: clients grid with sliding pill, built-for popup and soft hover tick`.

---

### Task 5: Statement reveal and count-up numbers

**Files:**
- Create:
  - `src/sections/home/Statement.jsx`
  - `src/lib/reveal.js`
  - `src/test/statement.test.jsx`
- Modify:
  - `src/components/Stats.jsx` (count-up)
  - `src/styles.css` (`.statement`, `.statement__w`)

**Interfaces:**
- **Produces:**
  - `reveal.js` exports `wordOpacity(i, n, p): number`. It returns 1 when `i < p*n`, else 0.18, with a smooth 1-word ramp between.
  - `reveal.js` also exports `progress(rect, vh): number`: `(0.85*vh - rect.top) / (0.45*vh + rect.height)` clamped to 0..1.

- [ ] **Step 1: Failing tests.**
  ```js
  import { wordOpacity, progress } from "../lib/reveal";
  it("reveals words in order with scroll progress", () => {
    expect(wordOpacity(0, 10, 0)).toBeCloseTo(0.18);
    expect(wordOpacity(4, 10, 0.5)).toBe(1);
    expect(wordOpacity(9, 10, 0.5)).toBeCloseTo(0.18);
    expect(progress({ top: 2000, height: 100 }, 800)).toBe(0);
    expect(progress({ top: -5000, height: 100 }, 800)).toBe(1);
  });
  it("renders the statement fully visible without JS motion and keeps the numbers", () => {
    renderWithProviders(<><Statement /><Stats /></>);
    expect(screen.getByText(/founder-led team/)).toBeInTheDocument();
    expect(document.querySelector("#numbers")).toBeTruthy();
  });
  ```
- [ ] **Step 2: Watch it fail.**
- [ ] **Step 3: Implement.**
  - **`Statement`:** split the copy into `<span class="statement__w">` words, with `aria-label` on the `<p>` and the spans `aria-hidden`.
  - **Animation loop:** a passive scroll listener with rAF, active only while `useOnScreen` is true and not under reduced motion. It sets `style.opacity` per word from `wordOpacity`.
  - **Default:** opacity 1 when there is no JS or under reduced motion.
  - **`Stats` count-up:** numeric part only (`/^(\d+)(.*)$/`), over 1.2s easeOutCubic, triggered once by `useInView`. Non-numeric values like "30 min" are shown as is.
- [ ] **Step 4: Suite and lint pass.**
- [ ] **Step 5: Commit** with `feat: scroll-revealed statement and count-up numbers`.

---

### Task 6: Selected work and More work (Altair)

**Files:**
- Create:
  - `src/sections/home/SelectedWork.jsx`
  - `src/sections/home/MoreWork.jsx`
  - `src/test/work-sections.test.jsx`
- Modify:
  - `src/data/projects.js` (optional `problem`, `outcome`, `url`, `status`)
  - `src/pages/Home.jsx` (replace `ProjectsPanel`)
  - `src/styles.css` (`.case`, `.mwork`)
- Leave in place: `ProjectsPanel.jsx` and `ProjectSpotlight.jsx`. Delete them only if no longer imported anywhere (check `Work.jsx`).

**Interfaces:**
- Consumes: `IntroCallButton`, `ProjectCover`, `Tag`.
- Produces: `MoreWork` takes `items: Project[]` and renders `.mwork__row` per project plus the final `.mwork__row--next` linking to `/intro-call`.

- [ ] **Step 1: Failing tests.**
  ```jsx
  it("shows two selected case cards with problem / built / outcome copy", () => {
    renderWithProviders(<SelectedWork />);
    const cards = document.querySelectorAll(".case");
    expect(cards.length).toBe(2);
    expect(cards[0].querySelector(".case__built").textContent.length).toBeGreaterThan(10);
    expect(cards[0].querySelector('a[href^="/work/"]')).toBeTruthy();
  });
  it("does not render an outcome line when a project has no real result", () => {
    renderWithProviders(<SelectedWork />);
    for (const c of document.querySelectorAll(".case")) {
      const o = c.querySelector(".case__outcome");
      if (o) expect(o.textContent.trim()).not.toBe("");
    }
  });
  it("lists more work and ends with Your product, next. linking to the intro call", () => {
    renderWithProviders(<MoreWork />);
    const rows = document.querySelectorAll(".mwork__row");
    expect(rows[rows.length - 1].textContent).toMatch(/Your product, next\./);
    expect(rows[rows.length - 1].getAttribute("href")).toBe("/intro-call");
    expect(screen.getByRole("link", { name: /All work and case studies/ })).toHaveAttribute("href", "/work");
  });
  ```
- [ ] **Step 2: Watch it fail.**
- [ ] **Step 3: Implement.** Exact values from the spec, §6:
  - **Cards:** `.case { display:grid; grid-template-columns: 1.25fr 1fr; background:#161616; color:#f5f5f5; border-radius:36px; overflow:hidden; }`, with `.case--flip` swapping the order.
  - **Eyebrow:** `font-family: "Geist Mono", ui-monospace, monospace; font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:#8a8a8a`. Add Geist Mono 400 to the Google Fonts URL in `index.html` (one extra family, `display=swap`).
  - **More-work rows:** `display:grid; grid-template-columns: 40% 1fr 1fr 48px; align-items:center; padding: 28px 0; border-top:1px solid #1c1c1c1f;`, with the name at 40px/700/-0.03em.
  - **Mobile (< 760px):** cards stack; rows become `grid-template-columns: 1fr 40px` with the category and status as a second line.
  - **Data:** the problem copy comes from the existing `brief`, the built copy from `built`, and `outcome` comes only from a real `result`. Mark `url` and `status` TO CONFIRM.
- [ ] **Step 4: Suite and lint pass.** Update any test expecting `ProjectsPanel` content on Home.
- [ ] **Step 5: Commit** with `feat: Altair-style selected work cards and more-work table`.

---

### Task 7: Process: "Three weeks. / One clear path."

**Files:**
- Create:
  - `src/sections/home/Process.jsx`
  - `src/components/illustrations/StepArt.jsx` (4 small iso scenes)
  - `src/data/process.js`
  - `src/test/process.test.jsx`
- Modify:
  - `src/styles.css` (`.process`, `.arc`, `.step`, keyframes `halo`, `arc-draw`, `iso-lift`)

**Interfaces:**
- Consumes: `Panel`, `IntroCallButton`, iso helpers (`floor`, `wall` from `isoMatrix.js`, `Layer` from `iso.jsx`), `useOnScreen`, `useReducedMotion`.
- Produces: `PROCESS = [{ n:"01", when:"Day 1", title, copy, art:"call"|"trial"|"build"|"launch" }]`.

- [ ] **Step 1: Failing test.**
  ```jsx
  it("shows the two-tone process heading, an arc with 4 nodes, 4 steps and a CTA bar", () => {
    renderWithProviders(<Process />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toMatch(/Three weeks\.\s*One clear path\./);
    expect(document.querySelectorAll(".arc__node").length).toBe(4);
    expect(document.querySelectorAll(".step").length).toBe(4);
    expect(document.querySelector(".step .step__when").textContent).toMatch(/01 · Day 1/i);
    expect(screen.getByRole("link", { name: /Intro call/ })).toHaveAttribute("href", "/intro-call");
  });
  ```
- [ ] **Step 2: Watch it fail.**
- [ ] **Step 3: Implement.**
  - **Arc:** `<svg viewBox="0 0 1328 220">` with `path d="M0 210 Q664 -10 1328 210" pathLength="1"`.
    - Draw: `stroke-dasharray:1; stroke-dashoffset:1`, then 0 under `.is-playing`, over 1.6s ease-out.
  - **Nodes:** placed at t = 0.125, 0.375, 0.625, 0.875 (quadratic Bézier point formula, computed in `process.js`).
    - Halo `<circle class="arc__halo">` uses keyframes `halo` (scale 1 → 1.35, opacity .55 → .2, 2.4s).
    - Dashed drop-lines go to the card tops.
  - **Cards:** `.step { background:#1f1f1f; border:1px solid #ffffff14; border-radius:24px; padding:24px; }`. Inside: the art at 180px tall, `.step__when` in mono 11px, the title at 22/600, copy at 15/500 `#a8a8a8`.
  - **StepArt scenes:** a call tile with a headset bubble, a stack of plan sheets lifting, a layered build stack splitting, and a beacon with dashed rays. Reuse the `.layer`/`.float` classes so they animate only under `.is-playing`.
  - **CTA bar:** `.process__cta { border:1px solid #ffffff14; border-radius:24px; padding:32px 40px; display:flex; justify-content:space-between; align-items:center; }`.
  - **Mobile:** the arc is hidden (`display:none` < 760px) and the cards go to 1 column.
- [ ] **Step 4: Suite and lint pass.**
- [ ] **Step 5: Commit** with `feat: Altair-style three-week process with drawn arc and iso steps`.

---

### Task 8: Founders and Bricx testimonials

**Files:**
- Create:
  - `src/components/Testimonials.jsx` (replaces `TestimonialCarousel` on Home)
  - `src/lib/drift.js`
  - `src/test/testimonials.test.jsx`
- Modify:
  - `src/components/TeamGrid.jsx` (title "Founders")
  - `src/data/testimonials.js` (optional `photo`, `company`, `logo`, `caseSlug` on quotes; `caseSlug` for Sacred Basil maps to `sacred-basil`)
  - `src/styles.css` (`.tsec`, `.tcard2`)
- Delete: `TestimonialCarousel.jsx` and its CSS, if it's no longer imported anywhere.

**Interfaces:**
- **Produces:**
  - `drift.js` exports `shouldDrift(count, reduced): boolean`, which is `count >= 6 && !reduced`.
  - `drift.js` also exports `wrap(scrollLeft, half): number`, which is `scrollLeft >= half ? scrollLeft - half : scrollLeft`.
  - `<Testimonials items={TESTIMONIAL_QUOTES} />`.

- [ ] **Step 1: Failing tests.**
  ```jsx
  import { shouldDrift, wrap } from "../lib/drift";
  it("only drifts with 6+ cards and never under reduced motion", () => {
    expect(shouldDrift(3, false)).toBe(false);
    expect(shouldDrift(6, false)).toBe(true);
    expect(shouldDrift(9, true)).toBe(false);
    expect(wrap(1200, 1000)).toBe(200);
  });
  it("renders the Bricx-style header and each real quote exactly once when not drifting", () => {
    renderWithProviders(<Testimonials items={TESTIMONIAL_QUOTES} />);
    const h = screen.getByRole("heading", { level: 2 });
    expect(h.textContent).toMatch(/Don't take our word\.\s*Take theirs\./);
    expect(document.querySelectorAll(".tcard2").length).toBe(TESTIMONIAL_QUOTES.length);
    expect(screen.getByRole("button", { name: "Previous testimonial" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next testimonial" })).toBeInTheDocument();
  });
  it("uses a monogram when there is no photo", () => {
    renderWithProviders(<Testimonials items={[{ ...TESTIMONIAL_QUOTES[0], photo: undefined }]} />);
    expect(document.querySelector(".tcard2__mono").textContent).toBe(TESTIMONIAL_QUOTES[0].avatar);
  });
  it("the team section is titled Founders", () => {
    renderWithProviders(<TeamGrid />);
    expect(screen.getByRole("heading", { level: 2, name: "Founders" })).toBeInTheDocument();
  });
  ```
- [ ] **Step 2: Watch it fail.**
- [ ] **Step 3: Implement.** Values from the spec, §9:
  - **Header:** h2 at 48/500/-0.02em, with spans `.tone-muted` (`color:#00000059`) and `.tone-ink`.
  - **Track:** `display:flex; gap:16px; overflow-x:auto; scroll-snap-type:x mandatory; scrollbar-width:none;`, padding-left equal to the container's left edge (`max(19px, (100vw - 1120px)/2 + 40px)`).
  - **Card (`.tcard2`):** `flex:0 0 443px; aspect-ratio:445/621; border-radius:14px; border:1px solid #dcdde0; position:relative; overflow:hidden; background:#1c1c1c; color:#fff; scroll-snap-align:start;`. On mobile, `flex-basis: min(340px, calc(100vw - 38px))`.
  - **Photo variant:** `<img class="tcard2__img">` with `transform:scale(1.05)`, going to 1 on hover over .5s ease-out.
  - **Monogram:** `.tcard2__mono` at 160px/700 `#ffffff10`, centred at 35% height.
  - **Text:** a bottom gradient `linear-gradient(to top, #000000d9, #00000059 50%, transparent)` over 46% of the height. The quote is 17/500/1.3 and the name 18/500. The role line is 14px at 60% white, formatted from `role`.
  - **Hover reveal:** `grid-template-rows: 0fr → 1fr` over 300ms with "Read the case study →" when `caseSlug` is set.
  - **Drift:** only when `shouldDrift`. Render the items twice; a rAF loop adds 40px/s × dt to `scrollLeft` and wraps at half. It pauses on `pointerenter`, `focusin`, `touchstart`, offscreen and while `document.hidden`.
  - **Arrows:** `scrollBy({ left: ±(cardWidth+16), behavior: "smooth" })`.
- [ ] **Step 4: Suite and lint pass.** Update `home.test.jsx` if it references the old carousel.
- [ ] **Step 5: Commit** with `feat: Bricx-style testimonials and Founders section`.

---

### Task 9: Pricing (925) on Home and at `/pricing`, plus the button label roll

**Files:**
- Create:
  - `src/data/pricing.js`
  - `src/sections/Pricing.jsx`
  - `src/pages/PricingPage.jsx`
  - `src/test/pricing.test.jsx`
- Modify:
  - `src/AppRoutes.jsx` (`/pricing`, lazy)
  - prerender meta and the sitemap
  - `src/styles.css` (`.pricing`, `.plan`, `.trialstrip`, `.btn` label roll)
  - every `.btn` usage that should roll (via a `<BtnLabel>` helper or CSS-only `data-label`)
- Delete: `TrialCard.jsx`, if it's no longer imported anywhere.

**Interfaces:**
- **Produces:**
  - `TRIAL = { price: "$1500", line, cta: "Start your trial week", href: "/start-a-project?plan=trial" }`.
  - `PLANS = [{ id, title, tagline, price: string|null, features: string[], dark: boolean }]`. A `null` price renders "Custom".
  - `<Pricing headingLevel?=2 />`.

- [ ] **Step 1: Failing tests.**
  ```jsx
  it("shows the trial week strip and two plans, dark then light", () => {
    renderWithProviders(<Pricing />);
    expect(screen.getByText("$1500")).toBeInTheDocument();
    const plans = document.querySelectorAll(".plan");
    expect(plans.length).toBe(2);
    expect(plans[0]).toHaveClass("plan--dark");
    expect(plans[1]).not.toHaveClass("plan--dark");
  });
  it("never says Book a call, and every CTA starts a project", () => {
    renderWithProviders(<Pricing />);
    const sec = document.querySelector("#pricing");
    expect(sec.textContent).not.toMatch(/book a call/i);
    for (const a of sec.querySelectorAll("a.btn")) expect(a.getAttribute("href")).toMatch(/^\/start-a-project\?plan=/);
  });
  it("renders Custom for a plan without a confirmed price", () => {
    renderWithProviders(<Pricing />);
    for (const p of PLANS.filter((x) => !x.price)) expect(screen.getAllByText("Custom").length).toBeGreaterThan(0);
  });
  it("has its own /pricing page with an h1", () => {
    renderWithProviders(<PricingPage />, { route: "/pricing" });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Start small\.\s*Scale when it works\./);
  });
  ```
- [ ] **Step 2: Watch it fail.**
- [ ] **Step 3: Implement.** Values from the spec, §10:
  - **Header:**
    - The eyebrow is an 18px ink circle with a white 8×2 bar, then "Simple pricing" at 16/500.
    - The h2 is two-tone: `.tone-muted` then `.tone-ink`.
  - **Trial strip:** `.trialstrip { background:#fff; border-radius:24px; padding:28px 32px; display:flex; justify-content:space-between; align-items:center; gap:24px; }`, wrapping on mobile.
  - **Grid:** `.plans { display:grid; grid-template-columns:1fr 1fr; gap:16px; }`, becoming 1 column below 810px.
  - **Card (`.plan`):** `border-radius:15px; padding:24px; display:flex; flex-direction:column; gap:42px; background:#fff;`.
    - `.plan--dark` uses `background:#171717; color:#fff`.
    - The icon tile is 42×42 with radius 8: `#262626` on dark, `#f5f5f5` on light.
    - Title 30/500. Tagline 16/500 muted (`#a3a3a3` on dark, `#525252` on light). Price 36/700.
    - CTA: `height:54px; border-radius:50px;` and full width, inverted against the card.
    - "Plan includes:" is 14/500 `#737373`. Feature rows are an 18px ⊕ bullet with a 10px gap, 16/500.
    - The closing check line is muted.
    - Mobile: gap 32, title 24, rows at 14px.
  - **Reveal:** an `.is-in` class from `useInView` adds `opacity 0→1; filter: blur(8px)→0; translateY(8px)→0` over 500ms, staggered `calc(var(--i)*40ms)`. Content is visible by default when JS is off (start state applied only under `.js-reveal`, set on mount).
  - **Button label roll:** a `.btn__roll` wrapper with `overflow:hidden; height:1lh`, holding two stacked spans. `.btn:hover .btn__roll > span { transform: translateY(-100%) }` over 300ms `cubic-bezier(.65,0,.35,1)`. Off under reduced motion via the global rule.
  - **`PricingPage`:** a Layout with `<Pricing headingLevel={1} />` and Seo "Pricing".
- [ ] **Step 4: Suite and lint pass.**
- [ ] **Step 5: Commit** with `feat: 925-style pricing with trial week, on Home and /pricing`.

---

### Task 10: Home assembly, no FAQ, Altair footer layout and Ask-AI row

**Files:**
- Modify:
  - `src/pages/Home.jsx`: the order is Hero, TrustedBy, ServicesPanel, Statement + Stats, SelectedWork, MoreWork, Process, TeamGrid, Testimonials, Pricing, ToolsStrip. Remove the FAQ.
  - `src/components/ClosingCTA.jsx` (sub-line; one Intro call button plus a "See our work" text link)
  - `src/components/SiteFooter.jsx` (© on the left, links on the right, Ask-AI row)
  - `src/styles.css`
  - `src/test/home.test.jsx` (section ids)
  - `src/test/shell.test.jsx`

**Interfaces:**
- Produces: `askAiLinks(prompt): { name, href }[]` in `src/lib/askAi.js`. It returns 4 URL-encoded links:
  - `https://chatgpt.com/?q=…`
  - `https://claude.ai/new?q=…`
  - `https://www.perplexity.ai/search?q=…`
  - `https://www.google.com/search?udm=50&q=…` (Gemini / AI mode)

- [ ] **Step 1: Failing tests.**
  ```jsx
  it("home sections are in the agreed order with no FAQ", () => {
    renderWithProviders(<Home />);
    const ids = [...document.querySelectorAll("main > section[id], main > div > section[id]")].map((s) => s.id);
    expect(ids).toEqual(["hero", "trusted", "services", "statement", "numbers", "work", "more-work", "process", "team", "testimonials", "pricing", "tools"]);
    expect(document.querySelector("#faq")).toBeNull();
  });
  it("footer: one Intro call CTA, © left, links right, Ask AI links encode only the fixed prompt", () => {
    renderWithProviders(<SiteFooter />);
    const closing = document.querySelector("#closing");
    expect(closing.querySelectorAll('a.btn').length).toBe(1);
    expect(closing.querySelector('a.btn')).toHaveAttribute("href", "/intro-call");
    for (const a of document.querySelectorAll(".askai a")) expect(decodeURIComponent(a.href)).toMatch(/Tell me about Velyx Labs \(velyxlabs\.in\)/);
  });
  ```
  - The section ids above are the intended ones. Before writing the assertion, check the existing ids (`services`, `numbers`, `team`, `tools`) in their components and match them.
  - Keep the existing `shell.test.jsx` dome assertions unchanged.
- [ ] **Step 2: Watch it fail.**
- [ ] **Step 3: Implement.**
  - **Footer row:** `.sfoot__inner { justify-content: space-between; max-width: 1120px; }`. On mobile it centres and wraps.
  - **Ask-AI row:** `.askai` is a row of 32px circular icon links, `aria-label="Ask ChatGPT about Velyx Labs"`, etc. Use simple monochrome SVG glyphs, not the vendors' logos, and a "Ask AI about Velyx Labs" text label.
  - **Copy:** remove "Book a call" mentions in home copy. Service copy stays.
- [ ] **Step 4: Suite and lint pass.**
- [ ] **Step 5: Commit** with `feat: new home order, Altair footer layout and Ask-AI row; drop FAQ`.

---

### Task 11: Verification pass (no new features)

- [ ] **Step 1:**
  - Run `npm run build`.
  - Start a preview on port 4317 and run Lighthouse mobile on `/`, `/pricing` and `/intro-call`.
  - **Expect:** performance ≥ 95, accessibility 100, CLS < 0.05. Fix any regressions in the owning task's files, test-first.
- [ ] **Step 2:**
  - Take puppeteer screenshots at 1280 and 390 of every home section, `/pricing` and `/intro-call`. Read each one.
  - **Check:** `scrollWidth === innerWidth` at both widths.
  - **Motion check** (`move.mjs` pattern):
    - the clients pill moves on hover
    - the statement words change opacity on scroll
    - the arc draws
    - testimonials drift only with 6+ items
- [ ] **Step 3:** Emulate reduced motion and confirm nothing animates and all content is visible.
- [ ] **Step 4:** Run `npx vitest run && npm run lint`, and record the counts.
- [ ] **Step 5: Commit** any fixes as `fix: …`.
- [ ] **Step 6:** Report to the user, listing every TO CONFIRM that blocks launch: prices, stats, photos, logos, process copy, the case outcomes and URLs, and the Meet icon.
