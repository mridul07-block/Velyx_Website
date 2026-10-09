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


  it("shows the three real quotes verbatim and both founders", () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/built a complete, production-ready web application/)).toBeInTheDocument();
    expect(screen.getByText("Dr. Parita")).toBeInTheDocument();
    expect(screen.getByText("Nishant")).toBeInTheDocument();
    expect(screen.getByText("Atharv Golait")).toBeInTheDocument();
    expect(screen.getByText("Mridul")).toBeInTheDocument();
  });


});
