"use client";

import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  status: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  price: string | number;
  quantity: number;
  image: string | null;
  status: string;
  category: {
    id: number;
    name: string;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add Product Form Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formQuantity, setFormQuantity] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formStatus, setFormStatus] = useState("ACTIVE");
  
  // Submit state
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Fetch initial data
  const fetchData = async (authToken: string) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch Products
      const prodRes = await fetch("http://localhost:5000/api/products", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });
      const prodData = await prodRes.json();
      if (!prodRes.ok) throw new Error(prodData.error || "Failed to fetch products.");
      setProducts(prodData.products || []);

      // Fetch Categories
      const catRes = await fetch("http://localhost:5000/api/categories", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });
      const catData = await catRes.json();
      if (!catRes.ok) throw new Error(catData.error || "Failed to fetch categories.");
      setCategories(catData.categories || []);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      fetchData(storedToken);
    }
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!formName || !formSku || !formPrice || !formCategoryId) {
      setSubmitError("Name, SKU, Price, and Category are required.");
      return;
    }

    if (!token) {
      setSubmitError("Authentication required.");
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formName,
          sku: formSku,
          price: parseFloat(formPrice),
          quantity: parseInt(formQuantity, 10) || 0,
          categoryId: parseInt(formCategoryId, 10),
          status: formStatus
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create product.");
      }

      setSubmitSuccess("Product added successfully!");
      // Reset form
      setFormName("");
      setFormSku("");
      setFormPrice("");
      setFormQuantity("");
      setFormCategoryId("");
      setFormStatus("ACTIVE");

      // Refresh list
      fetchData(token);

      // Close modal after delay
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(null);
      }, 1000);

    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <main className="px-6 py-10 space-y-8 z-10 relative">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Products Management</h1>
          <p className="text-sm text-slate-400 mt-2">Manage products inventory, details, and stock levels.</p>
        </div>

        {isAdmin ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        ) : (
          <div className="px-4 py-2 bg-white/[0.02] border border-white/5 text-slate-500 text-xs font-semibold uppercase tracking-wider rounded-xl">
            View-Only Access (Manager)
          </div>
        )}
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
        /* Data Table */
        <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                      No products found. Add some products to get started.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                            {product.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-white block text-sm">{product.name}</span>
                            {product.image && (
                              <span className="text-[10px] text-indigo-400 truncate max-w-[150px] block">{product.image}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-300">{product.sku}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">${parseFloat(String(product.price)).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${product.quantity <= 5 ? "text-amber-400" : "text-slate-300"}`}>
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-1 text-[11px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                          {product.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                            product.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg backdrop-blur-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 space-y-6 relative animate-in fade-in zoom-in duration-200">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div>
              <h3 className="text-xl font-bold text-white">Add New Product</h3>
              <p className="text-xs text-slate-400 mt-1">Register a new product in the store inventory.</p>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              {/* Errors/Success alerts */}
              {submitError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                  {submitSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-white/[0.02] py-2.5 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                    placeholder="e.g. iPhone 15 Pro"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">SKU</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-white/[0.02] py-2.5 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all font-mono"
                    placeholder="e.g. IPH15P-128"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-white/[0.02] py-2.5 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Quantity (Stock)</label>
                  <input
                    type="number"
                    required
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-white/[0.02] py-2.5 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                    placeholder="0"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Category</label>
                  <select
                    required
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-slate-800 py-2.5 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Status Selection */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-slate-800 py-2.5 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              {/* Submit Action */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl border border-white/5 bg-transparent hover:bg-white/[0.02] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {submitLoading ? "Adding..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
