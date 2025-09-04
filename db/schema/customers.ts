import { pgTable, uuid, varchar, text, index } from 'drizzle-orm/pg-core';

export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  imageUrl: varchar('image_url', { length: 255 }).notNull(),
  status: varchar('status', { length: 10, enum: ['active', 'inactive'] }).default('active').notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  company: varchar('company', { length: 100 }).notNull(),
  location: varchar('location', { length: 100 }).notNull(),
}, (table) => ({
  nameIdx: index("customers_name_idx").on(table.name),
  emailIdx: index("customers_email_idx").on(table.email),
  statusIdx: index("customers_status_idx").on(table.status),
}));