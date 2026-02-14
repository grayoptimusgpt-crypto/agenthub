import Link from "next/link";
import { Zap, Shield, Search, ArrowRight, Bot, Globe, BarChart3, Code2, ChevronRight, Cpu, Wallet, Clock } from "lucide-react";

const SERVICES = [
  { id: "svc_text-summarizer", name: "Text Summarizer", desc: "Summarize any text or URL into concise bullet points", price: "$0.01", category: "NLP", calls: 142, icon: "📝" },
  { id: "svc_web-scraper", name: "Web Scraper", desc: "Extract readable content from any webpage", price: "$0.005", category: "Data", calls: 89, icon: "🌐" },
  { id: "svc_sentiment-analyzer", name: "Sentiment Analyzer", desc: "Analyze sentiment of text with confidence scores", price: "$0.005", category: "NLP", calls: 56, icon: "🎭" },
  { id: "svc_crypto-price", name: "Crypto Prices", desc: "Real-time cryptocurrency price data from CoinGecko", price: "$0.001", category: "Finance", calls: 203, icon: "📈" },
  { id: "svc_screenshot", name: "Screenshot", desc: "Capture full-page screenshots of any website", price: "$0.01", category: "Data", calls: 34, icon: "📸" },
  { id: "svc_domain-enrich", name: "Domain Enrichment", desc: "DNS records, WHOIS, and tech stack detection", price: "$0.01", category: "Data", calls: 67, icon: "🔍" },
];

const STEPS = [
  { icon: Search, title: "Discover", desc: "Browse or search AI agent services by category, price, or capability" },
  { icon: Wallet, title: "Pay Per Use", desc: "Pay with USDC via x402 protocol — sub-cent precision, no subscriptions" },
  { icon: Cpu, title: "Integrate", desc: "Simple REST API. Your agents can autonomously discover and pay for services" },
];

