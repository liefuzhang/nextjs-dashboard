import { type Config } from "drizzle-kit";

export default {
  schema: "./db/schema/*",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
    ssl: {
      rejectUnauthorized: false
    }
  },
} satisfies Config;