/* ------------------------------------------------------------------
   ANALYTICS — thin, safe wrapper over GA4 (gtag).
   No-ops when gtag isn't present (e.g. local dev without the tag).
------------------------------------------------------------------ */
export function track(name, params = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

/* Delegated click tracking for conversions + outbound links.
   Call once (returns a cleanup fn). Captures:
   - book_call_click : any element with [data-cal-link] (all "Book a call" CTAs)
   - outbound_click  : clicks on external links */
export function initClickTracking() {
  if (typeof document === "undefined") return () => {};
  const onClick = (e) => {
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;

    const cal = t.closest("[data-cal-link]");
    if (cal) {
      track("book_call_click", { location: window.location.pathname });
      return;
    }
    const link = t.closest('a[href^="http"]');
    if (link && link.host !== window.location.host) {
      track("outbound_click", { url: link.href, location: window.location.pathname });
    }
  };
  document.addEventListener("click", onClick, { capture: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}
