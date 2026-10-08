import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, screen, within } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import StickyCta from "../components/StickyCta";
import ScrollManager from "../components/ScrollManager";

describe("Nav", () => {
  it("shows the four links and the booking CTA", () => {
    renderWithProviders(<Nav />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    for (const [name, href] of [["Services", "/services"], ["Process", "/#process"], ["About", "/#about"], ["Contact", "/contact"]]) {
      expect(within(nav).getAllByRole("link", { name })[0]).toHaveAttribute("href", href);
    }
    expect(within(nav).getAllByRole("button", { name: "Book a free call" })[0]).toHaveAttribute("data-cal-link", "velyx-labs/30min");
  });

  it("has no clock, no sound toggle, no removed pages", () => {
    const { container } = renderWithProviders(<Nav />);
    expect(container.textContent).not.toMatch(/\d{2}:\d{2}:\d{2}/);
    expect(screen.queryByRole("button", { name: /sound/i })).toBeNull();
    expect(container.textContent).not.toMatch(/Blog|Case Studies|Testimonials|Portfolio/);
  });

  it("toggles the mobile menu", () => {
    renderWithProviders(<Nav />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("mobile-menu")).toBeInTheDocument();
  });
});

describe("Footer", () => {
  it("links to kept pages and legal, with no newsletter form", () => {
    const { container } = renderWithProviders(<Footer />);
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
    expect(screen.getByRole("link", { name: "velyxlabs@gmail.com" })).toHaveAttribute("href", "mailto:velyxlabs@gmail.com");
    expect(container.querySelector("form")).toBeNull();
    expect(container.textContent).not.toMatch(/Blog|Case studies|Testimonials|Portfolio/);
  });
});

describe("StickyCta", () => {
  it("appears only after scrolling past the hero", () => {
    renderWithProviders(<StickyCta />);
    expect(screen.queryByRole("button", { name: "Book a free call" })).toBeNull();
    act(() => {
      window.scrollY = 700;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.getByRole("button", { name: "Book a free call" })).toBeInTheDocument();
    window.scrollY = 0;
  });
});

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

  it("scrolls to top when there is no hash", () => {
    const spy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    renderWithProviders(<ScrollManager />, { route: "/services" });
    expect(spy).toHaveBeenCalledWith(0, 0);
    spy.mockRestore();
  });
});
