const { services, callLogs } = require("../../lib/store");
const { cors } = require("../../lib/cors");
const { buildPaymentRequired, verifyPayment } = require("../../lib/payment");

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { id } = req.query;
  const service = services.get(id);
  if (!service) return res.status(404).json({ error: "Service not found" });

  // Check x402 payment
  const payment = req.headers["x-payment"];
  if (!payment) {
    return res.status(402).json(buildPaymentRequired(service));
  }

  const valid = await verifyPayment(payment);
  if (!valid) {
    return res.status(402).json({ error: "Invalid payment", ...buildPaymentRequired(service) });
  }

  // Forward call to the upstream service endpoint
  try {
    const upstream = await fetch(service.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Payment": payment,
      },
      body: JSON.stringify(req.body || {}),
    });

    const data = await upstream.json().catch(() => ({}));

    // Log the call
    callLogs.push({
      serviceId: id,
      timestamp: new Date().toISOString(),
      paid: true,
      amount: service.pricing.amount,
      status: upstream.status,
    });

    // Update stats
    service.stats.totalCalls++;
    service.stats.revenue = (parseFloat(service.stats.revenue) + parseInt(service.pricing.amount) / 1e6).toFixed(4);

    if (upstream.status === 402) {
      // Upstream also wants payment — pass through
      return res.status(402).json(data);
    }

    return res.status(upstream.status).json({
      service: { id: service.id, name: service.name },
      result: data,
    });
  } catch (err) {
    callLogs.push({ serviceId: id, timestamp: new Date().toISOString(), paid: true, amount: service.pricing.amount, status: 500 });
    return res.status(502).json({ error: "Upstream service error", details: err.message });
  }
};
