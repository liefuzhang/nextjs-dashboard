import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index";
import { readdir } from "fs/promises";
import { join } from "path";

async function runMigrations() {
  try {
    console.log("🚀 Starting database migrations...");
    
    // List available migrations
    const migrationsPath = join(process.cwd(), "db/migrations");
    const migrationFiles = await readdir(migrationsPath);
    console.log(`📁 Found ${migrationFiles.length} migration files`);
    
    // Run migrations
    await migrate(db, { migrationsFolder: "./db/migrations" });
    
    console.log("✅ Migrations completed successfully!");
    console.log("🎉 Database is up to date");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
    }
    
    process.exit(1);
  }
}

async function checkMigrationStatus() {
  try {
    console.log("🔍 Checking migration status...");
    
    // This would require implementing a custom migration tracker
    // For now, we'll just run the migrations
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
    case 'status':
      checkMigrationStatus();
      break;
    case 'up':
    default:
      runMigrations();
      break;
  }
}