/* Swipe file: raw design shots, no captions. TO CONFIRM: the category of
   each image, and more images. */
const s = (file, type, w = 1600, h = 1040) => ({ src: `/work/${file}`, w, h, type });

export const SWIPE = [
  s("landy-1.jpg", "product"),
  s("kettler-1.jpg", "web"),
  s("yorkscreenplay.jpg", "web"),
  s("landy-2.jpg", "product"),
  s("sacred-basil.jpg", "brand", 619, 549),
  s("kettler-2.jpg", "web"),
  s("landy-3.jpg", "product"),
  s("priya-1.jpg", "web"),
  s("kettler-3.jpg", "web"),
  s("landy-4.jpg", "product"),
  s("kettler-4.jpg", "web"),
];
