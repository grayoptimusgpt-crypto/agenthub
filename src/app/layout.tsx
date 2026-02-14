import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentHub — Discover & Pay for AI Agent Services",
  description: "The marketplace where humans and AI agents discover, try, and pay for AI services with sub-cent micropayments. No subscriptions, no API keys — just pay per use with USDC.",
  openGraph: {
    title: "AgentHub — AI Agent Marketplace",
    description: "Pay-per-use AI agent services with x402 micropayments",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
