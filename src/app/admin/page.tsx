"use client";

import { motion } from "framer-motion";
import { Newspaper, FileText, AlertCircle, IndianRupee, TrendingUp, TrendingDown } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const stats = [
  { title: "Active News Posts", value: "24", icon: Newspaper, trend: "+12%", up: true, color: "text-blue-600", bg: "bg-blue-100" },
  { title: "Pending Welfare Apps", value: "156", icon: FileText, trend: "-5%", up: false, color: "text-amber-600", bg: "bg-amber-100" },
  { title: "New Grievances", value: "48", icon: AlertCircle, trend: "+18%", up: true, color: "text-red-600", bg: "bg-red-100" },
  { title: "Budget Allocation", value: "₹4.5L", icon: IndianRupee, trend: "+2%", up: true, color: "text-emerald-600", bg: "bg-emerald-100" },
];

const chartData = [
  { name: 'Week 1', apps: 45, grievances: 12 },
  { name: 'Week 2', apps: 52, grievances: 19 },
  { name: 'Week 3', apps: 38, grievances: 15 },
  { name: 'Week 4', apps: 65, grievances: 28 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Poonamallee Zone Public Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={stat.title} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.up ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Request Volume (30 Days)</h2>
          <p className="text-sm text-slate-500">Comparison of welfare applications vs grievances</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGrievances" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="apps" name="Applications" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
              <Area type="monotone" dataKey="grievances" name="Grievances" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorGrievances)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
