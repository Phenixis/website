import { getPost, upsertPost, deletePost, setPostDraftPasswordHash } from "@/lib/db";
import { hashDraftPassword } from "@/lib/draft-access";
import { revalidatePortfolio } from "@/lib/revalidate";
import { validatePost, validateDraftPassword, ValidationError } from "@/lib/validate";

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

  let post;
  let draftPassword;
  try {
    const body = await req.json();
    post = validatePost({ ...body, id });
    draftPassword = validateDraftPassword(body);
  } catch (err) {
    const message = err instanceof ValidationError ? err.message : "Invalid JSON body";
    return Response.json({ error: message }, { status: 400 });
  }

  try {
    await upsertPost(post);
    if (draftPassword !== undefined) {
      await setPostDraftPasswordHash(post.id, draftPassword && hashDraftPassword(draftPassword));
    }
  } catch (err) {
    console.error("Failed to save post:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

  revalidatePortfolio();
  return Response.json(post);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await deletePost(id);
  } catch (err) {
    console.error("Failed to delete post:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
  revalidatePortfolio();
  return new Response(null, { status: 204 });
}
