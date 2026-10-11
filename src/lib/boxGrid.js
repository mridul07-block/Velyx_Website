/* Geometry for the boxed background (BoxGrid). */
export const CELL = 44;

// A fixed scatter (seeded, so every render and test sees the same tiles).
export const GLOWS = (() => {
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: 26 }, (_, i) => ({
    col: Math.floor(rnd() * (i % 3 === 0 ? 8 : 44)),
    row: Math.floor(rnd() * 30),
    a: (0.2 + rnd() * 0.45).toFixed(2),
    dur: (7 + rnd() * 8).toFixed(1),
    delay: (-rnd() * 15).toFixed(1),
  }));
})();
