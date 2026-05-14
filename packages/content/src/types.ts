export type Metadata = {
    title: string
    publishedAt: string
    summary: string
    views: number
    link?: string
    image?: string
    color?: string
    tags?: string[]
    start?: string
    end?: string
    alias?: string[]
}

export type PostType = 'blog' | 'project' | 'experiences'

export type ProjectType = {
    metadata: Metadata
    slug: string
    content: string
    type: PostType
}
