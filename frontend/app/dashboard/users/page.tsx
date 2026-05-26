"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<{ role: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState("MANAGER");

  // Submit states
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const fetchUsers = async (authToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users.");
      }
      setUsers(data.users || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while loading users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      setToken(storedToken);
      if (parsedUser.role === "ADMIN") {
        fetchUsers(storedToken);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!formName || !formEmail || !formPassword || !formRole) {
      setSubmitError("All fields are required.");
      return;
    }

    if (!token) {
      setSubmitError("Authentication required.");
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          password: formPassword,
          roleName: formRole
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create user.");
      }

      setSubmitSuccess("Manager account created successfully!");
      setFormName("");
      setFormEmail("");
      setFormPassword("");
      setFormRole("MANAGER");
      
      // Refresh list
      fetchUsers(token);

      setTimeout(() => {
        setSubmitSuccess(null);
      }, 3000);

    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (currentUser && currentUser.role !== "ADMIN") {
    return (
      <main className="px-6 py-10 space-y-8 z-10 relative">
        <div className="backdrop-blur-md bg-red-500/10 border border-red-500/25 rounded-2xl p-8 text-center text-red-400">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-sm">You do not have permissions to manage staff accounts. This section is restricted to Administrators only.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-10 space-y-8 z-10 relative">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Staff Management</h1>
        <p className="text-sm text-slate-400 mt-2">Manage backend system administrators and managers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* User List Table (Left Side) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white mb-2">System Users</h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          ) : (
            <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.01]">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="px-6 py-4 font-semibold text-white">{u.name}</td>
                        <td className="px-6 py-4 text-slate-300 font-mono">{u.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                              u.role === "ADMIN"
                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Create User Form (Right Side) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white mb-2">Actions</h2>
          <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add Staff Account</h3>

            <form onSubmit={handleCreateUser} className="space-y-4">
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="block w-full rounded-xl border border-white/10 bg-white/[0.02] py-2.5 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="block w-full rounded-xl border border-white/10 bg-white/[0.02] py-2.5 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="block w-full rounded-xl border border-white/10 bg-white/[0.02] py-2.5 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Role</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="block w-full rounded-xl border border-white/10 bg-slate-800 py-2.5 px-3 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                >
                  <option value="MANAGER">MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className="w-full px-5 py-3 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/25"
              >
                {submitLoading ? "Creating..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
