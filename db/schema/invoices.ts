import { pgTable, uuid, integer, varchar, date, index } from 'drizzle-orm/pg-core';
import { customers } from './customers';

export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').notNull().references(() => customers.id),
  amount: integer('amount').notNull(),
  status: varchar('status', { length: 255, enum: ['pending', 'paid'] }).notNull(),
  date: date('date').notNull(),
}, (table) => ({
  customerIdIdx: index("invoices_customer_id_idx").on(table.customerId),
  statusIdx: index("invoices_status_idx").on(table.status),
  dateIdx: index("invoices_date_idx").on(table.date),
  statusDateIdx: index("invoices_status_date_idx").on(table.status, table.date),
}));