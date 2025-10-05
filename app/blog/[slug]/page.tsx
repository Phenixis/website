import {notFound} from 'next/navigation'
import {CustomMDX} from '@/components/big/mdx'
import {formatDate, getBlogPosts, kebabCasetoTitleCase} from '@/app/blog/utils'
import {baseUrl} from 'app/sitemap'
import {BadgeTrimmed} from '@/components/ui/badge-trimmed'
import {cn} from '@/lib/utils'
import {ExternalLink, Eye, UserIcon} from 'lucide-react'
import {Metadata} from "next";
import {headers} from "next/headers"
import {getViews, incrementViews, hashIp} from "@/lib/redis";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    const post = (await getBlogPosts(true)).find((post) => post.slug === params.slug)

    if (!post) {
        return {title: 'Not Found'}
    }

    const {
        title,
        publishedAt: publishedTime,
        summary: description,
        image,
    } = post.metadata
    const ogImage = image
        ? image
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

export default async function Blog(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const post = (await getBlogPosts(true)).find((post) => post.slug === params.slug)

    if (!post) {
        notFound()
    }

    const h = await headers();
    const xff = h.get('x-forwarded-for');
    const ip = (xff && xff.split(',')[0].trim()) || h.get('x-real-ip') || '127.0.0.1';

    const secret = process.env.IP_HASH_KEY; // défini dans .env
    const hashedIp = hashIp(ip, secret);

    console.log(`IP: ${ip}, Hashed IP: ${hashedIp}`);

    await incrementViews("/blog/" + post.slug, hashedIp)

    const views = await getViews("/blog/" + post.slug)

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
                                {post.metadata.tags.map((tag) => (
                                    <BadgeTrimmed
                                        key={tag.index}
                                        className={cn("mr-1 mb-1", tag.color.tag)}
                                        text={kebabCasetoTitleCase(tag.name)}
                                        untilSpace
                                        forceFull
                                    />
                                ))}
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
                                    <ExternalLink className="size-4"/>
                                </a>
                            ) : null
                        }
                        <p className="flex items-center gap-1">
                            {views}
                            <Eye className="size-4"/>
                        </p>
                    </div>
                </div>
            </header>
            <article className="grow flex flex-col justify-between prose font-serif text-sm md:text-base lg:text-lg">
                <CustomMDX source={post.content}/>
            </article>
            <footer>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Best Regards,<br/>
                    Maxime Duhamel :)
                </p>
            </footer>
        </section>
    )
}
