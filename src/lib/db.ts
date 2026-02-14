import { sql } from "@vercel/postgres";

export const dbSchema = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  image VARCHAR(500),
  wallet_address VARCHAR(42),
  provider VARCHAR(50) NOT NULL,
  provider_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  tags VARCHAR(255)[],
  endpoint VARCHAR(500) NOT NULL,
  pricing_amount BIGINT NOT NULL,
  pricing_currency VARCHAR(20) DEFAULT 'USDC',
  pricing_network VARCHAR(20) DEFAULT 'base',
  input_schema JSONB,
  output_schema JSONB,
  rate_limit VARCHAR(50),
  documentation TEXT,
  terms_of_service TEXT,
  status VARCHAR(20) DEFAULT 'active',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service stats table
CREATE TABLE IF NOT EXISTS service_stats (
  id SERIAL PRIMARY KEY,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  total_calls INTEGER DEFAULT 0,
  total_revenue BIGINT DEFAULT 0,
  last_call TIMESTAMP
);

-- Call logs table
CREATE TABLE IF NOT EXISTS call_logs (
  id SERIAL PRIMARY KEY,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(20),
  amount_paid BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_services_user ON services(user_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_call_logs_service ON call_logs(service_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_created ON call_logs(created_at);
`;

// Initialize database tables
export async function initializeDb() {
  try {
    await sql`${dbSchema}`;
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}
