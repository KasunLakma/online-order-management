"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Chart Mock Data
const monthlySalesData = [
  { name: "Jan", sales: 12000 },
  { name: "Feb", sales: 15000 },
  { name: "Mar", sales: 18500 },
  { name: "Apr", sales: 14110 },
  { name: "May", sales: 24350 }
];

const orderStatusData = [
  { name: "New", value: 10, color: "#3b82f6" },
  { name: "Packaging", value: 18, color: "#f59e0b" },
  { name: "Delivered", value: 86, color: "#6366f1" },
  { name: "Returned", value: 6, color: "#f97316" },
  { name: "Canceled", value: 4, color: "#ef4444" }
];

const bestSellingProductsData = [
  { name: "Laptop", qty: 25 },
  { name: "iPhone 15", qty: 45 },
  { name: "Galaxy S24", qty: 30 },
  { name: "Headphones", qty: 15 }
];

export default function DashboardIndexPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Sales (AreaChart) */}
        <div className="lg:col-span-2 backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl p-6 shadow-2xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Monthly Sales Overview</h3>
            <p className="text-xs text-slate-500 mt-0.5">Net sales revenue trends over the past 5 months.</p>
          </div>
          <div className="h-64">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff"
                    }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">Loading Sales Chart...</div>
            )}
          </div>
        </div>

        {/* Order Status Distribution (PieChart) */}
        <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl p-6 shadow-2xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Order Status Distribution</h3>
            <p className="text-xs text-slate-500 mt-0.5">Distribution count across workflow status stages.</p>
          </div>
          <div className="h-64 relative flex items-center justify-center">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff"
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={8}
                    iconType="circle"
                    wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">Loading Status Chart...</div>
            )}
          </div>
        </div>

        {/* Best-Selling Products (BarChart) */}
        <div className="lg:col-span-3 backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl p-6 shadow-2xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Best-Selling Products</h3>
            <p className="text-xs text-slate-500 mt-0.5">Quantity volume sold for top products.</p>
          </div>
          <div className="h-64">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bestSellingProductsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff"
                    }}
                  />
                  <Bar dataKey="qty" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40}>
                    {bestSellingProductsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#8b5cf6" : "#6366f1"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">Loading Products Chart...</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
