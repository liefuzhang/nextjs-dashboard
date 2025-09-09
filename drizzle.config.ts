import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema/*",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL_NON_POOLING!,
    // Use permissive SSL to work with Supabase cert chain
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
