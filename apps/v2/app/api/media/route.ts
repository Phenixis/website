import { del, list, type ListBlobResultBlob } from "@vercel/blob";
import { NextResponse } from "next/server";
import { mediaPath } from "@/lib/media";

export async function GET() {
  try {
    const blobs: ListBlobResultBlob[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ cursor });
      blobs.push(...page.blobs);
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);

    return NextResponse.json(
      blobs.map((b) => ({
        url: b.url,
        src: mediaPath(b.pathname),
        pathname: b.pathname,
        size: b.size,
        uploadedAt: b.uploadedAt,
      })),
    );
  } catch (err) {
    console.error("Failed to list blobs:", err);
    return NextResponse.json({ error: "Could not load media" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { url } = await req.json();
  if (typeof url !== "string" || url.length === 0) {
    return NextResponse.json({ error: '"url" must be a non-empty string' }, { status: 400 });
  }

  try {
    await del(url);
  } catch (err) {
    console.error("Failed to delete blob:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
