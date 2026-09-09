import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  formatDuration,
  formatMonth,
  hasGapAfter,
  isOngoing,
  monthIndex,
  sortByStartDesc,
} from "./experience-dates";
import type { Experience } from "@/app/data";

function exp(overrides: Partial<Experience>): Experience {
  return {
    id: "x",
    startDate: "2020-01",
    endDate: null,
    role: "Role",
    where: "Somewhere",
    kind: "role",
    blurb: "",
    stack: [],
    ...overrides,
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-06-15T00:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("monthIndex", () => {
  it("orders months and years correctly", () => {
    expect(monthIndex("2026-01")).toBeLessThan(monthIndex("2026-02"));
    expect(monthIndex("2025-12")).toBeLessThan(monthIndex("2026-01"));
  });
});

describe("formatMonth", () => {
  it("formats a YYYY-MM as an abbreviated month and year", () => {
    expect(formatMonth("2026-06")).toBe("Jun 2026");
  });
});

describe("isOngoing", () => {
  it("is true when endDate is null", () => {
    expect(isOngoing({ endDate: null })).toBe(true);
  });

  it("is true when endDate is in the current or a future month", () => {
    expect(isOngoing({ endDate: "2026-06" })).toBe(true);
    expect(isOngoing({ endDate: "2026-12" })).toBe(true);
  });

  it("is false when endDate is in the past", () => {
    expect(isOngoing({ endDate: "2026-05" })).toBe(false);
  });
});

describe("formatDuration", () => {
  it("runs to today when ongoing", () => {
    // 2025-01 through 2026-06 (pinned "now"), inclusive = 18 months = 1 yr 6 mo
    expect(formatDuration(exp({ startDate: "2025-01", endDate: null }))).toBe("1 yr 6 mo");
  });

  it("uses the fixed end date otherwise", () => {
    expect(formatDuration(exp({ startDate: "2024-01", endDate: "2024-03" }))).toBe("3 mo");
  });

  it("floors to whole years with no remainder", () => {
    expect(formatDuration(exp({ startDate: "2023-01", endDate: "2024-12" }))).toBe("2 yr");
  });
});

describe("sortByStartDesc", () => {
  it("orders most recent start date first without mutating the input", () => {
    const items = [exp({ id: "a", startDate: "2020-01" }), exp({ id: "b", startDate: "2024-01" })];
    const sorted = sortByStartDesc(items);
    expect(sorted.map((e) => e.id)).toEqual(["b", "a"]);
    expect(items.map((e) => e.id)).toEqual(["a", "b"]);
  });
});

describe("hasGapAfter", () => {
  it("is false for the last item", () => {
    const items = [exp({ startDate: "2024-01", endDate: "2024-06" })];
    expect(hasGapAfter(items, 0)).toBe(false);
  });

  it("is true when there's a multi-month gap between entries", () => {
    const sorted = [
      exp({ startDate: "2025-06", endDate: null }),
      exp({ startDate: "2024-01", endDate: "2024-06" }),
    ];
    expect(hasGapAfter(sorted, 0)).toBe(true);
  });

  it("is false when entries are contiguous", () => {
    const sorted = [
      exp({ startDate: "2024-07", endDate: null }),
      exp({ startDate: "2024-01", endDate: "2024-06" }),
    ];
    expect(hasGapAfter(sorted, 0)).toBe(false);
  });
});
