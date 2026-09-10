import { getPublishedPost } from "@/lib/db";
import { notFound } from "next/navigation";
import { truncateDescription } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};
  const description = truncateDescription(post.excerpt);
  return {
    title: `${post.title} — Maxime Duhamel`,
    description,
    openGraph: { title: post.title, description },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();
  return null;
}
