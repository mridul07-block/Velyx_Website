import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import AppRoutes from "../AppRoutes";

describe("routes", () => {
  it.each([
    ["/", /AI systems and software/],
    ["/services", /What we build for founders/],
    ["/contact", /Tell us what you want to build/],
    ["/privacy", /Privacy/],
    ["/terms", /Terms/],
    ["/start", /Put AI to work in your business/],
  ])("%s renders its h1", async (route, h1) => {
    renderWithProviders(<AppRoutes />, { route });
    expect(await screen.findByRole("heading", { level: 1, name: h1 })).toBeInTheDocument();
  });

  it("unknown URLs show a 404 with a way home and a booking CTA", async () => {
    renderWithProviders(<AppRoutes />, { route: "/does-not-exist" });
    expect(await screen.findByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/");
    expect(screen.getAllByRole("link", { name: "Book a free call" }).length).toBeGreaterThan(0);
  });

  it("/start has no navigation links that leak traffic", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/start" });
    await screen.findByRole("heading", { level: 1 });
    expect(container.querySelector('nav[aria-label="Main"]')).toBeNull();
    expect(container.querySelector('a[href="/services"]')).toBeNull();
  });
});
