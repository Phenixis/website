// Pure text transforms behind the admin Markdown editor's toolbar and
// shortcuts. Each takes the textarea's value and selection and returns a
// single replacement edit, so the editor can apply it in a way that keeps
// the browser's native undo history.

export type Selection = { value: string; start: number; end: number };

/** Replace value[from, to) with `text`, then select [selStart, selEnd) (absolute, in the new value). */
export type Edit = { from: number; to: number; text: string; selStart: number; selEnd: number };

/**
 * Toggle an inline marker (`**`, `_`, `` ` ``, `~~`) around the selection.
 * With nothing selected, inserts the marker around a selected placeholder.
 */
export function wrapInline({ value, start, end }: Selection, marker: string, placeholder: string): Edit {
  const m = marker.length;
  const selected = value.slice(start, end);

  // Already wrapped, markers just outside the selection → unwrap.
  if (value.slice(start - m, start) === marker && value.slice(end, end + m) === marker) {
    return { from: start - m, to: end + m, text: selected, selStart: start - m, selEnd: end - m };
  }
  // Markers included in the selection → unwrap.
  if (selected.length >= 2 * m && selected.startsWith(marker) && selected.endsWith(marker)) {
    const inner = selected.slice(m, -m);
    return { from: start, to: end, text: inner, selStart: start, selEnd: start + inner.length };
  }

  const inner = selected || placeholder;
  return { from: start, to: end, text: marker + inner + marker, selStart: start + m, selEnd: start + m + inner.length };
}

/** `[selection](url)`, with "url" selected so it can be typed over. */
export function insertLink({ value, start, end }: Selection, image = false): Edit {
  const label = value.slice(start, end) || (image ? "alt text" : "link text");
  const prefix = image ? "!" : "";
  const text = `${prefix}[${label}](url)`;
  const urlStart = start + prefix.length + label.length + 3;
  return { from: start, to: end, text, selStart: urlStart, selEnd: urlStart + 3 };
}

/**
 * GFM footnote: inserts a reference `[^n]` at the caret and appends its
 * definition `[^n]: note` at the end of the body, with "note" (or the
 * selection, moved into the note) selected for typing. `n` is one more than
 * the highest numeric footnote already used.
 */
export function insertFootnote({ value, start, end }: Selection): Edit {
  const used = [...value.matchAll(/\[\^(\d+)\]/g)].map((m) => Number(m[1]));
  const n = Math.max(0, ...used) + 1;
  const note = value.slice(start, end) || "note";
  const ref = `[^${n}]`;
  const rest = value.slice(end);
  const tail = rest.replace(/\s*$/, "");
  // Edit spans caret → end of body so reference and definition land in one undo step.
  const text = `${ref}${tail}\n\n[^${n}]: ${note}`;
  const noteStart = start + text.length - note.length;
  return { from: start, to: value.length, text, selStart: noteStart, selEnd: noteStart + note.length };
}

function lineBounds(value: string, start: number, end: number): [number, number] {
  const from = value.lastIndexOf("\n", start - 1) + 1;
  // A selection ending right after a newline doesn't include the next line.
  const effectiveEnd = end > start && value[end - 1] === "\n" ? end - 1 : end;
  const nl = value.indexOf("\n", effectiveEnd);
  return [from, nl === -1 ? value.length : nl];
}

const LIST_PREFIX = /^(\s*)([-*+] |\d+\. )/;

/**
 * Toggle a block prefix on every line the selection touches: "## ", "> ",
 * "- ", or "1. " (numbered: renumbers the lines 1, 2, 3…). Switching between
 * list styles replaces the old marker instead of stacking both.
 */
export function toggleLinePrefix({ value, start, end }: Selection, kind: "## " | "> " | "- " | "1. "): Edit {
  const [from, to] = lineBounds(value, start, end);
  const lines = value.slice(from, to).split("\n");
  const has = (line: string) =>
    kind === "1. " ? /^\s*\d+\. /.test(line) : kind === "- " ? /^\s*[-*+] /.test(line) : line.startsWith(kind);
  const nonEmpty = lines.filter((l) => l.trim());
  const removing = nonEmpty.length > 0 && nonEmpty.every(has);

  let n = 0;
  const next = lines.map((line) => {
    if (removing) {
      if (kind === "- " || kind === "1. ") return line.replace(LIST_PREFIX, "$1");
      return line.slice(kind.length);
    }
    if (!line.trim()) return line;
    if (kind === "- " || kind === "1. ") {
      const marker = kind === "1. " ? `${++n}. ` : "- ";
      return LIST_PREFIX.test(line) ? line.replace(LIST_PREFIX, `$1${marker}`) : marker + line;
    }
    if (kind === "## ") return kind + line.replace(/^#{1,6} /, "");
    return kind + line;
  });

  const text = next.join("\n");
  // Keep a caret (empty selection) after the prefix change; select whole lines otherwise.
  if (start === end) {
    const caret = Math.max(from, start + (next[0].length - lines[0].length));
    return { from, to, text, selStart: caret, selEnd: caret };
  }
  return { from, to, text, selStart: from, selEnd: from + text.length };
}

/** Wrap the selected lines in a fenced code block. */
export function insertCodeBlock({ value, start, end }: Selection): Edit {
  const [from, to] = start === end ? [start, end] : lineBounds(value, start, end);
  const body = value.slice(from, to) || "code";
  const before = from > 0 && value[from - 1] !== "\n" ? "\n" : "";
  const text = `${before}\`\`\`\n${body}\n\`\`\``;
  const bodyStart = from + before.length + 4;
  return { from, to, text, selStart: bodyStart, selEnd: bodyStart + body.length };
}
