import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Home from "../pages/Home";

describe("Home", () => {
  it("renders the 7 essential sections in order", () => {
    const { container } = renderWithProviders(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    const ids = [...container.querySelectorAll("main section[id]")].map((s) => s.id);
    expect(ids).toEqual(["hero", "services", "process", "testimonials", "about", "faq", "book"]);
  });

  it("leads with the booking CTA and a link to services", () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole("button", { name: "Book a free 30-min call" })).toHaveAttribute("data-cal-link", "velyx-labs/30min");
    expect(screen.getByRole("link", { name: "See what we build" })).toHaveAttribute("href", "#services");
  });

  it("shows the three real quotes verbatim and both founders", () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/built a complete, production-ready web application/)).toBeInTheDocument();
    expect(screen.getByText("Dr. Parita")).toBeInTheDocument();
    expect(screen.getByText("Nishant")).toBeInTheDocument();
    expect(screen.getByText("Atharv Golait")).toBeInTheDocument();
    expect(screen.getByText("Mridul")).toBeInTheDocument();
  });

  it("links each service card to its section on /services", () => {
    renderWithProviders(<Home />);
    const links = screen.getAllByRole("link", { name: /^Learn more/ }).map((a) => a.getAttribute("href"));
    expect(links).toEqual(["/services#agents", "/services#saas", "/services#whatsapp", "/services#web"]);
  });

  it("contains no pricing, fake clients or fake live claims", () => {
    const { container } = renderWithProviders(<Home />);
    expect(container.textContent).not.toMatch(/\$|₹|Northwind|Sable Health|Halcyon|seats remain|AGENTS DEPLOYED/i);
  });
});
