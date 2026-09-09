import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "./lib/auth";

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  return verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin UI pages
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    if (!(await isAuthenticated(req))) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // Protect the admin-only content API — nothing under these paths is
  // consumed by the public site, so every method requires a session.
  const isProtectedApi =
    pathname.startsWith("/api/projects") ||
    pathname.startsWith("/api/posts") ||
    pathname.startsWith("/api/experiences") ||
    pathname.startsWith("/api/settings") ||
    pathname.startsWith("/api/media");

  if (isProtectedApi && !(await isAuthenticated(req))) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin(.*)", "/api/(projects|posts|experiences|settings|media)(.*)"],
};
