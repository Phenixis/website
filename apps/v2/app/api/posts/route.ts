import { getPosts, upsertPost } from "@/lib/db";
import { revalidatePortfolio } from "@/lib/revalidate";

export async function GET() {
  const posts = await getPosts();
  return Response.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();
  await upsertPost(body);
  revalidatePortfolio();
  return Response.json(body, { status: 201 });
}
