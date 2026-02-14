/**
 * In-memory store for services and call logs.
 * In production, replace with a database.
 */

const services = new Map();
const callLogs = []; // { serviceId, timestamp, paid, amount }

// Seed some demo services
const SEEDS = [
  {
    id: "svc_text-summarizer",
    name: "Text Summarizer",
    description: "Summarize any text or URL into concise bullet points",
    category: "nlp",
    tags: ["summarization", "text", "ai"],
    developer: "dev_openclaw",
    endpoint: "https://x402-apis.vercel.app/api/summarize",
    pricing: { amount: "10000", asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", network: "base", currency: "USDC", humanPrice: "$0.01" },
    inputSchema: { type: "object", properties: { text: { type: "string" }, url: { type: "string" } } },
    outputSchema: { type: "object", properties: { summary: { type: "string" } } },
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
    stats: { totalCalls: 142, revenue: "1.42" },
  },
  {
    id: "svc_web-scraper",
    name: "Web Scraper",
    description: "Extract readable content from any webpage",
    category: "data",
    tags: ["scraping", "web", "extraction"],
    developer: "dev_openclaw",
    endpoint: "https://x402-apis.vercel.app/api/scrape",
    pricing: { amount: "5000", asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", network: "base", currency: "USDC", humanPrice: "$0.005" },
    inputSchema: { type: "object", properties: { url: { type: "string" } } },
    outputSchema: { type: "object", properties: { title: { type: "string" }, content: { type: "string" } } },
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
    stats: { totalCalls: 89, revenue: "0.445" },
  },
  {
    id: "svc_sentiment-analyzer",
    name: "Sentiment Analyzer",
    description: "Analyze sentiment of text with confidence scores",
    category: "nlp",
    tags: ["sentiment", "analysis", "ai"],
    developer: "dev_openclaw",
    endpoint: "https://x402-apis.vercel.app/api/sentiment",
    pricing: { amount: "5000", asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", network: "base", currency: "USDC", humanPrice: "$0.005" },
    inputSchema: { type: "object", properties: { text: { type: "string" } } },
    outputSchema: { type: "object", properties: { sentiment: { type: "string" }, confidence: { type: "number" } } },
    status: "active",
    createdAt: "2026-01-01T00:00:00Z",
    stats: { totalCalls: 56, revenue: "0.28" },
  },
];

for (const s of SEEDS) services.set(s.id, s);

module.exports = { services, callLogs };
