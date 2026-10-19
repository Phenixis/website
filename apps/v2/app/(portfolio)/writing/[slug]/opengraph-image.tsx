import { ImageResponse } from "next/og";
import { getPublishedPost } from "@/lib/db";

export const alt = "Maxime Duhamel — Writing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  const title = post?.title ?? "Writing";
  const meta = post ? [post.date, post.readTime].filter(Boolean).join(" · ") : "";
  const tags = post?.tags.slice(0, 4) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "#0a0a0d",
          color: "#ededf3",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: 56, height: 4, background: "#b794f6", marginBottom: 28 }} />
          <div
            style={{
              display: "flex",
              fontSize: title.length > 70 ? 52 : title.length > 40 ? 64 : 76,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          {meta ? (
            <div style={{ display: "flex", fontSize: 26, color: "#b8b8c4", marginTop: 24 }}>{meta}</div>
          ) : null}
          {tags.length ? (
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              {tags.map((t) => (
                <div
                  key={t}
                  style={{
                    display: "flex",
                    fontSize: 20,
                    color: "#b794f6",
                    border: "1px solid rgba(183,148,246,0.4)",
                    borderRadius: 6,
                    padding: "4px 12px",
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#b8b8c4" }}>Maxime Duhamel</div>
      </div>
    ),
    { ...size },
  );
}
