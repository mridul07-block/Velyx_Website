import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import AppRoutes from "../AppRoutes";
import { INDUSTRIES } from "../data/industries";
import { SERVICES } from "../data/services";

describe("case studies", () => {
  it("lists the three industries, each linking to its page", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/case-studies" });
    expect(await screen.findByRole("heading", { level: 1, name: "Case studies" })).toBeInTheDocument();
    const links = [...container.querySelectorAll("a.industry-card")].map((a) => a.getAttribute("href"));
    expect(links).toEqual(["/case-studies/healthcare", "/case-studies/real-estate", "/case-studies/automobile"]);
  });

  it.each(INDUSTRIES.map((i) => [i.slug, i]))("/case-studies/%s shows film, problems, agents, services and work", async (slug, ind) => {
    const { container } = renderWithProviders(<AppRoutes />, { route: `/case-studies/${slug}` });
    expect(await screen.findByRole("heading", { level: 1, name: ind.short })).toBeInTheDocument();
    expect(container.querySelector(".offer__film video")).toHaveAttribute("src", ind.film.src);
    expect(container.querySelectorAll(".problems li")).toHaveLength(ind.problems.length);
    expect(container.querySelectorAll("#agents li.agent")).toHaveLength(ind.agents.length);
    const svc = [...container.querySelectorAll(".industry-services a")].map((a) => a.getAttribute("href"));
    expect(svc).toEqual(ind.services.map((s) => `/services/${s}`));
    for (const s of ind.services) expect(SERVICES.some((x) => x.slug === s)).toBe(true);
    expect(container.querySelectorAll(".industry-work .pcard")).toHaveLength(ind.work.length);
  });

  it("sends an unknown industry to the not-found page", async () => {
    renderWithProviders(<AppRoutes />, { route: "/case-studies/space" });
    expect(await screen.findByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
  });
});
