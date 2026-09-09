import { getExperience, upsertExperience, deleteExperience } from "@/lib/db";
import { revalidatePortfolio } from "@/lib/revalidate";
import { validateExperience, ValidationError } from "@/lib/validate";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const exp = await getExperience(id);
  if (!exp) return new Response("Not found", { status: 404 });
  return Response.json(exp);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let experience;
  try {
    experience = validateExperience({ ...(await req.json()), id });
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
  return Response.json(experience);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await deleteExperience(id);
  } catch (err) {
    console.error("Failed to delete experience:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
  revalidatePortfolio();
  return new Response(null, { status: 204 });
}
