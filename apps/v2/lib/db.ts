import { createClient } from "@libsql/client";
import type { Project, Post, Experience } from "@/app/data";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default db;

/* ── Migrations ────────────────────────────────────────── */

const MIGRATIONS: Array<{ name: string; sql: string }> = [
  {
    name: "001_add_published_to_posts",
    sql: "ALTER TABLE posts ADD COLUMN published INTEGER DEFAULT 1",
  },
  {
    name: "002_create_profile_table",
    sql: `CREATE TABLE IF NOT EXISTS profile (
      id       INTEGER PRIMARY KEY DEFAULT 1,
      name     TEXT NOT NULL,
      handle   TEXT NOT NULL,
      tagline  TEXT NOT NULL,
      location TEXT NOT NULL
    )`,
  },
  {
    name: "003_add_published_to_projects",
    sql: "ALTER TABLE projects ADD COLUMN published INTEGER DEFAULT 1",
  },
  {
    name: "004_add_published_to_experiences",
    sql: "ALTER TABLE experiences ADD COLUMN published INTEGER DEFAULT 1",
  },
  {
    name: "005_add_parent_id_to_experiences",
    sql: "ALTER TABLE experiences ADD COLUMN parent_id TEXT",
  },
  {
    name: "006_add_start_date_to_experiences",
    sql: "ALTER TABLE experiences ADD COLUMN start_date TEXT",
  },
  {
    name: "007_add_end_date_to_experiences",
    sql: "ALTER TABLE experiences ADD COLUMN end_date TEXT",
  },
  {
    name: "008_drop_when_from_experiences",
    sql: 'ALTER TABLE experiences DROP COLUMN "when"',
  },
  {
    name: "009_add_category_to_projects",
    sql: "ALTER TABLE projects ADD COLUMN category TEXT DEFAULT 'main'",
  },
];

/** SQLite's wording for "this DDL is a no-op because the schema already has it". */
function isAlreadyAppliedError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return /duplicate column name|already exists/i.test(message);
}

/**
 * Intended to run once per deploy (see scripts/migrate.ts), not on every
 * server boot — so this assumes it's the only runner touching the
 * `migrations` table at a time and doesn't need to defend against
 * concurrent invocations.
 */
export async function runMigrations(): Promise<void> {
  await db.execute(
    `CREATE TABLE IF NOT EXISTS migrations (
      name       TEXT PRIMARY KEY,
      applied_at TEXT DEFAULT (datetime('now'))
    )`,
  );

  for (const m of MIGRATIONS) {
    const row = await db.execute({
      sql: "SELECT 1 FROM migrations WHERE name = ?",
      args: [m.name],
    });
    if (row.rows.length > 0) continue;

    const tx = await db.transaction("write");
    try {
      await tx.execute(m.sql);
      await tx.execute({ sql: "INSERT INTO migrations (name) VALUES (?)", args: [m.name] });
      await tx.commit();
      console.log(`[db] migration applied: ${m.name}`);
    } catch (err) {
      await tx.rollback();

      if (!isAlreadyAppliedError(err)) {
        throw new Error(`[db] migration ${m.name} failed: ${(err as Error).message}`, { cause: err });
      }

      // The DDL is a no-op (e.g. a column added by hand before the
      // migrations table existed) — record it as applied without retrying
      // the statement, but don't swallow anything else.
      await db.execute({ sql: "INSERT INTO migrations (name) VALUES (?)", args: [m.name] });
      console.warn(`[db] migration ${m.name} already applied at schema level, marking as done`);
    }
  }
}

/* ── Row mappers ───────────────────────────────────────── */

function rowToProject(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    title: row.title as string,
    year: row.year as string,
    kind: row.kind as string,
    status: row.status as Project["status"],
    blurb: row.blurb as string,
    body: JSON.parse(row.body as string),
    stack: JSON.parse(row.stack as string),
    color: row.color as string,
    published: row.published == null ? true : Boolean(row.published),
    category: (row.category as Project["category"]) ?? "main",
    ...(row.role != null ? { role: row.role as string } : {}),
    ...(row.links != null ? { links: JSON.parse(row.links as string) } : {}),
  };
}

