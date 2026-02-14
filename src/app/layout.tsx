import type { Metadata } from "next";
import Link from "next/link";
import { Providers } from "@/providers/AuthProvider";
import { AuthButton } from "@/app/auth/signin/page";
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

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-white/60 hover:text-white transition text-sm">
      {children}
    </a>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <Providers>
          <nav className="fixed top-0 w-full z-50 bg-[#050510]/80 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-sm">A</div>
                <span className="text-lg font-semibold">AgentHub</span>
              </Link>
              <div className="hidden md:flex items-center gap-6 lg:gap-8">
                <NavLink href="/explore">Services</NavLink>
                <NavLink href="#how-it-works">How It Works</NavLink>
                <NavLink href="#pricing">Pricing</NavLink>
                <NavLink href="/developers">Docs</NavLink>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/explore" className="hidden sm:block text-sm text-white/60 hover:text-white transition">Explore</Link>
                <AuthButton />
              </div>
            </div>
          </nav>
          <div className="pt-16">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
