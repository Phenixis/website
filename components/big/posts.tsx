import Link from 'next/link'
import {formatDate, getBlogPosts} from '@/app/blog/utils'
import {cn} from '@/lib/utils'
import {Eye} from "lucide-react";

export default async function BlogPosts({
                                      limit = 5
                                  }: {
    limit?: number
}) {
    const allBlogs = await getBlogPosts()

    return (
        <div>
            {allBlogs
                .sort((a, b) => {
                    if (
                        new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
                    ) {
                        return -1
                    }
                    return 1
                })
                .slice(0, limit !== 0 ? limit : allBlogs.length)
                .map((post) => (
                    <Link
                        key={post.slug}
                        className="flex flex-col space-y-1 mb-4 p-2 rounded-sm group/blog duration-1000 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                        href={`/blog/${post.slug}`}
                    >
                        <div className="w-full flex flex-col md:items-center md:flex-row space-x-0 md:space-x-2">
                            <div
                                className="flex flex-row md:flex-col w-full md:w-[100px] tabular-nums shrink-0 text-neutral-600 dark:text-neutral-400">
                                <p>
                                    {formatDate(post.metadata.publishedAt, false)}
                                </p>
                                <p className="flex items-center gap-1">
                                    <Eye className="size-4"/>
                                    {post.metadata.views}
                                </p>
                            </div>
                            <div>
                                <p
                                    className={cn(
                                        "text-neutral-900 dark:text-neutral-100 tracking-tight w-fit relative block line-clamp-1",
                                        "before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-full before:bg-black dark:before:bg-white before:transition-transform before:duration-1000 before:scale-x-100 md:before:scale-x-0 md:group-hover/blog:before:scale-x-100 before:origin-left"
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
                ))}
        </div>
    )
}
