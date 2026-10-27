import { getProjects, upsertProject, setProjectDraftPasswordHash } from "@/lib/db";
import { hashDraftPassword } from "@/lib/draft-access";
import { revalidatePortfolio } from "@/lib/revalidate";
import { validateProject, validateDraftPassword, ValidationError } from "@/lib/validate";

export async function GET() {
  const projects = await getProjects();
  return Response.json(projects);
}

export async function POST(req: Request) {
  let project;
  let draftPassword;
  try {
    const body = await req.json();
    project = validateProject(body);
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
  return Response.json(project, { status: 201 });
}
