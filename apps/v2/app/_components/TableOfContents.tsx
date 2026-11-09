import { extractHeadings } from "@/lib/reading";
import { TocNav } from "./TocNav";

/**
 * "Contents" for a Markdown body; renders nothing when it has no headings.
 * Put it inside a `relative` wrapper together with the body so the wide-screen
 * rail can sit in the gutter and stay sticky for the body's whole height.
 */
export function TableOfContents({ source }: { source: string }) {
  const headings = extractHeadings(source).filter((h) => h.depth <= 3);
  if (headings.length < 1) return null;
  return <TocNav headings={headings} />;
}
