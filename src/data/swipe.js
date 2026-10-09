/* Swipe file: raw design shots (product, web and brand work), no captions.
   Real design work only — never meeting or call screenshots.
   TO CONFIRM: more images from the user. */
const s = (file, type, w = 1600, h = 1040) => ({ src: `/work/${file}`, w, h, type });

export const SWIPE = [
  s("sacred-basil.jpg", "brand", 619, 549),
];
