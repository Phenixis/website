import { getExperiences, findPostByAlias, getAliasSlugsForRoute, getPostRoutePrefix } from '@/app/blog/utils'
import { formatDate } from '@/app/blog/blog-types'
import { CustomMDX } from '@/components/big/mdx'
import { resolveImageSrc } from '@/lib/utils'
import { baseUrl } from '@/app/sitemap'
import { Metadata } from "next"
import { notFound, redirect } from 'next/navigation'
import { ViewCounter } from '@/components/big/view-counter'
import { ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    const post = (await getExperiences()).find((post) => post.slug === params.slug)

    if (!post) {
        return { title: 'Not Found' }
    }

    const { title, summary: description, image } = post.metadata
    const ogImage = image
        ? resolveImageSrc(image, baseUrl)
        : `${baseUrl}/og?title=${encodeURIComponent(title)}`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            url: `${baseUrl}/experiences/${post.slug}`,
            images: [{ url: ogImage }],
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
    const posts = await getExperiences()
    const aliasSlugs = getAliasSlugsForRoute('/experiences')

    return [
        ...posts.map((post) => ({ slug: post.slug })),
        ...aliasSlugs.map((slug) => ({ slug })),
    ]
}

export default async function ExperiencePost(props: Readonly<{ params: Promise<{ slug: string }> }>) {
    const params = await props.params;
    const post = (await getExperiences()).find((post) => post.slug === params.slug)

    if (!post) {
        // Check if this slug is an alias pointing to another post
        const aliasTarget = findPostByAlias(`/experiences/${params.slug}`)
        if (aliasTarget) {
            redirect(`${getPostRoutePrefix(aliasTarget.type)}/${aliasTarget.slug}`)
        }
        notFound()
    }

    const { title, summary, start, end, link, tags, image } = post.metadata
    const endLabel = end ? formatDate(end) : 'Present'
    const dateRange = start ? `${formatDate(start)} – ${endLabel}` : null

    return (
        <section className='page flex-1 flex flex-col justify-between gap-4 md:gap-12'>
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'EmployeeRole',
                        name: title,
                        startDate: start,
                        endDate: end ?? undefined,
                        description: summary,
                        url: `${baseUrl}/experiences/${post.slug}`,
                        roleName: tags?.filter(t => !['Internship'].includes(t)).join(', '),
                    }),
                }}
            />

            <header className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h1 className="page-title">{title}</h1>
                    {dateRange && (
                        <span className="text-sm text-muted-foreground shrink-0">{dateRange}</span>
                    )}
                </div>

                {summary && (
                    <p className="text-sm text-muted-foreground">{summary}</p>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-1">
                    {tags && tags.length > 0 && tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                    {link && (
                        <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs"
                        >
                            Link
                            <ExternalLink className="size-3" />
                        </a>
                    )}
                    <ViewCounter slug={`/experiences/${post.slug}`} className="text-xs text-muted-foreground" />
                </div>

                {image && (
                    <img
                        src={resolveImageSrc(image, baseUrl)}
                        alt={title}
                        className="w-full rounded-lg object-cover mt-2 max-h-64"
                    />
                )}
            </header>

            <article className="grow flex flex-col justify-between prose font-serif text-sm md:text-base lg:text-lg px-2 lg:px-6">
                <CustomMDX source={post.content} />
            </article>

            <footer>
                <p className="text-sm text-black">
                    Best Regards,<br />
                    Maxime Duhamel :)
                </p>
            </footer>
        </section>
    )
}
