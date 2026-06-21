"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { IndianRupee, TrendingUp, Search } from "lucide-react";

export default function NidhiDashboard() {
  const [totalBudget, setTotalBudget] = useState(50000000);
  const [totalSpent, setTotalSpent] = useState(0);
  const [remaining, setRemaining] = useState(50000000);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFunds() {
      try {
        const res = await fetch("/api/funds");
        if (res.ok) {
          const data = await res.json();
          setTotalBudget(data.totalBudget || 50000000);
          setTotalSpent(data.totalSpent || 0);
          setRemaining(data.remaining || 0);
          setTransactions(data.transactions || []);
        }
      } catch (error) {
        console.error("Failed to fetch funds", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFunds();
  }, []);

  // Format currency helpers
  const formatLakhsCr = (amount: number) => {
    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(2)} Cr`;
    }
    return `${(amount / 100000).toFixed(2)} Lakhs`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Dynamically calculate category-wise allocation based on transaction purposes
  const getDynamicChartData = () => {
    let roadsVal = 0;
    let educationVal = 0;
    let waterVal = 0;
    let healthVal = 0;

    transactions.forEach((trx) => {
      const purposeLower = (trx.purpose || "").toLowerCase();
      const amt = Number(trx.amount) || 0;

      if (purposeLower.match(/road|street|light|park|infra|bridge|building/)) {
        roadsVal += amt;
      } else if (purposeLower.match(/school|education|study|college|library|student/)) {
        educationVal += amt;
      } else if (purposeLower.match(/water|pipeline|supply|drainage|sewage|tank/)) {
        waterVal += amt;
      } else {
        healthVal += amt;
      }
    });

    const sumVal = roadsVal + educationVal + waterVal + healthVal;

    if (sumVal === 0) {
      // Return default equal shares if no transactions
      return [
        { name: "Roads & Infra", value: 30, color: "#1E3A8A" },
        { name: "Education", value: 30, color: "#0F766E" },
        { name: "Water Supply", value: 20, color: "#F59E0B" },
        { name: "Health", value: 20, color: "#10B981" }
      ];
    }

    return [
      { name: "Roads & Infra", value: Math.round((roadsVal / sumVal) * 100), color: "#1E3A8A" },
      { name: "Education", value: Math.round((educationVal / sumVal) * 100), color: "#0F766E" },
      { name: "Water Supply", value: Math.round((waterVal / sumVal) * 100), color: "#F59E0B" },
      { name: "Health", value: Math.round((healthVal / sumVal) * 100), color: "#10B981" }
    ].filter(item => item.value > 0); // Hide empty slices
  };

  const chartData = getDynamicChartData();

  const filteredTransactions = transactions.filter((trx) => {
    if (searchQuery.trim() === "") return true;
    const query = searchQuery.toLowerCase();
    return (
      (trx.purpose || "").toLowerCase().includes(query) ||
      (trx.status || "").toLowerCase().includes(query) ||
      (trx.id || "").toLowerCase().includes(query)
    );
  });

  const percentUtilized = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const percentRemaining = totalBudget > 0 ? Math.round((remaining / totalBudget) * 100) : 0;

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading constituency funds...
      </div>
    );
  }

  return (
    <section id="nidhi" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nidhi (Constituency Fund) Dashboard</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transparent tracking of local development funds. See exactly where your tax money is being invested.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
          >
            <div className="text-gray-500 text-sm font-medium mb-2">Total Budget Received</div>
            <div className="text-3xl font-bold text-gray-900 flex items-center mb-4">
              <IndianRupee className="h-6 w-6 text-brand-blue mr-1" />
              {formatLakhsCr(totalBudget)}
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-brand-blue h-full w-full"></div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
          >
            <div className="text-gray-500 text-sm font-medium mb-2">Total Allocated / Spent</div>
            <div className="text-3xl font-bold text-gray-900 flex items-center mb-4">
              <IndianRupee className="h-6 w-6 text-brand-teal mr-1" />
              {formatLakhsCr(totalSpent)}
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-brand-teal h-full transition-all" style={{ width: `${percentUtilized}%` }}></div>
            </div>
            <div className="text-xs text-gray-400 mt-2 text-right">{percentUtilized}% Utilized</div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
          >
            <div className="text-gray-500 text-sm font-medium mb-2">Remaining Balance</div>
            <div className="text-3xl font-bold text-gray-900 flex items-center mb-4">
              <IndianRupee className="h-6 w-6 text-brand-emerald mr-1" />
              {formatLakhsCr(remaining)}
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-brand-emerald h-full transition-all" style={{ width: `${percentRemaining}%` }}></div>
            </div>
            <div className="text-xs text-gray-400 mt-2 text-right">{percentRemaining}% Remaining</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm lg:col-span-1">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Fund Allocation by Category</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Allocation']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transaction History Feed */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search transactions..." 
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 w-full sm:w-64 bg-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-sm text-gray-500">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Purpose</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        No transactions found matching search.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((trx, idx) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 text-gray-600">{trx.date}</td>
                        <td className="py-4 font-medium text-gray-900">{trx.purpose}</td>
                        <td className="py-4 font-semibold text-gray-800">{formatCurrency(trx.amount)}</td>
                        <td className="py-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                            trx.status === 'Completed' ? 'bg-brand-emerald/10 text-brand-emerald' : 
                            trx.status === 'In Progress' ? 'bg-brand-blue/10 text-brand-blue' : 
                            'bg-brand-gold/10 text-brand-gold'
                          }`}>
                            {trx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center">
                Audited & Verified <TrendingUp className="h-4 w-4 ml-1 text-brand-emerald" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
