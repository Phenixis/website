import { getViews } from "@/lib/redis";
import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';
import { type Metadata, type ProjectType, formatToKebabCase as fmtKebab } from './blog-types';

export type { Metadata, ProjectType } from './blog-types';
export { formatDate, kebabCasetoTitleCase, formatToKebabCase } from './blog-types';

export const dir = path.join(process.cwd(), 'app', 'blog', 'posts')

function getMDXFiles(dir: fs.PathLike) {
    return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath: fs.PathOrFileDescriptor) {
    const rawContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(rawContent)

    // gray-matter parses bare YAML dates as Date objects; normalize to YYYY-MM-DD string
    if (data.publishedAt instanceof Date) {
        data.publishedAt = data.publishedAt.toISOString().split('T')[0]
    }

    return { metadata: data as Metadata, content }
}

async function getMDXData(dir: string) {
    const mdxFiles = getMDXFiles(dir)
    const postPromises = mdxFiles.map((file) => getBlogPost(file));
    return Promise.all(postPromises); // Wait for all promises to resolve
}

export async function getBlogPosts(options: {
    includeTags?: string[]
    excludeTags?: string[]
} = {}) {
    const { includeTags = [], excludeTags = [] } = options
    const posts = await getMDXData(dir)

    return posts.filter((post) => {
        if (!post.metadata.publishedAt) return false
        
        const postTags = post.metadata.tags || []
        const isProject = postTags.includes('Project')
        const allTags = isProject ? [...postTags, 'Project'] : postTags
        
        // If includeTags is specified, post must have at least one of those tags
        if (includeTags.length > 0) {
            const hasIncludedTag = includeTags.some(tag => allTags.includes(tag))
            if (!hasIncludedTag) return false
        }
        
        // Post must not have any of the excluded tags
        if (excludeTags.length > 0) {
            const hasExcludedTag = excludeTags.some(tag => allTags.includes(tag))
            if (hasExcludedTag) return false
        }
        
        return true
    })
}

export async function getBlogPost(slug: string) {
    const slugWithoutMDX = slug.replace(/\.mdx?$/, '')
    const slugWithMDX = `${slugWithoutMDX}.mdx`
    const {metadata, content} = readMDXFile(path.join(dir, slugWithMDX))

    metadata.views = await getViews("/blog/" + fmtKebab(slugWithoutMDX))

    return {
        metadata,
        slug: fmtKebab(slugWithoutMDX),
        content,
    } as ProjectType
}

export async function getProjects() {
    return await getBlogPosts({ includeTags: ['Project'] })
}

