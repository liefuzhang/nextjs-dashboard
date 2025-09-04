import { relations } from 'drizzle-orm';
import { customers } from './customers';
import { invoices } from './invoices';
import { revenue } from './revenue';
import { products } from './products';

export const customersRelations = relations(customers, ({ many }) => ({
  invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
}));

export { customers, invoices, revenue, products };