import { NextRequest, NextResponse } from "next/server";
import { services, initializeDb } from "@/lib/storage";

let dbInitialized = false;

async function ensureDb() {
  if (!dbInitialized) {
    await initializeDb();
    
    const existing = await services.findAll();
    if (existing.length === 0) {
      const seeds = [
        // Original 6
        { name: "Text Summarizer", description: "Summarize any text or URL into concise bullet points using advanced NLP.", category: "nlp", tags: ["summarization", "text", "ai"], endpoint: "https://x402-apis.vercel.app/api/summarize", price: 10000 },
        { name: "Web Scraper", description: "Extract readable content from any webpage.", category: "data", tags: ["scraping", "web"], endpoint: "https://x402-apis.vercel.app/api/scrape", price: 5000 },
        { name: "Sentiment Analyzer", description: "Analyze sentiment of text with confidence scores.", category: "nlp", tags: ["sentiment", "analysis"], endpoint: "https://x402-apis.vercel.app/api/sentiment", price: 5000 },
        { name: "Crypto Prices", description: "Real-time cryptocurrency price data.", category: "finance", tags: ["crypto", "price"], endpoint: "https://x402-apis.vercel.app/api/crypto/price", price: 1000 },
        { name: "Screenshot", description: "Capture full-page screenshots of any website.", category: "data", tags: ["screenshot", "web"], endpoint: "https://x402-apis.vercel.app/api/screenshot", price: 10000 },
        { name: "Domain Enrichment", description: "Get DNS records and tech stack detection.", category: "data", tags: ["domain", "dns"], endpoint: "https://x402-apis.vercel.app/api/enrich/domain", price: 10000 },
        
        // New 10
        { name: "AI Image Generator", description: "Generate stunning images from text descriptions using AI.", category: "image", tags: ["ai", "image", "generation", "art"], endpoint: "https://api.agenthub.market/img/generate", price: 20000 },
        { name: "Language Translator", description: "Translate text between 50+ languages with AI.", category: "nlp", tags: ["translation", "language", "nlp"], endpoint: "https://api.agenthub.market/translate", price: 5000 },
        { name: "Web Search", description: "Search the web for real-time information and answers.", category: "data", tags: ["search", "web", "information"], endpoint: "https://api.agenthub.market/search", price: 10000 },
        { name: "AI Detector", description: "Detect if text was written by AI with confidence score.", category: "nlp", tags: ["ai", "detector", "plagiarism"], endpoint: "https://api.agenthub.market/detect-ai", price: 5000 },
        { name: "QR Generator", description: "Generate QR codes from text, URLs, or contact info.", category: "tools", tags: ["qr", "code", "generator"], endpoint: "https://api.agenthub.market/qrcode", price: 2000 },
        { name: "URL Shortener", description: "Shorten long URLs with custom aliases and tracking.", category: "tools", tags: ["url", "shortener", "link"], endpoint: "https://api.agenthub.market/shorten", price: 1000 },
        { name: "Email Validator", description: "Validate email addresses for deliverability.", category: "tools", tags: ["email", "validator", "verification"], endpoint: "https://api.agenthub.market/validate-email", price: 2000 },
        { name: "Weather API", description: "Get current weather and forecasts for any location.", category: "data", tags: ["weather", "forecast", "location"], endpoint: "https://api.agenthub.market/weather", price: 3000 },
        { name: "News Aggregator", description: "Get latest news headlines from top sources.", category: "data", tags: ["news", "headlines", "media"], endpoint: "https://api.agenthub.market/news", price: 5000 },
        { name: "YouTube Transcript", description: "Extract transcripts from YouTube videos.", category: "data", tags: ["youtube", "transcript", "video"], endpoint: "https://api.agenthub.market/youtube-transcript", price: 8000 },
      ];
      
      for (const seed of seeds) {
        await services.create({
          name: seed.name,
          description: seed.description,
          category: seed.category,
          tags: seed.tags,
          endpoint: seed.endpoint,
          userId: 1,
          pricing: { amount: String(seed.price), currency: "USDC", network: "base", humanPrice: `$${seed.price / 1e6}` },
          inputSchema: null,
          outputSchema: null,
        });
      }
    }
    
    dbInitialized = true;
  }
}

export async function GET(request: NextRequest) {
  await ensureDb();
  
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  if (id) {
    const service = await services.findById(id);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    return NextResponse.json({ service });
  }

  const category = searchParams.get("category") || undefined;
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search")?.toLowerCase();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));

  let results = await services.findAll({ category, status });

  if (search) {
    results = results.filter((s: any) =>
      s.name.toLowerCase().includes(search) ||
      (s.description?.toLowerCase().includes(search)) ||
      (s.tags?.some((t: string) => t.toLowerCase().includes(search)))
    );
  }

  const total = results.length;
  const paginated = results.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    services: paginated,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(request: NextRequest) {
  await ensureDb();
  
  try {
    const body = await request.json();
    const { name, description, category, tags, endpoint, pricing, inputSchema, outputSchema, userId } = body;

    if (!name || !endpoint || !pricing?.amount) {
      return NextResponse.json({ error: "name, endpoint, and pricing.amount are required" }, { status: 400 });
    }

    const service = await services.create({
      name,
      description: description || "",
      category: category || "other",
      tags: tags || [],
      endpoint,
      userId: userId || 0,
      pricing: {
        amount: pricing.amount,
        currency: pricing.currency || "USDC",
        network: pricing.network || "base",
        humanPrice: pricing.humanPrice || `$${(parseInt(pricing.amount) / 1e6).toFixed(4)}`,
      },
      inputSchema: inputSchema || null,
      outputSchema: outputSchema || null,
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (e) {
    console.error("Error creating service:", e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
