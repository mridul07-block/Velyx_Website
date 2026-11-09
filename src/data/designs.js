/* Concept designs we built in code (from the X growth studio work). Each
   one is the complete page, served whole from public/designs/<slug>/ and
   shown live in an iframe, never as a link out. `vw` is the width the page
   was designed at (default 1440); `vh` is set for the fixed-size pages, which
   are always scaled to fit whole. `wall: false` keeps it off the home wall. */
const shot = (slug) => ({ src: `/designs/heroes/${slug}.webp`, w: 1600, h: 1000 });

export const DESIGNS = [
  { slug: "northloop", name: "Northloop", kind: "Landing page" },
  { slug: "plotline", name: "Plotline", kind: "Landing page" },
  { slug: "saffra", name: "Saffra", kind: "Landing page", vw: 1480 },
  { slug: "tapline", name: "Tapline", kind: "Hero section", vw: 1920, vh: 1080 },
  { slug: "contour", name: "Contour", kind: "Dashboard" },
  { slug: "kiln", name: "Kiln Studio", kind: "Landing page" },
  { slug: "nocta", name: "Nocta Card", kind: "Hero section", vw: 1600, vh: 1000 },
  { slug: "looply", name: "Looply", kind: "Landing page" },
  { slug: "northloop-agents", name: "Northloop Agents", kind: "Dashboard", vw: 1520 },
  { slug: "inkwell", name: "Inkwell", kind: "Landing page" },
  { slug: "lunea", name: "Lunea Homes", kind: "Hero section", vw: 1600, vh: 1000 },
  { slug: "driftline", name: "Driftline", kind: "Landing page" },
  { slug: "lead-agent", name: "Lead Agent", kind: "Dashboard" },
  { slug: "aurelle", name: "Aurelle", kind: "Hero section" },
  { slug: "ridgeline", name: "Ridgeline", kind: "Landing page" },
  { slug: "ryu-anime", name: "Ryu Anime", kind: "Hero section" },
  { slug: "rackline", name: "Rackline", kind: "Dashboard" },
  { slug: "tidewatch", name: "Tidewatch", kind: "Landing page" },
  { slug: "ryu-painted", name: "Ryu", kind: "Hero section" },
  { slug: "orvane", name: "Orvane", kind: "Footer" },
  { slug: "ryu-pixel", name: "Ryu Pixel", kind: "Hero section" },
  { slug: "ascii-agents", name: "ASCII Agents", kind: "Interactive art", wall: false },
].map((d) => ({ vw: 1440, wall: true, ...d, src: `/designs/${d.slug}/index.html`, shot: shot(d.slug) }));

export const WALL_DESIGNS = DESIGNS.filter((d) => d.wall);
