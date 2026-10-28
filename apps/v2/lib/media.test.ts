import { describe, expect, it } from "vitest";
import { mediaPath } from "./media";

describe("mediaPath", () => {
  it("maps a blob pathname to the public media route", () => {
    expect(mediaPath("photo-a1B2c3.png")).toBe("/media/photo-a1B2c3.png");
  });

  it("keeps folders and encodes each segment", () => {
    expect(mediaPath("posts/my photo#1.jpg")).toBe("/media/posts/my%20photo%231.jpg");
  });
});
