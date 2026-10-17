import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import AppRoutes from "../AppRoutes";
import { SERVICES } from "../data/services";

describe("service pages", () => {
  it.each(SERVICES.map((s) => [s.slug, s]))("/services/%s shows its title, film and every agent", async (slug, s) => {
    const { container } = renderWithProviders(<AppRoutes />, { route: `/services/${slug}` });
    expect(await screen.findByRole("heading", { level: 1, name: s.title })).toBeInTheDocument();
    const film = container.querySelector(".offer__film video");
    expect(film).toHaveAttribute("src", s.film.src);
    expect(film).toHaveAttribute("poster", s.film.poster);
    expect(film).toHaveAttribute("preload", "metadata");
    const cards = container.querySelectorAll("#agents li.agent");
    expect(cards).toHaveLength(s.agents.length);
    s.agents.forEach((a, i) => {
      expect(cards[i].querySelector("h3").textContent).toBe(a.name);
      expect(cards[i].querySelector("a.agent__cta")).toHaveAttribute("href", `/intro-call?agent=${encodeURIComponent(a.name)}`);
    });
    expect(screen.getByRole("link", { name: "Get your agent" })).toHaveAttribute("href", "#agents");
  });

  it("sends an unknown service to the not-found page", async () => {
    renderWithProviders(<AppRoutes />, { route: "/services/teleportation" });
    expect(await screen.findByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
  });
});
