import React from "react";
import type { Post, Profile } from "../../data";
import { DetailFooter } from "../../_components/portfolio/DetailFooter";

export function BlogList({ posts, onSelect }: { posts: Post[]; onSelect: (id: string) => void }) {
  return (
    <ol className="list-none p-0 mx-auto max-w-[760px] flex flex-col max-[920px]:max-w-full">
      {posts.map((p, i) => (
        <li
          key={p.id}
          className="grid grid-cols-[120px_1fr] gap-9 py-[30px] border-t border-v3-border last:border-b cursor-pointer relative transition-[padding-left] duration-[280ms] ease-v3-fade hover:pl-[18px] before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-v3-accent before:origin-top before:scale-y-0 before:transition-transform before:duration-[280ms] before:ease-v3-fade hover:before:scale-y-100 max-[720px]:grid-cols-[72px_1fr] max-[720px]:gap-[18px] max-[720px]:py-[22px] max-[480px]:grid-cols-[56px_1fr] max-[480px]:gap-3 max-[480px]:py-[18px]"
          onClick={() => onSelect(p.id)}
        >
          <div className="flex flex-col gap-[6px] pt-1">
            <div className="font-serif italic text-[32px] text-v3-accent leading-none font-light tabular-nums max-[720px]:text-[26px] max-[480px]:text-[22px]">
              {String(i + 1).padStart(2, "0")}
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
        </li>
      ))}
    </ol>
  );
}

export function PostDetail({
  post,
  posts,
  profile,
  onSelect,
}: {
  post: Post;
  posts: Post[];
  profile: Profile;
  onSelect: (id: string | null) => void;
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
          No. {String(idx + 1).padStart(2, "0")} / {String(posts.length).padStart(2, "0")}
        </span>
      </div>

      <p className="font-serif italic font-light text-[22px] leading-[1.5] tracking-[-0.005em] text-v3-text-2 mt-0 mb-7 text-pretty max-[720px]:text-[18px] max-[480px]:text-[16px]">
        {post.excerpt}
      </p>
      <div className="w-14 h-px bg-v3-accent opacity-55 mb-8" />

      <div className="flex flex-col gap-[22px] max-[720px]:gap-[18px]">
        {post.body.map((para, i) => (
          <p key={i} className="font-mono text-[13.5px] leading-[1.85] text-v3-text m-0 text-pretty max-[480px]:text-[12.5px] max-[480px]:leading-[1.75]">
            {i === 0 && (
              <span className="font-serif italic font-light text-[56px] leading-[0.85] float-left mr-2 -mb-[2px] mt-[6px] text-v3-accent max-[720px]:text-[44px] max-[480px]:text-[36px] max-[480px]:mr-[6px] max-[480px]:mt-1">
                {para.charAt(0)}
              </span>
            )}
            {i === 0 ? para.slice(1) : para}
          </p>
        ))}
      </div>

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
        onSelect={onSelect}
      />
    </article>
  );
}
