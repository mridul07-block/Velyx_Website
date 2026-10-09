export const WORK_FILTERS = [
  ["all", "All"],
  ["ai", "AI & Automation"],
  ["saas", "SaaS & Product"],
  ["web", "Websites"],
  ["mobile", "Mobile"],
];

export const SWIPE_FILTERS = [
  ["all", "All"],
  ["product", "Product"],
  ["web", "Web"],
  ["brand", "Brand"],
];

/* Returns the ?type= value if it is a known filter key, else "all". */
export function pickFilter(filters, value) {
  return filters.some(([key]) => key === value) ? value : "all";
}
