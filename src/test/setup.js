import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { createElement } from "react";

afterEach(() => cleanup());

// Cal.com loads a remote script + iframe; replace it in tests.
vi.mock("@calcom/embed-react", () => ({
  default: () => createElement("div", { "data-testid": "cal-embed" }),
  getCalApi: async () => () => {},
}));
