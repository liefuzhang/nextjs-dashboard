import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from "./definitions";
import { formatCurrency } from "./utils";
import { db } from "@/db";
import { customers, invoices, revenue } from "@/db/schema";
import { eq, desc, asc, count, sum, sql } from "drizzle-orm";

export async function fetchRevenue() {
  try {
    // We artificially delay a response for demo purposes.
    // Don't do this in production :)
    console.log("Fetching revenue data...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await db.select().from(revenue);

    console.log("Data fetch completed after 3 seconds.");

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await db
      .select({
        amount: invoices.amount,
        name: customers.name,
        image_url: customers.imageUrl,
        email: customers.email,
        id: invoices.id,
      })
      .from(invoices)
      .innerJoin(customers, eq(invoices.customerId, customers.id))
      .orderBy(desc(invoices.date))
      .limit(5);

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = db.select({ count: count() }).from(invoices);
    const customerCountPromise = db.select({ count: count() }).from(customers);
    const invoiceStatusPromise = db
      .select({
        paid: sum(sql`CASE WHEN ${invoices.status} = 'paid' THEN ${invoices.amount} ELSE 0 END`).mapWith(Number),
        pending: sum(sql`CASE WHEN ${invoices.status} = 'pending' THEN ${invoices.amount} ELSE 0 END`).mapWith(Number),
      })
      .from(invoices);

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0]?.count ?? "0");
    const numberOfCustomers = Number(data[1][0]?.count ?? "0");
    const totalPaidInvoices = formatCurrency(data[2][0]?.paid ?? 0);
    const totalPendingInvoices = formatCurrency(data[2][0]?.pending ?? 0);

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

const ITEMS_PER_PAGE = 2;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const queryPattern = `%${query}%`;
    
    const invoicesList = await db
      .select({
        id: invoices.id,
        amount: invoices.amount,
        date: invoices.date,
        status: invoices.status,
        name: customers.name,
        email: customers.email,
        image_url: customers.imageUrl,
        customer_id: invoices.customerId,
      })
      .from(invoices)
      .innerJoin(customers, eq(invoices.customerId, customers.id))
      .where(
        sql`
          ${customers.name} ILIKE ${queryPattern} OR
          ${customers.email} ILIKE ${queryPattern} OR
          ${invoices.amount}::text ILIKE ${queryPattern} OR
          ${invoices.date}::text ILIKE ${queryPattern} OR
          ${invoices.status} ILIKE ${queryPattern}
        `
      )
      .orderBy(desc(invoices.date))
      .limit(ITEMS_PER_PAGE)
      .offset(offset);

    return invoicesList;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const queryPattern = `%${query}%`;
    
    const data = await db
      .select({ count: count() })
      .from(invoices)
      .innerJoin(customers, eq(invoices.customerId, customers.id))
      .where(
        sql`
          ${customers.name} ILIKE ${queryPattern} OR
          ${customers.email} ILIKE ${queryPattern} OR
          ${invoices.amount}::text ILIKE ${queryPattern} OR
          ${invoices.date}::text ILIKE ${queryPattern} OR
          ${invoices.status} ILIKE ${queryPattern}
        `
      );

    const totalPages = Math.ceil(Number(data[0]?.count ?? 0) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await db
      .select({
        id: invoices.id,
        customer_id: invoices.customerId,
        amount: invoices.amount,
        status: invoices.status,
      })
      .from(invoices)
      .where(eq(invoices.id, id));

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchCustomers() {
  try {
    const customersList = await db
      .select({
        id: customers.id,
        name: customers.name,
        email: customers.email,
        image_url: customers.imageUrl,
        status: customers.status,
        phone: customers.phone,
        company: customers.company,
        location: customers.location,
      })
      .from(customers)
      .orderBy(asc(customers.name));

    return customersList;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const queryPattern = `%${query}%`;
    
    const data = await db
      .select({
        id: customers.id,
        name: customers.name,
        email: customers.email,
        image_url: customers.imageUrl,
        total_invoices: count(invoices.id),
        total_pending: sum(sql`CASE WHEN ${invoices.status} = 'pending' THEN ${invoices.amount} ELSE 0 END`).mapWith(Number),
        total_paid: sum(sql`CASE WHEN ${invoices.status} = 'paid' THEN ${invoices.amount} ELSE 0 END`).mapWith(Number),
      })
      .from(customers)
      .leftJoin(invoices, eq(customers.id, invoices.customerId))
      .where(
        sql`
          ${customers.name} ILIKE ${queryPattern} OR
          ${customers.email} ILIKE ${queryPattern}
        `
      )
      .groupBy(customers.id, customers.name, customers.email, customers.imageUrl)
      .orderBy(asc(customers.name));

    const customersData = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending ?? 0),
      total_paid: formatCurrency(customer.total_paid ?? 0),
    }));

    return customersData;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}
