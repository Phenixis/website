import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { getSecretKey } from "./auth";

export const DRAFT_ACCESS_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type DraftKind = "post" | "project";

/** Namespaces a slug by content type, since a post and a project can share an id. */
export function draftKey(kind: DraftKind, slug: string): string {
  return `${kind}:${slug}`;
}

export function draftCookieName(key: string): string {
  return `draft-access-${encodeURIComponent(key)}`;
}

/** "salt:hash" (hex), so the stored value is useless without the password. */
export function hashDraftPassword(password: string): string {
  const salt = randomBytes(16);
  return `${salt.toString("hex")}:${scryptSync(password, salt, 32).toString("hex")}`;
}

export function verifyDraftPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return timingSafeEqual(actual, expected);
}

// The token is bound to the stored hash, so changing a draft's password
// immediately invalidates every unlock cookie issued under the old one.
const fingerprint = (storedHash: string) => storedHash.slice(-16);

export async function createDraftAccessToken(slug: string, storedHash: string): Promise<string> {
  return new SignJWT({ draft: slug, v: fingerprint(storedHash) })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DRAFT_ACCESS_MAX_AGE}s`)
    .sign(getSecretKey());
}

export async function verifyDraftAccessToken(
  token: string | undefined,
  slug: string,
  storedHash: string,
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.draft === slug && payload.v === fingerprint(storedHash);
  } catch {
    return false;
  }
}
