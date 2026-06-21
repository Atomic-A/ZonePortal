"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, X, Eye, EyeOff, UserPlus, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserManagement() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [revealPasswords, setRevealPasswords] = useState<{ [key: string]: boolean }>({});

  // Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setModelError] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admins");
      if (res.ok) {
        const data = await res.json();
        setAdmins(data);
      }
    } catch (error) {
      console.error("Failed to fetch admin users", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordReveal = (username: string) => {
    setRevealPasswords(prev => ({
      ...prev,
      [username]: !prev[username]
    }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModelError("");

    if (username.trim().length < 3) {
      setModelError("Username must be at least 3 characters long.");
      return;
    }

    if (password.length < 6) {
      setModelError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password })
      });

      if (res.ok) {
        setUsername("");
        setPassword("");
        setIsCreating(false);
        fetchAdmins();
      } else {
        const errData = await res.json();
        setModelError(errData.error || "Failed to create user.");
      }
    } catch (error) {
      console.error("Failed to add user", error);
      setModelError("An unexpected error occurred.");
    }
  };

  const handleDeleteUser = async (usernameToDelete: string) => {
    if (admins.length <= 1) {
      alert("Error: You cannot delete the last remaining administrator user!");
      return;
    }

    if (!confirm(`Are you sure you want to remove admin user "${usernameToDelete}"?`)) return;

    try {
      const res = await fetch("/api/admins", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameToDelete })
      });

      if (res.ok) {
        fetchAdmins();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin User Management</h1>
          <p className="text-slate-500 mt-1">Configure administrator login names and secure credentials</p>
        </div>
        <button 
          onClick={() => {
            setIsCreating(!isCreating);
            setModelError("");
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm"
        >
          {isCreating ? <X className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
          {isCreating ? "Cancel" : "Add Admin User"}
        </button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 mb-8 max-w-xl">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Register New Administrator</h2>
              
              <form className="space-y-6" onSubmit={handleAddUser}>
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100 text-center">
                    {error}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Login Username</label>
                    <input 
                      required 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      type="text" 
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all font-medium text-slate-800 text-sm" 
                      placeholder="E.g., poonamallee_staff" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Access Password</label>
                    <input 
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      type="password" 
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all font-medium text-slate-800 text-sm" 
                      placeholder="Minimum 6 characters" 
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2.5 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2">
                    <Save className="h-4 w-4" /> Save Account
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin User Accounts Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4 pl-6">Admin Username</th>
                <th className="p-4">Credential Password</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr><td colSpan={3} className="p-8 text-center text-slate-500">Loading administrators database...</td></tr>
              )}
              
              {!loading && admins.length === 0 && (
                <tr><td colSpan={3} className="p-8 text-center text-slate-500">No administrator accounts listed.</td></tr>
              )}
              
              {!loading && admins.map((admin: any) => {
                const isRevealed = !!revealPasswords[admin.username];
                
                return (
                  <tr key={admin.username} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6 font-bold text-slate-900">{admin.username}</td>
                    <td className="p-4 font-mono text-sm text-slate-700">
                      <div className="flex items-center gap-3">
                        <span>{isRevealed ? admin.password : "••••••••"}</span>
                        <button 
                          onClick={() => togglePasswordReveal(admin.username)} 
                          className="p-1 rounded text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title={isRevealed ? "Hide Password" : "Reveal Password"}
                        >
                          {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-2">
                        {admins.length > 1 ? (
                          <button 
                            onClick={() => handleDeleteUser(admin.username)} 
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Remove Admin Account"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : (
                          <span className="p-2 text-slate-300 cursor-not-allowed flex items-center gap-1 text-xs font-semibold" title="Cannot delete the last admin user">
                            <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
                            System Lock
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
