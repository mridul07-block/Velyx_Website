import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Home from "../pages/Home";

describe("Home", () => {
  it("renders Kargul's sections in the user's order, closing in the footer", () => {
    const { container } = renderWithProviders(<Home />);
    const ids = [...container.querySelectorAll("main section[id]")].map((s) => s.id);
    expect(ids).toEqual(["hero", "trusted", "services", "statement", "numbers", "projects", "compare", "process", "team", "testimonials", "trial", "tools"]);
    expect(container.querySelector("#faq")).toBeNull();
    expect(container.querySelector("footer section#closing")).not.toBeNull();
  });

  it("spotlights the featured projects with case-study links, then compares", () => {
    renderWithProviders(<Home />);
    const links = [...document.querySelectorAll("#projects .spot a.btn")].map((a) => a.getAttribute("href"));
    expect(links).toEqual(["/work/getlandy", "/work/audi-service-system", "/work/plainstate"]);
    expect(document.querySelector("#more-work")).toBeNull();
    expect(document.querySelector("#compare table")).not.toBeNull();
  });

  it("offers the $1500 trial week linked to a pre-selected brief", () => {
    renderWithProviders(<Home />);
    const trial = document.getElementById("trial");
    expect(within(trial).getByRole("heading", { level: 2 })).toHaveTextContent(/Start with a trial week for only \$1500/);
    expect(within(trial).getByRole("link", { name: "Start your trial week" })).toHaveAttribute("href", "/start-a-project?plan=trial");
    // The full plans live on their own page.
    expect(within(trial).getByRole("link", { name: /See all pricing/ })).toHaveAttribute("href", "/pricing");
    expect(document.getElementById("pricing")).toBeNull();
  });

  it("ends with the animated closing CTA", () => {
    renderWithProviders(<Home />);
    expect(screen.getByRole("heading", { level: 2, name: "Let's build something amazing" })).toBeInTheDocument();
  });

  it("shows no borrowed or fabricated claims, and $1500 is the only price", () => {
    const { container } = renderWithProviders(<Home />);
    const text = container.textContent;
    expect(text).not.toMatch(/\$1B|210M|75\+|95%|SideShift|ZeroLeaks|Agent Arcade|Northwind|Sable Health|Halcyon/i);
    expect(new Set(text.match(/\$\d[\d,]*/g))).toEqual(new Set(["$1500"])); // the trial week, in the proof line and pricing
  });
});

