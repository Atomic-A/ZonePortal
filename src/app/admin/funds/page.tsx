"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, IndianRupee, CreditCard, Calendar, CheckCircle2, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConstituencyFundsAdmin() {
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  // Core financial state
  const [totalBudget, setTotalBudget] = useState(50000000);
  const [totalSpent, setTotalSpent] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Form State (Budget & Transactions)
  const [inputBudget, setInputBudget] = useState("50000000");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Completed");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      const res = await fetch("/api/funds");
      if (res.ok) {
        const data = await res.json();
        setTotalBudget(data.totalBudget || 50000000);
        setTotalSpent(data.totalSpent || 0);
        setRemaining(data.remaining || 0);
        setTransactions(data.transactions || []);
        
        setInputBudget((data.totalBudget || 50000000).toString());
      }
    } catch (error) {
      console.error("Failed to fetch funds", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setPurpose("");
    setAmount("");
    setStatus("Completed");
    setDate("");
  };

  const startEdit = (trx: any) => {
    setEditingId(trx.id);
    setPurpose(trx.purpose);
    setAmount(trx.amount.toString());
    setStatus(trx.status);
    setDate(trx.date);
    setIsCreating(true);
  };

  const handleBudgetUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/funds", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalBudget: Number(inputBudget) })
      });
      if (res.ok) {
        setIsEditingBudget(false);
        fetchFunds();
      }
    } catch (error) {
      console.error("Failed to update budget", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = editingId !== null;
    const url = "/api/funds";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          purpose,
          amount: Number(amount),
          status,
          date: date || new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
        })
      });

      if (res.ok) {
        cancelForm();
        fetchFunds();
      }
    } catch (error) {
      console.error(`Failed to ${isEdit ? 'update' : 'create'} transaction`, error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fund allocation transaction?")) return;
    try {
      const res = await fetch("/api/funds", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) fetchFunds();
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  // Helper formatting function
  const formatINR = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Constituency Fund Ledger</h1>
          <p className="text-slate-500 mt-1">Audit and update fund allocation budgets and project expenditures</p>
        </div>
        <button 
          onClick={() => {
            if (isCreating) {
              cancelForm();
            } else {
              setIsCreating(true);
            }
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm"
        >
          {isCreating ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {isCreating ? "Cancel" : "Record Transaction"}
        </button>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Budget Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div>
            <span className="text-slate-500 text-sm font-semibold">Total Constituency Budget</span>
            {isEditingBudget ? (
              <form onSubmit={handleBudgetUpdate} className="flex gap-2 mt-2">
                <input 
                  type="number" 
                  value={inputBudget}
                  onChange={(e) => setInputBudget(e.target.value)}
                  className="px-2 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none w-32 font-bold text-slate-800 text-sm" 
                  required
                />
                <button type="submit" className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700">
                  <Save className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setIsEditingBudget(false)} className="p-1.5 bg-slate-100 text-slate-500 rounded hover:bg-slate-200">
                  <X className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <h2 className="text-2xl font-black text-slate-900">{formatINR(totalBudget)}</h2>
                <button 
                  onClick={() => setIsEditingBudget(true)}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  (Edit)
                </button>
              </div>
            )}
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
            <div className="bg-red-600 h-full w-full"></div>
          </div>
        </div>

        {/* Spent / Allocated Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div>
            <span className="text-slate-500 text-sm font-semibold">Allocated / Spent</span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">{formatINR(totalSpent)}</h2>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="text-right text-[10px] font-bold text-slate-400 mt-1">
            {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% Utilized
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[140px]">
          <div>
            <span className="text-slate-500 text-sm font-semibold">Remaining Funds</span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">{formatINR(remaining)}</h2>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-4">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${totalBudget > 0 ? (remaining / totalBudget) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="text-right text-[10px] font-bold text-slate-400 mt-1">
            {totalBudget > 0 ? Math.round((remaining / totalBudget) * 100) : 0}% Remaining
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                {editingId !== null ? "Edit Project Transaction" : "Record Fund Allocation"}
              </h2>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Project / Purpose</label>
                    <input required value={purpose} onChange={(e) => setPurpose(e.target.value)} type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" placeholder="E.g., Road repair Sector 3" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Allocated Amount (₹)</label>
                    <input required value={amount} onChange={(e) => setAmount(e.target.value)} type="number" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none" placeholder="Amount in Rupees" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Project Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none bg-white">
                      <option>Approved</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Date of Transaction (Optional)</label>
                    <input value={date} onChange={(e) => setDate(e.target.value)} type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none" placeholder="E.g., 15 May 2026" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={cancelForm} className="px-6 py-2.5 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2">
                    <Save className="h-4 w-4" /> {editingId !== null ? "Update Ledger" : "Publish Transaction"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions Table Ledger */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-slate-500" />
            Project Transaction Ledger
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-sm font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4 pl-6">Transaction Date</th>
                <th className="p-4">Purpose / Project</th>
                <th className="p-4">Amount Allocated</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading ledger data...</td></tr>
              )}
              
              {!loading && transactions.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No project allocations recorded.</td></tr>
              )}
              
              {!loading && transactions.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 pl-6 font-medium text-slate-600 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{item.date}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-900">{item.purpose}</td>
                  <td className="p-4 font-black text-slate-800 text-sm">
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 text-slate-500 shrink-0" />
                      {item.amount.toLocaleString("en-IN")}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      <CheckCircle2 className="h-3 w-3" />
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(item)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
