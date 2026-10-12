/* Rules for the Bricx-style testimonial drift. */

/* Drift needs enough cards that the doubled loop never shows the same
   faces twice in view; never under reduced motion. */
export function shouldDrift(count, reduced) {
  return count >= 6 && !reduced;
}

/* The track renders its cards twice; jump back by half to loop seamlessly. */
export function wrap(scrollLeft, half) {
  return scrollLeft >= half ? scrollLeft - half : scrollLeft;
}

/* "Founder · Sacred Basil" → "Founder @Sacred Basil" (Bricx's format). */
export function roleLine(role) {
  const [title, company] = role.split(" · ");
  return company ? `${title} @${company}` : title;
}
