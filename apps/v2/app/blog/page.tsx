import { getBlogPosts } from '@repo/content/server'
import { formatDate } from '@repo/content'
import Link from 'next/link'

export default async function BlogPage() {
  const posts = await getBlogPosts()
  const sorted = posts.sort((a, b) =>
    new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  )

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-10">Blog</h1>
      <ul className="space-y-6">
        {sorted.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group block">
              <p className="font-semibold group-hover:underline">{post.metadata.title}</p>
              <p className="text-zinc-500 text-sm mt-1">{post.metadata.summary}</p>
              <p className="text-zinc-400 text-xs mt-1">
                {formatDate(post.metadata.publishedAt)} · {post.metadata.views} views
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
