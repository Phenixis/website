import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "admin-session";

function isAuthenticated(req: NextRequest): boolean {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.ADMIN_SECRET;
  return !!secret && token === secret;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin UI pages
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    if (!isAuthenticated(req)) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // Protect mutating API calls
  const isMutation = ["POST", "PUT", "DELETE", "PATCH"].includes(req.method);
  const isProtectedApi =
    pathname.startsWith("/api/projects") ||
    pathname.startsWith("/api/posts") ||
    pathname.startsWith("/api/experiences") ||
    pathname.startsWith("/api/settings");

  if (isMutation && isProtectedApi) {
    if (!isAuthenticated(req)) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin(.*)", "/api/(projects|posts|experiences|settings)(.*)"],
};
