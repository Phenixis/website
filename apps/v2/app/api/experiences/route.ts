import { getExperiences, upsertExperience } from "@/lib/db";
import { revalidatePortfolio } from "@/lib/revalidate";

export async function GET() {
  const experiences = await getExperiences();
  return Response.json(experiences);
}

export async function POST(req: Request) {
  const body = await req.json();
  await upsertExperience(body);
  revalidatePortfolio();
  return Response.json(body, { status: 201 });
}
