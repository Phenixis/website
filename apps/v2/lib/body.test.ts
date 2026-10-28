import { describe, expect, it } from "vitest";
import { parseBody } from "./body";

describe("parseBody", () => {
  it("joins a legacy JSON paragraph array with blank lines", () => {
    expect(parseBody(JSON.stringify(["One.", "Two."]))).toBe("One.\n\nTwo.");
  });

  it("returns Markdown unchanged", () => {
    expect(parseBody("# Title\n\nSome **bold** text.")).toBe("# Title\n\nSome **bold** text.");
  });

  it("returns Markdown that starts with a link unchanged", () => {
    const md = "[Life OS](https://life-os.xyz) is my app.";
    expect(parseBody(md)).toBe(md);
  });

  it("leaves a JSON array of non-strings alone", () => {
    expect(parseBody("[1, 2]")).toBe("[1, 2]");
  });

  it("treats null as an empty body", () => {
    expect(parseBody(null)).toBe("");
  });
});
