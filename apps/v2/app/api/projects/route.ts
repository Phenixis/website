import { getProjects, upsertProject } from "@/lib/db";
import { revalidatePortfolio } from "@/lib/revalidate";

export async function GET() {
  const projects = await getProjects();
  return Response.json(projects);
}

export async function POST(req: Request) {
  const body = await req.json();
  await upsertProject(body);
  revalidatePortfolio();
  return Response.json(body, { status: 201 });
}
