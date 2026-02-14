"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  ChevronRight, 
  Terminal, 
  Code2, 
  Wallet, 
  Calculator, 
  BookOpen,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Layers,
  Key
} from "lucide-react";

const QUICK_EXAMPLES = [
  {
    language: "cURL",
    icon: Terminal,
    code: `curl -X POST https://api.agenthub.dev/svc_text-summarizer \\
  -H "Content-Type: application/json" \\
  -H "X-Payment: <x402-token>" \\
  -d '{"text": "Your long article text here..."}'
`
  },
  {
    language: "JavaScript",
    icon: Code2,
    code: `const response = await fetch('https://api.agenthub.dev/svc_text-summarizer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Payment': paymentToken
  },
  body: JSON.stringify({
    text: 'Your long article text here...'
  })
});
const data = await response.json();`
  },
  {
    language: "Python",
    icon: Code2,
    code: `import requests

response = requests.post(
    'https://api.agenthub.dev/svc_text-summarizer',
    headers={
        'Content-Type': 'application/json',
        'X-Payment': payment_token
    },
    json={'text': 'Your long article text here...'}
)
data = response.json()`
  }
];

const X402_STEPS = [
  {
    title: "Get USDC on Base",
    description: "Bridge USDC to Base L2 using a wallet like MetaMask or Coinbase Wallet.",
    icon: Wallet,
  },
  {
    title: "Request Payment Token",
    description: "Call the x402 payment gateway to get a signed payment token for the service.",
    icon: Key,
  },
  {
    title: "Include in Request",
    description: "Add the X-Payment header with your token to API requests.",
    icon: Layers,
  },
  {
    title: "Automatic Settlement",
    description: "Payment is automatically settled on-chain. No subscription required.",
    icon: Zap,
  }
];

const PRICING_EXAMPLES = [
  { calls: 100, price: "$0.10", service: "Text Summarizer" },
  { calls: 1000, price: "$1.00", service: "Text Summarizer" },
  { calls: 100, price: "$0.50", service: "Web Scraper" },
  { calls: 1000, price: "$5.00", service: "Web Scraper" },
  { calls: 10000, price: "$10.00", service: "Crypto Prices" },
];

