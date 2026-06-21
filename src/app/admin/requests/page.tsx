"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Filter, Download, MoreVertical, CheckCircle2, Clock, AlertCircle, Trash2, FileDown } from "lucide-react";

export default function CitizenRequests() {
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterWard, setFilterWard] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setRequests(prev => 
          prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
        );
        setActiveMenuId(null);
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this citizen request?")) return;
    try {
      const res = await fetch("/api/requests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setRequests(prev => prev.filter(r => r.id !== id));
        setActiveMenuId(null);
      }
    } catch (error) {
      console.error("Failed to delete request", error);
    }
  };

  const downloadLetter = (req: any) => {
    const letterText = `
--------------------------------------------------
OFFICIAL CITIZEN REQUEST LETTER
POONAMALLEE CONSTITUENCY OFFICE
--------------------------------------------------

Date: ${req.date}
Petition/Request ID: ${req.id}

To:
The Member of Legislative Assembly (MLA)
Poonamallee Constituency, Tamil Nadu

Subject: Request regarding ${req.type}

Respected Sir/Madam,

I am writing to bring to your attention a request/grievance regarding the following:

Citizen Name: ${req.name}
Ward Number: Ward ${req.ward}
Submitted Date: ${req.date}
Current Status: ${req.status}

Details of the Request:
${req.description || "No description provided."}

--------------------------------------------------
Please take necessary action at the earliest.
Thank you.

Sincerely,
${req.name}
--------------------------------------------------
`;
    const blob = new Blob([letterText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Petition_${req.id}_${req.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setActiveMenuId(null);
  };

  const filteredRequests = requests.filter(req => {
    if (filterStatus !== "All" && req.status !== filterStatus) return false;
    if (filterWard !== "All" && req.ward.toString() !== filterWard) return false;
    
    // Search query match
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchId = req.id.toLowerCase().includes(query);
      const matchName = req.name.toLowerCase().includes(query);
      const matchType = req.type.toLowerCase().includes(query);
      if (!matchId && !matchName && !matchType) return false;
    }
    
    return true;
  });

  const getStatusConfig = (status: string) => {
    switch(status) {
      case "Pending": return { color: "text-amber-700 bg-amber-100", icon: AlertCircle };
      case "In Progress": return { color: "text-blue-700 bg-blue-100", icon: Clock };
      case "Resolved": 
      case "Completed":
        return { color: "text-emerald-700 bg-emerald-100", icon: CheckCircle2 };
      default: return { color: "text-slate-700 bg-slate-100", icon: AlertCircle };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Citizen Requests</h1>
          <p className="text-slate-500 mt-1">Track welfare applications and grievance letters</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, Name or Type..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none bg-white transition-all"
            />
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <select 
                value={filterWard}
                onChange={(e) => setFilterWard(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-red-500 outline-none cursor-pointer"
              >
                <option value="All">All Wards</option>
                {Array.from({length: 21}, (_, i) => (
                  <option key={i+1} value={i+1}>Ward {i+1}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-red-500 outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved / Completed</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Request ID</th>
                <th className="p-4">Citizen Name</th>
                <th className="p-4">Request Type</th>
                <th className="p-4">Ward</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    Loading requests from database...
                  </td>
                </tr>
              )}
              
              {!loading && filteredRequests.map((req) => {
                const statusConf = getStatusConfig(req.status);
                const StatusIcon = statusConf.icon;
                
                return (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 pl-6 font-mono text-sm font-semibold text-slate-900">{req.id}</td>
                    <td className="p-4 font-medium text-slate-700">{req.name}</td>
                    <td className="p-4 text-slate-600 text-sm">{req.type}</td>
                    <td className="p-4 text-slate-600 text-sm">Ward {req.ward}</td>
                    <td className="p-4 text-slate-500 text-sm">{req.date}</td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusConf.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {req.status}
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right relative">
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === req.id ? null : req.id)}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {/* Dropdown Options Menu */}
                      {activeMenuId === req.id && (
                        <div 
                          ref={dropdownRef}
                          className="absolute right-12 top-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 text-left text-sm font-medium text-slate-700 animate-in fade-in slide-in-from-top-2 duration-100"
                        >
                          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Update Status
                          </div>
                          <button 
                            onClick={() => handleStatusUpdate(req.id, "Pending")}
                            className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-amber-700"
                          >
                            <Clock className="h-4 w-4" /> Pending
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(req.id, "In Progress")}
                            className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-blue-700"
                          >
                            <Clock className="h-4 w-4" /> In Progress
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(req.id, "Resolved")}
                            className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-emerald-700"
                          >
                            <CheckCircle2 className="h-4 w-4" /> Resolved / Completed
                          </button>
                          
                          <div className="h-px bg-slate-100 my-1"></div>
                          
                          <button 
                            onClick={() => downloadLetter(req)}
                            className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                          >
                            <FileDown className="h-4 w-4" /> Download Letter
                          </button>
                          <button 
                            onClick={() => handleDelete(req.id)}
                            className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" /> Delete Request
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              
              {!loading && filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    No requests found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
