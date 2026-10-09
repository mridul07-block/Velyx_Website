import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { renderMeta } from "../../scripts/meta.mjs";
import { ROUTES } from "../../scripts/routes.mjs";

const template = readFileSync("index.html", "utf8");

describe("prerendered per-route meta", () => {
  it("replaces description and og:description on the real index.html", () => {
    const route = ROUTES.find((r) => r.path === "/work");
    const html = renderMeta(template, route);
    const desc = html.match(/<meta name="description"\s+content="([^"]*)"/)[1];
    const og = html.match(/<meta property="og:description"\s+content="([^"]*)"/)[1];
    expect(desc).toBe(route.desc);
    expect(og).toBe(route.desc);
    expect(html).toMatch(/<link rel="canonical" href="https:\/\/www\.velyxlabs\.in\/work"/);
  });
});
