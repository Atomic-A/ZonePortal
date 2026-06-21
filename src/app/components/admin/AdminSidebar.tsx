"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Newspaper, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  HeartHandshake,
  BarChart3,
  IndianRupee
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
  { name: "News & Announcements", href: "/admin/news", icon: Newspaper },
  { name: "Citizen Requests", href: "/admin/requests", icon: FileText },
  { name: "Welfare Schemes", href: "/admin/schemes", icon: HeartHandshake },
  { name: "Townhall Polls", href: "/admin/polls", icon: BarChart3 },
  { name: "Constituency Funds", href: "/admin/funds", icon: IndianRupee },
  { name: "User Management", href: "/admin/users", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth", { method: "DELETE" });
      if (res.ok) {
        window.location.href = "/admin/login";
      }
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white border-r border-slate-800 w-64 shadow-2xl">
      <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-950">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-yellow-500 flex items-center justify-center font-black text-xl shadow-lg">
            P
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide">Poonamallee Zone</h1>
            <p className="text-xs text-slate-400 font-medium">Admin Portal</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 scrollbar-hide">
        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 mt-2">Main Menu</p>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-red-600/10 text-red-500 font-semibold" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-red-500" : "text-slate-500 group-hover:text-slate-300"}`} />
              <span className="text-sm">{item.name}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="w-1.5 h-6 bg-red-500 rounded-full ml-auto"
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0 border border-slate-600">
            <Users className="h-5 w-5 text-slate-300" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">Super Admin</p>
            <p className="text-xs text-slate-400 truncate">admin@poonamallee.gov.in</p>
          </div>
        </div>
        <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-red-600/20 hover:text-red-500 transition-colors">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-50 flex items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-yellow-500 flex items-center justify-center font-black text-sm text-white">
            P
          </div>
          <span className="font-bold text-white">Poonamallee Admin</span>
        </Link>
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40 w-64 bg-slate-900">
        {renderSidebarContent()}
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="lg:hidden fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 shadow-2xl"
            >
              {renderSidebarContent()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
