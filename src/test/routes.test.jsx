import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import AppRoutes from "../AppRoutes";

describe("routes", () => {
  it.each([
    ["/", /AI and engineering partner/],
    ["/work", /Latest projects/],
    ["/work/getlandy", /Getlandy AI/],
    ["/swipe-file", /Swipe file/],
    ["/start-a-project", /Start a project/],
    ["/privacy", /Privacy/],
    ["/terms", /Terms/],
    ["/start", /AI and engineering partner/],
  ])("%s renders its h1", async (route, h1) => {
    renderWithProviders(<AppRoutes />, { route });
    expect(await screen.findByRole("heading", { level: 1, name: h1 })).toBeInTheDocument();
  });

  it("removed pages are gone from the app (redirects handle them)", async () => {
    for (const route of ["/services", "/contact"]) {
      const { unmount } = renderWithProviders(<AppRoutes />, { route });
      expect(await screen.findByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
      unmount();
    }
  });

  it("/start has no navigation exits", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/start" });
    await screen.findByRole("heading", { level: 1 });
    expect(container.querySelector('nav[aria-label="Main"]')).toBeNull();
    expect(container.querySelector('a[href="/work"]')).toBeNull();
  });

  it("unknown URLs show a 404 with a way home and a booking CTA", async () => {
    renderWithProviders(<AppRoutes />, { route: "/does-not-exist" });
    expect(await screen.findByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/");
    expect(screen.getAllByRole("link", { name: "Book a free call" }).length).toBeGreaterThan(0);
  });
});
