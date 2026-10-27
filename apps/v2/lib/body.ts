/**
 * Bodies are stored as Markdown. Rows written before migrations 012/013 hold
 * a JSON array of paragraphs instead — join those so reads keep working
 * until the migration has run.
 */
export function parseBody(raw: unknown): string {
  const text = (raw as string | null) ?? "";
  if (text.startsWith("[")) {
    try {
      const parsed: unknown = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.every((p) => typeof p === "string")) {
        return parsed.join("\n\n");
      }
    } catch {
      // Not JSON — a Markdown body that happens to start with "[" (a link).
    }
  }
  return text;
}
