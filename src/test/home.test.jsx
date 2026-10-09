import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Home from "../pages/Home";

describe("Home", () => {
  it("renders the 7 essential sections in order", () => {
    const { container } = renderWithProviders(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    const ids = [...container.querySelectorAll("main section[id]")].map((s) => s.id);
    expect(ids).toEqual(["hero", "process", "testimonials", "about", "faq", "book"]);
  });

  it("leads with the booking CTA and a link to services", () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole("link", { name: "Book a free 30-min call" })).toHaveAttribute("data-cal-link", "velyx-labs/30min");
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


});