const STATS = [
  { value: "6+", label: "Live Services" },
  { value: "$0.001", label: "Starting Price" },
  { value: "<100ms", label: "Avg Response" },
  { value: "Base L2", label: "Settlement" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#050510]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-sm">A</div>
            <span className="text-lg font-semibold">AgentHub</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#services" className="text-white/60 hover:text-white transition">Services</a>
            <a href="#how-it-works" className="text-white/60 hover:text-white transition">How It Works</a>
            <a href="#pricing" className="text-white/60 hover:text-white transition">Pricing</a>
            <a href="#docs" className="text-white/60 hover:text-white transition">API Docs</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/explore" className="hidden sm:block text-sm text-white/60 hover:text-white transition">Explore</Link>
            <Link href="/explore" className="px-4 py-2 text-sm font-medium rounded-lg bg-purple-600 hover:bg-purple-500 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-glow" />
            Live on Base — Powered by x402 micropayments
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Discover & Pay for{" "}
            <span className="gradient-text">AI Agents</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            The marketplace where humans and AI agents discover, try, and pay for services with sub-cent precision. No subscriptions, no API keys.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/explore" className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition font-medium text-base flex items-center gap-2">
              Explore Services <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#docs" className="px-8 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 transition font-medium text-base flex items-center gap-2">
              <Code2 className="w-4 h-4" /> API Documentation
            </a>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold gradient-text">{s.value}</div>
                <div className="text-sm text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Popular Services</h2>
              <p className="text-white/50">Pay-per-use AI agents ready to integrate</p>
            </div>
            <Link href="/explore" className="hidden sm:flex items-center gap-1 text-purple-400 hover:text-purple-300 transition text-sm">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <div key={s.id} className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] card-hover">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-white/50">{s.category}</span>
                </div>
                <h3 className="font-semibold mb-1">{s.name}</h3>
                <p className="text-sm text-white/40 mb-4 leading-relaxed">{s.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-purple-400 font-semibold">{s.price}</span>
                    <span className="text-xs text-white/30">per call</span>
                  </div>
                  <Link href={`/explore?service=${s.id}`} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-purple-600 transition">
                    Try it →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-white/50 text-center mb-16 max-w-lg mx-auto">Three steps to integrate AI agent services into your workflow</p>
          <div className="grid md:grid-cols-3 gap-10">
            {STEPS.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center mx-auto mb-5">
                  <step.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Developers */}
      <section id="docs" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Built for Developers & Agents</h2>
          <p className="text-white/50 text-center mb-12 max-w-lg mx-auto">Simple REST API with x402 payment protocol</p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Code example */}
            <div className="rounded-xl bg-[#0d0d1a] border border-white/[0.06] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="text-xs text-white/30 ml-2">call-service.js</span>
              </div>
              <pre className="p-5 text-sm leading-relaxed overflow-x-auto"><code className="text-white/70">{`// 1. Discover services
const res = await fetch(
  "https://agenthub-api.vercel.app/api/services"
);
const { services } = await res.json();

// 2. Call with x402 payment
const result = await fetch(
  services[0].endpoint,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Payment": paymentToken
    },
    body: JSON.stringify({
      text: "Analyze this..."
    })
  }
);`}</code></pre>
            </div>
            {/* Features list */}
            <div className="space-y-4">
              {[
                { icon: Zap, title: "Sub-cent Payments", desc: "Pay as little as $0.001 per API call with USDC on Base L2" },
                { icon: Shield, title: "No API Keys", desc: "x402 protocol handles auth via payment — no signup required" },
                { icon: Bot, title: "Agent-Native", desc: "AI agents can autonomously discover, evaluate, and pay for services" },
                { icon: Globe, title: "Open Registry", desc: "Any developer can list services. Earn revenue from every call" },
                { icon: BarChart3, title: "Real-time Analytics", desc: "Track usage, revenue, and performance for your listed services" },
                { icon: Clock, title: "Instant Settlement", desc: "USDC payments settle on Base L2 in seconds" },
              ].map((f, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-white/[0.02] transition">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{f.title}</h4>
                    <p className="text-xs text-white/40 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
          <p className="text-white/50 text-center mb-12">Pay only for what you use. No monthly fees required.</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <h3 className="font-semibold mb-1">Pay Per Use</h3>
              <div className="text-3xl font-bold my-4">$0<span className="text-lg text-white/30 font-normal">/mo</span></div>
              <ul className="text-sm text-white/50 space-y-3 mb-6">
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> All services available</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Pay per API call</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> No rate limits</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> x402 payments only</li>
              </ul>
              <Link href="/explore" className="block text-center py-2.5 rounded-lg border border-white/10 hover:bg-white/5 transition text-sm font-medium">
                Start Now
              </Link>
            </div>
            <div className="p-6 rounded-xl bg-purple-500/10 border border-purple-500/20 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 text-xs font-medium rounded-full">Popular</div>
              <h3 className="font-semibold mb-1">Pro</h3>
              <div className="text-3xl font-bold my-4">$29<span className="text-lg text-white/30 font-normal">/mo</span></div>
              <ul className="text-sm text-white/50 space-y-3 mb-6">
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Everything in Free</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> API key access</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Usage analytics</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Priority support</li>
              </ul>
              <Link href="/explore" className="block text-center py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 transition text-sm font-medium">
                Get Started
              </Link>
            </div>
            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <h3 className="font-semibold mb-1">Enterprise</h3>
              <div className="text-3xl font-bold my-4">Custom</div>
              <ul className="text-sm text-white/50 space-y-3 mb-6">
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Dedicated support</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Custom integrations</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> SLA guarantee</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Volume discounts</li>
              </ul>
              <a href="mailto:gray@agenthub.dev" className="block text-center py-2.5 rounded-lg border border-white/10 hover:bg-white/5 transition text-sm font-medium">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to build with AI agents?</h2>
          <p className="text-white/50 mb-8">Start integrating pay-per-use AI services in minutes.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/explore" className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition font-medium flex items-center gap-2">
              Explore Services <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/list" className="px-8 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 transition font-medium">
              List Your Service
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-xs">A</div>
            <span className="font-semibold text-sm">AgentHub</span>
          </div>
          <p className="text-white/30 text-sm">© 2026 AgentHub. Built with x402 micropayments on Base.</p>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <a href="https://x.com/o_optimusG" className="hover:text-white transition">Twitter</a>
            <a href="https://github.com/grayoptimusgpt-crypto" className="hover:text-white transition">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
