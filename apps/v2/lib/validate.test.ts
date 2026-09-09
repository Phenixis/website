import { describe, expect, it } from "vitest";
import { validateExperience, validatePost, validateProfile, validateProject, ValidationError } from "./validate";

describe("validateProject", () => {
  const base = {
    id: "cartograph",
    title: "Cartograph",
    year: "2025",
    kind: "App",
    status: "shipping",
    blurb: "A note-taking app.",
    body: ["Paragraph one."],
    stack: ["SwiftUI"],
    color: "#a78bfa",
  };

  it("accepts a well-formed project", () => {
    expect(validateProject(base)).toMatchObject({ id: "cartograph", title: "Cartograph" });
  });

  it("accepts optional fields when present", () => {
    const project = validateProject({
      ...base,
      role: "Solo",
      links: [{ label: "site", href: "https://example.com" }],
      published: false,
      category: "side",
    });
    expect(project.role).toBe("Solo");
    expect(project.links).toEqual([{ label: "site", href: "https://example.com" }]);
    expect(project.published).toBe(false);
    expect(project.category).toBe("side");
  });

  it("rejects a missing id", () => {
    const rest: Record<string, unknown> = { ...base };
    delete rest.id;
    expect(() => validateProject(rest)).toThrow(ValidationError);
  });

  it("rejects an invalid status", () => {
    expect(() => validateProject({ ...base, status: "on-fire" })).toThrow(ValidationError);
  });

  it("rejects a non-array stack", () => {
    expect(() => validateProject({ ...base, stack: "SwiftUI" })).toThrow(ValidationError);
  });

  it("rejects a stack with non-string entries", () => {
    expect(() => validateProject({ ...base, stack: [1, 2] })).toThrow(ValidationError);
  });

  it("rejects an invalid category", () => {
    expect(() => validateProject({ ...base, category: "bonus" })).toThrow(ValidationError);
  });

  it("rejects a malformed link", () => {
    expect(() => validateProject({ ...base, links: [{ label: "site" }] })).toThrow(ValidationError);
  });

  it("rejects a non-object body", () => {
    expect(() => validateProject("nope")).toThrow(ValidationError);
    expect(() => validateProject(null)).toThrow(ValidationError);
  });
});

describe("validatePost", () => {
  const base = {
    id: "slow-building",
    title: "On building slowly",
    date: "Apr 02, 2026",
    readTime: "8 min",
    tags: ["craft"],
    excerpt: "Three years in.",
    body: ["Paragraph one."],
  };

  it("accepts a well-formed post", () => {
    expect(validatePost(base)).toMatchObject({ id: "slow-building" });
  });

  it("rejects tags that aren't strings", () => {
    expect(() => validatePost({ ...base, tags: ["craft", 42] })).toThrow(ValidationError);
  });

  it("rejects a missing title", () => {
    const rest: Record<string, unknown> = { ...base };
    delete rest.title;
    expect(() => validatePost(rest)).toThrow(ValidationError);
  });
});

describe("validateExperience", () => {
  const base = {
    id: "indep-26",
    startDate: "2026-01",
    endDate: null,
    role: "Independent",
    where: "Saint-Brieuc",
    kind: "self",
    blurb: "Building full-time.",
    stack: [],
  };

  it("accepts a null endDate (ongoing)", () => {
    expect(validateExperience(base).endDate).toBeNull();
  });

  it("accepts a string endDate", () => {
    expect(validateExperience({ ...base, endDate: "2026-06" }).endDate).toBe("2026-06");
  });

  it("rejects an invalid kind", () => {
    expect(() => validateExperience({ ...base, kind: "hobby" })).toThrow(ValidationError);
  });

  it("accepts an optional parentId", () => {
    expect(validateExperience({ ...base, parentId: "school-2" }).parentId).toBe("school-2");
  });
});

describe("validateProfile", () => {
  it("accepts a well-formed profile", () => {
    expect(
      validateProfile({ name: "Max", handle: "@max", tagline: "Builder.", location: "Earth" }),
    ).toEqual({ name: "Max", handle: "@max", tagline: "Builder.", location: "Earth" });
  });

  it("rejects a missing name", () => {
    expect(() => validateProfile({ handle: "@max", tagline: "", location: "" })).toThrow(ValidationError);
  });
});
