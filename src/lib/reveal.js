/* Count-up maths, kept pure so it can be tested. */
const clamp = (v) => Math.min(1, Math.max(0, v));

/* A stat's text at count-up time t (0..1): only the leading number counts,
   the suffix stays ("11+", "100%", "30 min"). Non-numeric values pass. */
export function countValue(value, t) {
  const m = /^(\d+)(.*)$/.exec(value);
  return m ? `${Math.round(Number(m[1]) * clamp(t))}${m[2]}` : value;
}
