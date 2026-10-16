import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { SERVICES } from "../data/services";
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
  it("has the Velyx services in a 3 + 2 + 2 + 3 layout, AI first and industries last", () => {
    expect(SERVICES.map((s) => s.id)).toEqual(["agents", "voice", "crm", "saas", "whatsapp", "web", "mobile", "healthcare", "realestate", "automotive"]);
    expect(SERVICES.filter((s) => s.wide).map((s) => s.id)).toEqual(["saas", "whatsapp", "web", "mobile"]);
    for (const s of SERVICES) expect(s.tags.length).toBeGreaterThanOrEqual(4);
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
    const all = JSON.stringify([SERVICES, STATS, PROJECTS, TEAM, TOOLS, FAQ_ITEMS, CLIENTS]);
    expect(all).not.toMatch(BANNED);
  });
});
