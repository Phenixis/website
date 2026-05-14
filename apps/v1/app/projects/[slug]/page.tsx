import { getProjects, findPostByAlias, getAliasSlugsForRoute, getPostRoutePrefix } from '@/app/blog/utils'
import { CustomMDX } from '@/components/big/mdx'
import { resolveImageSrc } from '@/lib/utils'
import { baseUrl } from '@/app/sitemap'
import { Metadata } from "next"
import { notFound, redirect } from 'next/navigation'
import BlogPostHeader from '@/app/blog/[slug]/blog-post-header'

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    const post = (await getProjects()).find((post) => post.slug === params.slug)

    if (!post) {
        return { title: 'Not Found' }
    }

    const {
        title,
        publishedAt: publishedTime,
        summary: description,
        image,
    } = post.metadata
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
            publishedTime,
            url: `${baseUrl}/projects/${post.slug}`,
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
    const posts = await getProjects()
    const aliasSlugs = getAliasSlugsForRoute('/projects')

    return [
        ...posts.map((post) => ({ slug: post.slug })),
        ...aliasSlugs.map((slug) => ({ slug })),
    ]
}

export default async function ProjectPost(props: Readonly<{ params: Promise<{ slug: string }> }>) {
    const params = await props.params;
    const post = (await getProjects()).find((post) => post.slug === params.slug)

    if (!post) {
        // Check if this slug is an alias pointing to another post
        const aliasTarget = findPostByAlias(`/projects/${params.slug}`)
        if (aliasTarget) {
            redirect(`${getPostRoutePrefix(aliasTarget.type)}/${aliasTarget.slug}`)
        }
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
                        '@type': 'SoftwareSourceCode',
                        name: post.metadata.title,
                        datePublished: post.metadata.publishedAt,
                        description: post.metadata.summary,
                        image: post.metadata.image
                            ? resolveImageSrc(post.metadata.image, baseUrl)
                            : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}`,
                        url: `${baseUrl}/projects/${post.slug}`,
                        author: {
                            '@type': 'Person',
                            name: 'Maxime Duhamel',
                        },
                    }),
                }}
            />
            <BlogPostHeader post={post} />
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
