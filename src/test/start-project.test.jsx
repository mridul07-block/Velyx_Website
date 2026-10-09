import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import AppRoutes from "../AppRoutes";

async function openPage(route = "/start-a-project") {
  renderWithProviders(<AppRoutes />, { route });
  await screen.findByRole("heading", { level: 1, name: "Start a project" });
}

function fill() {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
  fireEvent.change(screen.getByLabelText("Tell us about the project"), { target: { value: "A WhatsApp CRM" } });
}

describe("/start-a-project", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("sends the brief with selected services, budget and timeline", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.stubGlobal("fetch", fetchMock);
    await openPage();
    fill();
    fireEvent.click(screen.getByRole("button", { name: "WhatsApp automation + CRM" }));
    fireEvent.click(screen.getByRole("button", { name: "Agentic AI automation" }));
    fireEvent.click(screen.getByRole("button", { name: "$10k–$25k" }));
    fireEvent.click(screen.getByRole("button", { name: "1–3 months" }));
    fireEvent.submit(screen.getByRole("form", { name: "Project brief" }));
    expect(await screen.findByText("Thanks — we got your brief.")).toBeInTheDocument();
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toMatchObject({
      access_key: "test-key",
      name: "Ada",
      email: "ada@example.com",
      message: "A WhatsApp CRM",
      services: "WhatsApp automation + CRM, Agentic AI automation",
      budget: "$10k–$25k",
      timeline: "1–3 months",
    });
  });

  it("?plan=trial pre-selects the trial budget", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    await openPage("/start-a-project?plan=trial");
    expect(screen.getByRole("button", { name: "Trial week ($1500)" })).toHaveAttribute("aria-pressed", "true");
  });

  it("shows an error with email fallback when sending fails", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    await openPage();
    fill();
    fireEvent.submit(screen.getByRole("form", { name: "Project brief" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't send/i);
    expect(screen.queryByText("Thanks — we got your brief.")).toBeNull();
  });

  it("treats success: false as an error", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: false }) }));
    await openPage();
    fill();
    fireEvent.submit(screen.getByRole("form", { name: "Project brief" }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("without an access key, shows email instead of a form that can't send", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "");
    await openPage();
    expect(screen.queryByRole("form", { name: "Project brief" })).toBeNull();
    expect(screen.getAllByRole("link", { name: "velyxlabs@gmail.com" }).length).toBeGreaterThan(0);
  });

  it("offers the calendar for people who prefer to talk first", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    await openPage();
    expect(screen.getByRole("heading", { name: "Prefer to talk first?" })).toBeInTheDocument();
    expect(screen.getByTestId("cal-embed")).toBeInTheDocument();
  });
});
