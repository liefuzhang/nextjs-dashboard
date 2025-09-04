import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from './index';
import postgres from 'postgres';

async function runMigrations() {
  try {
    console.log('Running migrations...');
    
    // Create the products table manually for now
    const sql = postgres(process.env.POSTGRES_URL!, { 
      ssl: { rejectUnauthorized: false } 
    });
    
    await sql`
      CREATE TABLE IF NOT EXISTS "products" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" varchar(255) NOT NULL,
        "description" text,
        "price" integer NOT NULL,
        "category" varchar(100) NOT NULL,
        "image_url" varchar(255),
        "status" varchar(20) DEFAULT 'active' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    
    console.log('✅ Products table created successfully');
    await sql.end();
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();