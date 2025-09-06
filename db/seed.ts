import { db } from "./index";
import { customers, invoices, revenue, products } from "./schema";
import {
  customers as customersData,
  invoices as invoicesData,
  revenue as revenueData,
  products as productsData,
} from "../app/lib/placeholder-data";

async function seedCustomers() {
  try {
    console.log("Seeding customers...");

    const insertedCustomers = await db
      .insert(customers)
      .values(
        customersData.map((customer) => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          imageUrl: customer.image_url,
          status: customer.status as "active" | "inactive",
          phone: customer.phone,
          company: customer.company,
          location: customer.location,
        }))
      )
      .onConflictDoUpdate({
        target: customers.id,
        set: {
          name: customersData[0].name,
          email: customersData[0].email,
          status: customersData[0].status,
        },
      })
      .returning();

    console.log(`✅ Seeded ${insertedCustomers.length} customers`);
    return insertedCustomers;
  } catch (error) {
    console.error("❌ Error seeding customers:", error);
    throw error;
  }
}

async function seedInvoices() {
  try {
    console.log("Seeding invoices...");

    const insertedInvoices = await db
      .insert(invoices)
      .values(
        invoicesData.map((invoice) => ({
          customerId: invoice.customer_id,
          amount: invoice.amount,
          status: invoice.status as "pending" | "paid",
          date: invoice.date,
        }))
      )
      .onConflictDoNothing()
      .returning();

    console.log(`✅ Seeded ${insertedInvoices.length} invoices`);
    return insertedInvoices;
  } catch (error) {
    console.error("❌ Error seeding invoices:", error);
    throw error;
  }
}

async function seedRevenue() {
  try {
    console.log("Seeding revenue...");

    const insertedRevenue = await db
      .insert(revenue)
      .values(revenueData)
      .onConflictDoUpdate({
        target: revenue.month,
        set: {
          revenue: revenueData[0].revenue,
        },
      })
      .returning();

    console.log(`✅ Seeded ${insertedRevenue.length} revenue entries`);
    return insertedRevenue;
  } catch (error) {
    console.error("❌ Error seeding revenue:", error);
    throw error;
  }
}

async function seedProducts() {
  try {
    console.log("Seeding products...");

    const insertedProducts = await db
      .insert(products)
      .values(
        productsData.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          imageUrl: product.image_url,
          status: product.status,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      )
      .onConflictDoUpdate({
        target: products.id,
        set: {
          name: productsData[0].name,
          description: productsData[0].description,
          price: productsData[0].price,
          updatedAt: new Date(),
        },
      })
      .returning();

    console.log(`✅ Seeded ${insertedProducts.length} products`);
    return insertedProducts;
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    throw error;
  }
}

async function main() {
  try {
    console.log("🌱 Starting database seeding with Drizzle ORM...");

    await seedCustomers();
    await seedInvoices();
    await seedRevenue();
    await seedProducts();

    console.log("✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
}

main();
