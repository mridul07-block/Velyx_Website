/* SVG matrices that lay flat "plane space" drawings into the isometric scene.
   floor(x, y): a plane lying flat; (x, y) is its back (top) corner.
   wall(x, y): an upright plane facing front-left; (x, y) is its top-left. */
export const floor = (x, y) => `matrix(0.866 0.5 -0.866 0.5 ${x} ${y})`;
export const wall = (x, y) => `matrix(0.866 -0.5 0 1 ${x} ${y})`;
