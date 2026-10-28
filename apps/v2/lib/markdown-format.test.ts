import { describe, expect, it } from "vitest";
import { insertCodeBlock, insertFootnote, insertLink, moveLines, toggleChecklist, toggleLinePrefix, wrapInline, type Edit, type Selection } from "./markdown-format";

/** Apply an edit and return the new value with the selection marked as [ ]. */
function apply(sel: Selection, edit: Edit): string {
  const v = sel.value.slice(0, edit.from) + edit.text + sel.value.slice(edit.to);
  return v.slice(0, edit.selStart) + "[" + v.slice(edit.selStart, edit.selEnd) + "]" + v.slice(edit.selEnd);
}

/** Build a Selection from a string with the selection marked as [ ]. */
function sel(marked: string): Selection {
  const start = marked.indexOf("[");
  const end = marked.indexOf("]") - 1;
  return { value: marked.replace("[", "").replace("]", ""), start, end };
}

describe("wrapInline", () => {
  it("wraps the selection", () => {
    expect(apply(sel("a [word] b"), wrapInline(sel("a [word] b"), "**", "bold"))).toBe("a **[word]** b");
  });
  it("inserts a selected placeholder when nothing is selected", () => {
    expect(apply(sel("a [] b"), wrapInline(sel("a [] b"), "_", "italic"))).toBe("a _[italic]_ b");
  });
  it("unwraps when the markers surround the selection", () => {
    expect(apply(sel("a **[word]** b"), wrapInline(sel("a **[word]** b"), "**", "bold"))).toBe("a [word] b");
  });
  it("unwraps when the markers are inside the selection", () => {
    expect(apply(sel("a [**word**] b"), wrapInline(sel("a [**word**] b"), "**", "bold"))).toBe("a [word] b");
  });
});

describe("insertLink / insertFootnote", () => {
  it("wraps the selection as link text and selects the url", () => {
    expect(apply(sel("see [docs]"), insertLink(sel("see [docs]")))).toBe("see [docs]([url])");
  });
  it("inserts an image with alt text", () => {
    expect(apply(sel("[]"), insertLink(sel("[]"), true))).toBe("![alt text]([url])");
  });
  it("inserts a footnote reference and appends its definition", () => {
    expect(apply(sel("Launched[] in Oct.\n"), insertFootnote(sel("Launched[] in Oct.\n")))).toBe(
      "Launched[^1] in Oct.\n\n[^1]: [note]",
    );
  });
  it("numbers after existing footnotes and moves the selection into the note", () => {
    const value = "A[^1] B on PH\n\n[^1]: x";
    const start = value.indexOf("on PH");
    const edit = insertFootnote({ value, start, end: start + "on PH".length });
    const next = value.slice(0, edit.from) + edit.text + value.slice(edit.to);
    expect(next).toBe("A[^1] B [^2]\n\n[^1]: x\n\n[^2]: on PH");
    expect(next.slice(edit.selStart, edit.selEnd)).toBe("on PH");
  });
});

describe("toggleLinePrefix", () => {
  it("adds a bullet to each selected line", () => {
    expect(apply(sel("[one\ntwo]"), toggleLinePrefix(sel("[one\ntwo]"), "- "))).toBe("[- one\n- two]");
  });
  it("removes bullets when every line has one", () => {
    expect(apply(sel("[- one\n- two]"), toggleLinePrefix(sel("[- one\n- two]"), "- "))).toBe("[one\ntwo]");
  });
  it("numbers lines and converts bullets", () => {
    expect(apply(sel("[- one\n- two]"), toggleLinePrefix(sel("[- one\n- two]"), "1. "))).toBe("[1. one\n2. two]");
  });
  it("prefixes the caret's line and keeps the caret in place", () => {
    expect(apply(sel("a\nti[]tle\nb"), toggleLinePrefix(sel("a\nti[]tle\nb"), "## "))).toBe("a\n## ti[]tle\nb");
  });
  it("replaces another heading level instead of stacking", () => {
    expect(apply(sel("### t[]"), toggleLinePrefix(sel("### t[]"), "## "))).toBe("## t[]");
  });
  it("skips blank lines", () => {
    expect(apply(sel("[a\n\nb]"), toggleLinePrefix(sel("[a\n\nb]"), "> "))).toBe("[> a\n\n> b]");
  });
});

describe("insertCodeBlock", () => {
  it("fences the selected lines", () => {
    expect(apply(sel("[x = 1]"), insertCodeBlock(sel("[x = 1]")))).toBe("```\n[x = 1]\n```");
  });
  it("starts the fence on its own line", () => {
    expect(apply(sel("text []"), insertCodeBlock(sel("text []")))).toBe("text \n```\n[code]\n```");
  });
});

describe("toggleChecklist", () => {
  it("adds an unchecked box, converting a bullet", () => {
    expect(apply(sel("[buy milk\n- eggs]"), toggleChecklist(sel("[buy milk\n- eggs]")))).toBe("[- [ ] buy milk\n- [ ] eggs]");
  });
  it("checks, then unchecks", () => {
    const once = "- [ ] milk";
    const checked = toggleChecklist({ value: once, start: 8, end: 8 });
    expect(checked.text).toBe("- [x] milk");
    expect(toggleChecklist({ value: checked.text, start: 8, end: 8 }).text).toBe("- [ ] milk");
  });
});

describe("moveLines", () => {
  const value = "one\ntwo\nthree";
  const at = (w: string) => ({ value, start: value.indexOf(w) + 1, end: value.indexOf(w) + 1 });
  const run = (s: Selection, d: "up" | "down") => {
    const e = moveLines(s, d);
    return { v: s.value.slice(0, e.from) + e.text + s.value.slice(e.to), caret: e.selStart };
  };
  it("moves a line up and keeps the caret on it", () => {
    const r = run(at("two"), "up");
    expect(r.v).toBe("two\none\nthree");
    expect(r.v.slice(r.caret - 1, r.caret + 2)).toBe("two");
  });
  it("moves a line down", () => {
    const r = run(at("two"), "down");
    expect(r.v).toBe("one\nthree\ntwo");
    expect(r.v.slice(r.caret - 1, r.caret + 2)).toBe("two");
  });
  it("does nothing at the edges", () => {
    expect(run(at("one"), "up").v).toBe(value);
    expect(run(at("three"), "down").v).toBe(value);
  });
  it("moves several selected lines together", () => {
    const e = moveLines({ value, start: 0, end: 7 }, "down");
    expect(value.slice(0, e.from) + e.text + value.slice(e.to)).toBe("three\none\ntwo");
  });
});
