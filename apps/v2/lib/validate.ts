import type { Experience, Post, Profile, Project } from "@/app/data";

export class ValidationError extends Error {}

function str(v: unknown, field: string): string {
  if (typeof v !== "string" || v.length === 0) {
    throw new ValidationError(`"${field}" must be a non-empty string`);
  }
  return v;
}

function strAllowEmpty(v: unknown, field: string): string {
  if (typeof v !== "string") throw new ValidationError(`"${field}" must be a string`);
  return v;
}

function strOrNull(v: unknown, field: string): string | null {
  if (v === null) return null;
  return str(v, field);
}

function strArray(v: unknown, field: string): string[] {
  if (!Array.isArray(v) || !v.every((x) => typeof x === "string")) {
    throw new ValidationError(`"${field}" must be an array of strings`);
  }
  return v;
}

function bool(v: unknown, field: string): boolean {
  if (typeof v !== "boolean") throw new ValidationError(`"${field}" must be a boolean`);
  return v;
}

function oneOf<T extends string>(v: unknown, options: readonly T[], field: string): T {
  if (typeof v !== "string" || !options.includes(v as T)) {
    throw new ValidationError(`"${field}" must be one of: ${options.join(", ")}`);
  }
  return v as T;
}

function links(v: unknown): { label: string; href: string }[] {
  if (!Array.isArray(v)) throw new ValidationError('"links" must be an array');
  return v.map((l, i) => {
    if (typeof l !== "object" || l === null) {
      throw new ValidationError(`links[${i}] must be an object`);
    }
    const o = l as Record<string, unknown>;
    return { label: str(o.label, `links[${i}].label`), href: str(o.href, `links[${i}].href`) };
  });
}

function record(body: unknown): Record<string, unknown> {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Request body must be an object");
  }
  return body as Record<string, unknown>;
}

export function validateProject(body: unknown): Project {
  const b = record(body);
  return {
    id: str(b.id, "id"),
    title: str(b.title, "title"),
    year: str(b.year, "year"),
    kind: str(b.kind, "kind"),
    status: oneOf(b.status, ["shipping", "paused", "archived"] as const, "status"),
    blurb: strAllowEmpty(b.blurb, "blurb"),
    body: strArray(b.body, "body"),
    stack: strArray(b.stack, "stack"),
    color: str(b.color, "color"),
    ...(b.role != null ? { role: str(b.role, "role") } : {}),
    ...(b.links != null ? { links: links(b.links) } : {}),
    ...(b.published != null ? { published: bool(b.published, "published") } : {}),
    ...(b.category != null ? { category: oneOf(b.category, ["main", "side"] as const, "category") } : {}),
  };
}

export function validatePost(body: unknown): Post {
  const b = record(body);
  return {
    id: str(b.id, "id"),
    title: str(b.title, "title"),
    date: str(b.date, "date"),
    readTime: strAllowEmpty(b.readTime, "readTime"),
    tags: strArray(b.tags, "tags"),
    excerpt: strAllowEmpty(b.excerpt, "excerpt"),
    body: strArray(b.body, "body"),
    ...(b.published != null ? { published: bool(b.published, "published") } : {}),
  };
}

export function validateExperience(body: unknown): Experience {
  const b = record(body);
  return {
    id: str(b.id, "id"),
    startDate: str(b.startDate, "startDate"),
    endDate: strOrNull(b.endDate, "endDate"),
    role: str(b.role, "role"),
    where: str(b.where, "where"),
    kind: oneOf(b.kind, ["self", "role", "edu"] as const, "kind"),
    blurb: strAllowEmpty(b.blurb, "blurb"),
    stack: strArray(b.stack, "stack"),
    ...(b.published != null ? { published: bool(b.published, "published") } : {}),
    ...(b.parentId != null ? { parentId: str(b.parentId, "parentId") } : {}),
  };
}

export function validateProfile(body: unknown): Profile {
  const b = record(body);
  return {
    name: str(b.name, "name"),
    handle: str(b.handle, "handle"),
    tagline: strAllowEmpty(b.tagline, "tagline"),
    location: strAllowEmpty(b.location, "location"),
    ...(b.github != null ? { github: str(b.github, "github") } : {}),
    ...(b.linkedin != null ? { linkedin: str(b.linkedin, "linkedin") } : {}),
  };
}
