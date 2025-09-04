import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';

export const revenue = pgTable('revenue', {
  month: varchar('month', { length: 4 }).notNull().unique(),
  revenue: integer('revenue').notNull(),
});