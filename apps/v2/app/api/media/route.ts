import { del, list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
  const { blobs } = await list();
  return NextResponse.json(blobs);
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
