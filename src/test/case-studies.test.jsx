import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import AppRoutes from "../AppRoutes";
import { INDUSTRIES } from "../data/industries";

describe("case studies", () => {
  it("lists the three industries, each linking to its page", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/case-studies" });
    expect(await screen.findByRole("heading", { level: 1, name: "Case studies" })).toBeInTheDocument();
    const links = [...container.querySelectorAll("a.industry-card")].map((a) => a.getAttribute("href"));
    expect(links).toEqual(["/case-studies/healthcare", "/case-studies/real-estate", "/case-studies/automobile"]);
  });

  it.each(INDUSTRIES.map((i) => [i.slug, i]))("/case-studies/%s is all value: promise, outcomes, how, agents — no project screenshots", async (slug, ind) => {
    const { container } = renderWithProviders(<AppRoutes />, { route: `/case-studies/${slug}` });
    expect(await screen.findByRole("heading", { level: 1, name: ind.short })).toBeInTheDocument();
    expect(screen.getByText(ind.promise)).toBeInTheDocument();
    expect(container.querySelector(".offer__film video")).toHaveAttribute("src", ind.film.src);
    const outcomes = container.querySelectorAll(".outcomes li");
    expect(outcomes).toHaveLength(4);
    ind.outcomes.forEach((o, i) => {
      expect(outcomes[i].querySelector(".outcome__from").textContent).toBe(o.from);
      expect(outcomes[i].querySelector(".outcome__to").textContent).toBe(o.to);
    });
    expect(container.querySelectorAll(".how li")).toHaveLength(3);
    expect(container.querySelectorAll("#agents li.agent")).toHaveLength(ind.agents.length);
    expect(container.querySelector(".pcard")).toBeNull();
    expect(container.querySelector(".industry-services")).toBeNull();
    expect(screen.queryByRole("heading", { name: "Related work" })).toBeNull();
  });

  it("sends an unknown industry to the not-found page", async () => {
    renderWithProviders(<AppRoutes />, { route: "/case-studies/space" });
    expect(await screen.findByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
  });
});
