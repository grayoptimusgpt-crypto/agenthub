"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft, ExternalLink, Loader2, Copy, Check } from "lucide-react";

const API_BASE = "https://agenthub-gamma-wine.vercel.app";

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  endpoint: string;
  pricing: { amount: string; humanPrice: string; currency: string };
  stats: { totalCalls: number; revenue: string };
  icon: string;
}

const ICONS: Record<string, string> = {
  "svc_text-summarizer": "📝",
  "svc_web-scraper": "🌐",
  "svc_sentiment-analyzer": "🎭",
};

const DEMO_SERVICES: Service[] = [
  {
    id: "svc_text-summarizer",
    name: "Text Summarizer",
    description: "Summarize any text or URL into concise bullet points",
    category: "nlp",
    tags: ["summarization", "text", "ai"],
    endpoint: "https://x402-apis.vercel.app/api/summarize",
    pricing: { amount: "10000", humanPrice: "$0.01", currency: "USDC" },
    stats: { totalCalls: 142, revenue: "1.42" },
    icon: "📝",
  },
  {
    id: "svc_web-scraper",
    name: "Web Scraper",
    description: "Extract readable content from any webpage",
    category: "data",
    tags: ["scraping", "web", "extraction"],
    endpoint: "https://x402-apis.vercel.app/api/scrape",
    pricing: { amount: "5000", humanPrice: "$0.005", currency: "USDC" },
    stats: { totalCalls: 89, revenue: "0.445" },
    icon: "🌐",
  },
  {
    id: "svc_sentiment-analyzer",
    name: "Sentiment Analyzer",
    description: "Analyze sentiment of text with confidence scores",
    category: "nlp",
    tags: ["sentiment", "analysis", "ai"],
    endpoint: "https://x402-apis.vercel.app/api/sentiment",
    pricing: { amount: "5000", humanPrice: "$0.005", currency: "USDC" },
    stats: { totalCalls: 56, revenue: "0.28" },
    icon: "🎭",
  },
];

function ServiceCard({ service, onSelect, selected }: { service: Service; onSelect: (s: Service) => void; selected: boolean }) {
  return (
    <button
      onClick={() => onSelect(service)}
      className={`w-full text-left p-5 rounded-xl border transition ${
        selected
          ? "bg-purple-500/10 border-purple-500/30"
          : "bg-white/[0.03] border-white/[0.06] hover:border-white/10"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{service.icon}</span>
        <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-white/50">{service.category}</span>
      </div>
      <h3 className="font-semibold mb-1">{service.name}</h3>
      <p className="text-sm text-white/40 mb-3">{service.description}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="text-purple-400 font-medium">{service.pricing.humanPrice}/call</span>
        <span className="text-white/30">{service.stats.totalCalls} calls</span>
      </div>
    </button>
  );
}

function TryPanel({ service }: { service: Service }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTry = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // Demo mode: call our local demo endpoint
      const payload = service.id === "svc_web-scraper"
        ? { serviceId: service.id, url: input }
        : { serviceId: service.id, text: input };
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 402) {
        // Show payment required info
        const data = await res.json();
        setResult(JSON.stringify({ paymentRequired: true, ...data }, null, 2));
      } else {
        const data = await res.json();
        setResult(JSON.stringify(data, null, 2));
      }
    } catch (e) {
      setError("Failed to reach service. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const curlExample = service.id === "svc_web-scraper"
    ? `curl -X POST ${service.endpoint} \\
  -H "Content-Type: application/json" \\
  -H "X-Payment: <your-x402-token>" \\
  -d '{"url": "https://example.com"}'`
    : `curl -X POST ${service.endpoint} \\
  -H "Content-Type: application/json" \\
  -H "X-Payment: <your-x402-token>" \\
  -d '{"text": "Your text here..."}'`;

  const handleCopy = () => {
    navigator.clipboard.writeText(curlExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Service header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">{service.icon}</span>
        <div>
          <h2 className="text-xl font-bold">{service.name}</h2>
          <p className="text-sm text-white/40">{service.description}</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
          <div className="text-purple-400 font-semibold">{service.pricing.humanPrice}</div>
          <div className="text-xs text-white/40 mt-1">per call</div>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
          <div className="font-semibold">{service.stats.totalCalls}</div>
          <div className="text-xs text-white/40 mt-1">total calls</div>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
          <div className="font-semibold">{service.pricing.currency}</div>
          <div className="text-xs text-white/40 mt-1">on Base</div>
        </div>
      </div>

      {/* Try it */}
      <div>
        <label className="text-sm font-medium text-white/60 mb-2 block">
          {service.id === "svc_web-scraper" ? "Enter URL" : "Enter text"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            service.id === "svc_web-scraper"
              ? "https://example.com"
              : "Enter text to analyze..."
          }
          className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 resize-none h-24"
        />
        <button
          onClick={handleTry}
          disabled={loading || !input.trim()}
          className="mt-3 px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm font-medium flex items-center gap-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : "Try it (demo)"}
        </button>
      </div>

      {/* Result */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}
      {result && (
        <div className="rounded-lg bg-[#0d0d1a] border border-white/[0.06] overflow-hidden">
          <div className="px-4 py-2 border-b border-white/5 text-xs text-white/30">Response</div>
          <pre className="p-4 text-sm text-white/60 overflow-x-auto max-h-64 overflow-y-auto"><code>{result}</code></pre>
        </div>
      )}

      {/* cURL example */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white/60">API Example</span>
          <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition">
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="rounded-lg bg-[#0d0d1a] border border-white/[0.06] p-4">
          <pre className="text-xs text-white/50 overflow-x-auto"><code>{curlExample}</code></pre>
        </div>
      </div>

      {/* Endpoint link */}
      <a
        href={service.endpoint}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition"
      >
        <ExternalLink className="w-4 h-4" /> View endpoint directly
      </a>
    </div>
  );
}

export default function ExplorePage() {
  const [services] = useState<Service[]>(DEMO_SERVICES);
  const [selected, setSelected] = useState<Service>(DEMO_SERVICES[0]);
  const [search, setSearch] = useState("");

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#050510]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-xs">A</div>
            <span className="font-semibold text-sm">AgentHub</span>
          </div>
          <div className="w-16" />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Explore Services</h1>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Service list */}
          <div className="md:col-span-2 space-y-4">
            {filtered.map((s) => (
              <ServiceCard key={s.id} service={s} onSelect={setSelected} selected={selected.id === s.id} />
            ))}
            {filtered.length === 0 && (
              <p className="text-white/40 text-sm text-center py-8">No services found.</p>
            )}
          </div>

          {/* Try panel */}
          <div className="md:col-span-3">
            <div className="sticky top-20 p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <TryPanel service={selected} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
