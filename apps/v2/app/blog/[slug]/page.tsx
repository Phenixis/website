import { getBlogPosts, getAliasSlugsForRoute, findPostByAlias } from '@repo/content/server'
import { formatDate, getPostRoutePrefix } from '@repo/content'
import { CustomMDX } from '@/components/mdx'
import { notFound, redirect } from 'next/navigation'

export const dynamicParams = true

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  const aliasSlugs = getAliasSlugsForRoute('/blog')
  return [
    ...posts.map((p) => ({ slug: p.slug })),
    ...aliasSlugs.map((slug) => ({ slug })),
  ]
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const posts = await getBlogPosts()
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    const alias = findPostByAlias(`/blog/${slug}`)
    if (alias) redirect(`${getPostRoutePrefix(alias.type)}/${alias.slug}`)
    notFound()
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-zinc-400 text-sm mb-2">
        {formatDate(post.metadata.publishedAt)} · {post.metadata.views} views
      </p>
      <h1 className="text-3xl font-bold mb-4">{post.metadata.title}</h1>
      <p className="text-zinc-500 mb-10">{post.metadata.summary}</p>
      <article className="prose prose-zinc max-w-none">
        <CustomMDX source={post.content} />
      </article>
    </main>
  )
}
