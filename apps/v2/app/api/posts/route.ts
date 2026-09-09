import { getPosts, upsertPost } from "@/lib/db";
import { revalidatePortfolio } from "@/lib/revalidate";
import { validatePost, ValidationError } from "@/lib/validate";

export async function GET() {
  const posts = await getPosts();
  return Response.json(posts);
}

export async function POST(req: Request) {
  let post;
  try {
    post = validatePost(await req.json());
  } catch (err) {
    const message = err instanceof ValidationError ? err.message : "Invalid JSON body";
    return Response.json({ error: message }, { status: 400 });
  }

  try {
    await upsertPost(post);
  } catch (err) {
    console.error("Failed to save post:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

  revalidatePortfolio();
  return Response.json(post, { status: 201 });
}
