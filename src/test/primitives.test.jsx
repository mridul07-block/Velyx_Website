import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import CalButton from "../components/CalButton";
import FAQ from "../components/FAQ";
import FadeIn from "../components/FadeIn";
import SectionHeader from "../components/SectionHeader";

describe("CalButton", () => {
  it("opens the 30-min Cal.com booking with the default label", () => {
    render(<CalButton />);
    const btn = screen.getByRole("link", { name: "Book a free call" });
    expect(btn).toHaveAttribute("data-cal-link", "velyx-labs/30min");
    expect(btn).toHaveAttribute("data-cal-namespace", "30min");
    expect(btn).toHaveAttribute("data-cal-config", '{"layout":"month_view"}');
    expect(btn).toHaveAttribute("href", "https://cal.com/velyx-labs/30min");
    expect(btn).toHaveAttribute("target", "_blank");
    expect(btn).toHaveClass("btn", "btn--primary");
  });

  it("falls back to the cal.com page when the Cal script is blocked", () => {
    render(<CalButton />);
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    screen.getByRole("link", { name: "Book a free call" }).dispatchEvent(click);
    expect(click.defaultPrevented).toBe(false);
  });

  it("lets the Cal popup handle the click once the Cal script has loaded", () => {
    const spy = vi.spyOn(window.customElements, "get").mockImplementation((n) => (n === "cal-modal-box" ? class {} : undefined));
    render(<CalButton />);
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    screen.getByRole("link", { name: "Book a free call" }).dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    spy.mockRestore();
  });

  it("supports variant, size, block and custom label", () => {
    render(<CalButton variant="secondary" size="sm" block>Open booking</CalButton>);
    expect(screen.getByRole("link", { name: "Open booking" })).toHaveClass("btn--secondary", "btn--sm", "btn--block");
  });
});

describe("FAQ", () => {
  it("renders each question as a collapsible details element", () => {
    const { container } = render(<FAQ items={[{ q: "Q one?", a: "A one." }, { q: "Q two?", a: "A two." }]} />);
    expect(container.querySelectorAll("details")).toHaveLength(2);
    expect(screen.getByText("Q one?").tagName).toBe("SUMMARY");
    expect(screen.getByText("A two.")).toBeInTheDocument();
  });
});

describe("SectionHeader", () => {
  it("renders eyebrow, h2 title and sub", () => {
    render(<SectionHeader eyebrow="Process" title="How we work" sub="Four steps." />);
    expect(screen.getByRole("heading", { level: 2, name: "How we work" })).toBeInTheDocument();
    expect(screen.getByText("Process")).toBeInTheDocument();
    expect(screen.getByText("Four steps.")).toBeInTheDocument();
  });

  it("can render the page h1", () => {
    render(<SectionHeader as="h1" title="Services" />);
    expect(screen.getByRole("heading", { level: 1, name: "Services" })).toBeInTheDocument();
  });
});

describe("FadeIn", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("is visible immediately when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<FadeIn><p>content</p></FadeIn>);
    expect(screen.getByText("content").parentElement).toHaveClass("fade", "is-in");
  });

  it("reveals anyway if the observer never reports (broken webviews, print)", () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        disconnect() {}
      }
    );
    render(<FadeIn><p>stuck</p></FadeIn>);
    const wrap = screen.getByText("stuck").parentElement;
    expect(wrap).not.toHaveClass("is-in");
    act(() => vi.advanceTimersByTime(2000));
    expect(wrap).toHaveClass("is-in");
    vi.useRealTimers();
  });

  it("reveals when the observer reports intersection", () => {
    let fire;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb) { fire = cb; }
        observe() {}
        disconnect() {}
      }
    );
    render(<FadeIn><p>later</p></FadeIn>);
    const wrap = screen.getByText("later").parentElement;
    expect(wrap).not.toHaveClass("is-in");
    act(() => fire([{ isIntersecting: true }]));
    expect(wrap).toHaveClass("is-in");
  });
});
