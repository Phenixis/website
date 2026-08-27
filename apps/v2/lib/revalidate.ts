import { revalidatePath } from "next/cache";

/**
 * The portfolio's list/detail pages are statically generated (revalidate:
 * 86400) so an admin edit wouldn't show up publicly for up to a day without
 * this. Editing one project can also change another project's prev/next
 * links, so we invalidate every portfolio route rather than trying to guess
 * which ones are actually affected.
 */
export function revalidatePortfolio() {
  revalidatePath("/");
  revalidatePath("/writing");
  revalidatePath("/writing/[slug]", "page");
  revalidatePath("/itinerary");
  revalidatePath("/projects/[slug]", "page");
}
