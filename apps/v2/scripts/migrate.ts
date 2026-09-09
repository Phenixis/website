// Applies any pending schema migrations. Run once per deploy (wired into
// vercel.json's buildCommand) or manually after pulling new migrations:
//   pnpm migrate
import { config } from "dotenv";
import path from "path";

// Mirror next.config.ts's env loading (root .env.local, then this app's) —
// this script runs outside of Next tooling, so nothing loads them for us.
config({ path: path.resolve(__dirname, "../../../.env.local"), override: false, quiet: true });
config({ path: path.resolve(__dirname, "../.env.local"), override: false, quiet: true });

async function main() {
  // Dynamic import: lib/db.ts creates its client at module load time, so it
  // must not be evaluated (even via a hoisted static import) until after
  // the env vars above are loaded.
  const { default: db, runMigrations } = await import("../lib/db");
  await runMigrations();
  db.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
