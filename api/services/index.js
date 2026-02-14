const { services } = require("../../lib/store");
const { cors } = require("../../lib/cors");
const { v4: uuidv4 } = require("uuid");

module.exports = (req, res) => {
  if (cors(req, res)) return;

  if (req.method === "GET") {
    const { category, tag, search, status, page = "1", limit = "20" } = req.query;
    let results = Array.from(services.values());

    if (category) results = results.filter(s => s.category === category);
    if (tag) results = results.filter(s => s.tags?.includes(tag));
    if (status) results = results.filter(s => s.status === status);
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags?.some(t => t.includes(q))
      );
    }

    const total = results.length;
    const p = Math.max(1, parseInt(page));
    const l = Math.min(100, Math.max(1, parseInt(limit)));
    const paginated = results.slice((p - 1) * l, p * l);

    return res.json({
      services: paginated,
      pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) },
    });
  }

  if (req.method === "POST") {
    const { name, description, category, tags, endpoint, pricing, inputSchema, outputSchema, developer } = req.body || {};
    if (!name || !endpoint || !pricing?.amount) {
      return res.status(400).json({ error: "name, endpoint, and pricing.amount are required" });
    }

    const id = `svc_${uuidv4().slice(0, 8)}`;
    const service = {
      id, name, description: description || "", category: category || "other",
      tags: tags || [], developer: developer || "anonymous", endpoint,
      pricing: {
        amount: pricing.amount,
        asset: pricing.asset || "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        network: pricing.network || "base",
        currency: pricing.currency || "USDC",
        humanPrice: pricing.humanPrice || `$${(parseInt(pricing.amount) / 1e6).toFixed(4)}`,
      },
      inputSchema: inputSchema || null,
      outputSchema: outputSchema || null,
      status: "active",
      createdAt: new Date().toISOString(),
      stats: { totalCalls: 0, revenue: "0" },
    };

    services.set(id, service);
    return res.status(201).json({ service });
  }

  res.status(405).json({ error: "Method not allowed" });
};
