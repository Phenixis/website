import type { Post, Project } from "../app/data";

/** Latest 4-digit year in a free-form string ("2024", "2023–2025"); 0 if none. */
const yearOf = (s: string) => Math.max(0, ...(s.match(/\d{4}/g) ?? []).map(Number));

/**
 * Most recently edited first; projects never edited since `updatedAt` was
 * tracked fall back to year, newest first. Ties keep their existing order.
 */
export const byYearDesc = (items: Project[]) => {
  const t = (p: Project) => (p.updatedAt ? Date.parse(p.updatedAt) || 0 : 0);
  return [...items].sort((a, b) => t(b) - t(a) || yearOf(b.year) - yearOf(a.year));
};

/** Most recent date first; unparseable dates go last. */
export const byDateDesc = (items: Post[]) => {
  const t = (p: Post) => Date.parse(p.date) || 0;
  return [...items].sort((a, b) => t(b) - t(a));
};

/** "12m ago", "3h ago", "yesterday", "4d ago"…; "—" when unknown. */
export function timeAgo(iso?: string, now = Date.now()): string {
  const then = iso ? Date.parse(iso) : NaN;
  if (Number.isNaN(then)) return "—";
  const mins = Math.max(0, Math.floor((now - then) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
