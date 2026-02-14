const { services } = require("../../lib/store");
const { cors } = require("../../lib/cors");
const { buildPaymentRequired } = require("../../lib/payment");

module.exports = (req, res) => {
  if (cors(req, res)) return;
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { id } = req.query;
  const service = services.get(id);
  if (!service) return res.status(404).json({ error: "Service not found" });

  // Return x402 payment requirements
  res.status(402).json(buildPaymentRequired(service));
};
