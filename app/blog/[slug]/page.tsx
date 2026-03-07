import { getBlogPosts } from '@/app/blog/utils'
import { CustomMDX } from '@/components/big/mdx'
import { resolveImageSrc } from '@/lib/utils'
import { baseUrl } from '@/app/sitemap'
import { Metadata } from "next"
import { notFound } from 'next/navigation'
import BlogPostHeader from './blog-post-header'

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
                            ? resolveImageSrc(post.metadata.image, baseUrl)
                            : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}`,
                        url: `${baseUrl}/blog/${post.slug}`,
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
