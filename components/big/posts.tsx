import { getBlogPosts } from '@/app/blog/utils'
import BlogPostsList from './posts-client'

export default async function BlogPosts({
    limit = 5
}: Readonly<{
    limit?: number
}>) {
    const allBlogs = await getBlogPosts({ excludeTags: ['Project'] })
    return <BlogPostsList posts={allBlogs} limit={limit} />
}
