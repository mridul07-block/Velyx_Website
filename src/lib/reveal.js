/* Scroll-reveal and count-up maths, kept pure so they can be tested. */
const clamp = (v) => Math.min(1, Math.max(0, v));

/* Opacity of word i of n at reveal progress p (0..1): dim words light up
   one after another, with a one-word soft edge. */
export function wordOpacity(i, n, p) {
  return 0.18 + 0.82 * clamp(p * n - i);
}

/* 0 while the paragraph's top is below 85% of the viewport, 1 once it has
   travelled up past 40% — the Dualite reveal window. */
export function progress(rect, vh) {
  return clamp((0.85 * vh - rect.top) / (0.45 * vh + rect.height));
}

/* A stat's text at count-up time t (0..1): only the leading number counts,
   the suffix stays ("11+", "100%", "30 min"). Non-numeric values pass. */
export function countValue(value, t) {
  const m = /^(\d+)(.*)$/.exec(value);
  return m ? `${Math.round(Number(m[1]) * clamp(t))}${m[2]}` : value;
}
