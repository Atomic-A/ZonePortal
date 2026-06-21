"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Inbox, FileText, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";

export default function ManuSystem() {
  const [name, setName] = useState("");
  const [ward, setWard] = useState("1");
  const [type, setType] = useState("Welfare Scheme App");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  const requestTypes = [
    "Welfare Scheme App",
    "Street Light Repair",
    "Road Maintenance",
    "Pension Scheme App",
    "Water Supply Issue",
    "Drainage & Sewage",
    "Others"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          ward: Number(ward),
          type,
          description
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessId(data.id);
        
        // Reset form inputs
        setName("");
        setWard("1");
        setType("Welfare Scheme App");
        setDescription("");
      }
    } catch (error) {
      console.error("Failed to submit request", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="manu" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Letter (Manu) System</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Submit your grievances, requests, or suggestions directly to the MLA office. Track the resolution status transparently.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Public Form Interface Container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-3xl p-4 border border-gray-100 shadow-xl"
          >
            <div className="bg-white rounded-2xl min-h-[580px] flex flex-col items-center justify-center p-6 sm:p-8 border border-gray-100 overflow-hidden relative">
              
              {/* Decorative Background Icon */}
              {!successId && (
                <div className="absolute inset-0 bg-brand-blue/5 flex flex-col items-center justify-center pointer-events-none">
                  <FileText className="h-48 w-48 text-brand-blue mb-4 opacity-5" />
                </div>
              )}
              
              <AnimatePresence mode="wait">
                {successId ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="z-10 w-full text-center space-y-6 max-w-md"
                  >
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                      <ShieldCheck className="h-10 w-10" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">Submission Successful!</h3>
                      <p className="text-gray-500 text-sm mt-2">
                        Your petition has been submitted securely to the MLA administration database.
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Tracking ID</p>
                      <h4 className="text-xl font-mono font-black text-slate-900 mt-1 select-all">{successId}</h4>
                      <p className="text-[11px] text-slate-500 mt-2">
                        Use this ID to track your application with ward representatives.
                      </p>
                    </div>

                    <button 
                      onClick={() => setSuccessId(null)}
                      className="px-6 py-3 border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2 mx-auto shadow-sm"
                    >
                      <RefreshCw className="h-4 w-4" /> Submit Another Petition
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="z-10 w-full max-w-md"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-6 text-left border-b border-gray-100 pb-4">
                      Submit a Request
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500">Citizen Name</label>
                        <input 
                          type="text" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name" 
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium text-gray-800" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-500">Ward Number</label>
                          <select 
                            value={ward}
                            onChange={(e) => setWard(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium text-gray-800"
                          >
                            {Array.from({length: 48}, (_, i) => (
                              <option key={i+1} value={i+1}>Ward {i+1}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-500">Request Category</label>
                          <select 
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium text-gray-800"
                          >
                            {requestTypes.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500">Petition Details / Description</label>
                        <textarea 
                          required
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Describe your issue or request in detail..." 
                          rows={4} 
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all resize-none font-medium text-gray-800" 
                        />
                      </div>
                      
                      <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-brand-blue hover:bg-brand-teal text-white rounded-xl font-bold shadow-md transition-colors disabled:opacity-75"
                      >
                        {loading ? "Submitting Petition..." : "Submit Secure Request"}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Analytics Tracker & Success Stories */}
          <div className="flex flex-col gap-8">
            {/* Transparency Metrics Tracker */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Petition Statistics</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-brand-blue/10 text-brand-blue">
                      <Inbox className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Received</p>
                      <p className="text-2xl font-bold text-gray-900">1,248</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="flex items-center gap-1.5 text-brand-gold"><Clock className="h-4 w-4" /> In Review</span>
                    <span className="text-gray-900">342</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-brand-gold h-full w-[27%] rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="flex items-center gap-1.5 text-brand-emerald"><CheckCircle className="h-4 w-4" /> Resolved successfully</span>
                    <span className="text-gray-900">906</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-brand-emerald h-full w-[73%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Success Stories */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-brand-teal/10 to-brand-blue/5 rounded-2xl p-6 border border-brand-teal/20"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Success Stories</h3>
              
              <div className="space-y-4">
                {[
                  { title: "Ward 7 Drainage Fixed", desc: "Resolved a 3-month long waterlogging issue within 48 hours of citizen reporting." },
                  { title: "New Streetlights in Sector 4", desc: "Installed 15 LED streetlights improving safety for night commuters." }
                ].map((story, idx) => (
                  <div key={idx} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white hover:border-brand-teal/30 transition-colors group cursor-pointer">
                    <h4 className="font-bold text-gray-900 mb-1 flex items-center justify-between">
                      {story.title}
                      <ArrowRight className="h-4 w-4 text-brand-teal opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{story.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
