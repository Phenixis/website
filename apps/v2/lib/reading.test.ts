import { describe, expect, it } from "vitest";
import { createSlugger, extractHeadings, readingTime } from "./reading";

describe("readingTime", () => {
  it("rounds up at 200 words per minute, with a one-minute floor", () => {
    expect(readingTime("")).toBe("1 min");
    expect(readingTime("word ".repeat(200))).toBe("1 min");
    expect(readingTime("word ".repeat(201))).toBe("2 min");
  });

  it("ignores Markdown syntax and image/link targets", () => {
    const body = `# Title\n\n![alt](https://example.com/a-very-long-url.png)\n\n[link](https://example.com) text`;
    expect(readingTime(body)).toBe("1 min");
  });
});

describe("headings", () => {
  it("extracts ATX headings outside code fences, with unique ids", () => {
    const md = "## Intro\ntext\n```\n## not a heading\n```\n## Intro\n### Détails *clés*\n";
    expect(extractHeadings(md)).toEqual([
      { id: "intro", text: "Intro", depth: 2 },
      { id: "intro-1", text: "Intro", depth: 2 },
      { id: "details-cles", text: "Détails clés", depth: 3 },
    ]);
  });

  it("slugger numbers duplicates in order", () => {
    const slug = createSlugger();
    expect([slug("A"), slug("A"), slug("A")]).toEqual(["a", "a-1", "a-2"]);
  });
});
