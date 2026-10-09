import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import AppRoutes from "../AppRoutes";
import { SWIPE } from "../data/swipe";

async function openSwipe(route = "/swipe-file") {
  const utils = renderWithProviders(<AppRoutes />, { route });
  await screen.findByRole("heading", { level: 1, name: "Swipe file" });
  return utils;
}

describe("/swipe-file", () => {
  it("shows every image and filters by category", async () => {
    const { container } = await openSwipe();
    expect(container.querySelectorAll(".swipe-item")).toHaveLength(SWIPE.length);
    fireEvent.click(screen.getByRole("button", { name: "Product" }));
    expect(container.querySelectorAll(".swipe-item")).toHaveLength(SWIPE.filter((s) => s.type === "product").length);
  });

  it("lightbox: opens on click, arrows wrap, Escape closes and returns focus", async () => {
    await openSwipe();
    const first = screen.getByRole("button", { name: "Open image 1" });
    first.focus();
    fireEvent.click(first);
    const dialog = screen.getByRole("dialog", { name: "Image viewer" });
    expect(dialog).toHaveTextContent(`1 / ${SWIPE.length}`);
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(dialog).toHaveTextContent(`${SWIPE.length} / ${SWIPE.length}`);
    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(dialog).toHaveTextContent(`1 / ${SWIPE.length}`);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(first).toHaveFocus();
  });

  it("a category with no images says so instead of showing a blank grid", async () => {
    await openSwipe("/swipe-file?type=product");
    if (!SWIPE.some((s) => s.type === "product")) {
      expect(screen.getByText("No images in this category yet.")).toBeInTheDocument();
    }
  });

  it("an unknown ?type= falls back to All", async () => {
    const { container } = await openSwipe("/swipe-file?type=zzz");
    expect(container.querySelectorAll(".swipe-item")).toHaveLength(SWIPE.length);
  });
});
