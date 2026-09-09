import { getExperiences, upsertExperience } from "@/lib/db";
import { revalidatePortfolio } from "@/lib/revalidate";
import { validateExperience, ValidationError } from "@/lib/validate";

export async function GET() {
  const experiences = await getExperiences();
  return Response.json(experiences);
}

export async function POST(req: Request) {
  let experience;
  try {
    experience = validateExperience(await req.json());
  } catch (err) {
    const message = err instanceof ValidationError ? err.message : "Invalid JSON body";
    return Response.json({ error: message }, { status: 400 });
  }

  try {
    await upsertExperience(experience);
  } catch (err) {
    console.error("Failed to save experience:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

  revalidatePortfolio();
  return Response.json(experience, { status: 201 });
}
