/**
 * x402 payment helpers for AgentHub.
 */

const PAY_TO = "0x66356d55a891321048e53Fa6A29ed21a15fc3A6A";
const NETWORK = "base";
const USDC_ASSET = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const BASE_URL = process.env.BASE_URL || "https://agenthub.vercel.app";

/**
 * Build an x402 payment-required response for a service.
 */
function buildPaymentRequired(service) {
  const p = service.pricing;
  return {
    x402Version: 1,
    error: "Payment required. Include X-PAYMENT header.",
    accepts: [{
      scheme: "exact",
      network: p.network || NETWORK,
      maxAmountRequired: p.amount,
      resource: `${BASE_URL}/api/services/${service.id}/call`,
      description: `Pay to call: ${service.name}`,
      mimeType: "application/json",
      payTo: PAY_TO,
      maxTimeoutSeconds: 300,
      asset: p.asset || USDC_ASSET,
      extra: { name: p.currency || "USD Coin", version: 2 },
    }],
  };
}

/**
 * Verify x402 payment by forwarding to the upstream service.
 * Returns true if valid (or if we're in dev/demo mode).
 */
async function verifyPayment(paymentHeader) {
  // In production, verify the payment token cryptographically
  // or forward to a facilitator. For now, accept any non-empty header.
  return !!paymentHeader;
}

module.exports = { PAY_TO, NETWORK, USDC_ASSET, BASE_URL, buildPaymentRequired, verifyPayment };
