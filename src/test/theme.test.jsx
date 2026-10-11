import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

/* The Velyx light theme: warm off-white page, the logo's near-black ink
   and the brand orange. */
const css = readFileSync("src/styles.css", "utf8");
const token = (name) => (css.match(new RegExp(`${name}:\\s*(#[0-9a-f]+)`, "i")) || [])[1];

describe("Velyx theme", () => {
  it("is a light theme with the brand orange", () => {
    expect(token("--page")).toBe("#f5f0e8");
    expect(token("--ink")).toBe("#1a160f");
    expect(token("--accent")).toBe("#e8a453");
    expect(token("--panel")).toBe("#14110a");
    expect(readFileSync("index.html", "utf8")).toMatch(/name="theme-color" content="#f5f0e8"/);
  });
});
