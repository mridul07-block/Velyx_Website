/* Tiny box physics for the footer chips: gravity, walls, a floor and
   box-on-box stacking. Bodies are plain objects in stage pixels:
   { x, y, w, h, vx, vy, angle, tilt }. Small enough to run every frame
   for a dozen chips, and it reports when everything has come to rest so
   the animation loop can stop. */

const GRAVITY = 1800;
const ITERATIONS = 6;
const REST = 6;

export function createBodies(sizes, width) {
  return sizes.map(({ w, h }, i) => ({
    x: (i * width * 0.618) % Math.max(1, width - w),
    y: -h - i * 70,
    w,
    h,
    vx: 0,
    vy: 0,
    angle: 0,
    tilt: ((i * 7) % 9) - 4,
    grounded: false,
  }));
}

/* Advances the world by dt seconds. Returns true once nothing is moving. */
export function stepWorld(bodies, { width, height }, dt) {
  for (const b of bodies) {
    b.grounded = false;
    b.vy += GRAVITY * dt;
    b.vx *= 0.995;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
  }

  // Bottom-most first so support propagates up a stack in one pass.
  const order = [...bodies].sort((a, b) => b.y - a.y);
  for (let it = 0; it < ITERATIONS; it++) {
    for (const b of order) bounds(b, width, height);
    for (let i = 0; i < order.length; i++) {
      for (let j = i + 1; j < order.length; j++) collide(order[i], order[j]);
    }
  }
  for (const b of order) bounds(b, width, height);

  let resting = true;
  for (const b of bodies) {
    const target = b.grounded ? b.tilt : b.tilt + Math.max(-25, Math.min(25, b.vx * 0.04));
    b.angle += (target - b.angle) * 0.2;
    if (Math.abs(b.vx) > REST || Math.abs(b.vy) > REST || Math.abs(target - b.angle) > 0.1) resting = false;
  }
  if (resting) for (const b of bodies) { b.vx = 0; b.vy = 0; b.angle = b.tilt; }
  return resting;
}

function bounds(b, width, height) {
  if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx) * 0.4; }
  if (b.x + b.w > width) { b.x = width - b.w; b.vx = -Math.abs(b.vx) * 0.4; }
  if (b.y + b.h >= height) {
    b.y = height - b.h;
    b.vy = b.vy > 240 ? -b.vy * 0.3 : 0;
    b.vx *= 0.88;
    b.grounded = true;
  }
}

function collide(a, b) {
  const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  if (ox <= 0 || oy <= 0) return;

  if (oy < ox) {
    const [top, low] = a.y < b.y ? [a, b] : [b, a];
    if (low.grounded) {
      // Resting on something solid: only the upper box moves.
      top.y -= oy;
      if (top.vy > low.vy) top.vy = low.vy;
      top.vx *= 0.9;
      top.grounded = true;
    } else {
      top.y -= oy / 2;
      low.y += oy / 2;
      if (top.vy > low.vy) top.vy = low.vy = (top.vy + low.vy) / 2;
    }
  } else {
    const [left, right] = a.x < b.x ? [a, b] : [b, a];
    left.x -= ox / 2;
    right.x += ox / 2;
    if (left.vx > right.vx) {
      const v = (left.vx + right.vx) / 2;
      left.vx = right.vx = v;
    }
  }
}

/* Shoves bodies within `radius` of (px, py) away from it. */
export function repel(bodies, px, py, radius, strength) {
  for (const b of bodies) {
    const dx = b.x + b.w / 2 - px;
    const dy = b.y + b.h / 2 - py;
    const d = Math.hypot(dx, dy);
    if (d >= radius || d === 0) continue;
    const f = (1 - d / radius) * strength;
    b.vx += (dx / d) * f;
    b.vy += (dy / d) * f - f * 0.35;
  }
}
