const { services } = require("../../lib/store");
const { cors } = require("../../lib/cors");

module.exports = (req, res) => {
  if (cors(req, res)) return;
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { id } = req.query;
  const service = services.get(id);
  if (!service) return res.status(404).json({ error: "Service not found" });

  res.json({ service });
};
