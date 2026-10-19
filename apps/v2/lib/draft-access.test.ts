import { beforeAll, describe, expect, it } from "vitest";
import { createDraftAccessToken, hashDraftPassword, verifyDraftAccessToken, verifyDraftPassword } from "./draft-access";
import { validateDraftPassword, ValidationError } from "./validate";

beforeAll(() => {
  process.env.ADMIN_SECRET = "test-secret";
});

describe("draft password hashing", () => {
  it("accepts the right password and rejects a wrong one", () => {
    const hash = hashDraftPassword("hunter2");
    expect(verifyDraftPassword("hunter2", hash)).toBe(true);
    expect(verifyDraftPassword("hunter3", hash)).toBe(false);
  });

  it("salts each hash and never stores the plaintext", () => {
    const a = hashDraftPassword("same");
    expect(a).not.toContain("same");
    expect(hashDraftPassword("same")).not.toBe(a);
  });

  it("rejects a malformed stored value", () => {
    expect(verifyDraftPassword("x", "garbage")).toBe(false);
  });
});

describe("draft access token", () => {
  it("is valid only for its slug and current password hash", async () => {
    const hash = hashDraftPassword("pw");
    const token = await createDraftAccessToken("my-post", hash);

    expect(await verifyDraftAccessToken(token, "my-post", hash)).toBe(true);
    expect(await verifyDraftAccessToken(token, "other-post", hash)).toBe(false);
    // Changing the password invalidates previously issued tokens.
    expect(await verifyDraftAccessToken(token, "my-post", hashDraftPassword("new"))).toBe(false);
    expect(await verifyDraftAccessToken(undefined, "my-post", hash)).toBe(false);
    expect(await verifyDraftAccessToken("not-a-jwt", "my-post", hash)).toBe(false);
  });
});

describe("validateDraftPassword", () => {
  it("leaves the password untouched when absent", () => {
    expect(validateDraftPassword({})).toBeUndefined();
  });

  it("treats null and empty string as removal", () => {
    expect(validateDraftPassword({ draftPassword: null })).toBeNull();
    expect(validateDraftPassword({ draftPassword: "" })).toBeNull();
  });

  it("passes a string through and rejects other types", () => {
    expect(validateDraftPassword({ draftPassword: "abc" })).toBe("abc");
    expect(() => validateDraftPassword({ draftPassword: 5 })).toThrow(ValidationError);
  });
});