export default function DevelopersPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [calculator, setCalculator] = useState({ calls: 1000, pricePerCall: 0.001 });
  
  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const estimatedCost = (calculator.calls * calculator.pricePerCall).toFixed(4);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#050510]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition text-sm">
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-xs">A</div>
            <span className="font-semibold text-sm">AgentHub</span>
          </div>
          <Link href="/explore" className="text-sm text-purple-400 hover:text-purple-300 transition">
            Explore
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Developer <span className="gradient-text">Documentation</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Integrate AI agent services into your applications with simple REST APIs and x402 micropayments.
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Quick Start</h2>
              <p className="text-white/40 text-sm">Make your first API call in minutes</p>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-purple-400 font-semibold mb-1">1. Discover</div>
              <p className="text-sm text-white/40">Browse services at /explore or call /api/services</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-purple-400 font-semibold mb-1">2. Get Token</div>
              <p className="text-sm text-white/40">Obtain x402 payment token for the service</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-purple-400 font-semibold mb-1">3. Call API</div>
              <p className="text-sm text-white/40">Make requests with X-Payment header</p>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Code Examples</h2>
              <p className="text-white/40 text-sm">Copy-paste ready integration code</p>
            </div>
          </div>

          <div className="space-y-4">
            {QUICK_EXAMPLES.map((example) => (
              <div key={example.language} className="rounded-xl bg-[#0d0d1a] border border-white/[0.06] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <example.icon className="w-4 h-4 text-white/40" />
                    <span className="text-sm font-medium">{example.language}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(example.code, example.language)}
                    className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition"
                  >
                    {copied === example.language ? (
                      <><Check className="w-3 h-3" /> Copied</>
                    ) : (
                      <><Copy className="w-3 h-3" /> Copy</>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-sm overflow-x-auto">
                  <code className="text-white/70 font-mono">{example.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>

        {/* API Reference */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">API Reference</h2>
              <p className="text-white/40 text-sm">Available endpoints</p>
            </div>
          </div>

          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
            {/* List Services */}
            <div className="border-b border-white/5">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02]">
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-green-500/20 text-green-400">GET</span>
                <code className="text-sm">/api/services</code>
              </div>
              <div className="px-4 py-3 text-sm text-white/50">
                List all available services. Returns array of service objects with pricing, endpoints, and schemas.
              </div>
            </div>

            {/* Call Service */}
            <div className="border-b border-white/5">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02]">
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-blue-500/20 text-blue-400">POST</span>
                <code className="text-sm">/api/demo</code>
              </div>
              <div className="px-4 py-3 text-sm text-white/50">
                Demo endpoint for testing. Accepts serviceId and input parameters. No payment required for demo.
              </div>
            </div>

            {/* Service Endpoint */}
            <div>
              <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.02]">
                <span className="px-2 py-0.5 rounded text-xs font-mono bg-purple-500/20 text-purple-400">POST</span>
                <code className="text-sm">https://api.agenthub.dev/:serviceId</code>
              </div>
              <div className="px-4 py-3 text-sm text-white/50">
                Direct service endpoint. Requires valid X-Payment header with x402 token. Returns service-specific response.
              </div>
            </div>
          </div>
        </section>

        {/* x402 Payment Guide */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">x402 Payment Integration</h2>
              <p className="text-white/40 text-sm">Sub-cent payments with USDC on Base</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {X402_STEPS.map((step, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <step.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-white/40">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Why x402?</h4>
                <p className="text-sm text-white/50">
                  x402 is an open payment protocol that enables per-request authentication and payment. 
                  No API keys, no subscriptions — just pay for what you use with microtransactions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Calculator */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Pricing Calculator</h2>
              <p className="text-white/40 text-sm">Estimate your costs</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Calculator */}
            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Estimated API calls per month</label>
                  <input
                    type="number"
                    min="1"
                    value={calculator.calls}
                    onChange={(e) => setCalculator({ ...calculator, calls: Number(e.target.value) })}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                  />
                  <div className="flex gap-2 mt-2">
                    {[100, 1000, 10000, 100000].map((n) => (
                      <button
                        key={n}
                        onClick={() => setCalculator({ ...calculator, calls: n })}
                        className="px-3 py-1 text-xs rounded-full bg-white/5 hover:bg-white/10 transition"
                      >
                        {n >= 1000 ? `${n/1000}k` : n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Price per call (USD)</label>
                  <select
                    value={calculator.pricePerCall}
                    onChange={(e) => setCalculator({ ...calculator, pricePerCall: Number(e.target.value) })}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="0.001">$0.001 (Crypto Prices)</option>
                    <option value="0.005">$0.005 (Web Scraper, Sentiment)</option>
                    <option value="0.01">$0.01 (Text Summarizer, Screenshot)</option>
                    <option value="0.05">$0.05 (Premium services)</option>
                    <option value="0.10">$0.10 (Enterprise services)</option>
                  </select>
                </div>

                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">${estimatedCost}</div>
                    <div className="text-sm text-white/40 mt-1">estimated per month</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Examples */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-white/60">Example costs</h3>
              {PRICING_EXAMPLES.map((example, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div>
                    <div className="text-sm">{example.service}</div>
                    <div className="text-xs text-white/40">{example.calls} calls/month</div>
                  </div>
                  <div className="text-purple-400 font-medium">{example.price}</div>
                </div>
              ))}
              <Link href="/explore" className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition text-sm">
                View all services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
          <h2 className="text-2xl font-bold mb-3">Ready to build?</h2>
          <p className="text-white/50 mb-6 max-w-md mx-auto">
            Start integrating AI agent services into your applications today. No signup required for testing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/explore" className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 transition font-medium flex items-center gap-2">
              Explore Services <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/list" className="px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition font-medium">
              List Your Service
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
