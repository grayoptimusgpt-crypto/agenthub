"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowLeft, ExternalLink, Loader2, Copy, Check, ChevronDown, ChevronRight, BookOpen, Play, Code, Flame, Clock, DollarSign, Sparkles } from "lucide-react";

interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

interface ServiceSchema {
  input: SchemaField[];
  output: SchemaField[];
}

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
  documentation?: string;
  inputSchema?: ServiceSchema["input"];
  outputSchema?: ServiceSchema["output"];
  createdAt?: string;
}

// Icon mapping
const ICONS: Record<string, string> = {
  nlp: "💬",
  data: "📊",
  finance: "💰",
  image: "🖼️",
  code: "💻",
  other: "🔌",
};

// Map API IDs to schema keys
const ID_TO_SCHEMA: Record<string, string> = {
  "svc_1": "svc_text-summarizer",
  "svc_2": "svc_web-scraper",
  "svc_3": "svc_sentiment-analyzer",
  "svc_4": "svc_crypto-price",
  "svc_5": "svc_screenshot",
  "svc_6": "svc_domain-enrich",
  "svc_7": "ai-image-generator",
  "svc_8": "language-translator",
  "svc_9": "web-search",
  "svc_10": "ai-detector",
  "svc_11": "qr-generator",
  "svc_12": "url-shortener",
  "svc_13": "email-validator",
  "svc_14": "weather-api",
  "svc_15": "news-aggregator",
  "svc_16": "youtube-transcript",
};

function getSchema(serviceId: string) {
  const schemaKey = ID_TO_SCHEMA[serviceId] || serviceId;
  return SERVICE_SCHEMAS[schemaKey] || { input: [], output: [], documentation: "" };
}

const SERVICE_SCHEMAS: Record<string, { documentation: string; input: SchemaField[]; output: SchemaField[] }> = {
  "svc_text-summarizer": {
    documentation: "Uses extractive summarization to identify key sentences and condense them into bullet points.",
    input: [
      { name: "text", type: "string", required: true, description: "The text content to summarize", example: "Your long article text here..." },
      { name: "maxLength", type: "number", required: false, description: "Maximum summary length in words", example: "100" },
      { name: "style", type: "string", required: false, description: "Summary style: 'bullets' | 'paragraph'", example: "bullets" },
    ],
    output: [
      { name: "summary", type: "string", required: true, description: "The generated summary" },
      { name: "sentenceCount", type: "number", required: true, description: "Number of sentences in original text" },
      { name: "wordCount", type: "number", required: true, description: "Word count of original text" },
    ],
  },
  "svc_web-scraper": {
    documentation: "Uses Mozilla Readability to extract main content from web pages. Ideal for content aggregation, research, and archiving.",
    input: [
      { name: "url", type: "string", required: true, description: "The URL of the webpage to scrape", example: "https://example.com/article" },
    ],
    output: [
      { name: "title", type: "string", required: true, description: "Page title" },
      { name: "content", type: "string", required: true, description: "Extracted text content" },
      { name: "byline", type: "string", required: false, description: "Author/date information" },
      { name: "excerpt", type: "string", required: false, description: "Short excerpt/description" },
    ],
  },
  "svc_sentiment-analyzer": {
    documentation: "Uses NLP models to classify text sentiment. Returns sentiment label and confidence score (0-1).",
    input: [
      { name: "text", type: "string", required: true, description: "The text to analyze", example: "This product is amazing! I love it so much." },
      { name: "language", type: "string", required: false, description: "Language code (en, es, fr, etc.)", example: "en" },
    ],
    output: [
      { name: "sentiment", type: "string", required: true, description: "Sentiment: 'positive' | 'negative' | 'neutral'", example: "positive" },
      { name: "confidence", type: "number", required: true, description: "Confidence score between 0 and 1", example: "0.95" },
      { name: "scores", type: "object", required: true, description: "Detailed scores for each sentiment" },
    ],
  },
  "svc_crypto-price": {
    documentation: "Fetches live prices from CoinGecko API. Supports 10,000+ cryptocurrencies.",
    input: [
      { name: "coin", type: "string", required: true, description: "Coin ID (e.g., 'bitcoin', 'ethereum')", example: "bitcoin" },
      { name: "currency", type: "string", required: false, description: "Fiat currency (usd, eur, etc.)", example: "usd" },
    ],
    output: [
      { name: "price", type: "number", required: true, description: "Current price in specified currency" },
      { name: "marketCap", type: "number", required: true, description: "Market capitalization" },
      { name: "volume24h", type: "number", required: true, description: "24-hour trading volume" },
      { name: "change24h", type: "number", required: true, description: "24-hour price change percentage" },
    ],
  },
  "svc_screenshot": {
    documentation: "Uses thum.io API to capture screenshots. Useful for archiving, preview generation, and monitoring.",
    input: [
      { name: "url", type: "string", required: true, description: "URL to capture", example: "https://example.com" },
      { name: "width", type: "number", required: false, description: "Viewport width in pixels", example: "1280" },
      { name: "height", type: "number", required: false, description: "Viewport height in pixels", example: "720" },
    ],
    output: [
      { name: "imageUrl", type: "string", required: true, description: "URL of the generated screenshot" },
      { name: "width", type: "number", required: true, description: "Actual image width" },
      { name: "height", type: "number", required: true, description: "Actual image height" },
    ],
  },
  "svc_domain-enrich": {
    documentation: "Performs DNS lookups, WHOIS queries, and technology stack detection. Useful for lead enrichment and security research.",
    input: [
      { name: "domain", type: "string", required: true, description: "Domain name to enrich", example: "vercel.com" },
      { name: "includeWhois", type: "boolean", required: false, description: "Include WHOIS data", example: "true" },
    ],
    output: [
      { name: "domain", type: "string", required: true, description: "Input domain" },
      { name: "dns", type: "object", required: true, description: "DNS records (A, AAAA, CNAME, MX, TXT)" },
      { name: "technologies", type: "array", required: true, description: "Detected technologies", example: "['Next.js', 'Vercel', 'React']" },
      { name: "registrar", type: "string", required: false, description: "Domain registrar" },
    ],
  },
};

