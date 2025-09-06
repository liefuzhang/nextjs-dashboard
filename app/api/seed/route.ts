import postgres from "postgres";
import {
  invoices,
  customers,
  revenue,
  users,
} from "../../lib/placeholder-data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function seedInvoices() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedInvoices;
}

async function seedCustomers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`DROP TABLE customers`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      status VARCHAR(10) DEFAULT 'active',
      phone VARCHAR(20),
      company VARCHAR(100),
      location VARCHAR(100)
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url, status, phone, company, location)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url}, ${customer.status}, ${customer.phone}, ${customer.company}, ${customer.location})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedCustomers;
}

async function seedRevenue() {
  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `
    )
  );

  return insertedRevenue;
}

export async function GET() {
  try {
    const result = await sql.begin(async (sql) => {
      //await seedCustomers();
      await seedInvoices();
      //await seedRevenue();
    });

    return Response.json({
      message: "Database seeded successfully with extended invoice data",
    });
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json({ error }, { status: 500 });
  }
}
