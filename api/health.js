module.exports = (req, res) => {
  res.json({
    status: "ok",
    service: "agenthub",
    version: "1.0.0",
    endpoints: [
      { method: "GET", path: "/api/services", description: "List/search services" },
      { method: "GET", path: "/api/services/:id", description: "Get service details" },
      { method: "POST", path: "/api/services", description: "Register a service" },
      { method: "GET", path: "/api/services/:id/pay", description: "Get x402 payment requirements" },
      { method: "POST", path: "/api/services/:id/call", description: "Call a service (x402 payment)" },
      { method: "GET", path: "/api/developer/stats", description: "Developer analytics" },
    ],
  });
};
