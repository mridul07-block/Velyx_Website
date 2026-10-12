/* Rules for the testimonial autoplay. */

/* Autoplay steps one whole card this often, so cards always rest aligned. */
export const AUTO_STEP_MS = 3600;

/* Autoplay needs enough cards that the doubled loop never shows the same
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

/* One loop length: the distance from a card to its copy in the doubled
   track (independent of the track's side padding). */
export function loopPeriod(cards, count) {
  return cards[count].offsetLeft - cards[0].offsetLeft;
}
