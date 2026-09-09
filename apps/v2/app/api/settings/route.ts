import { getProfile, upsertProfile } from "@/lib/db";
import { PROFILE } from "@/app/data";
import { revalidatePortfolio } from "@/lib/revalidate";
import { validateProfile, ValidationError } from "@/lib/validate";

export async function GET() {
  const profile = await getProfile();
  return Response.json(profile ?? PROFILE);
}

export async function PUT(req: Request) {
  let profile;
  try {
    profile = validateProfile(await req.json());
  } catch (err) {
    const message = err instanceof ValidationError ? err.message : "Invalid JSON body";
    return Response.json({ error: message }, { status: 400 });
  }

  try {
    await upsertProfile(profile);
  } catch (err) {
    console.error("Failed to save profile:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

  revalidatePortfolio();
  return Response.json(profile);
}
