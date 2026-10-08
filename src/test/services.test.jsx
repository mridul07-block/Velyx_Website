import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Services from "../pages/Services";

describe("Services page", () => {
  it("has one h1 and a block per service with its anchor", () => {
    const { container } = renderWithProviders(<Services />, { route: "/services" });
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    for (const id of ["agents", "saas", "whatsapp", "web"]) {
      const block = container.querySelector(`#${id}`);
      expect(block).not.toBeNull();
      expect(within(block).getByText("What you get")).toBeInTheDocument();
      expect(within(block).getByText("Example builds")).toBeInTheDocument();
    }
  });

  it("ends with process, FAQ and the booking section", () => {
    const { container } = renderWithProviders(<Services />, { route: "/services" });
    expect(container.querySelector("#process")).not.toBeNull();
    expect(container.querySelector("#faq details")).not.toBeNull();
    expect(container.querySelector("#book")).not.toBeNull();
  });

  it("has no pricing or old portfolio detail links", () => {
    const { container } = renderWithProviders(<Services />, { route: "/services" });
    expect(container.textContent).not.toMatch(/\$|₹/);
    expect(container.querySelector('a[href^="/portfolio"]')).toBeNull();
  });
});
