"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

const API_BASE = "https://agenthub-gamma-wine.vercel.app";

export default function ListServicePage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "nlp",
    endpoint: "",
    priceUsd: "0.01",
    tags: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const priceAmount = String(Math.round(parseFloat(form.priceUsd) * 1e6));
      const res = await fetch(`${API_BASE}/api/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          category: form.category,
          endpoint: form.endpoint,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          pricing: {
            amount: priceAmount,
            humanPrice: `$${form.priceUsd}`,
          },
          developer: "anonymous",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to list service");
      }

      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Service Listed!</h1>
          <p className="text-white/50 mb-8">Your service is now visible in the AgentHub marketplace. Agents can discover and pay for it via x402.</p>
          <Link href="/explore" className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 transition font-medium">
            View Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 bg-[#050510]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">List Your Service</h1>
        <p className="text-white/50 mb-8">Add your AI agent service to the marketplace. Earn USDC on every API call.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Service Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Image Classifier"
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Description</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What does your service do?"
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50 resize-none h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
              >
                <option value="nlp">NLP</option>
                <option value="data">Data</option>
                <option value="finance">Finance</option>
                <option value="image">Image</option>
                <option value="code">Code</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Price (USD)</label>
              <input
                required
                type="number"
                step="0.001"
                min="0.001"
                value={form.priceUsd}
                onChange={(e) => setForm({ ...form, priceUsd: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">API Endpoint</label>
            <input
              required
              type="url"
              value={form.endpoint}
              onChange={(e) => setForm({ ...form, endpoint: e.target.value })}
              placeholder="https://your-api.com/endpoint"
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Tags (comma-separated)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="ai, nlp, classification"
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 transition font-medium flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "List Service"}
          </button>
        </form>
      </div>
    </div>
  );
}
