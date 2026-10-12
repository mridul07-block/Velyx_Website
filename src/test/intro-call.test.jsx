import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Layout from "../components/Layout";
import IntroCall from "../pages/IntroCall";
import { ROUTES } from "../../scripts/routes.mjs";

describe("audit bar + nav + intro call", () => {
  it("shows the free-audit row above the nav, linking to the audit booking", () => {
    renderWithProviders(<Layout><p /></Layout>);
    const bar = screen.getByRole("link", { name: /audited\. for free/i });
    expect(bar).toHaveAttribute("href", "/intro-call?for=audit");
    expect(bar.compareDocumentPosition(screen.getByRole("navigation", { name: "Main" })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("nav CTA is Intro call to /intro-call, with Pricing in the links", () => {
    renderWithProviders(<Layout><p /></Layout>);
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(nav.querySelector('a[href="/intro-call"]').textContent).toMatch(/Intro call/);
    expect(nav.querySelector('a[href="/pricing"]')).toBeTruthy();
  });

  it("intro-call page shows the calendar heading and a fallback link", () => {
    renderWithProviders(<IntroCall />, { route: "/intro-call" });
    expect(screen.getByRole("heading", { level: 1, name: "Book an intro call" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open the booking page/i })).toHaveAttribute("href", "https://cal.com/velyx-labs/30min");
  });

  it("switches the heading for the free audit", () => {
    renderWithProviders(<IntroCall />, { route: "/intro-call?for=audit" });
    expect(screen.getByRole("heading", { level: 1, name: "Free product audit" })).toBeInTheDocument();
  });

  it("is a pre-rendered, indexed route", () => {
    expect(ROUTES.some((r) => r.path === "/intro-call")).toBe(true);
  });
});
