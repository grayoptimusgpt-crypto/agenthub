import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentHub — Discover & Pay for AI Agent Services",
  description: "The marketplace where humans and AI agents discover, try, and pay for AI services with sub-cent micropayments. No subscriptions, no API keys — just pay per use with USDC.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "AgentHub — AI Agent Marketplace",
    description: "Pay-per-use AI agent services with x402 micropayments on Base",
    type: "website",
    images: [{ url: "/assets/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentHub — Discover & Pay for AI Agents",
    description: "Pay-per-use AI agent services with x402 micropayments",
    images: ["/assets/og-image.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
