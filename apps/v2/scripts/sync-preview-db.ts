// Overwrites the preview database with an exact copy of the main (production)
// one: every table's schema and rows, including the `migrations` table, so
// preview builds start from production's state and only apply the migrations
// of the branch being previewed. Runs after each production deploy (see
// .github/workflows/v2-sync-preview-db.yml), or manually:
//   pnpm sync-preview-db
//
// Source (read only): TURSO_MAIN_DATABASE_URL / TURSO_MAIN_AUTH_TOKEN
// Target (replaced):  TURSO_DATABASE_URL / TURSO_AUTH_TOKEN
import { config } from "dotenv";
import path from "path";
import { createClient, type InStatement, type Client } from "@libsql/client";

// Same env loading as scripts/migrate.ts: root .env.local, then this app's.
config({ path: path.resolve(__dirname, "../../../.env.local"), override: false, quiet: true });
config({ path: path.resolve(__dirname, "../.env.local"), override: false, quiet: true });

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const quote = (identifier: string) => `"${identifier.replace(/"/g, '""')}"`;

/** Hostname for remote URLs, the full URL otherwise (file:, :memory:). */
function dbIdentity(url: string): string {
  try {
    const host = new URL(url).host;
    return host || url;
  } catch {
    return url;
  }
}

// Internal objects SQLite / libSQL manage themselves.
const INTERNAL = /^(sqlite_|libsql_|_litestream)/;

type SchemaObject = { type: string; name: string; sql: string };

async function userObjects(db: Client): Promise<SchemaObject[]> {
  const r = await db.execute("SELECT type, name, sql FROM sqlite_master WHERE sql IS NOT NULL");
  return r.rows
    .map((row) => ({ type: String(row.type), name: String(row.name), sql: String(row.sql) }))
    .filter((o) => !INTERNAL.test(o.name));
}

async function rowCounts(db: Client, tables: string[]): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const t of tables) {
    const r = await db.execute(`SELECT COUNT(*) AS n FROM ${quote(t)}`);
    counts[t] = Number(r.rows[0].n);
  }
  return counts;
}

async function main() {
  const sourceUrl = env("TURSO_MAIN_DATABASE_URL");
  const targetUrl = env("TURSO_DATABASE_URL");
  const source = dbIdentity(sourceUrl);
  const target = dbIdentity(targetUrl);
  if (source === target) {
    throw new Error(`Refusing to sync: source and target are the same database (${source}).`);
  }

  // intMode "bigint" so integers round-trip exactly.
  const mainDb = createClient({ url: sourceUrl, authToken: process.env.TURSO_MAIN_AUTH_TOKEN, intMode: "bigint" });
  const previewDb = createClient({ url: targetUrl, authToken: process.env.TURSO_AUTH_TOKEN, intMode: "bigint" });

  try {
    const objects = await userObjects(mainDb);
    const tables = objects.filter((o) => o.type === "table");
    const others = objects.filter((o) => o.type !== "table"); // indexes, views, triggers

    const statements: InStatement[] = [];

    // Drop everything user-defined in the target. Views first (they depend on
    // tables); dropping a table also drops its indexes and triggers.
    const existing = await userObjects(previewDb);
    for (const v of existing.filter((o) => o.type === "view")) statements.push(`DROP VIEW IF EXISTS ${quote(v.name)}`);
    for (const t of existing.filter((o) => o.type === "table")) statements.push(`DROP TABLE IF EXISTS ${quote(t.name)}`);

    for (const t of tables) {
      statements.push(t.sql);
      const rows = await mainDb.execute(`SELECT * FROM ${quote(t.name)}`);
      if (rows.rows.length === 0) continue;
      const cols = rows.columns.map(quote).join(", ");
      const params = rows.columns.map(() => "?").join(", ");
      const insert = `INSERT INTO ${quote(t.name)} (${cols}) VALUES (${params})`;
      for (const row of rows.rows) {
        statements.push({ sql: insert, args: rows.columns.map((c) => row[c]) });
      }
    }
    for (const o of others) statements.push(o.sql);

    // One write transaction: the preview database is either fully replaced or untouched.
    await previewDb.batch(statements, "write");

    const names = tables.map((t) => t.name);
    const [want, got] = await Promise.all([rowCounts(mainDb, names), rowCounts(previewDb, names)]);
    const mismatched = names.filter((n) => want[n] !== got[n]);
    console.log(`[sync] ${source} → ${target}`);
    for (const n of names) console.log(`[sync]   ${n}: ${got[n]} rows`);
    if (mismatched.length) {
      throw new Error(`[sync] row counts differ after sync for: ${mismatched.join(", ")}`);
    }
  } finally {
    mainDb.close();
    previewDb.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
