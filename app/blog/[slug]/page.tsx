import { formatDate, getBlogPosts, kebabCasetoTitleCase } from '@/app/blog/utils'
import { CustomMDX } from '@/components/big/mdx'
import { colorVariants, states } from "@/components/big/project"
import { ViewCounter } from '@/components/big/view-counter'
import { BadgeTrimmed } from '@/components/ui/badge-trimmed'
import { cn } from '@/lib/utils'
import { baseUrl } from '@/app/sitemap'
import { ExternalLink } from 'lucide-react'
import { Metadata } from "next"
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'
export const dynamicParams = true
// export const revalidate = 1000 * 60 * 60 * 24

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    const post = (await getBlogPosts()).find((post) => post.slug === params.slug)

    if (!post) {
        return { title: 'Not Found' }
    }

    const {
        title,
        publishedAt: publishedTime,
        summary: description,
        image,
    } = post.metadata
    const ogImage = image || `${baseUrl}/og?title=${encodeURIComponent(title)}`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            publishedTime,
            url: `${baseUrl}/blog/${post.slug}`,
            images: [
                {
                    url: ogImage,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
    }
}

export async function generateStaticParams() {
    const posts = await getBlogPosts()

    return posts.map((post) => ({
        slug: post.slug,
    }))
}

export default async function Blog(props: Readonly<{ params: Promise<{ slug: string }> }>) {
    const params = await props.params;
    const post = (await getBlogPosts()).find((post) => post.slug === params.slug)

    if (!post) {
        notFound()
    }

    return (
        <section className='page flex-1 flex flex-col justify-between gap-4 md:gap-12'>
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: post.metadata.title,
                        datePublished: post.metadata.publishedAt,
                        dateModified: post.metadata.publishedAt,
                        description: post.metadata.summary,
                        image: post.metadata.image
                            ? `${baseUrl}${post.metadata.image}`
                            : `/og?title=${encodeURIComponent(post.metadata.title)}`,
                        url: `${baseUrl}/blog/${post.slug}`,
                        author: {
                            '@type': 'Person',
                            name: 'Maxime Duhamel',
                        },
                    }),
                }}
            />
            <header>
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-12">
                    <h1 className="page-title">
                        {post.metadata.title}
                    </h1>
                    {
                        post.metadata.isProject && post.metadata.tags && post.metadata.tags.length > 0 ? (
                            <div className="md:col-span-5 text-xs font-light flex flex-col md:flex-row">
                                {post.metadata.tags
                                    .filter(tag => !states.includes(tag) && tag !== 'Project')
                                    .map((tag) => {
                                        const colorVariant = post.metadata.color && colorVariants[post.metadata.color]
                                            ? colorVariants[post.metadata.color]
                                            : colorVariants.blue
                                        return (
                                            <BadgeTrimmed
                                                key={tag}
                                                className={cn("mr-1 mb-1", colorVariant.tag)}
                                                text={kebabCasetoTitleCase(tag)}
                                                untilSpace
                                                forceFull
                                            />
                                        )
                                    })}
                            </div>
                        ) : null
                    }
                </div>
                <div
                    className="flex flex-col gap-1 md:flex-row justify-between md:items-center mt-2 text-xs md:text-sm text-neutral-600 dark:text-neutral-400 ">
                    <p className="basis-1/6">
                        {formatDate(post.metadata.publishedAt)}
                    </p>
                    <p className="basis-5/6">
                        {post.metadata.summary}
                    </p>
                    <div className="flex flex-col basis-1/6 items-end gap-1 md:gap-2 text-right">
                        {
                            post.metadata.link ? (
                                <a href={post.metadata.link} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1">
                                    Link
                                    <ExternalLink className="size-4" />
                                </a>
                            ) : null
                        }
                        <ViewCounter slug={`/blog/${post.slug}`} />
                    </div>
                </div>
            </header>
            <article className="grow flex flex-col justify-between prose font-serif text-sm md:text-base lg:text-lg">
                <CustomMDX source={post.content} />
            </article>
            <footer>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Best Regards,<br />
                    Maxime Duhamel :)
                </p>
            </footer>
        </section>
    )
}
