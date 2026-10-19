import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PROFILE } from "@/app/data";
import { PostDetail } from "@/app/(portfolio)/writing/WritingPane";
import { getPost, getProfile } from "@/lib/db";
import { getDraftPasswordHash, hasDraftAccess } from "@/lib/draft-gate";
import { DraftGate } from "../DraftGate";

// Per-visitor (cookie-dependent) and must never be cached or indexed.
export const dynamic = "force-dynamic";

// Static on purpose: the draft's title must not leak before the password is entered.
export const metadata: Metadata = {
  title: "Private draft — Maxime Duhamel",
  robots: { index: false, follow: false },
};

export default async function DraftPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await getPost(slug);
  if (!post) notFound();
  // Once published, an old draft link just lands on the real post.
  if (post.published !== false) redirect(`/writing/${encodeURIComponent(slug)}`);

  const storedHash = await getDraftPasswordHash("post", slug);

  let content: React.ReactNode;
  if (await hasDraftAccess("post", slug, storedHash)) {
    const profile = (await getProfile()) ?? PROFILE;
    content = (
      <div className="w-full">
        <div className="max-w-[720px] mx-auto mb-8 flex items-center gap-3 text-[10.5px] tracking-[0.18em] uppercase text-v3-text-mute">
          <span className="text-v3-accent">Draft</span>
          <span>· not published</span>
        </div>
        <h1 className="max-w-[720px] mx-auto font-serif font-normal text-[40px] tracking-[-0.015em] leading-[1.1] text-v3-text text-pretty m-0 mb-8 max-[720px]:text-[30px]">
          {post.title}
        </h1>
        <PostDetail post={post} posts={[post]} profile={profile} />
      </div>
    );
  } else if (storedHash === null) {
    // No password set means no public link: indistinguishable from a missing post.
    notFound();
  } else {
    content = <DraftGate kind="post" slug={slug} />;
  }

  return (
    <main className="min-h-screen bg-v3-bg text-v3-text font-mono text-[12.5px] leading-[1.55] px-6 py-14 flex justify-center items-start max-[480px]:px-4">
      {content}
    </main>
  );
}
