import { redirect } from "next/navigation";

export default async function ExperienceSlugRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/itinerary#${encodeURIComponent(slug)}`);
}
