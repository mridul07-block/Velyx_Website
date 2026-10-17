import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { SERVICES } from "../data/services";
import { INDUSTRIES } from "../data/industries";
import { STATS } from "../data/stats";
import { PROJECTS } from "../data/projects";
import { TEAM } from "../data/team";
import { TOOLS } from "../data/tools";
import { SWIPE } from "../data/swipe";
import { FAQ_ITEMS } from "../data/faq";
import { CLIENTS } from "../data/clients";
import { TESTIMONIAL_QUOTES } from "../data/testimonials";

const BANNED = /\$1B|210M|75\+|95%|SideShift|ZeroLeaks|Agent Arcade|Kargul|Northwind|Sable Health|Halcyon/i;

describe("content data", () => {
  it("has six Velyx services in a 2 + 2 + 2 layout, each with its page slug", () => {
    expect(SERVICES.map((s) => s.id)).toEqual(["agents", "voice", "saas", "whatsapp", "web", "mobile"]);
    expect(SERVICES.every((s) => s.wide)).toBe(true);
    expect(SERVICES.map((s) => s.slug)).toEqual(["ai-agents", "voice-agents", "ai-saas-mvps", "whatsapp-automation", "web-apps", "mobile-apps"]);
    for (const s of SERVICES) expect(s.tags.length).toBeGreaterThanOrEqual(4);
  });

  it("gives every service and industry 3–5 agents and a film named after its slug", () => {
    for (const x of [...SERVICES, ...INDUSTRIES]) {
      expect(x.agents.length, x.slug).toBeGreaterThanOrEqual(3);
      expect(x.agents.length, x.slug).toBeLessThanOrEqual(5);
      for (const a of x.agents) {
        expect(a.name).toBeTruthy();
        expect(a.does.length).toBeGreaterThan(30);
        expect(a.plugsInto.length).toBeGreaterThanOrEqual(2);
      }
      expect(x.film).toEqual({ src: `/films/${x.slug}.mp4`, poster: `/films/${x.slug}.webp`, w: 1600, h: 1000 });
    }
  });

  it("has every film and poster on disk, each film under 3 MB", async () => {
    const { existsSync, statSync } = await import("node:fs");
    for (const x of [...SERVICES, ...INDUSTRIES]) {
      expect(existsSync(`public${x.film.src}`), x.film.src).toBe(true);
      expect(existsSync(`public${x.film.poster}`), x.film.poster).toBe(true);
      expect(statSync(`public${x.film.src}`).size, x.film.src).toBeLessThanOrEqual(3 * 1024 * 1024);
    }
  });

  it("gives each of the three industries a promise and four before → after outcomes", () => {
    expect(INDUSTRIES.map((i) => i.slug)).toEqual(["healthcare", "real-estate", "automobile"]);
    for (const i of INDUSTRIES) {
      expect(i.promise.length).toBeGreaterThan(30);
      expect(i.outcomes).toHaveLength(4);
      for (const o of i.outcomes) {
        expect(o.from).toBeTruthy();
        expect(o.to).toBeTruthy();
      }
    }
  });

  it("uses the real client and service figures", () => {
    // The user's real figures (2026-10-13).
    expect(STATS[0]).toEqual({ value: "30+", label: "Clients and partners" });
    expect(STATS[1]).toEqual({ value: "10+", label: "Services under one roof" });
  });

  it("features three projects, every image and film of which exists on disk", () => {
    const featured = PROJECTS.filter((p) => p.featured);
    expect(featured.map((p) => p.slug)).toEqual(["getlandy", "audi-service-system", "plainstate"]);
    for (const p of PROJECTS) {
      const media = [p.cover, ...p.gallery, ...(p.shots ?? []), ...(p.features ?? []).map((f) => f.shot), p.video && { src: p.video.src }, p.video && { src: p.video.poster }, p.logo && { src: p.logo }];
      for (const img of media.filter(Boolean)) {
        expect(existsSync(`public${img.src}`), img.src).toBe(true);
      }
    }
  });

  it("project slugs are unique and quotes refer to real testimonials", () => {
    expect(new Set(PROJECTS.map((p) => p.slug)).size).toBe(PROJECTS.length);
    const names = TESTIMONIAL_QUOTES.map((t) => t.name);
    for (const p of PROJECTS) if (p.quoteName) expect(names).toContain(p.quoteName);
  });

  it("testimonial highlights only emphasise words already in the quote", () => {
    for (const t of TESTIMONIAL_QUOTES) {
      expect(t.highlights.length).toBeGreaterThan(0);
      for (const h of t.highlights) expect(t.q).toContain(h);
    }
  });

  it("swipe images exist on disk with dimensions", () => {
    expect(SWIPE.length).toBeGreaterThanOrEqual(1);
    for (const s of SWIPE) {
      expect(existsSync(`public${s.src}`), s.src).toBe(true);
      expect(s.w).toBeGreaterThan(0);
      expect(["product", "web", "brand"]).toContain(s.type);
    }
  });

  it("has seven FAQs, the team and tools", () => {
    expect(FAQ_ITEMS).toHaveLength(7);
    expect(TEAM.map((t) => t.name)).toEqual(["Mridul", "Atharv Golait"]);
    expect(TOOLS.length).toBeGreaterThanOrEqual(10);
  });

  it("contains no borrowed or fabricated claims", () => {
    const all = JSON.stringify([SERVICES, INDUSTRIES, STATS, PROJECTS, TEAM, TOOLS, FAQ_ITEMS, CLIENTS]);
    expect(all).not.toMatch(BANNED);
  });
});
