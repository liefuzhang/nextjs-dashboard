import { pgTable, uuid, integer, varchar, date } from 'drizzle-orm/pg-core';
import { customers } from './customers';

export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').notNull().references(() => customers.id),
  amount: integer('amount').notNull(),
  status: varchar('status', { length: 255, enum: ['pending', 'paid'] }).notNull(),
  date: date('date').notNull(),
});