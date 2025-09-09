import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { readdir } from "fs/promises";
import { join } from "path";

async function runMigrations() {
  // Create an isolated client so we can close it afterwards to avoid hanging CI jobs
  const url = process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL;
  if (!url) {
    console.error("❌ Missing POSTGRES_URL or POSTGRES_URL_NON_POOLING env var");
    process.exit(1);
  }
  const client = postgres(url, { ssl: { rejectUnauthorized: false } });
  const localDb = drizzle(client, { schema });
  try {
    console.log("🚀 Starting database migrations...");

    // List available migrations
    const migrationsPath = join(process.cwd(), "db/migrations");
    const migrationFiles = await readdir(migrationsPath);
    console.log(`📁 Found ${migrationFiles.length} migration files`);

    // Run migrations using local postgres-js client
    await migrate(localDb, { migrationsFolder: "./db/migrations" });

    console.log("✅ Migrations completed successfully!");
    console.log("🎉 Database is up to date");
  } catch (error) {
    console.error("❌ Migration failed:", error);

    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
    }

    process.exit(1);
  } finally {
    // Ensure we close the connection to prevent hanging processes in CI
    try {
      await client.end({ timeout: 5 });
    } catch {
      // ignore
    }
  }
}

async function checkMigrationStatus() {
  try {
    console.log("🔍 Checking migration status...");

    // Simple status: run migrations to ensure up to date
    await runMigrations();
  } catch (error) {
    console.error("❌ Status check failed:", error);
    process.exit(1);
  }
}

// CLI handling
const command = process.argv[2];

if (import.meta.url === `file://${process.argv[1]}`) {
  switch (command) {
    case "status":
      checkMigrationStatus();
      break;
    case "up":
    default:
      runMigrations();
      break;
  }
}
