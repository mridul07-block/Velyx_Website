import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import FinalCTA from "../components/FinalCTA";
import ProcessSteps from "../components/ProcessSteps";
import ClientStrip from "../components/ClientStrip";
import { SERVICES } from "../data/services";
import { FAQ_ITEMS } from "../data/faq";
import { CLIENTS } from "../data/clients";

describe("FinalCTA", () => {
  it("shows the inline calendar plus an email fallback", () => {
    renderWithProviders(<FinalCTA />);
    expect(screen.getByRole("heading", { level: 2, name: /what you want to build/i })).toBeInTheDocument();
    expect(screen.getByTestId("cal-embed")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "velyxlabs@gmail.com" })).toHaveAttribute("href", "mailto:velyxlabs@gmail.com");
    expect(screen.getByRole("link", { name: "Open booking page" })).toHaveAttribute("data-cal-link", "velyx-labs/30min");
  });
});

describe("ProcessSteps", () => {
  it("renders four numbered steps in the #process section", () => {
    const { container } = renderWithProviders(<ProcessSteps />);
    expect(container.querySelector("section#process")).not.toBeNull();
    expect(container.querySelectorAll(".step")).toHaveLength(4);
    expect(screen.getByText("Free call")).toBeInTheDocument();
  });
});

describe("content data", () => {
  it("has the four services with stable anchor ids", () => {
    expect(SERVICES.map((s) => s.id)).toEqual(["agents", "saas", "whatsapp", "web"]);
    for (const s of SERVICES) {
      expect(s.examples.length).toBeGreaterThanOrEqual(3);
      expect(s.deliverables.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("has six FAQs and no pricing or fabricated clients", () => {
    expect(FAQ_ITEMS).toHaveLength(6);
    const all = JSON.stringify([SERVICES, FAQ_ITEMS, CLIENTS]);
    expect(all).not.toMatch(/\$|₹|Northwind|Sable|Halcyon|seats remain/i);
  });

  it("renders the client strip", () => {
    renderWithProviders(<ClientStrip />);
    expect(screen.getByText("Sacred Basil")).toBeInTheDocument();
  });
});