const CATEGORIES = [
  { id: "", label: "All" },
  { id: "nlp", label: "NLP" },
  { id: "data", label: "Data" },
  { id: "finance", label: "Finance" },
  { id: "image", label: "Image" },
  { id: "code", label: "Code" },
  { id: "other", label: "Other" },
];

const SORT_OPTIONS = [
  { id: "popular", label: "Most Popular", icon: Flame },
  { id: "newest", label: "Newest", icon: Clock },
  { id: "price-low", label: "Price: Low to High", icon: DollarSign },
  { id: "price-high", label: "Price: High to Low", icon: DollarSign },
];

function SchemaViewer({ title, fields }: { title: string; fields: SchemaField[] }) {
  const [expanded, setExpanded] = useState(true);
  
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 transition"
      >
        <span className="font-medium text-sm">{title}</span>
        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {expanded && (
        <div className="p-4 space-y-3">
          {fields.map((field, i) => (
            <div key={i} className="flex gap-3 text-sm flex-wrap">
              <code className="text-purple-400 shrink-0">{field.name}</code>
              <span className="text-white/30">:</span>
              <span className="text-blue-400 shrink-0">{field.type}</span>
              {field.required && <span className="text-red-400 text-xs">[required]</span>}
              <span className="text-white/50">{field.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TryPanel({ service }: { service: Service }) {
  const [activeTab, setActiveTab] = useState<"form" | "curl">("form");
  const schema = getSchema(service.id);
  
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    schema.input.forEach((f) => {
      defaults[f.name] = f.example || "";
    });
    return defaults;
  });
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTry = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const payload: Record<string, unknown> = { serviceId: service.id };
      schema.input.forEach((f) => {
        if (formData[f.name]) {
          if (f.type === "number") payload[f.name] = Number(formData[f.name]);
          else if (f.type === "boolean") payload[f.name] = formData[f.name] === "true";
          else payload[f.name] = formData[f.name];
        }
      });

      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch {
      setError("Failed to reach service. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const exampleInput: Record<string, string> = {};
  schema.input.forEach(f => { if (f.example) exampleInput[f.name] = f.example; });
  
  const curlExample = `curl -X POST ${service.endpoint} \\
  -H "Content-Type: application/json" \\
  -H "X-Payment: <your-x402-token>" \\
  -d '${JSON.stringify(exampleInput, null, 2)}'`;

  const handleCopy = () => {
    navigator.clipboard.writeText(curlExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <span className="text-4xl">{ICONS[service.category] || "🔌"}</span>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{service.name}</h2>
          <p className="text-white/50 text-sm mt-1">{service.description}</p>
        </div>
      </div>

      {/* Documentation */}
      {schema.documentation && (
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-blue-400 mt-0.5" />
            <p className="text-sm text-blue-200">{schema.documentation}</p>
          </div>
        </div>
      )}

      {/* Pricing & Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
          <div className="text-purple-400 font-semibold">{service.pricing.humanPrice}</div>
          <div className="text-xs text-white/40 mt-1">per call</div>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
          <div className="font-semibold">{service.stats.totalCalls || 0}</div>
          <div className="text-xs text-white/40 mt-1">total calls</div>
        </div>
        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-center">
          <div className="font-semibold">{service.pricing.currency}</div>
          <div className="text-xs text-white/40 mt-1">on Base</div>
        </div>
      </div>

      {/* Input/Output Schemas */}
      {schema.input.length > 0 && (
        <SchemaViewer title="Input Parameters" fields={schema.input} />
      )}
      {schema.output.length > 0 && (
        <SchemaViewer title="Response Schema" fields={schema.output} />
      )}

      {/* Try It / cURL Tabs */}
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab("form")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "form" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
            }`}
          >
            <Play className="w-4 h-4" /> Try It
          </button>
          <button
            onClick={() => setActiveTab("curl")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "curl" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
            }`}
          >
            <Code className="w-4 h-4" /> cURL
          </button>
        </div>

        <div className="p-4">
          {activeTab === "form" ? (
            <div className="space-y-4">
              {schema.input.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">
                    {field.name}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    value={formData[field.name] || ""}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    placeholder={field.example}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
                  />
                  <p className="text-xs text-white/30 mt-1">{field.description}</p>
                </div>
              ))}
              <button
                onClick={handleTry}
                disabled={loading || !schema.input.some((f) => formData[f.name] && f.required)}
                className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm font-medium flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <>Run Request</>}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/40">Production API call</span>
                <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="text-xs text-white/60 overflow-x-auto bg-black/30 p-3 rounded"><code>{curlExample}</code></pre>
            </div>
          )}
        </div>
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

      {/* Endpoint link */}
      <a href={service.endpoint} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition">
        <ExternalLink className="w-4 h-4" /> View endpoint directly
      </a>
    </div>
  );
}

function ServiceCard({ service, onSelect, selected }: { service: Service; onSelect: (s: Service) => void; selected: boolean }) {
  return (
    <button
      onClick={() => onSelect(service)}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
        selected 
          ? "bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30 shadow-lg shadow-purple-500/10" 
          : "bg-white/[0.03] border-white/[0.06] hover:border-white/15 hover:bg-white/[0.05]"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-2xl">
          {ICONS[service.category] || "🔌"}
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/50 font-medium">{service.category}</span>
      </div>
      <h3 className="font-semibold mb-1.5 text-base">{service.name}</h3>
      <p className="text-sm text-white/40 mb-4 line-clamp-2 leading-relaxed">{service.description}</p>
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-purple-400 font-medium text-sm">{service.pricing.humanPrice}</span>
          <span className="text-white/30 text-xs">/call</span>
        </div>
        <div className="flex items-center gap-1 text-white/30 text-xs">
          <Flame className="w-3 h-3" />
          {service.stats.totalCalls || 0}
        </div>
      </div>
    </button>
  );
}

export default function ExplorePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selected, setSelected] = useState<Service | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data.services || []);
        if (data.services?.length > 0) {
          setSelected(data.services[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = services.filter((s) => {
    const matchesSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !category || s.category === category;
    return matchesSearch && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return (b.stats.totalCalls || 0) - (a.stats.totalCalls || 0);
      case "newest":
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case "price-low":
        return parseFloat(a.pricing.humanPrice.replace("$", "")) - parseFloat(b.pricing.humanPrice.replace("$", ""));
      case "price-high":
        return parseFloat(b.pricing.humanPrice.replace("$", "")) - parseFloat(a.pricing.humanPrice.replace("$", ""));
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

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
          <Link href="/dashboard" className="text-sm text-purple-400 hover:text-purple-300 transition">
            Sign In
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Explore Services</h1>
            <p className="text-white/50 text-sm mt-1">Discover AI agents you can pay per-use</p>
          </div>
          <Link href="/list" className="px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 transition text-sm font-medium whitespace-nowrap w-fit">
            List Your Service
          </Link>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat.id
                  ? "bg-purple-600 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-purple-500/50 cursor-pointer min-w-[160px]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-white/40 mb-4">{sorted.length} services found</p>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Service list */}
          <div className="md:col-span-2 space-y-3">
            {sorted.map((s) => (
              <ServiceCard key={s.id} service={s} onSelect={setSelected} selected={selected?.id === s.id} />
            ))}
            {sorted.length === 0 && (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">No services found.</p>
                <p className="text-white/20 text-xs mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className="md:col-span-3">
            {selected ? (
              <div className="sticky top-20 p-4 sm:p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] max-h-[calc(100vh-180px)] overflow-y-auto">
                <TryPanel service={selected} />
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center text-white/40">
                Select a service to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
