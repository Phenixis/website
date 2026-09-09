import { describe, expect, it } from "vitest";
import { bulbFillPoints } from "./hourglass-shape";

describe("bulbFillPoints", () => {
  it("collapses to a zero-area sliver at the base for fraction 0 (empty)", () => {
    expect(bulbFillPoints(29, 50, 28, 72, 0)).toBe("28,29 72,29 72,29 28,29");
  });

  it("collapses to the apex point for fraction 1 (full)", () => {
    expect(bulbFillPoints(29, 50, 28, 72, 1)).toBe("28,29 72,29 50,50 50,50");
  });

  it("narrows linearly with fraction, symmetric around the center", () => {
    // base half-width 22, at 60% toward the apex the cut half-width should be 22*0.4 = 8.8
    expect(bulbFillPoints(29, 50, 28, 72, 0.6)).toBe("28,29 72,29 58.8,41.6 41.2,41.6");
  });

  it("works with an apex above the base too (bottom bulb, apexY < baseY)", () => {
    // at 40% toward the apex, cut half-width should be 22*0.6 = 13.2 -- this is the
    // exact case that was previously hand-computed wrong in apple-icon.tsx
    expect(bulbFillPoints(71, 50, 28, 72, 0.4)).toBe("28,71 72,71 63.2,62.6 36.8,62.6");
  });
});
