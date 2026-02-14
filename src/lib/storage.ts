/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Neon database storage for AgentHub
 * Uses @neondatabase/serverless for serverless Postgres
 */

import { neon } from "@neondatabase/serverless";

declare global {
  var sql: ReturnType<typeof neon> | undefined;
}

const getSql = () => {
  if (!global.sql) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL not set");
    }
    global.sql = neon(connectionString);
  }
  return global.sql;
};

export async function initializeDb() {
  const sql = getSql();
  
  await sql`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    image VARCHAR(500),
    wallet_address VARCHAR(42),
    provider VARCHAR(50) NOT NULL,
    provider_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  await sql`CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    tags TEXT[],
    endpoint VARCHAR(500) NOT NULL,
    pricing_amount BIGINT NOT NULL,
    pricing_currency VARCHAR(20) DEFAULT 'USDC',
    pricing_network VARCHAR(20) DEFAULT 'base',
    pricing_human_price VARCHAR(20) DEFAULT '$0.001',
    input_schema JSONB,
    output_schema JSONB,
    status VARCHAR(20) DEFAULT 'active',
    total_calls INTEGER DEFAULT 0,
    revenue DECIMAL(20, 6) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  console.log("Database tables ready");
}

export const services = {
  async findAll(filters?: { category?: string; status?: string; userId?: number }) {
    const sql = getSql();
    const results = await sql`SELECT * FROM services ORDER BY id DESC` as any;
    
    return results.map((row: any) => ({
      id: `svc_${row.id}`,
      name: row.name,
      description: row.description,
      category: row.category,
      tags: row.tags || [],
      endpoint: row.endpoint,
      userId: row.user_id,
      pricing: {
        amount: String(row.pricing_amount),
        currency: row.pricing_currency || 'USDC',
        network: row.pricing_network || 'base',
        humanPrice: row.pricing_human_price || '$0.001',
      },
      inputSchema: row.input_schema,
      outputSchema: row.output_schema,
      status: row.status,
      stats: {
        totalCalls: Number(row.total_calls || 0),
        revenue: String(row.revenue || "0"),
      },
    }));
  },

  async findById(id: string) {
    const sql = getSql();
    const numericId = parseInt(id.replace("svc_", ""));
    const results = await sql`SELECT * FROM services WHERE id = ${numericId}` as any;
    if (!results[0]) return null;
    
    const row = results[0];
    return {
      id: `svc_${row.id}`,
      name: row.name,
      description: row.description,
      category: row.category,
      tags: row.tags || [],
      endpoint: row.endpoint,
      userId: row.user_id,
      pricing: {
        amount: String(row.pricing_amount),
        currency: row.pricing_currency || 'USDC',
        network: row.pricing_network || 'base',
        humanPrice: row.pricing_human_price || '$0.001',
      },
      inputSchema: row.input_schema,
      outputSchema: row.output_schema,
      status: row.status,
      stats: {
        totalCalls: Number(row.total_calls || 0),
        revenue: String(row.revenue || "0"),
      },
    };
  },

  async create(service: {
    name: string;
    description: string;
    category: string;
    tags: string[];
    endpoint: string;
    userId: number;
    pricing: { amount: string; currency: string; network: string; humanPrice: string };
    inputSchema: unknown;
    outputSchema: unknown;
  }) {
    const sql = getSql();
    const results = await sql`
      INSERT INTO services (user_id, name, description, category, tags, endpoint, pricing_amount, pricing_currency, pricing_network, pricing_human_price, input_schema, output_schema, status, total_calls, revenue)
      VALUES (${service.userId}, ${service.name}, ${service.description}, ${service.category}, ${service.tags}, ${service.endpoint}, ${parseInt(service.pricing.amount)}, ${service.pricing.currency}, ${service.pricing.network}, ${service.pricing.humanPrice}, ${JSON.stringify(service.inputSchema)}, ${JSON.stringify(service.outputSchema)}, 'active', 0, 0)
      RETURNING *
    ` as any;
    
    const row = results[0];
    return {
      id: `svc_${row.id}`,
      name: row.name,
      description: row.description,
      category: row.category,
      tags: row.tags,
      endpoint: row.endpoint,
      userId: row.user_id,
      pricing: {
        amount: String(row.pricing_amount),
        currency: row.pricing_currency,
        network: row.pricing_network,
        humanPrice: row.pricing_human_price,
      },
      inputSchema: row.input_schema,
      outputSchema: row.output_schema,
      status: row.status,
      stats: { totalCalls: 0, revenue: "0" },
    };
  },

  async incrementCalls(id: string, amount: number) {
    const sql = getSql();
    const numericId = parseInt(id.replace("svc_", ""));
    await sql`UPDATE services SET total_calls = total_calls + 1, revenue = revenue + ${amount / 1e6} WHERE id = ${numericId}`;
  },
};

export const users = {
  async findByEmail(email: string) {
    const sql = getSql();
    const results = await sql`SELECT * FROM users WHERE email = ${email}` as any;
    return results[0] || null;
  },

  async findById(id: number) {
    const sql = getSql();
    const results = await sql`SELECT * FROM users WHERE id = ${id}` as any;
    return results[0] || null;
  },

  async create(user: { email: string; name: string; image?: string; provider: string; providerId?: string; walletAddress?: string }) {
    const sql = getSql();
    const results = await sql`
      INSERT INTO users (email, name, image, provider, provider_id, wallet_address)
      VALUES (${user.email}, ${user.name}, ${user.image || null}, ${user.provider}, ${user.providerId || null}, ${user.walletAddress || null})
      RETURNING *
    ` as any;
    return results[0];
  },
};

export const callLogs = {
  async create(log: { serviceId: string; userId?: number; status: string; amountPaid: number }) {
    const sql = getSql();
    const numericId = parseInt(log.serviceId.replace("svc_", ""));
    await sql`INSERT INTO call_logs (service_id, user_id, status, amount_paid) VALUES (${numericId}, ${log.userId || null}, ${log.status}, ${log.amountPaid})`;
  },
};
