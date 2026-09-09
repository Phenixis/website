import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { redis } from "@/lib/redis";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 15 * 60;

async function getClientIp(): Promise<string> {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  return xff?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
}

export async function POST(req: Request) {
  const ip = await getClientIp();
  const attemptsKey = `login-attempts:${ip}`;

  // Redis is optional infra elsewhere in this app (view counts degrade to
  // no-ops without it); do the same here rather than hard-failing login.
  if (redis) {
    const attempts = (await redis.get<number>(attemptsKey)) ?? 0;
    if (attempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429 },
      );
    }
  }

  const { password } = await req.json();
  const secret = process.env.ADMIN_SECRET;

  if (!secret || password !== secret) {
    if (redis) {
      const attempts = await redis.incr(attemptsKey);
      if (attempts === 1) await redis.expire(attemptsKey, LOCKOUT_SECONDS);
    }
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  if (redis) await redis.del(attemptsKey);

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
