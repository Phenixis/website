import { getProject, upsertProject, deleteProject, setProjectDraftPasswordHash } from "@/lib/db";
import { hashDraftPassword } from "@/lib/draft-access";
import { revalidatePortfolio } from "@/lib/revalidate";
import { validateProject, validateDraftPassword, ValidationError } from "@/lib/validate";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return new Response("Not found", { status: 404 });
  return Response.json(project);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let project;
  let draftPassword;
  try {
    const body = await req.json();
    project = validateProject({ ...body, id });
    draftPassword = validateDraftPassword(body);
  } catch (err) {
    const message = err instanceof ValidationError ? err.message : "Invalid JSON body";
    return Response.json({ error: message }, { status: 400 });
  }

  try {
    await upsertProject(project);
    if (draftPassword !== undefined) {
      await setProjectDraftPasswordHash(project.id, draftPassword && hashDraftPassword(draftPassword));
    }
  } catch (err) {
    console.error("Failed to save project:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

  revalidatePortfolio();
  return Response.json(project);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await deleteProject(id);
  } catch (err) {
    console.error("Failed to delete project:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
  revalidatePortfolio();
  return new Response(null, { status: 204 });
}
