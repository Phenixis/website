'use client';

import Link from 'next/link'
import type { ProjectType } from '@/app/blog/utils'
import { formatDate, cn } from '@/lib/utils'
import { Eye } from "lucide-react"
import { useStyle } from "@/contexts/style-context"

/**
 * Sorts posts by publishedAt descending and slices to the given limit.
 * limit=0 means no limit.
 */
function sortAndSlice(posts: ProjectType[], limit: number): ProjectType[] {
    return posts
        .toSorted((a, b) =>
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt) ? -1 : 1
        )
        .slice(0, limit === 0 ? posts.length : limit)
}

function BlogPostClassical({ post }: Readonly<{ post: ProjectType }>) {
    return (
        <Link
            className="flex flex-col space-y-1 mb-4 p-2 rounded-sm group/blog duration-1000 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            href={`/blog/${post.slug}`}
        >
            <div className="w-full flex flex-col md:items-center md:flex-row space-x-0 md:space-x-2">
                <div className="flex flex-row justify-between md:flex-col w-full md:w-25 tabular-nums shrink-0 text-neutral-600 dark:text-neutral-400">
                    <p>
                        {formatDate(post.metadata.publishedAt, false)}
                    </p>
                    <p className="flex items-center gap-1">
                        <Eye className="size-4" />
                        {post.metadata.views}
                    </p>
                </div>
                <div>
                    <p
                        className={cn(
                            "text-neutral-900 dark:text-neutral-100 tracking-tight w-fit relative block line-clamp-1",
                            "before:absolute before:left-0 before:bottom-0 before:h-0.5 before:w-full before:bg-black dark:before:bg-white before:transition-transform before:duration-1000 before:scale-x-0 group-hover/blog:before:scale-x-100 before:origin-left"
                        )}
                    >
                        {post.metadata.title}
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-400 tracking-tight line-clamp-2">
                        {post.metadata.summary}
                    </p>
                </div>
            </div>
        </Link>
    )
}

function BlogPostModern({ post }: Readonly<{ post: ProjectType }>) {
    return (
        <Link href={`/blog/${post.slug}`} className="group/blog block px-2 py-1.5 rounded-sm bg-neutral-100/15 dark:bg-neutral-900/50 lg:bg-neutral-100/0 lg:bg-neutral-90/0 lg:hover:bg-neutral-100/15 lg:dark:hover:bg-neutral-900/50 transition-colors duration-300">
            {/* Main line: view count + title on the left, date on the right */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="flex items-center gap-1 shrink-0 tabular-nums text-xs text-neutral-800 dark:text-neutral-400">
                        <Eye className="size-3" />
                        {post.metadata.views ?? 0}
                    </span>
                    <span className="text-neutral-900 dark:text-neutral-100 tracking-wider truncate">
                        {post.metadata.title}
                    </span>
                </div>
                <span className="shrink-0 tabular-nums text-xs text-neutral-900 dark:text-neutral-400">
                    {formatDate(post.metadata.publishedAt, false)}
                </span>
            </div>

            {/* Summary: expands below on hover */}
            <div className="grid lg:grid-rows-[0fr] lg:group-hover/blog:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out">
                <div className="overflow-hidden">
                    <p className="pt-1 text-sm text-neutral-900 dark:text-neutral-400 tracking-tight line-clamp-2">
                        {post.metadata.summary}
                    </p>
                </div>
            </div>
        </Link>
    )
}

export default function BlogPostsList({
    posts,
    limit = 5,
}: Readonly<{
    posts: ProjectType[]
    limit?: number
}>) {
    const { currentStyle } = useStyle()
    const sorted = sortAndSlice(posts, limit)

    if (currentStyle === 'modern') {
        return (
            <div className="grid grid-cols-1 gap-2">
                {sorted.map(post => (
                    <BlogPostModern key={post.slug} post={post} />
                ))}
            </div>
        )
    }

    return (
        <div>
            {sorted.map(post => (
                <BlogPostClassical key={post.slug} post={post} />
            ))}
        </div>
    )
}
