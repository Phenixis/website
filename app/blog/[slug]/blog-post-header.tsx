'use client';

import { formatDate, getPostRoutePrefix, kebabCasetoTitleCase, type ProjectType } from '@/app/blog/blog-types'
import { colorVariants } from '@/components/big/project'
import { states } from '@/lib/project-states'
import { ViewCounter } from '@/components/big/view-counter'
import { BadgeTrimmed } from '@/components/ui/badge-trimmed'
import { cn, isExternalImage } from '@/lib/utils'
import { useStyle } from '@/contexts/style-context'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'

interface BlogPostHeaderProps {
    post: ProjectType
}

/**
 * Modern blog post header: full-width image hero on mobile,
 * side-by-side (image left, text right) layout on desktop.
 * Requires `post.metadata.image` to be set.
 */
export function BlogPostHeaderModern({ post }: Readonly<BlogPostHeaderProps>) {
    const { metadata, slug } = post

    return (
        <div className="relative w-full overflow-hidden md:flex md:flex-row md:items-stretch">
            {/* Image side */}
            <div className="relative w-full aspect-video overflow-hidden md:w-3/13 md:aspect-auto md:min-h-52 rounded-lg">
                {isExternalImage(metadata.image!) ? (
                    <img
                        src={metadata.image!}
                        alt={metadata.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Image
                        src={metadata.image!}
                        alt={metadata.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 40vw"
                    />
                )}
                {/* Subtle dark backdrop */}
                <div className="absolute inset-0 bg-black/20 md:hidden" />
            </div>

            {/* Header: gradient overlay on mobile, side panel on desktop */}
            <header className="absolute inset-x-0 top-0 px-3 pb-15 pt-3 bg-linear-to-b from-black/70 to-transparent text-white md:relative md:inset-auto md:flex-1 md:flex md:flex-col md:justify-between md:gap-3 md:px-6 md:py-5 md:bg-none md:text-foreground rounded-lg">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 shrink-0">
                        <h1 className="page-title text-white md:text-black leading-tight">
                            {metadata.title}
                        </h1>
                        <span className="text-xs text-white/70 md:text-black">
                            {formatDate(metadata.publishedAt)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {post.type === 'project' && metadata.tags && metadata.tags.length > 0 ? (
                            <div className="text-xs font-light flex flex-row flex-wrap justify-end">
                                {metadata.tags
                                    .filter((tag) => !states.includes(tag))
                                    .map((tag) => {
                                        const colorVariant =
                                            metadata.color && colorVariants[metadata.color]
                                                ? colorVariants[metadata.color]
                                                : colorVariants.blue
                                        return (
                                            <BadgeTrimmed
                                                key={tag}
                                                className={cn('mr-1 mb-1', colorVariant.tag)}
                                                text={kebabCasetoTitleCase(tag)}
                                                untilSpace
                                                forceFull
                                            />
                                        )
                                    })}
                            </div>
                        ) : null}

                        {metadata.link ? (
                            <a
                                href={metadata.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-white/80 md:text-black"
                            >
                                Link
                                <ExternalLink className="size-4" />
                            </a>
                        ) : null}

                        <ViewCounter
                            slug={`${getPostRoutePrefix(post.type)}/${slug}`}
                            className="text-xs text-white/70 md:text-black"
                        />
                    </div>
                </div>

                <p className="text-white/70 md:text-black tracking-tight line-clamp-2 text-sm">
                    {metadata.summary}
                </p>
            </header>
        </div>
    )
}

/**
 * Classical blog post header: plain layout with title, tags, date,
 * summary and external link / view counter.
 */
export function BlogPostHeaderClassical({ post }: Readonly<BlogPostHeaderProps>) {
    const { metadata, slug } = post

    return (
        <header>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-12">
                <h1 className="page-title">{metadata.title}</h1>

                {post.type === 'project' && metadata.tags && metadata.tags.length > 0 ? (
                    <div className="md:col-span-5 text-xs font-light flex flex-col md:flex-row">
                        {metadata.tags
                            .filter((tag) => !states.includes(tag))
                            .map((tag) => {
                                const colorVariant =
                                    metadata.color && colorVariants[metadata.color]
                                        ? colorVariants[metadata.color]
                                        : colorVariants.blue
                                return (
                                    <BadgeTrimmed
                                        key={tag}
                                        className={cn('mr-1 mb-1', colorVariant.tag)}
                                        text={kebabCasetoTitleCase(tag)}
                                        untilSpace
                                        forceFull
                                    />
                                )
                            })}
                    </div>
                ) : null}
            </div>

            <div className="flex flex-col gap-1 md:flex-row justify-between md:items-center mt-2 text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                <p className="basis-1/6">{formatDate(metadata.publishedAt)}</p>
                <p className="basis-5/6">{metadata.summary}</p>
                <div className="flex flex-col basis-1/6 items-end gap-1 md:gap-2 text-right">
                    {metadata.link ? (
                        <a
                            href={metadata.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                        >
                            Link
                            <ExternalLink className="size-4" />
                        </a>
                    ) : null}
                    <ViewCounter slug={`${getPostRoutePrefix(post.type)}/${slug}`} />
                </div>
            </div>
        </header>
    )
}

/**
 * Selects the appropriate header component based on the active style flag.
 * Falls back to the classical header when style is "modern" but the post
 * has no image (BlogPostHeaderModern requires one).
 */
export default function BlogPostHeader({ post }: Readonly<BlogPostHeaderProps>) {
    const { currentStyle } = useStyle()

    if (currentStyle === 'modern' && post.metadata.image) {
        return <BlogPostHeaderModern post={post} />
    }

    return <BlogPostHeaderClassical post={post} />
}
