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
    address: string | null;
    city: string | null;
    email: string | null;
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
  
  // Invoice modal state
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  
  // Status update states
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

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
      setToken(storedToken);
      fetchOrders(storedToken);
    }
  }, []);

  const toggleExpandOrder = (id: number) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    if (!token) return;
    setUpdatingId(orderId);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update order status.");
      }

      // Refresh list
      await fetchOrders(token);
    } catch (err: any) {
      alert(err.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Popup blocked! Please allow popups to print invoices.");
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.invoiceNo}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; color: #1e293b; padding: 40px; line-height: 1.5; }
            .invoice-box { max-width: 800px; margin: auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: 800; color: #4f46e5; text-transform: uppercase; letter-spacing: -0.025em; }
            .details { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
            .title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; text-align: left; }
            th { border-bottom: 2px solid #cbd5e1; padding: 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; background: #f8fafc; }
            td { border-bottom: 1px solid #e2e8f0; padding: 12px; font-size: 14px; }
            .summary { display: flex; justify-content: flex-end; }
            .summary-box { width: 250px; font-size: 14px; line-height: 2; }
            .summary-row { display: flex; justify-content: space-between; }
            .grand-total { border-top: 2px solid #cbd5e1; font-weight: 800; font-size: 18px; color: #0f172a; padding-top: 8px; margin-top: 8px; }
            .footer { margin-top: 60px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div>
                <div class="logo">OrderFlow</div>
                <div style="font-size: 13px; color: #64748b; margin-top: 5px;">
                  Pixzora Labs Assignment Inc.<br/>
                  100 Tech Square, Colombo 03<br/>
                  support@orderflow.com
                </div>
              </div>
              <div style="text-align: right;">
                <div class="title">INVOICE</div>
                <div style="font-size: 14px;">Invoice No: <strong>${order.invoiceNo}</strong></div>
                <div style="font-size: 14px; color: #64748b; margin-top: 4px;">Date: ${new Date(order.createdAt).toLocaleDateString()}</div>
                <div style="font-size: 14px; color: #64748b;">Status: <strong>${order.status}</strong></div>
              </div>
            </div>

            <div class="details">
              <div>
                <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Billed To</div>
                <div style="font-weight: 700; font-size: 16px; color: #0f172a;">${order.customer.name}</div>
                <div style="font-size: 14px; margin-top: 4px;">${order.customer.mobile1}</div>
                ${order.customer.address ? `<div style="font-size: 14px;">${order.customer.address}</div>` : ""}
                ${order.customer.city ? `<div style="font-size: 14px;">${order.customer.city}</div>` : ""}
                ${order.customer.email ? `<div style="font-size: 14px;">${order.customer.email}</div>` : ""}
              </div>
              <div style="text-align: right;">
                <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Order Details</div>
                <div style="font-size: 14px;">Payment Method: <strong>${order.paymentMethod}</strong></div>
                <div style="font-size: 14px;">Source: <strong>${order.orderSource}</strong></div>
                <div style="font-size: 14px; margin-top: 4px;">Processed By: <strong>${order.user.name}</strong></div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item / SKU</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Qty</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.orderItems.map(item => `
                  <tr>
                    <td>
                      <div style="font-weight: 700; color: #0f172a;">${item.product.name}</div>
                      <div style="font-size: 11px; font-family: monospace; color: #64748b; margin-top: 2px;">SKU: ${item.product.sku}</div>
                    </td>
                    <td style="text-align: right;">$${parseFloat(String(item.price)).toFixed(2)}</td>
                    <td style="text-align: right;">${item.qty}</td>
                    <td style="text-align: right;">$${parseFloat(String(item.total)).toFixed(2)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>

            <div class="summary">
              <div class="summary-box">
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>$${parseFloat(String(order.subtotal)).toFixed(2)}</span>
                </div>
                ${parseFloat(String(order.discount)) > 0 ? `
                  <div class="summary-row" style="color: #10b981;">
                    <span>Discount</span>
                    <span>-$${parseFloat(String(order.discount)).toFixed(2)}</span>
                  </div>
                ` : ""}
                <div class="summary-row grand-total">
                  <span>Grand Total</span>
                  <span>$${parseFloat(String(order.total)).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div class="footer">
              Thank you for your business!<br/>
              If you have any questions about this invoice, please contact support@orderflow.com
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <main className="px-6 py-10 space-y-8 z-10 relative">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Orders History</h1>
        <p className="text-sm text-slate-400 mt-2">Browse customer orders, update delivery status, and view invoices.</p>
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
                  <th className="px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-sm text-slate-500">
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
                          className="hover:bg-white/[0.01] transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 text-center" onClick={() => toggleExpandOrder(order.id)}>
                            <svg
                              className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-indigo-400 font-mono" onClick={() => toggleExpandOrder(order.id)}>{order.invoiceNo}</td>
                          <td className="px-6 py-4" onClick={() => toggleExpandOrder(order.id)}>
                            <div>
                              <span className="font-semibold text-white block text-sm">{order.customer?.name}</span>
                              <span className="text-[11px] text-slate-400 block mt-0.5">{order.customer?.mobile1}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4" onClick={() => toggleExpandOrder(order.id)}>
                            <div>
                              <span className="font-bold text-white block text-sm">${parseFloat(String(order.total)).toFixed(2)}</span>
                              {parseFloat(String(order.discount)) > 0 && (
                                <span className="text-[10px] text-emerald-400 block mt-0.5">-${parseFloat(String(order.discount)).toFixed(2)} Disc.</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4" onClick={() => toggleExpandOrder(order.id)}>
                            <div>
                              <span className="text-xs text-white bg-slate-800 border border-slate-700/50 rounded px-1.5 py-0.5">{order.paymentMethod}</span>
                              <span className="text-[11px] text-slate-400 block mt-1">Source: {order.orderSource}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300" onClick={() => toggleExpandOrder(order.id)}>{date}</td>
                          <td className="px-6 py-4" onClick={() => toggleExpandOrder(order.id)}>
                            <span
                              className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${
                                order.status === "NEW" || order.status === "PENDING"
                                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                  : order.status === "PACKAGING"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : order.status === "DELIVERED"
                                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                  : order.status === "COMPLETED"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : order.status === "RETURNED"
                                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                  : "bg-red-500/10 text-red-400 border border-red-500/20"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveInvoiceOrder(order);
                              }}
                              className="px-3 py-1.5 text-xs font-semibold text-indigo-400 hover:text-white rounded bg-indigo-500/5 hover:bg-indigo-500/20 border border-indigo-500/10 hover:border-indigo-500/20 transition-all cursor-pointer"
                            >
                              View Invoice
                            </button>
                          </td>
                        </tr>
                        {/* Expanded details panel with Status Transition Actions */}
                        {isExpanded && (
                          <tr className="bg-white/[0.005]">
                            <td colSpan={8} className="px-8 py-6">
                              <div className="space-y-6 animate-in slide-in-from-top-2 duration-200">
                                {/* Order items table */}
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Order Items</h4>
                                    {order.notes && (
                                      <span className="text-xs text-slate-400 italic">Notes: "{order.notes}"</span>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-1 gap-2">
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

                                {/* Order Status Workflow Buttons */}
                                <div className="space-y-3 pt-2">
                                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-white/5 pb-2">Update Workflow Status</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {["NEW", "PACKAGING", "DELIVERED", "COMPLETED", "RETURNED", "CANCELED"].map((st) => {
                                      const isCurrent = order.status === st;
                                      return (
                                        <button
                                          key={st}
                                          disabled={isCurrent || updatingId === order.id}
                                          onClick={() => handleUpdateStatus(order.id, st)}
                                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                                            isCurrent
                                              ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold"
                                              : "bg-white/[0.02] text-slate-400 hover:text-white border border-white/5 hover:bg-white/[0.05]"
                                          }`}
                                        >
                                          {st}
                                        </button>
                                      );
                                    })}
                                  </div>
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

      {/* Invoice Modal Overlay */}
      {activeInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl backdrop-blur-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 relative flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setActiveInvoiceOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Title */}
            <div className="border-b border-white/5 pb-4 mb-4">
              <h3 className="text-xl font-bold text-white">Invoice Preview</h3>
              <p className="text-xs text-slate-400 mt-1">Review the customer billing details and download or print the PDF invoice.</p>
            </div>

            {/* Invoice Layout (Scrollable) */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 text-sm text-slate-300">
              <div id="invoice-printable-box" className="p-6 rounded-xl border border-white/5 bg-slate-950/50 space-y-6">
                {/* Invoice Header */}
                <div className="flex justify-between border-b border-white/5 pb-4">
                  <div>
                    <div className="text-lg font-bold text-indigo-400 uppercase tracking-wider">OrderFlow</div>
                    <div className="text-xs text-slate-500 mt-1 font-semibold">Pixzora Labs Assignment Inc.</div>
                    <div className="text-xs text-slate-500">100 Tech Square, Colombo 03</div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-black text-white leading-none">INVOICE</h2>
                    <div className="text-xs mt-2 text-slate-400 font-mono">No: {activeInvoiceOrder.invoiceNo}</div>
                    <div className="text-xs text-slate-500">Date: {new Date(activeInvoiceOrder.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Billed To</span>
                    <strong className="text-white block text-sm">{activeInvoiceOrder.customer.name}</strong>
                    <div className="text-xs mt-1 text-slate-400">{activeInvoiceOrder.customer.mobile1}</div>
                    {activeInvoiceOrder.customer.address && <div className="text-xs text-slate-400">{activeInvoiceOrder.customer.address}</div>}
                    {activeInvoiceOrder.customer.city && <div className="text-xs text-slate-400">{activeInvoiceOrder.customer.city}</div>}
                    {activeInvoiceOrder.customer.email && <div className="text-xs text-slate-400">{activeInvoiceOrder.customer.email}</div>}
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Order Details</span>
                    <div className="text-xs">Payment Method: <strong className="text-white">{activeInvoiceOrder.paymentMethod}</strong></div>
                    <div className="text-xs">Source: <strong className="text-white">{activeInvoiceOrder.orderSource}</strong></div>
                    <div className="text-xs mt-1">Processed By: <strong className="text-white">{activeInvoiceOrder.user.name}</strong></div>
                  </div>
                </div>

                {/* Invoice Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        <th className="py-2.5">Item / SKU</th>
                        <th className="py-2.5 text-right">Unit Price</th>
                        <th className="py-2.5 text-center">Qty</th>
                        <th className="py-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                      {activeInvoiceOrder.orderItems.map((item) => (
                        <tr key={item.id}>
                          <td className="py-3">
                            <strong className="text-white text-sm block">{item.product.name}</strong>
                            <span className="text-[10px] font-mono text-slate-500 mt-0.5 block">SKU: {item.product.sku}</span>
                          </td>
                          <td className="py-3 text-right font-semibold">${parseFloat(String(item.price)).toFixed(2)}</td>
                          <td className="py-3 text-center">{item.qty}</td>
                          <td className="py-3 text-right font-semibold text-white">${parseFloat(String(item.total)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Totals */}
                <div className="flex justify-end pt-4 border-t border-white/5">
                  <div className="w-60 space-y-1.5 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-white">${parseFloat(String(activeInvoiceOrder.subtotal)).toFixed(2)}</span>
                    </div>
                    {parseFloat(String(activeInvoiceOrder.discount)) > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount</span>
                        <span className="font-semibold">-${parseFloat(String(activeInvoiceOrder.discount)).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-white/5">
                      <span>Grand Total</span>
                      <span className="text-indigo-400">${parseFloat(String(activeInvoiceOrder.total)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-4 shrink-0">
              <button
                type="button"
                onClick={() => setActiveInvoiceOrder(null)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl border border-white/5 bg-transparent hover:bg-white/[0.02] transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handlePrintInvoice(activeInvoiceOrder)}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/25"
              >
                <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h8z" />
                </svg>
                Print / Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
