"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, BarChart3, Settings, LogOut, ExternalLink, TrendingUp, DollarSign, Activity } from "lucide-react";

// Mock user data (would come from session in production)
const MOCK_USER = {
  name: "Demo Developer",
  email: "dev@example.com",
  image: null,
  provider: "github",
  services: [
    {
      id: 1,
      name: "My Text Analyzer",
      endpoint: "https://my-api.com/analyze",
      status: "active",
      calls: 234,
      revenue: "2.34",
    },
    {
      id: 2,
      name: "Image Classifier",
      endpoint: "https://my-api.com/classify",
      status: "active",
      calls: 89,
      revenue: "0.89",
    },
  ],
};

export default function DashboardPage() {
  const [user] = useState(MOCK_USER);

  const totalCalls = user.services.reduce((sum, s) => sum + s.calls, 0);
  const totalRevenue = user.services.reduce((sum, s) => sum + parseFloat(s.revenue), 0);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#050510]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-xs">A</div>
            <span className="font-semibold text-sm">AgentHub</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-white/60 hover:text-white transition text-sm flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-white/50">Manage your services and view analytics</p>
          </div>
          <Link href="/list" className="px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 transition text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New Service
          </Link>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-white/50 text-sm">Total Calls</span>
            </div>
            <div className="text-2xl font-bold">{totalCalls.toLocaleString()}</div>
          </div>
          <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-white/50 text-sm">Total Revenue</span>
            </div>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)} USDC</div>
          </div>
          <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-white/50 text-sm">Active Services</span>
            </div>
            <div className="text-2xl font-bold">{user.services.length}</div>
          </div>
        </div>

        {/* Services */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Your Services</h2>
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-5 py-3 text-sm font-medium text-white/50">Service</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-white/50">Endpoint</th>
                  <th className="text-left px-5 py-3 text-sm font-medium text-white/50">Status</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-white/50">Calls</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-white/50">Revenue</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-white/50"></th>
                </tr>
              </thead>
              <tbody>
                {user.services.map((service) => (
                  <tr key={service.id} className="border-b border-white/[0.06] last:border-0">
                    <td className="px-5 py-4 font-medium">{service.name}</td>
                    <td className="px-5 py-4">
                      <code className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">{service.endpoint}</code>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        {service.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-white/70">{service.calls.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right text-green-400">${service.revenue}</td>
                    <td className="px-5 py-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-white/5 transition">
                        <Settings className="w-4 h-4 text-white/40" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/list" className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/30 transition group">
              <Plus className="w-5 h-5 text-purple-400 mb-3" />
              <div className="font-medium mb-1 group-hover:text-purple-400 transition">List New Service</div>
              <p className="text-sm text-white/40">Add an AI agent to the marketplace</p>
            </Link>
            <Link href="/explore" className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/30 transition group">
              <ExternalLink className="w-5 h-5 text-purple-400 mb-3" />
              <div className="font-medium mb-1 group-hover:text-purple-400 transition">Explore APIs</div>
              <p className="text-sm text-white/40">Discover services to integrate</p>
            </Link>
            <a href="#" className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/30 transition group">
              <BarChart3 className="w-5 h-5 text-purple-400 mb-3" />
              <div className="font-medium mb-1 group-hover:text-purple-400 transition">View Analytics</div>
              <p className="text-sm text-white/40">Detailed usage metrics</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
