import { MDXRemote } from 'next-mdx-remote/rsc'

export function CustomMDX({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      options={{ parseFrontmatter: false }}
    />
  )
}
