import { NextRequest, NextResponse } from "next/server";

// Simple demo endpoint that provides limited free access to showcase services
// Rate limited: 10 requests per IP per hour

const rateLimitMap = new Map<string, { count: number; reset: number }>();

const DEMO_SERVICES: Record<string, (body: Record<string, string>) => Promise<Record<string, unknown>>> = {
  "svc_text-summarizer": async (body) => {
    const text = body.text || "";
    if (!text) return { error: "text is required" };
    // Simple extractive summary for demo
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const summary = sentences.slice(0, 3).map((s) => s.trim()).join(" ");
    return {
      demo: true,
      summary,
      sentenceCount: sentences.length,
      note: "This is a free demo. Full service uses advanced summarization.",
    };
  },
  "svc_web-scraper": async (body) => {
    const url = body.url;
    if (!url) return { error: "url is required" };
    return {
      demo: true,
      url,
      title: "(Demo) Full scraping requires x402 payment",
      content: "To extract actual content, call the endpoint with an X-Payment header.",
      note: "Free demo shows the API structure. Pay to get real results.",
    };
  },
  "svc_sentiment-analyzer": async (body) => {
    const text = body.text || "";
    if (!text) return { error: "text is required" };
    // Simple word-based sentiment for demo
    const positive = ["good", "great", "love", "happy", "best", "amazing", "wonderful", "excellent", "awesome", "fantastic"];
    const negative = ["bad", "terrible", "hate", "sad", "worst", "awful", "horrible", "poor", "ugly", "disgusting"];
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    words.forEach((w) => {
      if (positive.some((p) => w.includes(p))) score++;
      if (negative.some((n) => w.includes(n))) score--;
    });
    const sentiment = score > 0 ? "positive" : score < 0 ? "negative" : "neutral";
    return {
      demo: true,
      sentiment,
      score: Math.max(-1, Math.min(1, score / Math.max(words.length, 1) * 5)),
      wordCount: words.length,
      note: "This is a free demo using basic word matching. Full service uses NLP models.",
    };
  },
};

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();

  // Rate limit
  const rl = rateLimitMap.get(ip);
  if (rl && rl.reset > now && rl.count >= 10) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
  }
  if (!rl || rl.reset <= now) {
    rateLimitMap.set(ip, { count: 1, reset: now + 3600000 });
  } else {
    rl.count++;
  }

  try {
    const body = await request.json();
    const serviceId = body.serviceId;

    const handler = DEMO_SERVICES[serviceId];
    if (!handler) {
      return NextResponse.json({ error: "Service not found or demo not available" }, { status: 404 });
    }

    const result = await handler(body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
