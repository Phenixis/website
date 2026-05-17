import { getPost, upsertPost, deletePost } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return new Response("Not found", { status: 404 });
  return Response.json(post);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  await upsertPost({ ...body, id });
  return Response.json({ ...body, id });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await deletePost(id);
  return new Response(null, { status: 204 });
}
