"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  DRAFT_ACCESS_MAX_AGE,
  createDraftAccessToken,
  draftCookieName,
  draftKey,
  verifyDraftPassword,
  type DraftKind,
} from "@/lib/draft-access";
import { getDraftPasswordHash } from "@/lib/draft-gate";
import { redis } from "@/lib/redis";

export type UnlockState = { error: string | null };

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 15 * 60;

export async function unlockDraft(
  kind: DraftKind,
  slug: string,
  _prev: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const key = draftKey(kind, slug);
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  const attemptsKey = `draft-attempts:${ip}:${key}`;

  // Like the admin login, rate limiting is skipped when Redis isn't configured.
  if (redis && ((await redis.get<number>(attemptsKey)) ?? 0) >= MAX_ATTEMPTS) {
    return { error: "Too many attempts. Try again later." };
  }

  const password = formData.get("password");
  const storedHash = await getDraftPasswordHash(kind, slug);

  if (typeof password !== "string" || !storedHash || !verifyDraftPassword(password, storedHash)) {
    if (redis) {
      const attempts = await redis.incr(attemptsKey);
      if (attempts === 1) await redis.expire(attemptsKey, LOCKOUT_SECONDS);
    }
    return { error: "Wrong password." };
  }

  if (redis) await redis.del(attemptsKey);

  (await cookies()).set(draftCookieName(key), await createDraftAccessToken(key, storedHash), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/drafts",
    maxAge: DRAFT_ACCESS_MAX_AGE,
  });
  redirect(`/drafts/${kind === "project" ? "projects/" : ""}${encodeURIComponent(slug)}`);
}
