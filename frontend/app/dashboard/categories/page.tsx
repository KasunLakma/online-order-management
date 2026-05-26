"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Category {
  id: number;
  name: string;
  status: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create form states
  const [formName, setFormName] = useState("");
  const [formStatus, setFormStatus] = useState("ACTIVE");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const fetchCategories = async (authToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch categories.");
      }
      setCategories(data.categories || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while loading categories.");
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
      fetchCategories(storedToken);
    }
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!formName) {
      setSubmitError("Category name is required.");
      return;
    }

    if (!token) {
      setSubmitError("Authentication required.");
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formName,
          status: formStatus
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create category.");
      }

      setSubmitSuccess("Category created successfully!");
      setFormName("");
      setFormStatus("ACTIVE");
      
      // Refresh list
      fetchCategories(token);

      setTimeout(() => {
        setSubmitSuccess(null);
      }, 3000);

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
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Categories Management</h1>
        <p className="text-sm text-slate-400 mt-2">Create and organize product categories.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Category List Grid (Left Side, 2 columns wide on large screen) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white mb-2">Category List</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          ) : categories.length === 0 ? (
            <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl p-12 text-center text-slate-500 text-sm">
              No categories registered yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="backdrop-blur-md bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all rounded-2xl p-5 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                      {category.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold text-white text-sm">{category.name}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">ID: {category.id}</span>
                    </div>
                  </div>

                  <span
                    className={`inline-block px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider ${
                      category.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                    }`}
                  >
                    {category.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Category Form (Right Side, 1 column wide) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white mb-2">Actions</h2>

          {isAdmin ? (
            <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Create New Category</h3>

              <form onSubmit={handleCreateCategory} className="space-y-4">
                {submitError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 animate-in fade-in">
                    {submitError}
                  </div>
                )}
                {submitSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 animate-in fade-in">
                    {submitSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Category Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-white/[0.02] py-2.5 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                    placeholder="e.g. Appliances"
                  />
                </div>

                <div>
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

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full px-5 py-3 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/25"
                >
                  {submitLoading ? "Creating..." : "Create Category"}
                </button>
              </form>
            </div>
          ) : (
            <div className="backdrop-blur-md bg-white/[0.01] border border-white/5 rounded-2xl p-6 text-center text-xs text-slate-500">
              You are signed in as a Manager. Category modification is restricted to Administrators only.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
