import React from "react";
import Link from "next/link";
import type { Post, Profile } from "../../data";
import { Markdown } from "../../_components/Markdown";
import { DetailFooter } from "../../_components/portfolio/DetailFooter";

export function BlogList({ posts }: { posts: Post[] }) {
  return (
    <ol className="list-none p-0 mx-auto max-w-[760px] flex flex-col max-[920px]:max-w-full">
      {posts.map((p, i) => (
        <li
          key={p.id}
          className="grid grid-cols-[120px_1fr] gap-9 py-[30px] border-t border-v3-border last:border-b cursor-pointer relative transition-[padding-left] duration-[280ms] ease-v3-fade hover:pl-[18px] before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-v3-accent before:origin-top before:scale-y-0 before:transition-transform before:duration-[280ms] before:ease-v3-fade hover:before:scale-y-100 max-[720px]:grid-cols-[72px_1fr] max-[720px]:gap-[18px] max-[720px]:py-[22px] max-[480px]:grid-cols-[56px_1fr] max-[480px]:gap-3 max-[480px]:py-[18px]"
        >
          <Link href={`/writing/${p.id}`} className="contents">
            <div className="flex flex-col gap-[6px] pt-1">
              <div className="font-serif italic text-[32px] text-v3-accent leading-none font-light tabular-nums max-[720px]:text-[26px] max-[480px]:text-[22px]">
                {String(posts.length - i).padStart(2, "0")}
              </div>
              <div className="text-[10.5px] text-v3-text-dim tracking-[0.08em] uppercase tabular-nums">{p.date}</div>
            </div>
            <div className="flex flex-col gap-[10px]">
              <h3 className="font-serif font-normal text-[30px] m-0 tracking-[-0.015em] leading-[1.15] text-v3-text text-pretty max-[720px]:text-[24px] max-[480px]:text-[20px]">
                {p.title}
              </h3>
              <p className="font-mono text-[12.5px] leading-[1.7] text-v3-text-2 m-0 max-w-[640px] text-pretty max-[720px]:text-[12px] max-[720px]:max-w-full">
                {p.excerpt}
              </p>
              <div className="flex items-center gap-2 text-[10.5px] text-v3-text-mute tracking-[0.1em] uppercase mt-1 max-[480px]:flex-wrap max-[480px]:gap-[6px]">
                <span>{p.readTime}</span>
                <span className="text-v3-text-dim">/</span>
                {p.tags.map((t, j) => (
                  <React.Fragment key={t}>
                    <span className="text-v3-text-2">{t}</span>
                    {j < p.tags.length - 1 && <span className="text-v3-text-dim">,</span>}
                  </React.Fragment>
                ))}
                <span className="flex-1 max-[480px]:hidden" />
                <span className="text-v3-accent tracking-[0.08em]">Read →</span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export function PostDetail({
  post,
  posts,
  profile,
}: {
  post: Post;
  posts: Post[];
  profile: Profile;
}) {
  const idx = posts.findIndex((p) => p.id === post.id);
  const prev = idx > 0 ? posts[idx - 1] : null;
  const next = idx < posts.length - 1 ? posts[idx + 1] : null;

  return (
    <article className="max-w-[720px] mx-auto pt-2">
      <div className="flex items-center gap-3 text-[10.5px] tracking-[0.12em] uppercase text-v3-text-mute mb-[22px]">
        {post.tags.map((t) => (
          <span key={t} className="text-v3-accent font-mono">#{t}</span>
        ))}
        <span className="ml-auto text-v3-text-dim tabular-nums">
          No. {String(posts.length - idx).padStart(2, "0")} / {String(posts.length).padStart(2, "0")}
        </span>
      </div>

      <p className="font-serif italic font-light text-[22px] leading-[1.5] tracking-[-0.005em] text-v3-text-2 mt-0 mb-7 text-pretty max-[720px]:text-[18px] max-[480px]:text-[16px]">
        {post.excerpt}
      </p>
      <div className="w-14 h-px bg-v3-accent opacity-55 mb-8" />

      <Markdown source={post.body} dropCap />

      <DetailFooter
        sign={
          <>
            <span className="text-v3-accent text-[13px] tracking-normal">✦</span>
            <span className="text-v3-text font-semibold">{profile.name}</span>
            <span className="text-v3-text-dim ml-auto tabular-nums">{post.date}</span>
          </>
        }
        prev={prev}
        next={next}
        hrefFor={(id) => `/writing/${id}`}
      />
    </article>
  );
}
