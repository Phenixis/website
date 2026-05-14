import { getMergedViews } from './redis'
import matter from 'gray-matter'
import fs from 'node:fs'
import path from 'node:path'
import { type Metadata, type PostType, type ProjectType } from './types'
import { formatToKebabCase as fmtKebab, getPostRoutePrefix } from './utils'

// process.cwd() in Next.js always returns the app root (where next.config.ts lives),
// so ../../packages/content/posts correctly resolves from apps/v1 or apps/v2
export const postsDir = path.join(process.cwd(), '..', '..', 'packages', 'content', 'posts')
export const blogDir = path.join(postsDir, 'blog')
export const projectDir = path.join(postsDir, 'project')
export const experiencesDir = path.join(postsDir, 'experiences')

export const dir = postsDir

function getMDXFiles(dir: fs.PathLike) {
    return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath: fs.PathOrFileDescriptor) {
    const rawContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(rawContent)

    if (data.publishedAt instanceof Date) {
        data.publishedAt = data.publishedAt.toISOString().split('T')[0]
    }
    if (data.start instanceof Date) {
        data.start = data.start.toISOString().split('T')[0]
    }
    if (data.end instanceof Date) {
        data.end = data.end.toISOString().split('T')[0]
    }

    return { metadata: data as Metadata, content }
}

function getAllPostsRaw(): ProjectType[] {
    const dirs: [string, PostType][] = [
        [blogDir, 'blog'],
        [projectDir, 'project'],
        [experiencesDir, 'experiences'],
    ]
    return dirs.flatMap(([d, type]) =>
        getMDXFiles(d).map(file => {
            const slugWithoutMDX = file.replace(/\.mdx?$/, '')
            const { metadata, content } = readMDXFile(path.join(d, file))
            return { metadata, slug: fmtKebab(slugWithoutMDX), content, type } as ProjectType
        })
    )
}

export function getAliasSlugsForRoute(routePrefix: string): string[] {
    return getAllPostsRaw()
        .flatMap(post => post.metadata.alias ?? [])
        .filter(alias => alias.startsWith(`${routePrefix}/`))
        .map(alias => alias.slice(`${routePrefix}/`.length))
}

export function findPostByAlias(aliasPath: string): ProjectType | null {
    return getAllPostsRaw().find(post => post.metadata.alias?.includes(aliasPath)) ?? null
}

async function getMDXData(searchDir: string, type: PostType) {
    const mdxFiles = getMDXFiles(searchDir)
    const routePrefix = getPostRoutePrefix(type)
    return Promise.all(mdxFiles.map(async (file) => {
        const slugWithoutMDX = file.replace(/\.mdx?$/, '')
        const { metadata, content } = readMDXFile(path.join(searchDir, file))
        const canonicalKey = `${routePrefix}/${fmtKebab(slugWithoutMDX)}`
        const aliasKeys = metadata.alias ?? []
        metadata.views = await getMergedViews([canonicalKey, ...aliasKeys])
        return {
            metadata,
            slug: fmtKebab(slugWithoutMDX),
            content,
            type,
        } as ProjectType
    }))
}

export async function getBlogPosts(options: {
    includeTags?: string[]
    excludeTags?: string[]
} = {}) {
    const { includeTags = [], excludeTags = [] } = options
    const posts = await getMDXData(blogDir, 'blog')

    return posts.filter((post) => {
        if (!post.metadata.publishedAt) return false

        const postTags = post.metadata.tags || []

        if (includeTags.length > 0) {
            const hasIncludedTag = includeTags.some(tag => postTags.includes(tag))
            if (!hasIncludedTag) return false
        }

        if (excludeTags.length > 0) {
            const hasExcludedTag = excludeTags.some(tag => postTags.includes(tag))
            if (hasExcludedTag) return false
        }

        return true
    })
}

export async function getBlogPost(slug: string) {
    const slugWithoutMDX = slug.replace(/\.mdx?$/, '')
    const slugWithMDX = `${slugWithoutMDX}.mdx`

    const dirTypeMap: [string, PostType][] = [
        [blogDir, 'blog'],
        [projectDir, 'project'],
        [experiencesDir, 'experiences'],
    ]
    for (const [d, type] of dirTypeMap) {
        const filePath = path.join(d, slugWithMDX)
        if (fs.existsSync(filePath)) {
            const { metadata, content } = readMDXFile(filePath)
            const routePrefix = getPostRoutePrefix(type)
            const canonicalKey = `${routePrefix}/${fmtKebab(slugWithoutMDX)}`
            const aliasKeys = metadata.alias ?? []
            metadata.views = await getMergedViews([canonicalKey, ...aliasKeys])
            return {
                metadata,
                slug: fmtKebab(slugWithoutMDX),
                content,
                type,
            } as ProjectType
        }
    }

    throw new Error(`Post not found: ${slug}`)
}

export async function getProjects() {
    const posts = await getMDXData(projectDir, 'project')
    return posts.filter(post => !!post.metadata.publishedAt)
}

export async function getExperiences() {
    const posts = await getMDXData(experiencesDir, 'experiences')
    return posts.filter(post => !!post.metadata.start)
}
