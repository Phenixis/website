import { getProfile, upsertProfile } from "@/lib/db";
import { PROFILE } from "@/app/data";

export async function GET() {
  const profile = await getProfile();
  return Response.json(profile ?? PROFILE);
}

export async function PUT(req: Request) {
  const body = await req.json();
  await upsertProfile(body);
  return Response.json(body);
}
