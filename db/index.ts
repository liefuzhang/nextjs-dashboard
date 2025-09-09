import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { eq, desc, asc, sql } from "drizzle-orm";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import type { ExtractTablesWithRelations } from "drizzle-orm";

const url = process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL!;
const client = postgres(url, {
  ssl: { rejectUnauthorized: false },
});
export const db = drizzle(client, { schema });

export async function withTransaction<T>(
  fn: (tx: PgTransaction<PostgresJsQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>) => Promise<T>
): Promise<T> {
  return await db.transaction(fn);
}

// Prepared statements for frequently used queries
export const preparedStatements = {
  getInvoiceById: db
    .select({
      id: schema.invoices.id,
      customer_id: schema.invoices.customerId,
      amount: schema.invoices.amount,
      status: schema.invoices.status,
    })
    .from(schema.invoices)
    .where(eq(schema.invoices.id, sql.placeholder("id")))
    .prepare("getInvoiceById"),

  getFilteredInvoices: db
    .select({
      id: schema.invoices.id,
      amount: schema.invoices.amount,
      date: schema.invoices.date,
      status: schema.invoices.status,
      name: schema.customers.name,
      email: schema.customers.email,
      image_url: schema.customers.imageUrl,
      customer_id: schema.invoices.customerId,
    })
    .from(schema.invoices)
    .innerJoin(schema.customers, eq(schema.invoices.customerId, schema.customers.id))
    .where(
      sql`
        ${schema.customers.name} ILIKE ${sql.placeholder("queryPattern")} OR
        ${schema.customers.email} ILIKE ${sql.placeholder("queryPattern")} OR
        ${schema.invoices.amount}::text ILIKE ${sql.placeholder("queryPattern")} OR
        ${schema.invoices.date}::text ILIKE ${sql.placeholder("queryPattern")} OR
        ${schema.invoices.status} ILIKE ${sql.placeholder("queryPattern")}
      `
    )
    .orderBy(desc(schema.invoices.date))
    .limit(sql.placeholder("limit"))
    .offset(sql.placeholder("offset"))
    .prepare("getFilteredInvoices"),

  getFilteredCustomers: db
    .select({
      id: schema.customers.id,
      name: schema.customers.name,
      email: schema.customers.email,
      image_url: schema.customers.imageUrl,
      total_invoices: sql<number>`count(${schema.invoices.id})`,
      total_pending: sql<number>`sum(CASE WHEN ${schema.invoices.status} = 'pending' THEN ${schema.invoices.amount} ELSE 0 END)`,
      total_paid: sql<number>`sum(CASE WHEN ${schema.invoices.status} = 'paid' THEN ${schema.invoices.amount} ELSE 0 END)`,
    })
    .from(schema.customers)
    .leftJoin(schema.invoices, eq(schema.customers.id, schema.invoices.customerId))
    .where(
      sql`
        ${schema.customers.name} ILIKE ${sql.placeholder("queryPattern")} OR
        ${schema.customers.email} ILIKE ${sql.placeholder("queryPattern")}
      `
    )
    .groupBy(schema.customers.id, schema.customers.name, schema.customers.email, schema.customers.imageUrl)
    .orderBy(asc(schema.customers.name))
    .prepare("getFilteredCustomers"),
};
