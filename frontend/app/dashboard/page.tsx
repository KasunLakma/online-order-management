"use client";

import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function DashboardIndexPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <main className="px-6 py-10 space-y-8 z-10 relative">
      {/* Welcome Section */}
      <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Welcome to OrderFlow Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            All systems operational. Here is an overview of your order status.
          </p>
        </div>

        {/* User Profile Info Card */}
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/10 rounded-xl px-5 py-3 shrink-0">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-600/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{user?.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">{user?.email}</div>
            <span className="inline-block px-2 py-0.5 mt-1.5 text-[9px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded uppercase tracking-wider">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Dashboard Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400 font-medium">Total Orders</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">124</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
              <span>+12.5%</span>
              <span className="text-slate-500 font-normal">vs last week</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400 font-medium">Total Revenue</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1" />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">$45,230</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
              <span>+8.2%</span>
              <span className="text-slate-500 font-normal">vs last week</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400 font-medium">Active Products</span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">18</div>
            <div className="text-xs text-slate-500 mt-1">
              Across 2 active categories
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400 font-medium">Customer Accounts</span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">48</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
              <span>+4.7%</span>
              <span className="text-slate-500 font-normal">vs last week</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
