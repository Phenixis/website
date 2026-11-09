// Reading-time and heading helpers shared by the Markdown renderer, the table
// of contents and the post loader.

const WORDS_PER_MINUTE = 200;

/** Strips the Markdown syntax that doesn't produce readable words. */
function plainText(markdown: string): string {
  return markdown
    .replace(/^(```|~~~)[^\n]*$/gm, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/[*_~`>|]/g, " ");
}

export function countWords(markdown: string): number {
  return plainText(markdown).split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

/** "6 min" — computed from the body, never below one minute. */
export function readingTime(markdown: string): string {
  return `${Math.max(1, Math.ceil(countWords(markdown) / WORDS_PER_MINUTE))} min`;
}

export function slugify(text: string): string {
  return (
    text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

/** Hands out unique heading ids in document order (`intro`, `intro-1`, …). */
export function createSlugger() {
  const seen = new Map<string, number>();
  return (text: string): string => {
    const base = slugify(text);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n === 0 ? base : `${base}-${n}`;
  };
}

export type Heading = { id: string; text: string; depth: number };

function inlineText(raw: string): string {
  return raw
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .trim();
}

/** ATX headings (`#`…`####`) outside fenced code, with ids matching the renderer's. */
export function extractHeadings(markdown: string): Heading[] {
  const slug = createSlugger();
  const headings: Heading[] = [];
  let fence: string | null = null;
  for (const line of markdown.split("\n")) {
    const f = line.match(/^ {0,3}(```|~~~)/);
    if (f) {
      fence = fence === null ? f[1] : fence === f[1] ? null : fence;
      continue;
    }
    if (fence) continue;
    const m = line.match(/^ {0,3}(#{1,4})\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    const text = inlineText(m[2]);
    headings.push({ id: slug(text), text, depth: m[1].length });
  }
  return headings;
}
