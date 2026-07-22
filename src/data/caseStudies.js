/* ------------------------------------------------------------------
   CASE STUDIES — industry playbooks
   Each entry powers one card on /case-studies and one full
   detail page at /case-studies/:slug
------------------------------------------------------------------ */

export const CASE_STUDIES = [
  /* ============================================================ 01 */
  {
    slug: "real-estate",
    num: "01",
    name: "Real Estate",
    cat: "Agentic Automation",
    viz: "funnel",
    tagline: "Speed-to-lead, solved.",
    summary:
      "Portal leads answered in 40 seconds, qualified on budget and intent, and pushed to the right agent's calendar before the competition opens their inbox.",
    metrics: [
      ["40s", "avg response"],
      ["3.4×", "site visits booked"],
      ["68%", "lead qualification"],
    ],
    hero: {
      title: "Every lead answered",
      titleSerif: "in forty seconds.",
      sub: "Real estate is a speed game. The first broker to respond wins the conversation 74% of the time — and most teams take four hours. We closed that gap to under a minute, permanently.",
    },
    problem: {
      lede: "A 22-agent brokerage was spending ₹9L a month on portal and Meta leads, then losing most of them to response lag.",
      points: [
        {
          t: "Four-hour average response",
          d: "Leads arrived at 11pm and got a callback the next afternoon. By then the buyer had already spoken to three other brokers.",
        },
        {
          t: "No qualification layer",
          d: "Agents burned their day on tyre-kickers — no budget, wrong city, browsing for a purchase 18 months out.",
        },
        {
          t: "Follow-up died at touch two",
          d: "Warm leads that didn't convert in the first week were never touched again. The CRM was a graveyard of ₹4Cr in stale pipeline.",
        },
      ],
    },
    system: {
      name: "Velyx Lead Velocity Engine",
      type: "Agentic Automation",
      lede: "A fleet of agents sitting between your ad spend and your sales team — qualifying, routing, and nurturing without a human in the loop until the lead is worth one.",
      modules: [
        {
          n: "01",
          t: "Instant Response Agent",
          d: "Fires on webhook from 99acres, MagicBricks, Housing, and Meta lead forms. WhatsApp + call within 40 seconds, in the buyer's language.",
        },
        {
          n: "02",
          t: "Qualification Agent",
          d: "Conversational BANT — budget band, possession timeline, loan pre-approval, locality shortlist. Scores 0–100 and tags the lead.",
        },
        {
          n: "03",
          t: "Inventory Matcher",
          d: "Reads live inventory and matches the buyer's brief to 3 properties, with floor plans and a price-per-sqft comparison, inside the chat.",
        },
        {
          n: "04",
          t: "Site-Visit Scheduler",
          d: "Checks agent calendars by locality specialisation, books the slot, sends the pin, and runs T-24h / T-2h confirmation nudges.",
        },
        {
          n: "05",
          t: "Reactivation Agent",
          d: "Works the dead pipeline on a 30/60/90 cadence with new launches and price drops that match each buyer's original brief.",
        },
      ],
    },
    flow: ["PORTAL LEAD", "QUALIFY", "MATCH", "BOOK VISIT", "AGENT CRM"],
    example: {
      client: "A Pune-based brokerage — 22 agents, luxury + mid-segment resale",
      context:
        "They were the classic case: strong ad budget, strong inventory, and a sales floor that simply could not physically answer 400 leads a month at the speed the market demanded. Two agents were doing nothing but manually calling new leads — and still missing most of them.",
      before: [
        "4 hr 10 min median first response",
        "400 leads/month → 31 site visits",
        "2 agents on manual dialling full-time",
        "₹4.2 Cr of pipeline untouched > 60 days",
      ],
      after: [
        "40 second median first response",
        "400 leads/month → 106 site visits",
        "0 agents on dialling — both moved to closing",
        "₹1.1 Cr revived from dead pipeline in 90 days",
      ],
      narrative:
        "The buyer fills a form on 99acres at 11:40pm. Within 40 seconds a WhatsApp lands: a warm intro, the project they enquired about, and one question — possession timeline. The buyer replies. Over six messages the agent establishes a ₹1.6–1.9Cr band, a 3BHK requirement in Baner, and a pre-approved HDFC loan. It scores the lead 84, matches three live units, and offers Saturday 11am or Sunday 4pm. The buyer picks Saturday. By 11:52pm, the site visit is on the calendar of the agent who specialises in Baner, the CRM record is written, and a confirmation is queued for Friday. Nobody on the team was awake.",
    },
    results: [
      ["3.4×", "site visits from same spend"],
      ["40s", "median first response"],
      ["₹1.1 Cr", "dead pipeline revived"],
      ["2 FTE", "redeployed to closing"],
    ],
    outcomes: [
      { t: "Speed becomes your moat", d: "You answer in 40 seconds while the broker down the road takes four hours. In a market where the first responder wins most conversations, that one change reorders who gets the deal." },
      { t: "Agents stop selling to tyre-kickers", d: "Every conversation your team joins already has a verified budget band, a possession timeline, and a shortlisted locality on record." },
      { t: "Your dead CRM becomes a revenue channel", d: "Leads you already paid for get worked forever — new launches and price drops matched to each buyer's original brief, on a 30/60/90 cadence." },
      { t: "Capacity without headcount", d: "Handle three times the lead volume on the same team. The system scales with your ad spend; your payroll doesn't." },
    ],
    deliverables: {
      agentic: ["Instant response agent — WhatsApp + call in 40s", "BANT qualification agent with 0–100 scoring", "Live inventory matcher with floor plans", "Site-visit scheduler with locality-based routing", "Dead-pipeline reactivation agent"],
      saas: ["Lead command dashboard — every lead, stage and owner live", "Agent leaderboard: response time, visits booked, closes", "Locality and budget demand heatmap", "Daily WhatsApp digest to the sales head"],
      integrations: ["99acres, MagicBricks, Housing webhooks", "Meta and Google Lead Ads", "WhatsApp Business API", "Zoho / your existing CRM", "Google Calendar", "Loan partner referral hooks"],
    },
    workflowSteps: [
      { n: "01", t: "Lead lands", what: "A buyer submits a form on a portal or an ad — any hour, any day.", auto: "Webhook fires instantly. The lead is deduped against your CRM and enriched.", out: "Clean lead record, zero manual entry." },
      { n: "02", t: "First contact in 40s", what: "The buyer gets a WhatsApp message and a call in their own language.", auto: "The response agent opens with the exact project they enquired about.", out: "Conversation started before competitors open their inbox." },
      { n: "03", t: "Qualify and match", what: "Budget band, possession timeline, loan status and locality shortlist.", auto: "Scores the lead 0–100 and matches three live units inside the chat.", out: "A scored lead with a shortlist attached." },
      { n: "04", t: "Book the visit", what: "The buyer picks a slot that suits them.", auto: "Checks agent calendars by locality specialisation, books, sends the pin, runs T-24h and T-2h nudges.", out: "Confirmed site visit on the right agent's calendar." },
      { n: "05", t: "Nurture forever", what: "Buyers who don't convert this week aren't lost — they're early.", auto: "A 30/60/90 cadence matches new launches and price drops to their original brief.", out: "Pipeline that keeps producing months later." },
    ],
    rollout: [
      { w: "Week 1", t: "Audit and mapping", d: "We map your lead sources, CRM fields, agent specialisations and current response times against your real data — not assumptions." },
      { w: "Week 2–3", t: "Build and integrate", d: "Agents built, portals and CRM wired, WhatsApp number provisioned and message templates approved." },
      { w: "Week 4", t: "Shadow run", d: "The system runs alongside your team. We tune scoring thresholds and scripts against live conversations before it takes over." },
      { w: "Ongoing", t: "Optimise on retainer", d: "Weekly review of scoring accuracy, drop-off points and new inventory logic as your projects change." },
    ],
    estimator: {
      label: "Portal and ad leads per month",
      min: 50, max: 1200, step: 25, def: 400,
      rows: [
        { label: "Site visits today", fn: (v) => Math.round(v * 0.08) },
        { label: "Site visits with the system", fn: (v) => Math.round(v * 0.265), hl: true },
        { label: "Extra visits every month", fn: (v) => `+${Math.round(v * 0.185)}`, hl: true },
      ],
      note: "Applies the 3.4× improvement from the engagement above to your volume. Your baseline will differ — we validate it against your actual numbers before building anything.",
    },
    stack: ["WhatsApp Business API", "99acres / MagicBricks webhooks", "Meta Lead Ads", "Zoho CRM", "Google Calendar", "Claude"],
  },

  /* ============================================================ 02 */
  {
    slug: "health-and-wellness",
    num: "02",
    name: "Health & Wellness",
    cat: "Full System",
    viz: "calendar",
    tagline: "Fewer no-shows, fuller chairs.",
    summary:
      "Booking, intake, reminders, and re-engagement running as one system — so clinics stop losing 30% of their revenue to empty slots and manual admin.",
    metrics: [
      ["-71%", "no-show rate"],
      ["+38%", "slot utilisation"],
      ["11 hrs", "admin saved/week"],
    ],
    hero: {
      title: "The empty chair is",
      titleSerif: "the whole problem.",
      sub: "A wellness clinic doesn't lose money on marketing. It loses money on no-shows, unfilled cancellations, and a front desk drowning in WhatsApp. We rebuilt the operating layer underneath all three.",
    },
    problem: {
      lede: "A 4-location physiotherapy and wellness group was running at 61% chair utilisation while turning away new patients at peak hours.",
      points: [
        {
          t: "A 29% no-show rate",
          d: "Almost a third of booked slots evaporated. Each empty 45-minute slot was ₹1,800 of unrecoverable revenue.",
        },
        {
          t: "Cancellations were dead air",
          d: "A 4pm cancellation at 2pm stayed empty, even with an eight-person waitlist sitting in a WhatsApp group.",
        },
        {
          t: "Intake ate clinical time",
          d: "Therapists spent the first 12 minutes of every first session taking history that should have arrived before the patient did.",
        },
        {
          t: "Packages went unfinished",
          d: "Patients bought 10-session packages and stopped at four. No one noticed, no one followed up, outcomes suffered.",
        },
      ],
    },
    system: {
      name: "Velyx Clinic OS",
      type: "SaaS + Agentic Layer",
      lede: "A scheduling and patient-journey system with agents handling every conversation the front desk used to handle badly.",
      modules: [
        {
          n: "01",
          t: "Conversational Booking",
          d: "Patients book, reschedule, and cancel over WhatsApp in plain language. Handles therapist preference, location, and service duration.",
        },
        {
          n: "02",
          t: "Digital Intake Agent",
          d: "Sends the condition-specific history form on booking, chases it at T-24h, and drops a structured summary into the therapist's view before the session.",
        },
        {
          n: "03",
          t: "Waitlist Backfill",
          d: "The moment a slot frees, it offers it to the ranked waitlist — first accept wins. Median backfill time: 9 minutes.",
        },
        {
          n: "04",
          t: "Adherence Agent",
          d: "Tracks package burn-down and session gaps. If a patient goes 12 days without booking mid-package, it reaches out with the clinical why.",
        },
        {
          n: "05",
          t: "Outcome & Review Loop",
          d: "Post-package outcome check-in, then a review request routed to Google only for patients who reported improvement.",
        },
      ],
    },
    flow: ["BOOKING", "INTAKE", "REMINDERS", "BACKFILL", "ADHERENCE"],
    example: {
      client: "A 4-clinic physiotherapy and sports rehab group",
      context:
        "Two full-time front-desk staff were managing roughly 1,400 appointments a month across four locations, mostly through a shared WhatsApp number and a paper diary. The clinical team was excellent. The operations layer was losing them close to ₹6L a month.",
      before: [
        "29% no-show rate",
        "61% chair utilisation",
        "Cancelled slots stayed empty",
        "42% of packages abandoned mid-way",
      ],
      after: [
        "8.4% no-show rate",
        "84% chair utilisation",
        "9 min median waitlist backfill",
        "17% package abandonment",
      ],
      narrative:
        "A patient cancels her 4pm Thursday slot at 2:10pm. Within 90 seconds the backfill agent has ranked the waitlist — weighting patients mid-package, patients whose last session was over ten days ago, and patients at that location — and messaged the top three. The second accepts at 2:19pm. Her intake is already on file, so the therapist's screen updates with her session-6 notes and last recorded range-of-motion. The slot never showed as empty on the day sheet. Meanwhile the adherence agent flags a different patient: session 4 of 10, no booking in 13 days. It sends a message referencing his specific recovery milestone. He books that evening.",
    },
    results: [
      ["-71%", "no-show rate"],
      ["+38%", "slot utilisation"],
      ["11 hrs", "front-desk hours saved/week"],
      ["4.8★", "from 4.2★ Google rating"],
    ],
    outcomes: [
      { t: "The empty chair disappears", d: "Cancellations get backfilled in minutes instead of staying dead air. Every 45-minute slot you recover is revenue you already paid rent and salary for." },
      { t: "Your front desk gets its day back", d: "Booking, rescheduling, intake chasing and reminders stop being human work — so your team handles patients in front of them, not a phone that never stops." },
      { t: "Patients finish what they start", d: "Package adherence is tracked per patient. When someone drifts mid-programme, they hear from you with the clinical reason why it matters." },
      { t: "Clinical time stays clinical", d: "History arrives before the patient does. Therapists open a session with a structured summary instead of twelve minutes of intake." },
    ],
    deliverables: {
      agentic: ["Conversational booking, reschedule and cancel over WhatsApp", "Digital intake agent with condition-specific forms", "Waitlist backfill agent — ranked, first-accept-wins", "Package adherence agent", "Outcome check-in and review routing"],
      saas: ["Chair utilisation dashboard across all locations", "Therapist day sheet with pre-session summaries", "Package burn-down and expiry tracker", "No-show and backfill analytics"],
      integrations: ["WhatsApp Business API", "Razorpay / payment gateway", "Google Business Profile", "Google / Outlook Calendar", "Your existing EMR or notes system"],
    },
    workflowSteps: [
      { n: "01", t: "Patient books", what: "Someone books, reschedules or cancels in plain language over WhatsApp.", auto: "Handles therapist preference, location and service duration against live availability.", out: "Confirmed appointment, no phone call needed." },
      { n: "02", t: "Intake before arrival", what: "A condition-specific history form goes out the moment the booking lands.", auto: "Chases at T-24h and structures the response for the therapist.", out: "Clinical summary waiting on the therapist's screen." },
      { n: "03", t: "Reminders that work", what: "The patient gets a reminder cadence tuned to reduce drop-off.", auto: "T-24h and T-2h nudges with a one-tap reschedule instead of a silent no-show.", out: "No-shows down, or converted into reschedules." },
      { n: "04", t: "Backfill the gap", what: "A slot frees up at short notice.", auto: "Ranks the waitlist by package stage, days since last session and location, then offers it out.", out: "Slot refilled in around nine minutes." },
      { n: "05", t: "Keep them on programme", what: "A patient goes quiet mid-package.", auto: "Detects the gap against their treatment plan and reaches out with the clinical why.", out: "Packages finished, outcomes protected." },
    ],
    rollout: [
      { w: "Week 1", t: "Operations audit", d: "We sit with your day sheets, no-show data, package records and front-desk WhatsApp history to find where the revenue is actually leaking." },
      { w: "Week 2–4", t: "Build the core", d: "Scheduling engine, intake flows per service type, and the waitlist ranking logic — built around how your clinics really run." },
      { w: "Week 5", t: "Single-site pilot", d: "One location goes live. We tune reminder timing and backfill ranking against real patient behaviour." },
      { w: "Week 6+", t: "Roll out and refine", d: "Remaining locations onboarded, then continuous tuning of adherence triggers and review routing." },
    ],
    estimator: {
      label: "Appointments booked per month",
      min: 100, max: 4000, step: 50, def: 1400,
      rows: [
        { label: "Slots lost to no-shows today", fn: (v) => Math.round(v * 0.29) },
        { label: "Slots lost with the system", fn: (v) => Math.round(v * 0.084), hl: true },
        { label: "Appointments recovered monthly", fn: (v) => `+${Math.round(v * 0.206)}`, hl: true },
      ],
      note: "Uses the 29% → 8.4% no-show shift from the engagement above. Every clinic's baseline differs — we measure yours first.",
    },
    stack: ["WhatsApp Business API", "Custom scheduling core", "Razorpay", "Google Business Profile API", "Claude"],
  },

  /* ============================================================ 03 */
  {
    slug: "coaching-and-consulting",
    num: "03",
    name: "Coaching & Consulting",
    cat: "Agentic Automation",
    viz: "agents",
    tagline: "Sell without being on every call.",
    summary:
      "An agentic sales floor that qualifies applicants, runs discovery, handles objections, and books only the calls actually worth the founder's hour.",
    metrics: [
      ["4.1×", "qualified calls"],
      ["-62%", "no-show on calls"],
      ["₹0", "SDR headcount"],
    ],
    hero: {
      title: "Your calendar should hold",
      titleSerif: "only closable calls.",
      sub: "Most coaching businesses cap out when the founder's calendar fills with unqualified discovery calls. We built the layer that decides who gets an hour — and prepares the founder for the ones who do.",
    },
    problem: {
      lede: "A business coach doing ₹1.8Cr/year was personally taking 40 discovery calls a month, closing 6, and burning out.",
      points: [
        {
          t: "Unqualified calendar",
          d: "Anyone could book. Roughly 60% of calls were people who could not afford the programme or were not ready to start.",
        },
        {
          t: "34% call no-show rate",
          d: "A third of the booked hours simply evaporated, and there was no structured re-book flow.",
        },
        {
          t: "Zero pre-call context",
          d: "Every call started from scratch — 15 minutes of discovery that a form could have captured.",
        },
        {
          t: "Post-call follow-up was manual",
          d: "Proposals went out two days late, objections went unanswered, and warm prospects cooled.",
        },
      ],
    },
    system: {
      name: "Velyx Enrolment Engine",
      type: "Agentic Automation",
      lede: "Five agents replacing the SDR function entirely — application scoring, nurture, pre-call prep, and post-call objection handling.",
      modules: [
        {
          n: "01",
          t: "Application Agent",
          d: "Replaces the open calendar with a conversational application. Captures revenue, team size, the actual bottleneck, and readiness to invest.",
        },
        {
          n: "02",
          t: "Fit Scoring",
          d: "Scores against the ICP the founder actually closes. Below threshold routes to the self-serve course; above threshold gets a calendar link.",
        },
        {
          n: "03",
          t: "Show-Up Agent",
          d: "Runs a value-loaded reminder sequence — a relevant case study at T-24h, a one-question prompt at T-2h, a nudge at T-10min.",
        },
        {
          n: "04",
          t: "Call Prep Brief",
          d: "Delivers a one-page brief to the founder 30 minutes before: business context, likely objection, comparable client, suggested opening.",
        },
        {
          n: "05",
          t: "Objection Agent",
          d: "Post-call, handles the three recurring objections with tailored proof, sends the proposal within 20 minutes, and runs a 14-day follow-up.",
        },
      ],
    },
    flow: ["APPLICATION", "FIT SCORE", "NURTURE", "PREP BRIEF", "CLOSE"],
    example: {
      client: "A B2B business coach — ₹1.8Cr/yr, ₹4L flagship programme",
      context:
        "The bottleneck was not lead generation. He had a strong content engine bringing 300+ applications a month. The bottleneck was that his own calendar was the only qualification mechanism, and it was completely full of the wrong people.",
      before: [
        "40 discovery calls/month, 6 closes",
        "34% call no-show rate",
        "15 min of every call spent on basic discovery",
        "Proposals sent 48 hrs post-call",
      ],
      after: [
        "24 discovery calls/month, 19 closes",
        "13% call no-show rate",
        "0 min — full brief delivered pre-call",
        "Proposals sent 20 min post-call",
      ],
      narrative:
        "An applicant lands from a YouTube video at 9pm. Instead of a calendar, she gets a conversation: what she runs, current revenue, team size, what is actually stuck. She describes a ₹3Cr agency with a delivery bottleneck and names a specific fear about hiring. The scoring agent puts her at 91 — squarely in the profile he closes at 60%. She gets a calendar link and picks Thursday 3pm. Over the next two days she receives one case study of an agency with the identical bottleneck. At 2:30pm Thursday the founder opens a brief: revenue, the delivery bottleneck in her words, the likely price objection, the two comparable clients to reference, and a suggested opening line. He walks into the call already three-quarters through discovery. She enrols on the call.",
    },
    results: [
      ["4.1×", "close rate per call"],
      ["-40%", "calls taken per month"],
      ["-62%", "no-show rate"],
      ["₹2.9Cr", "run-rate, same lead volume"],
    ],
    outcomes: [
      { t: "Your calendar holds only closable calls", d: "An application layer decides who is worth an hour of your time. You stop spending your week discovering that someone can't afford you." },
      { t: "You walk into every call prepared", d: "A one-page brief lands 30 minutes before: their business, their bottleneck in their own words, the likely objection and the comparable client to reference." },
      { t: "No SDR payroll to carry", d: "The qualification, nurture and follow-up function runs without a single hire — and it doesn't take holidays or leave for a competitor." },
      { t: "Follow-up stops being the leak", d: "Proposals go out in twenty minutes, not two days, and objections get answered with proof while the conversation is still warm." },
    ],
    deliverables: {
      agentic: ["Conversational application agent", "ICP fit-scoring engine tuned to who you actually close", "Show-up agent with value-loaded reminders", "Pre-call brief generator", "Post-call objection and proposal agent"],
      saas: ["Application pipeline board with scores and reasons", "ICP scoring tuner you control", "Call brief archive", "Cohort revenue and close-rate dashboard"],
      integrations: ["Cal.com / Calendly", "WhatsApp and email sequences", "Notion / your CRM", "Stripe or Razorpay for enrolment", "YouTube and content lead capture"],
    },
    workflowSteps: [
      { n: "01", t: "Application, not a calendar", what: "A prospect lands from your content and wants to talk.", auto: "A conversation captures revenue, team size, the real bottleneck and readiness to invest.", out: "A structured application instead of a blind booking." },
      { n: "02", t: "Score against reality", what: "Not every applicant deserves an hour.", auto: "Scores against the profile you actually close — low scores route to self-serve, high scores get a calendar link.", out: "Only qualified prospects reach your calendar." },
      { n: "03", t: "Make them show up", what: "Booked calls mean nothing if a third evaporate.", auto: "A relevant case study at T-24h, a one-question prompt at T-2h, a nudge at T-10min.", out: "No-shows cut by more than half." },
      { n: "04", t: "Brief before the call", what: "You need to be three-quarters through discovery before you say hello.", auto: "Generates a one-page brief 30 minutes out with context, objection and suggested opening.", out: "Calls that start deep instead of starting over." },
      { n: "05", t: "Close the loop", what: "The call ends. Most businesses lose the deal here.", auto: "Proposal within 20 minutes, tailored objection handling, then a 14-day follow-up sequence.", out: "Warm prospects converted, not cooled." },
    ],
    rollout: [
      { w: "Week 1", t: "Decode your ICP", d: "We go through your last 40 closes and 40 losses to find what genuinely predicts a sale — that becomes the scoring model." },
      { w: "Week 2", t: "Build the application flow", d: "Conversational application, scoring thresholds, and the routing rules between programme tiers." },
      { w: "Week 3", t: "Nurture and briefs live", d: "Show-up sequences and pre-call briefs go live. You start receiving briefs before every call." },
      { w: "Week 4+", t: "Tune on real outcomes", d: "Scoring recalibrated against what actually closes, and objection handling updated as new patterns appear." },
    ],
    estimator: {
      label: "Applications per month",
      min: 20, max: 800, step: 10, def: 300,
      rows: [
        { label: "Calls you take today", fn: (v) => Math.round(v * 0.133) },
        { label: "Calls you take with the system", fn: (v) => Math.round(v * 0.08), hl: true },
        { label: "Closes per month", fn: (v) => `${Math.round(v * 0.02)} → ${Math.round(v * 0.063)}`, hl: true },
      ],
      note: "Applies the shift from the engagement above — fewer calls, far higher close rate. Numbers are illustrative, not a promise.",
    },
    stack: ["Typeform → custom flow", "Cal.com", "WhatsApp + Email", "Notion CRM", "Claude"],
  },

  /* ============================================================ 04 */
  {
    slug: "legal-services",
    num: "04",
    name: "Legal Services",
    cat: "SaaS + Agents",
    viz: "docs",
    tagline: "Billable hours, back where they belong.",
    summary:
      "Intake, conflict checks, document drafting, and matter status updates automated — so associates spend their day on argument, not admin.",
    metrics: [
      ["+22%", "billable utilisation"],
      ["6 min", "intake to conflict check"],
      ["-80%", "status-update calls"],
    ],
    hero: {
      title: "Associates should argue,",
      titleSerif: "not administrate.",
      sub: "In most firms, 30–40% of a fee-earner's day is non-billable admin: intake, conflict checks, first-draft documents, and telling clients where their matter stands. All four are automatable without touching legal judgement.",
    },
    problem: {
      lede: "A 14-lawyer commercial firm was billing 4.9 hours of a 9.5-hour day, with the gap eaten almost entirely by process work.",
      points: [
        {
          t: "Intake took three days",
          d: "New enquiries bounced between reception, a partner, and a paralegal before anyone confirmed the firm could even take the matter.",
        },
        {
          t: "Manual conflict checks",
          d: "A paralegal searched three separate systems by hand. It took 40 minutes and occasionally missed a related-party conflict.",
        },
        {
          t: "First drafts from scratch",
          d: "Standard NDAs, employment contracts, and notices were being rebuilt each time from a messy precedent folder.",
        },
        {
          t: "Constant status calls",
          d: "Clients rang for updates. Each call cost 10 non-billable minutes and interrupted deep work.",
        },
      ],
    },
    system: {
      name: "Velyx Matter Desk",
      type: "SaaS + Agentic Layer",
      lede: "A matter-management layer with agents on intake, conflicts, drafting, and client comms. Every output is a draft — a lawyer signs off on everything.",
      modules: [
        {
          n: "01",
          t: "Intake Agent",
          d: "Structured conversational intake that captures parties, matter type, jurisdiction, timeline, and urgency, then produces a partner-ready summary.",
        },
        {
          n: "02",
          t: "Conflict Check",
          d: "Searches the matter database, entity registry, and related-party graph in one pass. Flags direct and indirect conflicts in under six minutes.",
        },
        {
          n: "03",
          t: "Draft Engine",
          d: "Generates first drafts from the firm's own precedent library — never generic templates. Clause-level provenance on every paragraph.",
        },
        {
          n: "04",
          t: "Matter Status Agent",
          d: "A client portal plus proactive updates at every milestone, so clients stop calling to ask what's happening.",
        },
        {
          n: "05",
          t: "Deadline Sentinel",
          d: "Tracks limitation periods and filing dates across all matters, escalating to the responsible partner at 30/14/7/2 days.",
        },
      ],
    },
    flow: ["ENQUIRY", "CONFLICT CHECK", "ENGAGEMENT", "DRAFT", "CLIENT PORTAL"],
    example: {
      client: "A 14-lawyer commercial and employment law firm",
      context:
        "The managing partner's concern was precise: he was not trying to replace legal work, he was trying to recover the 4.6 hours a day per fee-earner that was disappearing into process. Everything we built was designed so a qualified lawyer reviews and signs off on every output — the agents prepare, they never decide.",
      before: [
        "4.9 billable hrs from a 9.5 hr day",
        "3 days from enquiry to engagement letter",
        "40 min manual conflict check",
        "~90 status calls/month across the firm",
      ],
      after: [
        "6.9 billable hrs from a 9.5 hr day",
        "5 hours from enquiry to engagement letter",
        "6 min automated conflict check",
        "~18 status calls/month",
      ],
      narrative:
        "An enquiry comes in on a Tuesday morning about an employment dispute. The intake agent runs a structured conversation: parties, dates of employment, nature of termination, documents held, jurisdiction, urgency. It produces a two-page summary and simultaneously runs the conflict check across the firm's matter history and related-party graph — clean at 09:41, six minutes after the enquiry landed. A partner reads the summary at 10am, approves, and the engagement letter drafts itself against the firm's standard employment terms with the fee band pre-filled. It is signed by 2pm the same day. Three weeks later, when the client would previously have rung to ask what was happening, the portal already shows the filed response and the next hearing date.",
    },
    results: [
      ["+22%", "billable utilisation"],
      ["3 days → 5 hrs", "enquiry to engagement"],
      ["-80%", "inbound status calls"],
      ["100%", "lawyer sign-off retained"],
    ],
    outcomes: [
      { t: "Hours move back to billable", d: "The 30–40% of a fee-earner's day that goes to intake, conflict checks, first drafts and status calls is process work — and process work is exactly what a system absorbs." },
      { t: "You win the matters you'd have lost", d: "Enquiry to signed engagement letter drops from days to hours. Clients instruct the firm that responds first far more often than the firm that responds best." },
      { t: "Conflicts stop being a risk", d: "Every check runs across matter history, entity registry and the related-party graph in one pass — including the indirect conflicts a manual search misses." },
      { t: "Judgement stays with lawyers", d: "Every output is a draft. Nothing is filed, sent or decided without a qualified lawyer signing off — the system prepares, it never decides." },
    ],
    deliverables: {
      agentic: ["Structured intake agent with partner-ready summaries", "Conflict check across matters and related parties", "First-draft engine grounded in your own precedents", "Matter status agent and client updates", "Deadline sentinel with escalation ladder"],
      saas: ["Matter management dashboard", "Client portal with live matter status", "Limitation and filing deadline board", "Fee-earner utilisation reporting"],
      integrations: ["Your matter database", "Precedent library (retrieval-grounded)", "DocuSign / e-signature", "Outlook and calendar", "Time recording and billing"],
    },
    workflowSteps: [
      { n: "01", t: "Enquiry arrives", what: "A prospective client makes contact about a new matter.", auto: "A structured conversation captures parties, matter type, jurisdiction, timeline and urgency.", out: "A two-page, partner-ready summary." },
      { n: "02", t: "Conflict check", what: "Before anything else, can the firm take it?", auto: "Searches matter history, entity registry and related-party graph in a single pass.", out: "Direct and indirect conflicts flagged in about six minutes." },
      { n: "03", t: "Engagement", what: "A partner reviews the summary and approves.", auto: "Drafts the engagement letter against your standard terms with the fee band pre-filled.", out: "Signed engagement the same day." },
      { n: "04", t: "First draft", what: "The matter needs its standard documents.", auto: "Generates drafts from your precedent library — never generic templates — with clause-level provenance.", out: "A draft on the lawyer's desk to review, not to write." },
      { n: "05", t: "Keep the client informed", what: "Clients ring because they don't know what's happening.", auto: "Proactive milestone updates plus a portal showing live matter status.", out: "Status calls down by around 80%." },
    ],
    rollout: [
      { w: "Week 1–2", t: "Precedent and process audit", d: "We index your precedent library, map matter types, and document where non-billable time actually goes across the firm." },
      { w: "Week 3–5", t: "Build with sign-off gates", d: "Intake, conflict search and drafting built with a mandatory lawyer review step at every output. Nothing bypasses a human." },
      { w: "Week 6", t: "Pilot on one practice area", d: "One team runs it live. We measure draft quality and conflict-check accuracy against manual results before expanding." },
      { w: "Ongoing", t: "Firm-wide and maintained", d: "Rolled out across practice areas, with the precedent index and deadline rules kept current as law and templates change." },
    ],
    estimator: {
      label: "Fee earners in the firm",
      min: 2, max: 120, step: 1, def: 14,
      rows: [
        { label: "Billable hours per day today", fn: (v) => `${(v * 4.9).toFixed(0)} hrs` },
        { label: "Billable hours with the system", fn: (v) => `${(v * 6.9).toFixed(0)} hrs`, hl: true },
        { label: "Recovered hours per week", fn: (v) => `+${Math.round(v * 2 * 5)} hrs`, hl: true },
      ],
      note: "Based on the 4.9 → 6.9 billable-hour shift in the engagement above, across a five-day week. Indicative only.",
    },
    stack: ["Custom matter DB", "Precedent library RAG", "DocuSign", "Client portal", "Claude"],
  },

  /* ============================================================ 05 */
  {
    slug: "restaurants-and-cafes",
    num: "05",
    name: "Restaurants & Cafés",
    cat: "Agentic Automation",
    viz: "orders",
    tagline: "Own the guest, not just the order.",
    summary:
      "Reservations, WhatsApp ordering, and win-back campaigns built on your own guest data — cutting the aggregator tax and bringing regulars back on a schedule.",
    metrics: [
      ["+31%", "repeat visit rate"],
      ["-18%", "aggregator dependence"],
      ["2.7×", "direct orders"],
    ],
    hero: {
      title: "The aggregator owns",
      titleSerif: "your customer.",
      sub: "You pay 25–30% commission for a guest whose phone number you never see. We build the direct channel — reservations, ordering, and win-back — so the relationship is yours.",
    },
    problem: {
      lede: "A 3-outlet café chain was doing 68% of delivery volume through aggregators and had no way to reach a single one of those customers again.",
      points: [
        {
          t: "The commission tax",
          d: "Roughly ₹4.4L a month in aggregator commission on orders from guests who had already visited the café in person.",
        },
        {
          t: "No guest database",
          d: "Thousands of orders a month, zero owned contact data. Every repeat order was re-bought through the platform.",
        },
        {
          t: "Reservations by phone only",
          d: "Calls went unanswered during service. Walk-in-only meant unpredictable covers and wasted prep.",
        },
        {
          t: "Regulars quietly churned",
          d: "A weekly regular who stopped coming was never noticed, let alone won back.",
        },
      ],
    },
    system: {
      name: "Velyx Guest Engine",
      type: "Agentic Automation",
      lede: "A WhatsApp-first guest layer that owns reservations, direct ordering, and lifecycle marketing on data you control.",
      modules: [
        {
          n: "01",
          t: "Reservation Agent",
          d: "Takes bookings over WhatsApp with live table availability, party size, and occasion tagging. Confirms and runs a T-3h reconfirm.",
        },
        {
          n: "02",
          t: "Direct Order Flow",
          d: "A WhatsApp menu with saved favourites and one-tap reorder, priced 12% below aggregator with free delivery over a threshold.",
        },
        {
          n: "03",
          t: "Guest Graph",
          d: "Builds a profile per guest — favourite dishes, visit cadence, spend band, dietary flags, occasion dates.",
        },
        {
          n: "04",
          t: "Win-Back Agent",
          d: "Detects when a guest breaks their own pattern and sends a personal message referencing what they actually order.",
        },
        {
          n: "05",
          t: "Occasion Agent",
          d: "Birthdays and anniversaries captured at booking, triggered a week out with a table offer.",
        },
      ],
    },
    flow: ["GUEST", "RESERVE / ORDER", "GUEST GRAPH", "WIN-BACK", "REPEAT VISIT"],
    example: {
      client: "A 3-outlet specialty coffee and all-day dining chain",
      context:
        "The food was the reason people came back — but the business had no mechanism to make coming back happen. Every guest relationship was rented from a platform. The goal was not to leave aggregators, it was to stop paying commission on guests who were already loyal.",
      before: [
        "68% of delivery through aggregators",
        "₹4.4L/month commission outflow",
        "0 owned guest records",
        "Reservations: phone only, often unanswered",
      ],
      after: [
        "44% of delivery through aggregators",
        "₹2.6L/month commission outflow",
        "11,400 owned guest records in 6 months",
        "Reservations: WhatsApp, 100% answered",
      ],
      narrative:
        "A guest who ordered a cold brew and a chicken sandwich every Tuesday for four months goes quiet. On day 19, the win-back agent notices the break in her own pattern — not a generic 30-day rule, her rhythm. She gets a message: a note that the single-origin she usually drinks has a new Ethiopian lot in, and a free upgrade on her next order. She orders directly that afternoon. The café pays zero commission on it, and her profile updates with a new favourite. Separately, a couple who booked a table and mentioned an anniversary at reservation get a message eleven months later, a week before the date, offering the same corner table.",
    },
    results: [
      ["+31%", "repeat visit rate"],
      ["₹1.8L", "monthly commission saved"],
      ["11.4K", "owned guest records"],
      ["2.7×", "direct order volume"],
    ],
    outcomes: [
      { t: "You own the customer, not the platform", d: "Every direct order builds a guest record you control — phone number, favourite dishes, visit rhythm, spend band. That asset compounds; rented platform traffic never does." },
      { t: "Commission stops being a fixed cost", d: "Guests who already love you stop being re-bought at 25–30% every single time they order." },
      { t: "Regulars come back on a schedule", d: "The system learns each guest's own rhythm and notices when they break it — not a blunt 30-day blast to your whole list." },
      { t: "Covers become predictable", d: "Reservations get answered during service instead of ringing out, so prep and rostering stop being guesswork." },
    ],
    deliverables: {
      agentic: ["WhatsApp reservation agent with live table availability", "Direct ordering flow with one-tap reorder", "Guest graph builder — dishes, cadence, spend, dietary flags", "Win-back agent tuned to each guest's own pattern", "Occasion agent for birthdays and anniversaries"],
      saas: ["Guest CDP you own and can export", "Cohort retention dashboard", "Menu and dish performance analytics", "Commission savings tracker vs aggregators"],
      integrations: ["WhatsApp Business API", "Your POS", "Razorpay / payment gateway", "Google Business Profile", "Aggregator order reconciliation"],
    },
    workflowSteps: [
      { n: "01", t: "Guest makes contact", what: "Someone books a table or places an order over WhatsApp.", auto: "Live table availability, party size and occasion tagging — or a menu with saved favourites.", out: "A booking or order on a channel you own." },
      { n: "02", t: "Order goes direct", what: "The same food, priced better than the aggregator.", auto: "Direct pricing with free delivery over a threshold, routed straight to your POS.", out: "Zero commission on the order." },
      { n: "03", t: "Profile builds itself", what: "Every interaction teaches the system something.", auto: "Records favourite dishes, visit cadence, spend band, dietary flags and occasion dates.", out: "A guest record that gets more valuable over time." },
      { n: "04", t: "Notice the drift", what: "A weekly regular quietly stops coming.", auto: "Detects the break against their own pattern — not a generic rule — and reaches out referencing what they actually order.", out: "Regulars recovered before they're gone for good." },
      { n: "05", t: "Own the occasion", what: "Birthdays and anniversaries captured at booking.", auto: "Triggers a week before the date with a table offer.", out: "High-spend covers you'd otherwise never have known about." },
    ],
    rollout: [
      { w: "Week 1", t: "Channel and margin audit", d: "We break down your aggregator mix, commission outflow, and which guests are already loyal but being re-bought every order." },
      { w: "Week 2–3", t: "Build the direct channel", d: "WhatsApp reservation and ordering flows, POS integration, and the guest graph schema." },
      { w: "Week 4", t: "One outlet live", d: "Launch at a single location with in-store prompts to move existing guests onto the direct channel." },
      { w: "Week 5+", t: "Scale and win back", d: "Remaining outlets onboarded, then lifecycle campaigns switched on as the guest database reaches critical mass." },
    ],
    estimator: {
      label: "Delivery orders per month",
      min: 200, max: 12000, step: 100, def: 3000,
      rows: [
        { label: "Orders via aggregators today", fn: (v) => Math.round(v * 0.68) },
        { label: "Orders via aggregators after", fn: (v) => Math.round(v * 0.44), hl: true },
        { label: "Orders moved to direct monthly", fn: (v) => `+${Math.round(v * 0.24)}`, hl: true },
      ],
      note: "Uses the 68% → 44% aggregator shift from the engagement above. Commission saved depends on your average order value and platform rate.",
    },
    stack: ["WhatsApp Business API", "POS integration", "Razorpay", "Guest CDP", "Claude"],
  },

  /* ============================================================ 06 */
  {
    slug: "beauty-and-salon-chains",
    num: "06",
    name: "Beauty & Salon Chains",
    cat: "Full System",
    viz: "calendar",
    tagline: "Rebooking as a system, not a hope.",
    summary:
      "Multi-location booking, stylist-level rebooking cadence, and membership retention running automatically across every outlet.",
    metrics: [
      ["+44%", "rebook rate"],
      ["-64%", "no-shows"],
      ["+27%", "member retention"],
    ],
    hero: {
      title: "The money is in",
      titleSerif: "the rebook.",
      sub: "A salon's economics live or die on whether a client comes back in six weeks instead of eleven. Most chains leave that entirely to the front desk asking nicely. We made it a system.",
    },
    problem: {
      lede: "An 11-outlet salon chain had strong footfall and weak retention — the average client gap was 11.4 weeks on services designed for a 6-week cycle.",
      points: [
        {
          t: "Rebooking depended on the desk",
          d: "If the front desk was busy at checkout, nobody asked. Rebook-at-checkout rate sat at 21%.",
        },
        {
          t: "Service cycles ignored",
          d: "A root touch-up needs 5–6 weeks. Clients drifted to 11 and often went elsewhere in between.",
        },
        {
          t: "Stylist loyalty was invisible",
          d: "Clients wanted a specific stylist but had no way to see that stylist's availability across outlets.",
        },
        {
          t: "Memberships lapsed silently",
          d: "Prepaid packages expired unused. Members felt cheated and did not renew.",
        },
      ],
    },
    system: {
      name: "Velyx Salon OS",
      type: "SaaS + Agentic Layer",
      lede: "A multi-location booking core with a rebooking agent that works to each service's actual biological cycle, per stylist.",
      modules: [
        {
          n: "01",
          t: "Multi-Outlet Booking",
          d: "One WhatsApp number across all outlets. Books by stylist, service, or nearest location with live chair availability.",
        },
        {
          n: "02",
          t: "Cycle-Aware Rebooking",
          d: "Each service carries its own return window. The agent reaches out at the right point in the client's cycle, not a flat 30 days.",
        },
        {
          n: "03",
          t: "Stylist Affinity",
          d: "Remembers stylist preference and formula history. If a client's stylist moves outlets, the client is told.",
        },
        {
          n: "04",
          t: "Membership Guardian",
          d: "Tracks package burn-down and expiry, nudging members to use sessions before value is lost — the single biggest driver of renewals.",
        },
        {
          n: "05",
          t: "Chair Fill Agent",
          d: "Detects tomorrow's soft slots and offers them to the waitlist and lapsed clients at a controlled discount.",
        },
      ],
    },
    flow: ["VISIT", "SERVICE LOG", "CYCLE TIMER", "REBOOK NUDGE", "RETURN"],
    example: {
      client: "An 11-outlet premium salon chain, 140+ stylists",
      context:
        "Footfall was never the problem — the brand pulled well. The problem was that a client worth ₹68,000 a year at a six-week cycle was behaving like a client worth ₹36,000 at an eleven-week cycle, and nothing in the operation was set up to notice or correct it.",
      before: [
        "21% rebook-at-checkout rate",
        "11.4 week average client gap",
        "23% no-show rate",
        "38% of memberships expired unused",
      ],
      after: [
        "63% rebook rate (checkout + agent)",
        "7.1 week average client gap",
        "8.3% no-show rate",
        "11% of memberships expired unused",
      ],
      narrative:
        "A client gets global colour with a specific stylist at the Koregaon Park outlet. The system logs the service, the formula, and the stylist. Colour on her hair type carries a 5.5-week window, so at week four the agent messages her — referencing her stylist by name and offering his two open Saturday slots. She books week five. Her actual gap drops from eleven weeks to five, and the chain's revenue per client nearly doubles without a single new customer acquired. Separately, a member who bought a ten-session package and has used three with two months left gets a nudge that frames it in value terms — sessions worth ₹9,000 expiring. She books two that week and renews at expiry.",
    },
    results: [
      ["+44%", "rebook rate"],
      ["11.4 → 7.1 wk", "average client gap"],
      ["-64%", "no-show rate"],
      ["+27%", "membership renewal"],
    ],
    outcomes: [
      { t: "Rebooking stops depending on a busy desk", d: "The return visit is driven by each service's actual cycle, not by whether someone remembered to ask at checkout." },
      { t: "The same client is worth far more", d: "Pulling an eleven-week gap back to seven weeks nearly doubles annual value per client — without acquiring a single new one." },
      { t: "Memberships get used, so they get renewed", d: "Prepaid packages that expire unused are the fastest way to lose a member. The system makes sure the value gets consumed." },
      { t: "Stylist loyalty finally works for you", d: "Clients follow stylists. When theirs moves outlet or has open slots, the client hears about it — so that loyalty stays inside your chain." },
    ],
    deliverables: {
      agentic: ["Multi-outlet booking over one WhatsApp number", "Cycle-aware rebooking agent per service type", "Stylist affinity and formula memory", "Membership guardian tracking burn-down and expiry", "Chair-fill agent for soft slots"],
      saas: ["Multi-outlet occupancy dashboard", "Stylist retention and rebook leaderboard", "Membership ledger with expiry exposure", "Client gap and cycle analytics"],
      integrations: ["WhatsApp Business API", "Your POS and billing", "Payment gateway for packages", "Multi-location calendar system"],
    },
    workflowSteps: [
      { n: "01", t: "Client visits", what: "A service is performed at one of your outlets.", auto: "Logs the service, the formula used, the stylist and the outlet against the client record.", out: "A service history that drives everything downstream." },
      { n: "02", t: "Cycle timer starts", what: "Colour needs 5–6 weeks. A cut needs something different.", auto: "Each service carries its own return window rather than a flat 30-day rule.", out: "The right reach-out date, per client, per service." },
      { n: "03", t: "Rebook nudge", what: "The client hits the right point in their cycle.", auto: "Messages them referencing their stylist by name with two open slots.", out: "Rebooking that happens whether or not the desk asked." },
      { n: "04", t: "Protect the membership", what: "A member has sessions left and time running out.", auto: "Frames the remaining sessions in value terms and prompts them to book.", out: "Packages consumed, renewals earned." },
      { n: "05", t: "Fill tomorrow's gaps", what: "Tomorrow has soft slots that will otherwise go empty.", auto: "Offers them to the waitlist and lapsed clients at a controlled discount.", out: "Chairs full without discounting your whole book." },
    ],
    rollout: [
      { w: "Week 1", t: "Cycle and retention audit", d: "We analyse actual client gaps per service type against the biological cycle each service should follow, and where memberships are dying." },
      { w: "Week 2–4", t: "Build the booking core", d: "Multi-outlet booking, stylist affinity, service cycle rules and the membership ledger." },
      { w: "Week 5", t: "Pilot outlets", d: "Two or three outlets go live. We tune nudge timing and discount thresholds against real rebooking behaviour." },
      { w: "Week 6+", t: "Chain-wide rollout", d: "All outlets onboarded, with cycle windows refined per service and stylist as data accumulates." },
    ],
    estimator: {
      label: "Client visits per month (all outlets)",
      min: 200, max: 20000, step: 100, def: 4000,
      rows: [
        { label: "Rebooked at checkout today", fn: (v) => Math.round(v * 0.21) },
        { label: "Rebooked with the system", fn: (v) => Math.round(v * 0.63), hl: true },
        { label: "Extra return visits monthly", fn: (v) => `+${Math.round(v * 0.42)}`, hl: true },
      ],
      note: "Applies the 21% → 63% rebook shift from the engagement above. Your mix of services and outlets will move this materially.",
    },
    stack: ["WhatsApp Business API", "Multi-tenant booking core", "POS + membership ledger", "Claude"],
  },

  /* ============================================================ 07 */
  {
    slug: "b2b-saas-founders",
    num: "07",
    name: "B2B SaaS Founders",
    cat: "Agentic Automation",
    viz: "agents",
    tagline: "An agentic GTM org, not more headcount.",
    summary:
      "Outbound research, inbound qualification, onboarding, and churn-risk detection run by a fleet of specialist agents the founder reviews weekly.",
    metrics: [
      ["6 → 1", "GTM headcount"],
      ["+$2.4M", "ARR added"],
      ["87%", "auto-qualified"],
    ],
    hero: {
      title: "Scale GTM without",
      titleSerif: "scaling headcount.",
      sub: "The Series A trap: revenue targets demand more pipeline, pipeline demands more SDRs, SDRs demand management, and burn multiple goes the wrong way. We build the agentic alternative.",
    },
    problem: {
      lede: "A Series A vertical SaaS company was carrying a 6-person GTM team to produce pipeline that a well-built agent fleet could produce better.",
      points: [
        {
          t: "SDR economics were upside down",
          d: "Six people, fully loaded, against a pipeline number that had barely moved in three quarters.",
        },
        {
          t: "Inbound leads sat for hours",
          d: "Trials signed up at all hours and got a first touch the next business day, by which point activation had already stalled.",
        },
        {
          t: "Onboarding was founder-dependent",
          d: "The founder was personally onboarding every account over $20K, which capped how many they could sign.",
        },
        {
          t: "Churn was a surprise",
          d: "Accounts churned at renewal with no earlier signal, despite usage data clearly showing the decline eight weeks out.",
        },
      ],
    },
    system: {
      name: "Velyx GTM Fleet",
      type: "Agentic Automation",
      lede: "Eight specialist agents covering research, qualification, prep, onboarding, and retention — with a single weekly escalation queue for the founder.",
      modules: [
        {
          n: "01",
          t: "Research Agent",
          d: "Builds an account dossier per target — tech stack, hiring signals, funding, the specific trigger that makes them buyable now.",
        },
        {
          n: "02",
          t: "Outbound Agent",
          d: "Writes sequences grounded in the dossier, not spun templates. Every email cites a real, verifiable observation about the account.",
        },
        {
          n: "03",
          t: "Inbound Qualifier",
          d: "Engages every trial signup within two minutes, establishes ICP fit and use case, and routes hot accounts to a live calendar.",
        },
        {
          n: "04",
          t: "Onboarding Agent",
          d: "Runs the first-30-days activation path per account, escalating to a human only when the account stalls at a known drop-off point.",
        },
        {
          n: "05",
          t: "Churn Sentinel",
          d: "Watches usage, seat activity, and support sentiment. Flags at-risk accounts 8–10 weeks before renewal with a specific reason.",
        },
        {
          n: "06",
          t: "CRM Hygiene Agent",
          d: "Keeps the CRM truthful — deduplicating, enriching, and closing stale opportunities so forecasts mean something.",
        },
      ],
    },
    flow: ["RESEARCH", "OUTBOUND", "QUALIFY", "ONBOARD", "RETAIN"],
    example: {
      client: "A Series A vertical SaaS company — $4.1M ARR at engagement",
      context:
        "The board wanted a path to $10M without tripling GTM spend. We spent three weeks mapping which parts of the GTM motion actually required human judgement — and it turned out to be far less than the org chart assumed. The founder now reviews about 18 escalations a week and that is the entirety of their GTM management load.",
      before: [
        "6-person GTM team",
        "Next-business-day inbound response",
        "Founder onboarding every $20K+ account",
        "Churn discovered at renewal",
      ],
      after: [
        "1 GTM lead + 8-agent fleet",
        "2-minute inbound response, 24/7",
        "Agent-led onboarding, human on stall only",
        "Churn risk flagged 8–10 weeks early",
      ],
      narrative:
        "A trial signs up at 2:14am from a logistics company. By 2:16am the qualifier has engaged, established that they are evaluating against a named competitor, that they have 40 seats in scope, and that the trigger is a compliance deadline in Q3. It routes them as a priority account and books a call for Thursday. In parallel, the research agent has already built the dossier: recent Series B, three ops hires last quarter, the exact compliance regime driving the deadline. The GTM lead walks into Thursday's call knowing more about the account than the prospect expects. Meanwhile the churn sentinel flags an existing $84K account — seat logins down 40% over six weeks, two unresolved support tickets, champion no longer active. That is ten weeks before renewal. The account was saved.",
    },
    results: [
      ["6 → 1", "GTM headcount"],
      ["+$2.4M", "ARR added in 4 quarters"],
      ["87%", "leads auto-qualified"],
      ["18/wk", "founder escalations"],
    ],
    outcomes: [
      { t: "Pipeline scales without burn scaling", d: "You hit the next revenue number without tripling GTM spend — the exact trap that wrecks burn multiple between Series A and B." },
      { t: "Inbound never waits again", d: "A trial that signs up at 2am is engaged by 2:02am, while intent is at its peak, instead of getting a first touch the next business day." },
      { t: "Churn stops being a surprise", d: "Usage decline, seat drop-off and champion departure are visible eight to ten weeks before renewal — while there's still time to act." },
      { t: "The founder gets out of the loop", d: "You review around 18 escalations a week. That's the whole management load — no SDR coaching, no pipeline nagging, no onboarding calls." },
    ],
    deliverables: {
      agentic: ["Account research agent building real dossiers", "Outbound agent grounded in verifiable observations", "Inbound qualifier engaging trials in under two minutes", "Onboarding agent running the first-30-days path", "Churn sentinel with 8–10 week early warning", "CRM hygiene agent"],
      saas: ["Single weekly escalation queue for the founder", "Pipeline dashboard with agent-attributed sourcing", "Account health scoring across usage and sentiment", "Full agent audit logs — every action traceable"],
      integrations: ["HubSpot or Salesforce", "Clay and enrichment APIs", "Product usage warehouse", "Slack", "Support desk and billing"],
    },
    workflowSteps: [
      { n: "01", t: "Research the account", what: "A target account enters the motion.", auto: "Builds a dossier — tech stack, hiring signals, funding, and the specific trigger making them buyable now.", out: "Real context, not a guessed persona." },
      { n: "02", t: "Reach out with substance", what: "Outbound that doesn't read like outbound.", auto: "Writes sequences grounded in the dossier — every email cites a verifiable observation about that account.", out: "Replies from accounts that actually fit." },
      { n: "03", t: "Qualify inbound instantly", what: "A trial signs up at any hour.", auto: "Engages within two minutes, establishes ICP fit, use case and competitive context, then routes.", out: "Hot accounts on a calendar while intent is live." },
      { n: "04", t: "Onboard to activation", what: "Signing is not the finish line — activation is.", auto: "Runs the first-30-days path per account, escalating only when it stalls at a known drop-off point.", out: "Activation without founder time." },
      { n: "05", t: "Defend the renewal", what: "Accounts churn for reasons visible months earlier.", auto: "Watches usage, seat activity and support sentiment, flagging risk with a specific stated reason.", out: "Renewals saved while there's still runway to fix it." },
    ],
    rollout: [
      { w: "Week 1–2", t: "Map judgement vs repetition", d: "We go through your GTM motion step by step and separate what genuinely needs human judgement from what only looks like it does." },
      { w: "Week 3–5", t: "Build the fleet", d: "Agents built and wired into CRM, enrichment, product usage and Slack — with escalation rules defined per agent." },
      { w: "Week 6", t: "Run in shadow", d: "The fleet runs alongside the existing team. Every output is reviewed before anything is sent, until quality is proven." },
      { w: "Ongoing", t: "Hand over and tune", d: "Progressive handover, weekly escalation review with the founder, and continuous tuning of scoring and messaging." },
    ],
    estimator: {
      label: "Trial signups per month",
      min: 20, max: 2000, step: 10, def: 250,
      rows: [
        { label: "Auto-qualified without a human", fn: (v) => Math.round(v * 0.87), hl: true },
        { label: "Routed to a human", fn: (v) => Math.round(v * 0.13) },
        { label: "SDR hours saved monthly", fn: (v) => `~${Math.round(v * 0.35)} hrs`, hl: true },
      ],
      note: "Applies the 87% auto-qualification rate from the engagement above, at roughly 24 minutes of manual handling saved per lead. Directional only.",
    },
    stack: ["HubSpot / Salesforce", "Clay + enrichment APIs", "Product usage warehouse", "Slack", "Claude"],
  },

  /* ============================================================ 08 */
  {
    slug: "event-management-and-wedding-planning",
    num: "08",
    name: "Events & Wedding Planning",
    cat: "Full System",
    viz: "workflow",
    tagline: "Every vendor, every RSVP, one thread.",
    summary:
      "Enquiry-to-proposal in hours, vendor coordination on autopilot, and guest RSVP handled at scale — so planners plan instead of chasing.",
    metrics: [
      ["4 hrs", "enquiry to proposal"],
      ["-73%", "coordination messages"],
      ["+2.2×", "events per planner"],
    ],
    hero: {
      title: "Planners should design,",
      titleSerif: "not chase.",
      sub: "A wedding involves 30+ vendors, 400+ guests, and roughly 2,000 messages. Almost none of that requires the planner's creative judgement — but all of it currently consumes their day.",
    },
    problem: {
      lede: "A wedding planning firm handling 40 events a year was capped entirely by coordination load, not by demand or creative capacity.",
      points: [
        {
          t: "Proposals took a week",
          d: "Every enquiry required manually assembling vendor quotes, a moodboard, and a budget sheet. Hot leads booked elsewhere in the gap.",
        },
        {
          t: "Vendor chasing was the job",
          d: "Confirming 30 vendors across a timeline meant hundreds of individual follow-ups per event, mostly over WhatsApp.",
        },
        {
          t: "RSVP chaos",
          d: "Guest lists lived in spreadsheets, RSVPs came by phone, and final headcounts moved right up to the day.",
        },
        {
          t: "Day-of firefighting",
          d: "No single live view of who had arrived, what was set up, and what was running late.",
        },
      ],
    },
    system: {
      name: "Velyx Event Command",
      type: "SaaS + Agentic Layer",
      lede: "A planning core with agents on proposals, vendor coordination, guest RSVP, and day-of run-of-show.",
      modules: [
        {
          n: "01",
          t: "Proposal Agent",
          d: "Turns an enquiry conversation into a costed proposal with vendor options, moodboard, and budget bands — in hours, not days.",
        },
        {
          n: "02",
          t: "Vendor Coordinator",
          d: "Owns the follow-up loop with every vendor: confirmations, deposits, deliverables, and timeline changes. Escalates only exceptions.",
        },
        {
          n: "03",
          t: "RSVP Agent",
          d: "Handles guest invitations and RSVPs over WhatsApp in multiple languages, tracking meal choices, plus-ones, and travel needs.",
        },
        {
          n: "04",
          t: "Logistics Brain",
          d: "Maintains the live run-of-show, recalculating downstream timings whenever one element slips.",
        },
        {
          n: "05",
          t: "Day-Of Console",
          d: "A live board for the on-ground team — vendor check-ins, setup status, and guest arrivals in one view.",
        },
      ],
    },
    flow: ["ENQUIRY", "PROPOSAL", "VENDOR LOCK", "RSVP", "RUN-OF-SHOW"],
    example: {
      client: "A luxury wedding planning firm — 40 events/year, 6 planners",
      context:
        "The firm turned away work every season, not because they lacked demand or taste, but because each planner could physically hold only six or seven events a year given the coordination load. Every hour spent chasing a florist for a confirmation was an hour not spent designing.",
      before: [
        "5–7 days from enquiry to proposal",
        "~2,000 coordination messages per event",
        "RSVPs in spreadsheets, called in manually",
        "6–7 events per planner per year",
      ],
      after: [
        "4 hours from enquiry to proposal",
        "~540 coordination messages per event",
        "RSVP fully conversational, live headcount",
        "14–15 events per planner per year",
      ],
      narrative:
        "An enquiry comes in for a 400-guest December wedding in Udaipur. The proposal agent runs a structured conversation about scale, aesthetic direction, budget comfort, and non-negotiables, then assembles a costed proposal against the firm's actual vendor network — three décor options at different price points, venue availability for the date, and a realistic all-in band. It lands in the client's inbox four hours after the first message, while two competing firms are still gathering quotes. Once booked, the vendor coordinator takes over: it chases the florist's confirmation, the caterer's tasting date, and the lighting deposit without a planner touching any of it. Three weeks out, the mandap setup slips by two hours. The logistics brain recalculates every downstream timing and notifies the six affected vendors within a minute. On the day, 400 guests have RSVP'd conversationally, meal counts are exact, and the planner spends the morning with the couple instead of on the phone.",
    },
    results: [
      ["5 days → 4 hrs", "enquiry to proposal"],
      ["-73%", "coordination messages"],
      ["2.2×", "events per planner"],
      ["+₹2.1Cr", "annual capacity unlocked"],
    ],
    outcomes: [
      { t: "You win the booking on speed", d: "A costed proposal lands in four hours while competing firms are still gathering vendor quotes. In a decision made emotionally and fast, that gap decides it." },
      { t: "Planners go back to designing", d: "Vendor chasing, deposit follow-ups and RSVP collection stop consuming the hours that should go into the creative work clients actually pay for." },
      { t: "Capacity doubles without hiring", d: "The ceiling on a planning firm is coordination load, not talent. Remove it and each planner holds twice the events." },
      { t: "Nothing slips silently", d: "When one element runs late, every downstream timing recalculates and the affected vendors are told within a minute — before it becomes a day-of crisis." },
    ],
    deliverables: {
      agentic: ["Proposal agent producing costed options with moodboards", "Vendor coordinator owning confirmations, deposits and deliverables", "Multilingual RSVP agent over WhatsApp", "Logistics brain maintaining a live run-of-show", "Day-of console for the on-ground team"],
      saas: ["Event command board across every live event", "Vendor CRM with reliability history", "RSVP dashboard with live headcount and meal counts", "Budget tracker against the signed proposal"],
      integrations: ["WhatsApp Business API", "Vendor CRM and contracts", "Razorpay for deposits", "Google Sheets and Calendar", "Venue availability feeds"],
    },
    workflowSteps: [
      { n: "01", t: "Enquiry to proposal", what: "A couple or company enquires about an event.", auto: "A structured conversation on scale, aesthetic, budget comfort and non-negotiables becomes a costed proposal against your real vendor network.", out: "A proposal in four hours, not five days." },
      { n: "02", t: "Lock the vendors", what: "Thirty vendors need confirming, paying and scheduling.", auto: "Owns the entire follow-up loop — confirmations, deposits, deliverables — escalating only exceptions.", out: "Vendors locked without a planner chasing." },
      { n: "03", t: "Collect the RSVPs", what: "Four hundred guests, multiple languages, changing plans.", auto: "Handles invitations and RSVPs conversationally, tracking meal choices, plus-ones and travel needs.", out: "An exact, live headcount instead of a stale spreadsheet." },
      { n: "04", t: "Hold the timeline", what: "Setup slips by two hours three weeks out.", auto: "Recalculates every downstream timing and notifies the affected vendors within a minute.", out: "A run-of-show that stays true." },
      { n: "05", t: "Run the day", what: "Event day, dozens of moving parts.", auto: "A live board shows vendor check-ins, setup status and guest arrivals in one view.", out: "The planner is with the client, not on the phone." },
    ],
    rollout: [
      { w: "Week 1", t: "Network and process mapping", d: "We catalogue your vendor network with real pricing bands, and map where planner hours actually disappear across a typical event." },
      { w: "Week 2–4", t: "Build proposal and coordination", d: "Proposal engine wired to your vendor pricing, plus the coordination agent with your escalation rules." },
      { w: "Week 5", t: "Live on one event", d: "A single real event runs on the system end to end, with a planner shadowing so nothing is left to chance." },
      { w: "Week 6+", t: "Full season rollout", d: "All planners onboarded before peak season, with vendor reliability data feeding back into proposal recommendations." },
    ],
    estimator: {
      label: "Events handled per year",
      min: 5, max: 300, step: 5, def: 40,
      rows: [
        { label: "Coordination messages today", fn: (v) => `~${(v * 2000).toLocaleString()}` },
        { label: "Coordination messages after", fn: (v) => `~${(v * 540).toLocaleString()}`, hl: true },
        { label: "Planners needed for this load", fn: (v) => `${Math.ceil(v / 6.5)} → ${Math.ceil(v / 14.5)}`, hl: true },
      ],
      note: "Uses the message reduction and per-planner capacity from the engagement above. Event scale changes this significantly.",
    },
    stack: ["WhatsApp Business API", "Vendor CRM", "Custom run-of-show engine", "Razorpay", "Claude"],
  },
];

export const getCaseStudy = (slug) => CASE_STUDIES.find((c) => c.slug === slug);
