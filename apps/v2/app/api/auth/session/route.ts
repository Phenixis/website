import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

// Lets the statically rendered public pages ask whether the visitor is the
// admin (the session cookie is httpOnly, so client code can't read it).
export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const authenticated = await verifySessionToken(token);
  return NextResponse.json({ authenticated }, { headers: { "Cache-Control": "private, no-store" } });
}
