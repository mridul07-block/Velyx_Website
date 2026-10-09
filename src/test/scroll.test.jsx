import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, screen } from "@testing-library/react";
import { Link } from "react-router-dom";
import { renderWithProviders } from "./renderWithProviders";
import ScrollManager from "../components/ScrollManager";

describe("ScrollManager", () => {
  it("scrolls to the hash target once it exists", () => {
    const target = document.createElement("div");
    target.id = "process";
    target.scrollIntoView = vi.fn();
    document.body.appendChild(target);
    renderWithProviders(<ScrollManager />, { route: "/#process" });
    expect(target.scrollIntoView).toHaveBeenCalled();
    target.remove();
  });

  it("waits for a lazily rendered hash target (slow network)", () => {
    vi.useFakeTimers();
    renderWithProviders(<ScrollManager />, { route: "/#late" });
    const target = document.createElement("div");
    target.id = "late";
    target.scrollIntoView = vi.fn();
    act(() => vi.advanceTimersByTime(1000));
    document.body.appendChild(target);
    act(() => vi.advanceTimersByTime(500));
    expect(target.scrollIntoView).toHaveBeenCalled();
    target.remove();
    vi.useRealTimers();
  });

  it("scrolls again when the same anchor link is clicked twice", () => {
    const target = document.createElement("div");
    target.id = "process";
    target.scrollIntoView = vi.fn();
    document.body.appendChild(target);
    renderWithProviders(<><ScrollManager /><Link to="/#process">Process</Link></>, { route: "/#process" });
    expect(target.scrollIntoView).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("link", { name: "Process" }));
    expect(target.scrollIntoView).toHaveBeenCalledTimes(2);
    target.remove();
  });

  it("scrolls to top when there is no hash", () => {
    const spy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    renderWithProviders(<ScrollManager />, { route: "/services" });
    expect(spy).toHaveBeenCalledWith(0, 0);
    spy.mockRestore();
  });
});
