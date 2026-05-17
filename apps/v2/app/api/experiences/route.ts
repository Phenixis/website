import { getExperiences, upsertExperience } from "@/lib/db";

export async function GET() {
  const experiences = await getExperiences();
  return Response.json(experiences);
}

export async function POST(req: Request) {
  const body = await req.json();
  await upsertExperience(body);
  return Response.json(body, { status: 201 });
}
