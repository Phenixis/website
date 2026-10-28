import { get } from "@vercel/blob";

// Uploads get a random suffix, so a pathname never changes content.
const CACHE_CONTROL = "public, max-age=31536000, immutable";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathname = path.join("/");

  let result;
  try {
    result = await get(pathname, {
      access: "private",
      ifNoneMatch: req.headers.get("if-none-match") ?? undefined,
    });
  } catch (err) {
    console.error("Failed to read blob:", err);
    return new Response("Internal server error", { status: 500 });
  }
  if (!result) return new Response("Not found", { status: 404 });

  const headers = new Headers({
    "Cache-Control": CACHE_CONTROL,
    ETag: result.blob.etag,
    "X-Content-Type-Options": "nosniff",
    // Served from the site's own origin: keep an uploaded SVG from running scripts.
    "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
  });
  if (result.statusCode === 304) return new Response(null, { status: 304, headers });

  headers.set("Content-Type", result.blob.contentType);
  headers.set("Content-Length", String(result.blob.size));
  return new Response(result.stream, { headers });
}
