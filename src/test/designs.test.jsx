import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import AppRoutes from "../AppRoutes";
import DesignWall from "../sections/home/DesignWall";
import { DESIGNS, WALL_DESIGNS } from "../data/designs";

const pub = (p) => `public${p}`;

describe("design data", () => {
  it("every design ships its complete page and a hero screenshot", () => {
    for (const d of DESIGNS) {
      expect(existsSync(pub(d.src)), d.src).toBe(true);
      expect(existsSync(pub(d.shot.src)), d.shot.src).toBe(true);
    }
  });
});

describe("home design wall", () => {
  it("shows every wall design once across three columns going up, down, up", () => {
    const { container } = renderWithProviders(<DesignWall />);
    const cols = [...container.querySelectorAll(".dwall__col")];
    expect(cols.map((c) => c.classList.contains("dwall__col--up"))).toEqual([true, false, true]);
    const live = container.querySelectorAll(".dwall__group:not([aria-hidden]) .dwall__card");
    expect(live).toHaveLength(WALL_DESIGNS.length);
    expect(WALL_DESIGNS.map((d) => d.slug)).not.toContain("ascii-agents");
    fireEvent.click(screen.getByRole("button", { name: `Open the ${WALL_DESIGNS[5].name} design` }));
    expect(screen.getByRole("dialog").querySelector("iframe")).toHaveAttribute("src", WALL_DESIGNS[5].src);
  });

  it("never shows Hinge or getlandy", () => {
    expect(DESIGNS.map((d) => d.slug)).not.toContain("getlandy");
    expect(DESIGNS.map((d) => d.slug)).not.toContain("hinge");
  });
});

describe("/work design lab", () => {
  it("shows every design as a card with a full-screen viewer", async () => {
    const { container } = renderWithProviders(<AppRoutes />, { route: "/work" });
    expect(await screen.findByRole("heading", { level: 2, name: "Design lab" })).toBeInTheDocument();
    const cards = container.querySelectorAll("#designs .dcard");
    expect(cards).toHaveLength(DESIGNS.length);
    fireEvent.click(within(cards[0]).getByRole("button", { name: /Full screen/ }));
    expect(screen.getByRole("dialog").querySelector("iframe")).toHaveAttribute("src", DESIGNS[0].src);
  });
});
