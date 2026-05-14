import { getBlogPosts, getProjects, getExperiences } from "@repo/content/server";
import { formatDate } from "@repo/content";
import Link from "next/link";

// This is a Next.js Server Component — no "use client" needed.
// getBlogPosts() reads MDX files from packages/content/posts/ at build time.
export default async function Home() {
  const [posts, projects, experiences] = await Promise.all([
    getBlogPosts(),
    getProjects(),
    getExperiences(),
  ]);

  return (
    <main className="max-w-2xl mx-auto px-6 py-16 font-sans">
      <h1 className="text-3xl font-bold mb-12">v2 — content demo</h1>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Blog posts</h2>
          <Link href="/blog" className="text-sm text-zinc-500 hover:underline">View all →</Link>
        </div>
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="flex justify-between gap-4 hover:underline">
                <span className="font-medium">{post.metadata.title}</span>
                <span className="text-zinc-500 text-sm shrink-0">
                  {post.metadata.views} views · {formatDate(post.metadata.publishedAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Projects</h2>
          <Link href="/projects" className="text-sm text-zinc-500 hover:underline">View all →</Link>
        </div>
        <ul className="space-y-3">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link href={`/projects/${project.slug}`} className="flex justify-between gap-4 hover:underline">
                <span className="font-medium">{project.metadata.title}</span>
                <span className="text-zinc-500 text-sm shrink-0">
                  {formatDate(project.metadata.publishedAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Experiences</h2>
          <Link href="/experiences" className="text-sm text-zinc-500 hover:underline">View all →</Link>
        </div>
        <ul className="space-y-3">
          {experiences.map((exp) => (
            <li key={exp.slug}>
              <Link href={`/experiences/${exp.slug}`} className="flex justify-between gap-4 hover:underline">
                <span className="font-medium">{exp.metadata.title}</span>
                <span className="text-zinc-500 text-sm shrink-0">
                  {exp.metadata.start} → {exp.metadata.end ?? "now"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
