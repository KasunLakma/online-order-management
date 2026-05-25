"use client";

import React, { useState } from "react";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"sales" | "orders" | "customers">("sales");
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const triggerExport = (reportType: string, format: "PDF" | "Excel" | "CSV") => {
    setExportMessage(`Exporting ${reportType} Report as ${format}... Please wait.`);
    setTimeout(() => {
      setExportMessage(null);
      alert(`Success: ${reportType} Report downloaded in ${format} format!`);
    }, 1500);
  };

  return (
    <main className="px-6 py-10 space-y-8 z-10 relative">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Reports & Analytics</h1>
        <p className="text-sm text-slate-400 mt-2">Export reports and view analytics datasets.</p>
      </div>

      {/* Export status alert */}
      {exportMessage && (
        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-400 animate-pulse flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {exportMessage}
        </div>
      )}

      {/* Tab navigation buttons */}
      <div className="flex border-b border-white/5 gap-2">
        {(["sales", "orders", "customers"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-semibold capitalize transition-all border-b-2 cursor-pointer ${
              activeTab === tab
                ? "border-indigo-500 text-indigo-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:border-white/10"
            }`}
          >
            {tab} Report
          </button>
        ))}
      </div>

      {/* Reports Card Container */}
      <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Reports Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white capitalize">{activeTab} Dataset</h3>
            <p className="text-xs text-slate-500 mt-1">Generated: Real-time update</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => triggerExport(activeTab, "PDF")}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Export PDF
            </button>
            <button
              onClick={() => triggerExport(activeTab, "Excel")}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-500/10 hover:bg-emerald-500/25 border border-emerald-500/20 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Export Excel
            </button>
            <button
              onClick={() => triggerExport(activeTab, "CSV")}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-500/10 hover:bg-slate-500/25 border border-slate-500/20 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Tab Specific Content */}
        {activeTab === "sales" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5">
                <span className="text-xs text-slate-500 uppercase font-semibold">Gross Sales</span>
                <div className="text-2xl font-bold text-white mt-1">$45,230.00</div>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5">
                <span className="text-xs text-slate-500 uppercase font-semibold">Total Discounts Given</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">-$2,120.00</div>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5">
                <span className="text-xs text-slate-500 uppercase font-semibold">Net Sales Revenue</span>
                <div className="text-2xl font-bold text-indigo-400 mt-1">$43,110.00</div>
              </div>
            </div>

            {/* Sales Table Mockup */}
            <div className="overflow-hidden border border-white/5 rounded-xl">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-xs font-semibold text-slate-400 uppercase">
                    <th className="px-6 py-3">Month</th>
                    <th className="px-6 py-3 text-right">Orders Count</th>
                    <th className="px-6 py-3 text-right">Gross Sales</th>
                    <th className="px-6 py-3 text-right">Net Sales</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr>
                    <td className="px-6 py-3">May 2026</td>
                    <td className="px-6 py-3 text-right">48</td>
                    <td className="px-6 py-3 text-right">$15,200.00</td>
                    <td className="px-6 py-3 text-right text-indigo-400 font-semibold">$14,500.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3">April 2026</td>
                    <td className="px-6 py-3 text-right">42</td>
                    <td className="px-6 py-3 text-right">$14,830.00</td>
                    <td className="px-6 py-3 text-right text-indigo-400 font-semibold">$14,110.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3">March 2026</td>
                    <td className="px-6 py-3 text-right">34</td>
                    <td className="px-6 py-3 text-right">$15,200.00</td>
                    <td className="px-6 py-3 text-right text-indigo-400 font-semibold">$14,500.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5">
                <span className="text-xs text-slate-500 uppercase font-semibold">Total Orders</span>
                <div className="text-2xl font-bold text-white mt-1">124</div>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5">
                <span className="text-xs text-slate-500 uppercase font-semibold">Delivered</span>
                <div className="text-2xl font-bold text-indigo-400 mt-1">86</div>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5">
                <span className="text-xs text-slate-500 uppercase font-semibold">Returned</span>
                <div className="text-2xl font-bold text-orange-400 mt-1">6</div>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5">
                <span className="text-xs text-slate-500 uppercase font-semibold">Canceled</span>
                <div className="text-2xl font-bold text-red-400 mt-1">4</div>
              </div>
            </div>

            {/* Orders Table Mockup */}
            <div className="overflow-hidden border border-white/5 rounded-xl">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-xs font-semibold text-slate-400 uppercase">
                    <th className="px-6 py-3">Order Status</th>
                    <th className="px-6 py-3 text-right">Orders Count</th>
                    <th className="px-6 py-3 text-right">Percent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr>
                    <td className="px-6 py-3">Completed / Delivered</td>
                    <td className="px-6 py-3 text-right">104</td>
                    <td className="px-6 py-3 text-right text-emerald-400 font-semibold">83.8%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3">New / Processing</td>
                    <td className="px-6 py-3 text-right">10</td>
                    <td className="px-6 py-3 text-right text-blue-400 font-semibold">8.1%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3">Returned</td>
                    <td className="px-6 py-3 text-right">6</td>
                    <td className="px-6 py-3 text-right text-orange-400 font-semibold">4.8%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3">Canceled</td>
                    <td className="px-6 py-3 text-right">4</td>
                    <td className="px-6 py-3 text-right text-red-400 font-semibold">3.2%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5">
                <span className="text-xs text-slate-500 uppercase font-semibold">Total Customers</span>
                <div className="text-2xl font-bold text-white mt-1">48</div>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5">
                <span className="text-xs text-slate-500 uppercase font-semibold">New This Month</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">+14</div>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5">
                <span className="text-xs text-slate-500 uppercase font-semibold">Active Buyers</span>
                <div className="text-2xl font-bold text-indigo-400 mt-1">36</div>
              </div>
            </div>

            {/* Customers Table Mockup */}
            <div className="overflow-hidden border border-white/5 rounded-xl">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01] text-xs font-semibold text-slate-400 uppercase">
                    <th className="px-6 py-3">Customer Name</th>
                    <th className="px-6 py-3 font-mono">Mobile</th>
                    <th className="px-6 py-3 text-right">Total Orders</th>
                    <th className="px-6 py-3 text-right">Total Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr>
                    <td className="px-6 py-3 font-semibold text-white">Jane Doe</td>
                    <td className="px-6 py-3 font-mono text-slate-400">0771234567</td>
                    <td className="px-6 py-3 text-right">12</td>
                    <td className="px-6 py-3 text-right text-emerald-400 font-semibold">$14,200.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-semibold text-white">John Smith</td>
                    <td className="px-6 py-3 font-mono text-slate-400">0719876543</td>
                    <td className="px-6 py-3 text-right">8</td>
                    <td className="px-6 py-3 text-right text-emerald-400 font-semibold">$9,850.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 font-semibold text-white">Alice Johnson</td>
                    <td className="px-6 py-3 font-mono text-slate-400">0755551234</td>
                    <td className="px-6 py-3 text-right">6</td>
                    <td className="px-6 py-3 text-right text-emerald-400 font-semibold">$6,450.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
