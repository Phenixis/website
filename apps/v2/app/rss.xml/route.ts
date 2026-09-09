import { getPublishedPosts } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPublishedPosts();

  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/writing/${p.id}</link>
      <guid>${SITE_URL}/writing/${p.id}</guid>
      <description>${escapeXml(p.excerpt)}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Maxime Duhamel's writing</title>
    <link>${SITE_URL}</link>
    <description>Essays and notes from Maxime Duhamel.</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
