import { getExperience, upsertExperience, deleteExperience } from "@/lib/db";

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
  const body = await req.json();
  await upsertExperience({ ...body, id });
  return Response.json({ ...body, id });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await deleteExperience(id);
  return new Response(null, { status: 204 });
}
