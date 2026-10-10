import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import AppRoutes from "../AppRoutes";
import { PROJECTS } from "../data/projects";

const cards = (container) => [...container.querySelectorAll(".pcard")].map((a) => a.getAttribute("href"));

describe("/work", () => {
  it("lists every project by default", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/work" });
    expect(await screen.findByRole("heading", { level: 1, name: "Latest projects" })).toBeInTheDocument();
    expect(cards(container)).toHaveLength(PROJECTS.length);
  });

  it("filters by type and reflects it in the pressed pill", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/work" });
    await screen.findByRole("heading", { level: 1 });
    fireEvent.click(screen.getByRole("button", { name: "AI & Automation" }));
    expect(screen.getByRole("button", { name: "AI & Automation" })).toHaveAttribute("aria-pressed", "true");
    const ai = PROJECTS.filter((p) => p.types.includes("ai")).map((p) => `/work/${p.slug}`);
    expect(cards(container)).toEqual(ai);
  });

  it("an unknown ?type= falls back to All", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/work?type=nonsense" });
    await screen.findByRole("heading", { level: 1 });
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
    expect(cards(container)).toHaveLength(PROJECTS.length);
  });

  it("a filter with no projects says so", async () => {
    renderWithProviders(<AppRoutes />, { route: "/work?type=mobile" });
    await screen.findByRole("heading", { level: 1 });
    if (!PROJECTS.some((p) => p.types.includes("mobile"))) {
      expect(screen.getByText("No projects in this category yet.")).toBeInTheDocument();
    }
  });
});

describe("/work/:slug", () => {
  it("renders the case study with brief, build and the client quote", async () => {
    renderWithProviders(<AppRoutes />, { route: "/work/sacred-basil" });
    expect(await screen.findByRole("heading", { level: 1, name: "Sacred Basil" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The brief" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What we built" })).toBeInTheDocument();
    expect(screen.getByText(/deep audit of our business operations/)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Stack" })).toBeNull();
    expect(screen.getByRole("link", { name: "← All work" })).toHaveAttribute("href", "/work");
    expect(screen.getByRole("link", { name: /Next project/ })).toBeInTheDocument();
  });

  it("an unknown slug shows the 404 page", async () => {
    renderWithProviders(<AppRoutes />, { route: "/work/does-not-exist" });
    expect(await screen.findByRole("heading", { level: 1, name: /page not found/i })).toBeInTheDocument();
  });
});

describe("closing CTA", () => {
  it.each(["/work", `/work/${PROJECTS[0].slug}`])("appears exactly once on %s (in the footer)", async (route) => {
    const { container } = renderWithProviders(<AppRoutes />, { route });
    await screen.findAllByRole("heading", { level: 1 });
    expect(container.querySelectorAll("section#closing")).toHaveLength(1);
    expect(container.querySelector("footer section#closing")).not.toBeNull();
  });
});
