"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Check, ExternalLink, Info } from "lucide-react";

export default function WelfareSchemes() {
  const [activeTab, setActiveTab] = useState("Farmers");
  const [schemes, setSchemes] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const categories = ["Farmers", "Students", "Senior Citizens", "Women"];

  useEffect(() => {
    async function fetchSchemes() {
      try {
        const res = await fetch("/api/schemes");
        if (res.ok) {
          const data = await res.json();
          setSchemes(data);
        }
      } catch (error) {
        console.error("Failed to fetch schemes", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSchemes();
  }, []);

  return (
    <section id="schemes" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welfare Schemes Directory</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find and apply for government schemes you are eligible for. Click 'Apply Now' to be redirected to the official Central or State Government portals.
          </p>
        </div>

        {/* Custom Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === cat 
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105" 
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="text-center text-gray-500 py-12">Loading schemes...</div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {!schemes[activeTab] || schemes[activeTab].length === 0 ? (
                  <div className="col-span-2 text-center text-gray-500 py-12">
                    No schemes registered under this category yet.
                  </div>
                ) : (
                  schemes[activeTab].map((scheme: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight">{scheme.title}</h3>
                        <div className="p-3 bg-red-50 rounded-xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors shrink-0">
                          <FileText className="h-6 w-6" />
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                        {scheme.desc}
                      </p>
                      
                      <div className="space-y-5 mb-8 flex-1 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
                            <Info className="h-4 w-4 text-blue-600" />
                            Eligibility Criteria
                          </h4>
                          <p className="text-sm text-gray-600 ml-6">{scheme.eligibility}</p>
                        </div>
                        {scheme.docs && scheme.docs.length > 0 && (
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
                              <Check className="h-4 w-4 text-green-600" />
                              Documents Needed
                            </h4>
                            <ul className="text-sm text-gray-600 ml-6 list-disc space-y-1">
                              {scheme.docs.map((doc: string, dIdx: number) => (
                                <li key={dIdx}>{doc}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <a 
                        href={scheme.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 flex justify-center items-center gap-2 border-2 border-red-600 text-red-700 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        Apply Now on Official Portal
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
