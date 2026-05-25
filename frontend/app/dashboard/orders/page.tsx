"use client";

import React, { useEffect, useState } from "react";

interface OrderItem {
  id: number;
  qty: number;
  price: string | number;
  total: string | number;
  product: {
    name: string;
    sku: string;
  };
}

interface Order {
  id: number;
  invoiceNo: string;
  subtotal: string | number;
  discount: string | number;
  total: string | number;
  status: string;
  paymentMethod: string;
  orderSource: string;
  notes: string | null;
  createdAt: string;
  customer: {
    name: string;
    mobile1: string;
  };
  user: {
    name: string;
  };
  orderItems: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const fetchOrders = async (authToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch orders.");
      }
      setOrders(data.orders || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while loading orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetchOrders(storedToken);
    }
  }, []);

  const toggleExpandOrder = (id: number) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <main className="px-6 py-10 space-y-8 z-10 relative">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Orders History</h1>
        <p className="text-sm text-slate-400 mt-2">Browse customer orders and details.</p>
      </div>

      {/* Loading & Error banner */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      ) : (
        /* Orders Table */
        <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="w-12 px-6 py-4.5"></th>
                  <th className="px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Invoice No</th>
                  <th className="px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Payment / Source</th>
                  <th className="px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;
                    const date = new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    });

                    return (
                      <React.Fragment key={order.id}>
                        <tr
                          onClick={() => toggleExpandOrder(order.id)}
                          className="hover:bg-white/[0.01] transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 text-center">
                            <svg
                              className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-indigo-400 font-mono">{order.invoiceNo}</td>
                          <td className="px-6 py-4">
                            <div>
                              <span className="font-semibold text-white block text-sm">{order.customer?.name}</span>
                              <span className="text-[11px] text-slate-400 block mt-0.5">{order.customer?.mobile1}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <span className="font-bold text-white block text-sm">${parseFloat(String(order.total)).toFixed(2)}</span>
                              {parseFloat(String(order.discount)) > 0 && (
                                <span className="text-[10px] text-emerald-400 block mt-0.5">-${parseFloat(String(order.discount)).toFixed(2)} Disc.</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <span className="text-xs text-white bg-slate-800 border border-slate-700/50 rounded px-1.5 py-0.5">{order.paymentMethod}</span>
                              <span className="text-[11px] text-slate-400 block mt-1">Source: {order.orderSource}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300">{date}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                                order.status === "PENDING"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : order.status === "COMPLETED"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                        {/* Expanded details panel */}
                        {isExpanded && (
                          <tr className="bg-white/[0.005]">
                            <td colSpan={7} className="px-8 py-6">
                              <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Order Items</h4>
                                  {order.notes && (
                                    <span className="text-xs text-slate-400 italic">Notes: "{order.notes}"</span>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  {order.orderItems.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-900/50"
                                    >
                                      <div>
                                        <span className="font-semibold text-white text-sm block">{item.product.name}</span>
                                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">SKU: {item.product.sku}</span>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-sm font-semibold text-white block">
                                          ${parseFloat(String(item.total)).toFixed(2)}
                                        </span>
                                        <span className="text-[11px] text-slate-400 block mt-0.5">
                                          ${parseFloat(String(item.price)).toFixed(2)} x {item.qty}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
