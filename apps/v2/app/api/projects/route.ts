import { getProjects, upsertProject } from "@/lib/db";
import { revalidatePortfolio } from "@/lib/revalidate";
import { validateProject, ValidationError } from "@/lib/validate";

export async function GET() {
  const projects = await getProjects();
  return Response.json(projects);
}

export async function POST(req: Request) {
  let project;
  try {
    project = validateProject(await req.json());
  } catch (err) {
    const message = err instanceof ValidationError ? err.message : "Invalid JSON body";
    return Response.json({ error: message }, { status: 400 });
  }

  try {
    await upsertProject(project);
  } catch (err) {
    console.error("Failed to save project:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

  revalidatePortfolio();
  return Response.json(project, { status: 201 });
}
