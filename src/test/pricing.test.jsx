import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Pricing from "../sections/Pricing";
import PricingPage from "../pages/PricingPage";
import IntroCallButton from "../components/IntroCallButton";
import { PLANS, TRIAL } from "../data/pricing";
import { ROUTES } from "../../scripts/routes.mjs";

describe("Pricing (925 Studios)", () => {
  it("shows the two-tone heading, the trial week strip and two plans, dark then light", () => {
    renderWithProviders(<Pricing />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toMatch(/Start small\.\s*Scale when it works\./);
    expect(screen.getByText(TRIAL.price)).toBeInTheDocument();
    const plans = document.querySelectorAll(".plan");
    expect(plans.length).toBe(2);
    expect(plans[0]).toHaveClass("plan--dark");
    expect(plans[1]).not.toHaveClass("plan--dark");
    for (const [i, p] of PLANS.entries()) expect(plans[i].querySelectorAll(".plan__feature").length).toBe(p.features.length);
  });

  it("plan cards book a call (Google Meet icon); the trial strip starts the trial", () => {
    renderWithProviders(<Pricing />);
    const sec = document.querySelector("#pricing");
    const plans = [...sec.querySelectorAll("a.plan__cta")];
    expect(plans.length).toBe(PLANS.length);
    for (const a of plans) {
      expect(a).toHaveAttribute("href", "/intro-call");
      expect(a.textContent).toMatch(/^Book a call/);
      expect(a.querySelector("svg.meet-icon")).not.toBeNull();
    }
    expect(sec.querySelector("a.trialstrip__cta")).toHaveAttribute("href", "/start-a-project?plan=trial");
    expect(sec.textContent).not.toMatch(/start a project/i);
  });

  it("renders Custom for a plan without a confirmed price", () => {
    renderWithProviders(<Pricing />);
    const unpriced = PLANS.filter((p) => !p.price).length;
    expect(screen.queryAllByText("Custom").length).toBe(unpriced);
  });

  it("has its own /pricing page with the heading as h1, plan titles as h2 and no hide-until-scroll", () => {
    renderWithProviders(<PricingPage />, { route: "/pricing" });
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(/Start small\.\s*Scale when it works\./);
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual(expect.arrayContaining(PLANS.map((p) => p.title)));
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
