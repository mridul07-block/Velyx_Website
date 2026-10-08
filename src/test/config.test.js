import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { ROUTES } from "../../scripts/routes.mjs";

const vercel = JSON.parse(readFileSync("vercel.json", "utf8"));

describe("vercel redirects for removed pages", () => {
  it.each([
    ["/portfolio", "/services"],
    ["/portfolio/:slug*", "/services"],
    ["/case-studies", "/services"],
    ["/case-studies/:slug*", "/services"],
    ["/blog", "/"],
    ["/blog/:slug*", "/"],
    ["/testimonials", "/"],
  ])("%s → %s (301)", (source, destination) => {
    const rule = (vercel.redirects || []).find((r) => r.source === source);
    expect(rule).toMatchObject({ destination, permanent: true });
  });

  it("keeps the SPA rewrite", () => {
    expect(vercel.rewrites).toEqual([{ source: "/(.*)", destination: "/index.html" }]);
  });
});

describe("public route list (sitemap + prerender)", () => {
  it("contains exactly the kept, indexable pages", () => {
    expect(ROUTES.map((r) => r.path)).toEqual(["/", "/services", "/contact", "/privacy", "/terms"]);
  });

  it("every route has a description and sitemap fields", () => {
    for (const r of ROUTES) {
      expect(r.desc.length).toBeGreaterThan(40);
      expect(typeof r.priority).toBe("number");
      expect(r.changefreq).toMatch(/^(weekly|monthly|yearly)$/);
    }
  });
});
