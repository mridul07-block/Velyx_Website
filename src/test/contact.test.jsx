import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./renderWithProviders";
import Contact from "../pages/Contact";

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@example.com" } });
  fireEvent.change(screen.getByLabelText("What do you want to build?"), { target: { value: "A WhatsApp CRM" } });
  fireEvent.submit(screen.getByRole("form", { name: "Contact form" }));
}

describe("Contact page", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("shows the booking calendar", () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    renderWithProviders(<Contact />, { route: "/contact" });
    expect(screen.getByTestId("cal-embed")).toBeInTheDocument();
  });

  it("sends the message to Web3Forms and confirms on success", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.stubGlobal("fetch", fetchMock);
    renderWithProviders(<Contact />, { route: "/contact" });
    fillAndSubmit();
    expect(await screen.findByText(/Thanks — we got your message/)).toBeInTheDocument();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.web3forms.com/submit");
    expect(JSON.parse(init.body)).toMatchObject({ access_key: "test-key", name: "Ada", email: "ada@example.com", message: "A WhatsApp CRM" });
  });

  it("shows an error with an email fallback when sending fails", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    renderWithProviders(<Contact />, { route: "/contact" });
    fillAndSubmit();
    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't send/i);
    expect(screen.queryByText(/Thanks — we got your message/)).toBeNull();
  });

  it("treats a rejected submission (success: false) as an error", async () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: false, message: "bad key" }) }));
    renderWithProviders(<Contact />, { route: "/contact" });
    fillAndSubmit();
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("without an access key, shows email instead of a form that can't send", () => {
    vi.stubEnv("VITE_WEB3FORMS_KEY", "");
    renderWithProviders(<Contact />, { route: "/contact" });
    expect(screen.queryByRole("form", { name: "Contact form" })).toBeNull();
    expect(screen.getAllByRole("link", { name: "velyxlabs@gmail.com" }).length).toBeGreaterThan(0);
  });
});
