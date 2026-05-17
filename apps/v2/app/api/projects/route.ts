import { getProjects, upsertProject } from "@/lib/db";

export async function GET() {
  const projects = await getProjects();
  return Response.json(projects);
}

export async function POST(req: Request) {
  const body = await req.json();
  await upsertProject(body);
  return Response.json(body, { status: 201 });
}
