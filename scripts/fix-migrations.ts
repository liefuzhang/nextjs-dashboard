import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { readFileSync } from "fs";
import { join } from "path";

// Create connection using non-pooling URL for migration
const client = postgres(process.env.POSTGRES_URL_NON_POOLING!, {
  ssl: { rejectUnauthorized: false },
  max: 1,
});
const db = drizzle(client);

async function fixMigrationTracking() {
  try {
    console.log("🔧 Fixing drizzle migration tracking...");

    // First, ensure drizzle schema exists
    await db.execute(`CREATE SCHEMA IF NOT EXISTS "drizzle"`);

    // Create the migration tracking table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at bigint
      )
    `);

    // Read the journal to get the exact migration metadata
    const journalPath = join(process.cwd(), "db/migrations/meta/_journal.json");
    const journal = JSON.parse(readFileSync(journalPath, 'utf8'));

    console.log(`📁 Found ${journal.entries.length} migrations in journal`);

    // Mark each migration as applied based on journal entries
    for (const entry of journal.entries) {
      const migrationFile = `${entry.tag}.sql`;
      const migrationPath = join(process.cwd(), "db/migrations", migrationFile);
      
      if (!require('fs').existsSync(migrationPath)) {
        console.log(`⚠️  Migration file not found: ${migrationFile}`);
        continue;
      }

      // Use the tag as the hash (this is what drizzle expects)
      const hash = entry.tag;
      const timestamp = entry.when;

      // Insert the migration as already applied
      await db.execute(`
        INSERT INTO "drizzle"."__drizzle_migrations" (hash, created_at)
        VALUES ($1, $2)
        ON CONFLICT (hash) DO NOTHING
      `, [hash, timestamp]);

      console.log(`✅ Marked migration as applied: ${migrationFile} (${hash})`);
    }

    console.log("🎉 Migration tracking fixed!");
    console.log("🚀 You can now run 'pnpm db:migrate' safely");

  } catch (error) {
    console.error("❌ Failed to fix migration tracking:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixMigrationTracking();