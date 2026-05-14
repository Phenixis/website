import { getBlogPosts, getProjects, getExperiences } from "@repo/content/server";
import { formatDate } from "@repo/content";

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
        <h2 className="text-xl font-semibold mb-4">Blog posts</h2>
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.slug} className="flex justify-between gap-4">
              <span className="font-medium">{post.metadata.title}</span>
              <span className="text-zinc-500 text-sm shrink-0">
                {post.metadata.views} views · {formatDate(post.metadata.publishedAt)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <ul className="space-y-3">
          {projects.map((project) => (
            <li key={project.slug} className="flex justify-between gap-4">
              <span className="font-medium">{project.metadata.title}</span>
              <span className="text-zinc-500 text-sm shrink-0">
                {formatDate(project.metadata.publishedAt)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Experiences</h2>
        <ul className="space-y-3">
          {experiences.map((exp) => (
            <li key={exp.slug} className="flex justify-between gap-4">
              <span className="font-medium">{exp.metadata.title}</span>
              <span className="text-zinc-500 text-sm shrink-0">
                {exp.metadata.start} → {exp.metadata.end ?? "now"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
