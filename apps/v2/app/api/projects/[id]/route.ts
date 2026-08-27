import { getProject, upsertProject, deleteProject } from "@/lib/db";
import { revalidatePortfolio } from "@/lib/revalidate";

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
  const body = await req.json();
  await upsertProject({ ...body, id });
  revalidatePortfolio();
  return Response.json({ ...body, id });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await deleteProject(id);
  revalidatePortfolio();
  return new Response(null, { status: 204 });
}
