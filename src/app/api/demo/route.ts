import { NextRequest, NextResponse } from "next/server";

// Demo handlers for all 16 services
const DEMO_SERVICES: Record<string, (body: Record<string, unknown>) => Promise<Record<string, unknown>>> = {
  // 1. Text Summarizer
  "svc_1": async (body) => {
    const text = (body.text as string) || "";
    if (!text) return { error: "text is required" };
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    return { demo: true, summary: sentences.slice(0, 3).join(" "), sentenceCount: sentences.length, wordCount: text.split(/\s+/).length };
  },
  "svc_text-summarizer": async (b) => DEMO_SERVICES["svc_1"](b),

  // 2. Web Scraper
  "svc_2": async (body) => {
    const url = (body.url as string) || "https://example.com";
    return { demo: true, url, title: "Sample Article Title", content: "This is extracted content from the webpage. The full service uses Mozilla Readability to extract clean, readable content from any webpage.", byline: "Author Name" };
  },
  "svc_web-scraper": async (b) => DEMO_SERVICES["svc_2"](b),

  // 3. Sentiment Analyzer
  "svc_3": async (body) => {
    const text = (body.text as string) || "";
    const positive = ["good", "great", "love", "amazing", "excellent", "fantastic", "wonderful", "happy", "best", "perfect"];
    const negative = ["bad", "terrible", "hate", "awful", "horrible", "worst", "poor", "disgusting", "sad", "angry"];
    const words = text.toLowerCase().split(/\s+/);
    let pos = 0, neg = 0;
    words.forEach(w => { if (positive.some(p => w.includes(p))) pos++; if (negative.some(n => w.includes(n))) neg++; });
    const total = pos + neg;
    return { demo: true, sentiment: total === 0 ? "neutral" : pos > neg ? "positive" : "negative", confidence: total === 0 ? 0.5 : Math.max(pos, neg) / total, scores: { positive: pos/words.length, negative: neg/words.length, neutral: 1-(pos+neg)/words.length } };
  },
  "svc_sentiment-analyzer": async (b) => DEMO_SERVICES["svc_3"](b),

  // 4. Crypto Prices
  "svc_4": async (body) => {
    const coin = (body.coin as string) || "bitcoin";
    const prices: Record<string, number> = { bitcoin: 97500, ethereum: 3250, solana: 185, cardano: 0.85, dogecoin: 0.32, ripple: 2.45, solana: 185 };
    return { demo: true, coin, currency: "usd", price: prices[coin.toLowerCase()] || 0, marketCap: prices[coin.toLowerCase()] * 19000000, volume24h: prices[coin.toLowerCase()] * 2800000000, change24h: (Math.random() * 10 - 3).toFixed(2) };
  },
  "svc_crypto-price": async (b) => DEMO_SERVICES["svc_4"](b),

  // 5. Screenshot
  "svc_5": async (body) => {
    const url = (body.url as string) || "https://example.com";
    return { demo: true, url, width: 1280, height: 720, imageUrl: `https://image.thum.io/get/width/1280/height/720/crop/${encodeURIComponent(url)}` };
  },
  "svc_screenshot": async (b) => DEMO_SERVICES["svc_5"](b),

  // 6. Domain Enrichment
  "svc_6": async (body) => {
    const domain = (body.domain as string) || "example.com";
    return { demo: true, domain, dns: { A: ["93.184.216.34"], AAAA: ["2606:2800:220:1::1"], MX: ["mail.example.com"], NS: ["ns1.example.com"] }, technologies: ["Cloudflare", "Amazon S3", "React", "Stripe"], registrar: "Example Registrar Inc.", createdDate: "1995-08-14" };
  },
  "svc_domain-enrich": async (b) => DEMO_SERVICES["svc_6"](b),

  // 7. AI Image Generator (NEW)
  "svc_7": async (body) => {
    const prompt = (body.prompt as string) || "A beautiful sunset over mountains";
    const style = (body.style as string) || "realistic";
    return { demo: true, prompt, style, imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`, note: "Demo image. Full service generates high-quality AI images." };
  },
  "ai-image-generator": async (b) => DEMO_SERVICES["svc_7"](b),

  // 8. Language Translator (NEW)
  "svc_8": async (body) => {
    const text = (body.text as string) || "Hello world";
    const target = (body.target as string) || "es";
    const langs: Record<string, string> = { es: "Hola mundo", fr: "Bonjour le monde", de: "Hallo Welt", ja: "こんにちは世界", zh: "你好世界", ko: "안녕하세요 세계", pt: "Olá mundo", ru: "Привет мир" };
    return { demo: true, original: text, translated: langs[target] || text, source: "en", target, confidence: 0.95 };
  },
  "language-translator": async (b) => DEMO_SERVICES["svc_8"](b),

  // 9. Web Search (NEW)
  "svc_9": async (body) => {
    const query = (body.query as string) || "artificial intelligence";
    return { demo: true, query, results: [{ title: `${query} - Wikipedia`, url: "https://en.wikipedia.org/wiki/Artificial_intelligence", snippet: "Artificial intelligence is the intelligence of machines or software.", position: 1 }, { title: `What is ${query}?`, url: "https://example.com/article", snippet: "A comprehensive guide to understanding artificial intelligence and its applications.", position: 2 }], totalResults: 1250000 };
  },
  "web-search": async (b) => DEMO_SERVICES["svc_9"](b),

  // 10. AI Detector (NEW)
  "svc_10": async (body) => {
    const text = (body.text as string) || "The quick brown fox jumps over the lazy dog. This is a sample text for analysis.";
    const wordCount = text.split(/\s+/).length;
    const hasAI = wordCount > 20 && Math.random() > 0.3;
    return { demo: true, text: text.substring(0, 100) + "...", isAI: hasAI, confidence: 0.75 + Math.random() * 0.2, scores: { ai: hasAI ? 0.82 : 0.15, human: hasAI ? 0.18 : 0.85 }, wordCount, note: "Demo analysis." };
  },
  "ai-detector": async (b) => DEMO_SERVICES["svc_10"](b),

  // 11. QR Generator (NEW)
  "svc_11": async (body) => {
    const content = (body.content as string) || "https://example.com";
    const size = (body.size as number) || 300;
    return { demo: true, content, size, qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(content)}`, note: "Demo QR code." };
  },
  "qr-generator": async (b) => DEMO_SERVICES["svc_11"](b),

  // 12. URL Shortener (NEW)
  "svc_12": async (body) => {
    const url = (body.url as string) || "https://example.com/very/long/url/path";
    const shortCode = Math.random().toString(36).substring(2, 8);
    return { demo: true, original: url, shortUrl: `https://agenthub.market/${shortCode}`, shortCode, expiresIn: "30 days", clicks: 0 };
  },
  "url-shortener": async (b) => DEMO_SERVICES["svc_12"](b),

  // 13. Email Validator (NEW)
  "svc_13": async (body) => {
    const email = (body.email as string) || "test@example.com";
    const isValid = email.includes("@") && email.includes(".");
    const domains = ["gmail.com", "yahoo.com", "outlook.com"];
    const domain = email.split("@")[1] || "";
    return { demo: true, email, isValid, isDeliverable: isValid && domains.some(d => domain.includes(d)), isDisposable: domain.includes("tempmail"), score: isValid ? 85 : 20 };
  },
  "email-validator": async (b) => DEMO_SERVICES["svc_13"](b),

  // 14. Weather API (NEW)
  "svc_14": async (body) => {
    const location = (body.location as string) || "San Francisco";
    return { demo: true, location, temperature: 72, feelsLike: 70, humidity: 65, windSpeed: 12, condition: "Partly Cloudy", icon: "partly-cloudy", forecast: [{ day: "Today", high: 75, low: 60 }, { day: "Tomorrow", high: 78, low: 62 }] };
  },
  "weather-api": async (b) => DEMO_SERVICES["svc_14"](b),

  // 15. News Aggregator (NEW)
  "svc_15": async (body) => {
    const topic = (body.topic as string) || "technology";
    return { demo: true, topic, articles: [{ title: "AI Breakthrough: New Model Achieves Human-Level Performance", source: "TechCrunch", publishedAt: "2026-02-14T10:00:00Z", url: "https://example.com/article1", summary: "A new AI model has achieved unprecedented performance..." }, { title: "Cryptocurrency Market Update", source: "CoinDesk", publishedAt: "2026-02-14T09:30:00Z", url: "https://example.com/article2", summary: "Bitcoin and Ethereum see moderate gains..." }], totalResults: 42 };
  },
  "news-aggregator": async (b) => DEMO_SERVICES["svc_15"](b),

  // 16. YouTube Transcript (NEW)
  "svc_16": async (body) => {
    const videoUrl = (body.videoUrl as string) || "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    return { demo: true, videoUrl, title: "Sample Video Title", transcript: "[00:00] Welcome to this video...\n[00:15] Today we're going to discuss...\n[00:30] The main topic is...\n[00:45] Let's dive in...", duration: "10:32", language: "en", chapters: [{ time: "0:00", title: "Introduction" }, { time: "3:00", title: "Main Content" }, { time: "8:00", title: "Conclusion" }] };
  },
  "youtube-transcript": async (b) => DEMO_SERVICES["svc_16"](b),
};

const rateLimitMap = new Map<string, { count: number; reset: number }>();

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();

  const rl = rateLimitMap.get(ip);
  if (rl && rl.reset > now && rl.count >= 10) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again in 1 hour." }, { status: 429 });
  }
  if (!rl || rl.reset <= now) {
    rateLimitMap.set(ip, { count: 1, reset: now + 3600000 });
  } else {
    rl.count++;
  }

  try {
    const body = await request.json();
    let serviceId = (body.serviceId as string) || "";
    
    // Try exact match, then prefix match
    const handler = DEMO_SERVICES[serviceId] || Object.keys(DEMO_SERVICES).find(k => serviceId.startsWith(k.replace("svc_", "").replace(/-/g, ""))) || DEMO_SERVICES[serviceId.replace("svc_", "")];
    
    if (!handler) {
      return NextResponse.json({ error: "Service not found or demo not available" }, { status: 404 });
    }

    const result = await handler(body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
