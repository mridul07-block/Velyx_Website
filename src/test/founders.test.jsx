import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import TeamGrid from "../components/TeamGrid";
import { TEAM } from "../data/team";

describe("Founders", () => {
  it("gives every founder a card with portrait, name, role and bio", () => {
    renderWithProviders(<TeamGrid />);
    const cards = document.querySelectorAll(".founder");
    expect(cards).toHaveLength(TEAM.length);
    TEAM.forEach((m, i) => {
      const c = cards[i];
      expect(within(c).getByRole("heading", { level: 3, name: m.name })).toBeInTheDocument();
      expect(c.querySelector(".founder__role").textContent).toBe(m.role);
      expect(c.querySelector(".founder__bio").textContent.length).toBeGreaterThan(20);
      expect(c.querySelector(".founder__portrait")).not.toBeNull();
    });
  });

  it("shows initials in a selection frame until a photo exists, and the photo when it does", () => {
    renderWithProviders(<TeamGrid />);
    const [first] = document.querySelectorAll(".founder");
    if (TEAM[0].photo) expect(first.querySelector("img.founder__photo")).toHaveAttribute("src", TEAM[0].photo);
    else expect(first.querySelector(".founder__initials").textContent).toBe(TEAM[0].initials);
    expect(first.querySelectorAll(".founder__frame .founder__handle")).toHaveLength(4);
  });

  it("only links profiles we have, each with a clear label", () => {
    renderWithProviders(<TeamGrid />);
    TEAM.forEach((m, i) => {
      const c = document.querySelectorAll(".founder")[i];
      const links = [...c.querySelectorAll(".founder__links a")];
      expect(links).toHaveLength(Object.values(m.links ?? {}).filter(Boolean).length);
      for (const a of links) {
        expect(a).toHaveAttribute("target", "_blank");
        expect(a.getAttribute("aria-label")).toMatch(new RegExp(`^${m.name.split(" ")[0]}`));
      }
    });
  });

  it("ends with a way to talk to the founders", () => {
    renderWithProviders(<TeamGrid />);
    expect(screen.getByRole("link", { name: /Talk to the founders/ })).toHaveAttribute("href", "/intro-call");
  });
});
