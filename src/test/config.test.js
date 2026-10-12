import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { ROUTES } from "../../scripts/routes.mjs";
import { PROJECTS } from "../data/projects";

const vercel = JSON.parse(readFileSync("vercel.json", "utf8"));

describe("vercel redirects", () => {
  it.each([
    ["/portfolio", "/work"],
    ["/portfolio/:slug*", "/work"],
    ["/case-studies", "/work"],
    ["/case-studies/:slug*", "/work"],
    ["/services", "/#services"],
    ["/contact", "/start-a-project"],
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
  it("lists the kept pages and every case study", () => {
    expect(ROUTES.map((r) => r.path)).toEqual([
      "/",
      "/work",
      ...PROJECTS.map((p) => `/work/${p.slug}`),
      "/swipe-file",
      "/start-a-project",
      "/pricing",
      "/intro-call",
      "/privacy",
      "/terms",
    ]);
  });

  it("every route has a description and sitemap fields", () => {
    for (const r of ROUTES) {
      expect(r.desc.length).toBeGreaterThan(20);
      expect(typeof r.priority).toBe("number");
      expect(r.changefreq).toMatch(/^(weekly|monthly|yearly)$/);
    }
  });
});
