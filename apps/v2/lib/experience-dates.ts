import type { Experience } from "@/app/data";

/** "YYYY-MM" → sortable integer (year * 12 + month index). */
export function monthIndex(ym: string): number {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

export function formatMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatRange(e: Pick<Experience, "startDate" | "endDate">): string {
  return e.endDate ? `${formatMonth(e.startDate)} — ${formatMonth(e.endDate)}` : `${formatMonth(e.startDate)} →`;
}

function currentYearMonth(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Inclusive month count, formatted as "3 mo", "1 yr", "1 yr 6 mo". Runs to today if ongoing. */
export function formatDuration(e: Pick<Experience, "startDate" | "endDate">): string {
  const end = monthIndex(e.endDate ?? currentYearMonth());
  const months = Math.max(1, end - monthIndex(e.startDate) + 1);
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${months} mo`;
  if (rem === 0) return `${years} yr`;
  return `${years} yr ${rem} mo`;
}

export function sortByStartDesc(items: Experience[]): Experience[] {
  return [...items].sort((a, b) => monthIndex(b.startDate) - monthIndex(a.startDate));
}

/** A gap this many months or more between two entries gets an ellipsis marker. */
export const GAP_THRESHOLD_MONTHS = 2;

/**
 * `sorted` must be in descending start-date order (most recent first).
 * Returns true at index `i` if there's a meaningful gap between item i
 * (newer) and item i + 1 (older).
 */
export function hasGapAfter(sorted: Experience[], i: number): boolean {
  const newer = sorted[i];
  const older = sorted[i + 1];
  if (!newer || !older) return false;
  const olderEnd = older.endDate ?? older.startDate;
  return monthIndex(newer.startDate) - monthIndex(olderEnd) >= GAP_THRESHOLD_MONTHS;
}
