import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Pricing from "../sections/Pricing";
import PricingPage from "../pages/PricingPage";
import IntroCallButton from "../components/IntroCallButton";
import { TIERS, PLAN_NOTE } from "../data/pricing";
import { ROUTES } from "../../scripts/routes.mjs";

describe("Pricing ladder", () => {
  it("lays out start small → scale as three steps, the trial week first and highlighted", () => {
    renderWithProviders(<Pricing />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toMatch(/Start small\.\s*Scale when it works\./);
    const tiers = document.querySelectorAll(".tier");
    expect(tiers).toHaveLength(3);
    expect([...tiers].map((t) => t.querySelector(".tier__step").textContent)).toEqual(["01 · Start here", "02 · Then", "03 · Ongoing"]);
    expect(tiers[0]).toHaveClass("tier--hero");
    expect(tiers[0]).toHaveTextContent("$1500");
  });

  it("joins the steps with a rail and keeps each list short", () => {
    renderWithProviders(<Pricing />);
    expect(document.querySelector(".ladder__rail")).toHaveAttribute("aria-hidden", "true");
    for (const t of document.querySelectorAll(".tier")) {
      const n = t.querySelectorAll(".tier__feature").length;
      expect(n).toBeGreaterThan(0);
      expect(n).toBeLessThanOrEqual(4);
    }
  });

  it("never says Book a call; the trial starts the trial, the others start a project with their plan", () => {
    renderWithProviders(<Pricing />);
    const sec = document.querySelector("#pricing");
    expect(sec.textContent).not.toMatch(/book a call/i);
    const ctas = [...sec.querySelectorAll(".tier a.btn")].map((a) => a.getAttribute("href"));
    expect(ctas).toEqual(TIERS.map((t) => t.href));
    for (const h of ctas) expect(h).toMatch(/^\/start-a-project\?plan=/);
  });

  it("shows Custom quote for unconfirmed prices and the trial-week promise once", () => {
    renderWithProviders(<Pricing />);
    expect(screen.queryAllByText("Custom quote")).toHaveLength(TIERS.filter((t) => !t.price).length);
    expect(screen.getAllByText(PLAN_NOTE)).toHaveLength(1);
  });

  it("has its own /pricing page with the heading as h1 and tier titles as h2", () => {
    renderWithProviders(<PricingPage />, { route: "/pricing" });
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/Start small\.\s*Scale when it works\./);
    const sec = document.querySelector("#pricing");
    expect([...sec.querySelectorAll("h2")].map((h) => h.textContent)).toEqual(TIERS.map((t) => t.title));
    expect(document.querySelector("#pricing")).not.toHaveClass("rv-armed");
    expect(ROUTES.some((r) => r.path === "/pricing")).toBe(true);
  });
});

describe("button label roll", () => {
  it("doubles the label for the hover roll but keeps one accessible name", () => {
    renderWithProviders(<IntroCallButton />);
    const a = screen.getByRole("link", { name: "Intro call" });
    expect(a.querySelectorAll(".btn__roll > span").length).toBe(2);
    expect(a.querySelector(".btn__roll > span:last-child")).toHaveAttribute("aria-hidden", "true");
  });
});
