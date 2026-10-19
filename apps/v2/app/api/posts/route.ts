import { getPosts, upsertPost, setPostDraftPasswordHash } from "@/lib/db";
import { hashDraftPassword } from "@/lib/draft-access";
import { revalidatePortfolio } from "@/lib/revalidate";
import { validatePost, validateDraftPassword, ValidationError } from "@/lib/validate";

export async function GET() {
  const posts = await getPosts();
  return Response.json(posts);
}

export async function POST(req: Request) {
  let post;
  let draftPassword;
  try {
    const body = await req.json();
    post = validatePost(body);
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
  return Response.json(post, { status: 201 });
}
