import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { ROUTES } from "../../scripts/routes.mjs";
import { PROJECTS } from "../data/projects";
import { SERVICES } from "../data/services";
import { INDUSTRIES } from "../data/industries";

const vercel = JSON.parse(readFileSync("vercel.json", "utf8"));

describe("vercel redirects", () => {
  it.each([
    ["/portfolio", "/work"],
    ["/portfolio/:slug*", "/work"],
    ["/contact", "/start-a-project"],
    ["/blog", "/"],
    ["/blog/:slug*", "/"],
    ["/testimonials", "/"],
  ])("%s → %s (301)", (source, destination) => {
    const rule = (vercel.redirects || []).find((r) => r.source === source);
    expect(rule).toMatchObject({ destination, permanent: true });
  });

  it("lets /services through to its own page", () => {
    expect((vercel.redirects || []).find((r) => r.source === "/services")).toBeUndefined();
  });

  it("lets /case-studies and its industry pages through", () => {
    for (const source of ["/case-studies", "/case-studies/:slug*"]) {
      expect((vercel.redirects || []).find((r) => r.source === source), source).toBeUndefined();
    }
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
      "/services",
      ...SERVICES.map((s) => `/services/${s.slug}`),
      "/case-studies",
      ...INDUSTRIES.map((i) => `/case-studies/${i.slug}`),
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