function rowToPost(row: Record<string, unknown>): Post {
  return {
    id: row.id as string,
    title: row.title as string,
    date: row.date as string,
    readTime: row.read_time as string,
    tags: JSON.parse(row.tags as string),
    excerpt: row.excerpt as string,
    body: JSON.parse(row.body as string),
    published: row.published == null ? true : Boolean(row.published),
  };
}

function rowToExperience(row: Record<string, unknown>): Experience {
  return {
    id: row.id as string,
    startDate: row.start_date as string,
    endDate: row.end_date == null ? null : (row.end_date as string),
    role: row.role as string,
    where: row.where as string,
    kind: row.kind as Experience["kind"],
    blurb: row.blurb as string,
    stack: JSON.parse(row.stack as string),
    published: row.published == null ? true : Boolean(row.published),
    ...(row.parent_id != null ? { parentId: row.parent_id as string } : {}),
  };
}

/* ── Projects ──────────────────────────────────────────── */

export async function getProjects(): Promise<Project[]> {
  const r = await db.execute("SELECT * FROM projects ORDER BY sort_order ASC, rowid ASC");
  return r.rows.map((row) => rowToProject(row as unknown as Record<string, unknown>));
}

export async function getPublishedProjects(): Promise<Project[]> {
  const r = await db.execute(
    "SELECT * FROM projects WHERE (published IS NULL OR published != 0) AND status != 'archived' ORDER BY sort_order ASC, rowid ASC",
  );
  return r.rows.map((row) => rowToProject(row as unknown as Record<string, unknown>));
}

export async function getProject(id: string): Promise<Project | null> {
  const r = await db.execute({ sql: "SELECT * FROM projects WHERE id = ?", args: [id] });
  if (!r.rows.length) return null;
  return rowToProject(r.rows[0] as unknown as Record<string, unknown>);
}

export async function getPublishedProject(id: string): Promise<Project | null> {
  const r = await db.execute({
    sql: "SELECT * FROM projects WHERE id = ? AND (published IS NULL OR published != 0) AND status != 'archived'",
    args: [id],
  });
  if (!r.rows.length) return null;
  return rowToProject(r.rows[0] as unknown as Record<string, unknown>);
}

export async function upsertProject(p: Project): Promise<void> {
  const published = p.published === false ? 0 : 1;
  await db.execute({
    sql: `INSERT INTO projects (id, title, year, kind, status, blurb, body, stack, color, role, links, published, category)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            title=excluded.title, year=excluded.year, kind=excluded.kind,
            status=excluded.status, blurb=excluded.blurb, body=excluded.body,
            stack=excluded.stack, color=excluded.color, role=excluded.role, links=excluded.links,
            published=excluded.published, category=excluded.category`,
    args: [
      p.id, p.title, p.year, p.kind, p.status, p.blurb,
      JSON.stringify(p.body), JSON.stringify(p.stack), p.color,
      p.role ?? null,
      p.links?.length ? JSON.stringify(p.links) : null,
      published,
      p.category ?? "main",
    ],
  });
}

export async function deleteProject(id: string): Promise<void> {
  await db.execute({ sql: "DELETE FROM projects WHERE id = ?", args: [id] });
}

/* ── Posts ─────────────────────────────────────────────── */

export async function getPosts(): Promise<Post[]> {
  const r = await db.execute("SELECT * FROM posts ORDER BY sort_order ASC, rowid ASC");
  return r.rows.map((row) => rowToPost(row as unknown as Record<string, unknown>));
}

export async function getPublishedPosts(): Promise<Post[]> {
  const r = await db.execute(
    "SELECT * FROM posts WHERE published IS NULL OR published != 0 ORDER BY sort_order ASC, rowid ASC",
  );
  return r.rows.map((row) => rowToPost(row as unknown as Record<string, unknown>));
}

