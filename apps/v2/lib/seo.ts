const MAX_META_DESCRIPTION_LENGTH = 155;

/** Truncates on a word boundary so `<meta name="description">` never gets flagged as too long. */
export function truncateDescription(text: string, max = MAX_META_DESCRIPTION_LENGTH): string {
  if (text.length <= max) return text;
  const truncated = text.slice(0, max - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : max - 1)}…`;
}
