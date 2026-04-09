import { describe, it, expect } from "vitest";
import { formatYear, formatRating, formatRuntime, formatCurrency, clamp } from "@/lib/utils";

describe("formatYear", () => {
  it("extracts year from ISO date string", () => {
    expect(formatYear("2023-07-15")).toBe("2023");
  });
  it("returns N/A for empty string", () => {
    expect(formatYear("")).toBe("N/A");
  });
  it("returns N/A for undefined", () => {
    expect(formatYear(undefined)).toBe("N/A");
  });
});

describe("formatRating", () => {
  it("formats to one decimal place", () => {
    expect(formatRating(7.456)).toBe("7.5");
  });
  it("handles whole numbers", () => {
    expect(formatRating(8)).toBe("8.0");
  });
});

describe("formatRuntime", () => {
  it("formats hours and minutes", () => {
    expect(formatRuntime(142)).toBe("2h 22m");
  });
  it("formats minutes only when under 60", () => {
    expect(formatRuntime(45)).toBe("45m");
  });
  it("returns N/A for null", () => {
    expect(formatRuntime(null)).toBe("N/A");
  });
  it("returns N/A for 0", () => {
    expect(formatRuntime(0)).toBe("N/A");
  });
});

describe("formatCurrency", () => {
  it("returns N/A for 0", () => {
    expect(formatCurrency(0)).toBe("N/A");
  });
  it("formats large numbers compactly", () => {
    expect(formatCurrency(1_000_000_000)).toMatch(/\$1B|\$1\.0B/);
  });
});

describe("clamp", () => {
  it("returns value when within range", () => {
    expect(clamp(5, 1, 10)).toBe(5);
  });
  it("clamps to min", () => {
    expect(clamp(0, 1, 10)).toBe(1);
  });
  it("clamps to max", () => {
    expect(clamp(15, 1, 10)).toBe(10);
  });
});
