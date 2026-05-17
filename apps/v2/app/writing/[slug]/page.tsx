import "../../portfolio.css";
import { Portfolio } from "../../_components/Portfolio";
import { PROFILE } from "../../data";
import { getProjects, getPublishedPosts, getExperiences, getPost } from "@/lib/db";
import { notFound } from "next/navigation";

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Maxime Duhamel`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [projects, posts, experiences, post] = await Promise.all([
    getProjects(),
    getPublishedPosts(),
    getExperiences(),
    getPost(slug),
  ]);

  if (!post) notFound();

  return (
    <Portfolio
      profile={PROFILE}
      projects={projects}
      posts={posts}
      experiences={experiences}
      initialFocus="blog"
      initialPostId={slug}
    />
  );
}
