const { services, callLogs } = require("../../lib/store");
const { cors } = require("../../lib/cors");

module.exports = (req, res) => {
  if (cors(req, res)) return;
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { developer } = req.query;
  const allServices = Array.from(services.values());
  const filtered = developer ? allServices.filter(s => s.developer === developer) : allServices;

  const serviceIds = new Set(filtered.map(s => s.id));
  const relevantLogs = callLogs.filter(l => serviceIds.has(l.serviceId));

  // Aggregate stats
  const totalCalls = filtered.reduce((sum, s) => sum + s.stats.totalCalls, 0);
  const totalRevenue = filtered.reduce((sum, s) => sum + parseFloat(s.stats.revenue), 0);

  // Per-service breakdown
  const breakdown = filtered.map(s => ({
    id: s.id,
    name: s.name,
    calls: s.stats.totalCalls,
    revenue: s.stats.revenue,
    price: s.pricing.humanPrice,
  }));

  // Recent calls (last 50)
  const recentCalls = relevantLogs.slice(-50).reverse();

  res.json({
    summary: {
      totalServices: filtered.length,
      totalCalls,
      totalRevenue: totalRevenue.toFixed(4),
      currency: "USDC",
    },
    services: breakdown,
    recentCalls,
  });
};
