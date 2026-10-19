import { cookies } from "next/headers";
import { getPostDraftPasswordHash, getProjectDraftPasswordHash } from "./db";
import { SESSION_COOKIE, verifySessionToken } from "./auth";
import { draftCookieName, draftKey, verifyDraftAccessToken, type DraftKind } from "./draft-access";

export function getDraftPasswordHash(kind: DraftKind, slug: string): Promise<string | null> {
  return kind === "post" ? getPostDraftPasswordHash(slug) : getProjectDraftPasswordHash(slug);
}

/** Whether this visitor may read the draft: a signed-in admin, or someone who entered the password. */
export async function hasDraftAccess(
  kind: DraftKind,
  slug: string,
  storedHash: string | null,
): Promise<boolean> {
  const jar = await cookies();
  if (await verifySessionToken(jar.get(SESSION_COOKIE)?.value)) return true;
  if (storedHash === null) return false;
  const key = draftKey(kind, slug);
  return verifyDraftAccessToken(jar.get(draftCookieName(key))?.value, key, storedHash);
}