export async function getPost(id: string): Promise<Post | null> {
  const r = await db.execute({ sql: "SELECT * FROM posts WHERE id = ?", args: [id] });
  if (!r.rows.length) return null;
  return rowToPost(r.rows[0] as unknown as Record<string, unknown>);
}

export async function getPublishedPost(id: string): Promise<Post | null> {
  const r = await db.execute({
    sql: "SELECT * FROM posts WHERE id = ? AND (published IS NULL OR published != 0)",
    args: [id],
  });
  if (!r.rows.length) return null;
  return rowToPost(r.rows[0] as unknown as Record<string, unknown>);
}

export async function upsertPost(p: Post): Promise<void> {
  const published = p.published === false ? 0 : 1;
  await db.execute({
    sql: `INSERT INTO posts (id, title, date, read_time, tags, excerpt, body, published)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            title=excluded.title, date=excluded.date, read_time=excluded.read_time,
            tags=excluded.tags, excerpt=excluded.excerpt, body=excluded.body,
            published=excluded.published`,
    args: [p.id, p.title, p.date, p.readTime, JSON.stringify(p.tags), p.excerpt, JSON.stringify(p.body), published],
  });
}

export async function deletePost(id: string): Promise<void> {
  await db.execute({ sql: "DELETE FROM posts WHERE id = ?", args: [id] });
}

/* ── Experiences ───────────────────────────────────────── */

export async function getExperiences(): Promise<Experience[]> {
  const r = await db.execute("SELECT * FROM experiences ORDER BY sort_order ASC, rowid ASC");
  return r.rows.map((row) => rowToExperience(row as unknown as Record<string, unknown>));
}

export async function getPublishedExperiences(): Promise<Experience[]> {
  const r = await db.execute(
    "SELECT * FROM experiences WHERE (published IS NULL OR published != 0) ORDER BY sort_order ASC, rowid ASC",
  );
  return r.rows.map((row) => rowToExperience(row as unknown as Record<string, unknown>));
}

export async function getExperience(id: string): Promise<Experience | null> {
  const r = await db.execute({ sql: "SELECT * FROM experiences WHERE id = ?", args: [id] });
  if (!r.rows.length) return null;
  return rowToExperience(r.rows[0] as unknown as Record<string, unknown>);
}

export async function upsertExperience(e: Experience): Promise<void> {
  const published = e.published === false ? 0 : 1;
  await db.execute({
    sql: `INSERT INTO experiences (id, start_date, end_date, role, "where", kind, blurb, stack, published, parent_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            start_date=excluded.start_date, end_date=excluded.end_date, role=excluded.role, "where"=excluded."where",
            kind=excluded.kind, blurb=excluded.blurb, stack=excluded.stack,
            published=excluded.published, parent_id=excluded.parent_id`,
    args: [e.id, e.startDate, e.endDate, e.role, e.where, e.kind, e.blurb, JSON.stringify(e.stack), published, e.parentId ?? null],
  });
}

export async function deleteExperience(id: string): Promise<void> {
  await db.execute({ sql: "DELETE FROM experiences WHERE id = ?", args: [id] });
}

/* ── Profile / Settings ────────────────────────────────── */

export type SettingsProfile = {
  name: string;
  handle: string;
  tagline: string;
  location: string;
};

export async function getProfile(): Promise<SettingsProfile | null> {
  const r = await db.execute("SELECT * FROM profile LIMIT 1");
  if (!r.rows.length) return null;
  const row = r.rows[0] as unknown as Record<string, unknown>;
  return {
    name: row.name as string,
    handle: row.handle as string,
    tagline: row.tagline as string,
    location: row.location as string,
  };
}

export async function upsertProfile(p: SettingsProfile): Promise<void> {
  await db.execute({
    sql: `INSERT INTO profile (id, name, handle, tagline, location)
          VALUES (1, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            name=excluded.name, handle=excluded.handle,
            tagline=excluded.tagline, location=excluded.location`,
    args: [p.name, p.handle, p.tagline, p.location],
  });
}
