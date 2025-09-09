import { Client } from 'pg'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import {
  customers as customersData,
  invoices as invoicesData,
  revenue as revenueData,
  products as productsData,
} from '../app/lib/placeholder-data'

function getDbUrl() {
  return process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL
}

async function withClient<T>(fn: (client: Client) => Promise<T>) {
  const url = getDbUrl()
  if (!url) throw new Error('POSTGRES_URL[_NON_POOLING] is not set')
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
  await client.connect()
  try {
    return await fn(client)
  } finally {
    await client.end()
  }
}

async function seedCustomers(client: Client) {
  console.log('Seeding customers...')
  for (const c of customersData) {
    await client.query(
      `INSERT INTO customers (id, name, email, image_url, status, phone, company, location)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (id) DO NOTHING`,
      [c.id, c.name, c.email, c.image_url, c.status, c.phone, c.company, c.location]
    )
  }
}

async function seedInvoices(client: Client) {
  console.log('Seeding invoices...')
  for (const inv of invoicesData) {
    await client.query(
      `INSERT INTO invoices (customer_id, amount, status, date)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (id) DO NOTHING`,
      [inv.customer_id, inv.amount, inv.status, inv.date]
    )
  }
}

async function seedRevenue(client: Client) {
  console.log('Seeding revenue...')
  for (const r of revenueData) {
    await client.query(
      `INSERT INTO revenue (month, revenue)
       VALUES ($1,$2)
       ON CONFLICT (month) DO NOTHING`,
      [r.month, r.revenue]
    )
  }
}

async function seedProducts(client: Client) {
  console.log('Seeding products...')
  for (const p of productsData) {
    await client.query(
      `INSERT INTO products (id, name, description, price, category, image_url, status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7, NOW(), NOW())
       ON CONFLICT (id) DO NOTHING`,
      [p.id, p.name, p.description, p.price, p.category, p.image_url, p.status]
    )
  }
}

async function main() {
  console.log('🌱 Starting database seeding (pg driver)...')
  await withClient(async (client) => {
    await client.query('BEGIN')
    try {
      await seedCustomers(client)
      await seedInvoices(client)
      await seedRevenue(client)
      await seedProducts(client)
      await client.query('COMMIT')
      console.log('✅ Database seeding completed successfully!')
    } catch (err) {
      await client.query('ROLLBACK')
      console.error('❌ Database seeding failed:', err)
      process.exit(1)
    }
  })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
