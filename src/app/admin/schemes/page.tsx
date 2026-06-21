"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, FileText, Link as LinkIcon, Info, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WelfareSchemesAdmin() {
  const [schemes, setSchemes] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState("Farmers");

  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [oldCategory, setOldCategory] = useState("");
  const [category, setCategory] = useState("Farmers");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [docsInput, setDocsInput] = useState(""); // Comma separated documents
  const [link, setLink] = useState("");

  const categories = ["Farmers", "Students", "Senior Citizens", "Women"];

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
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
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setOldCategory("");
    setCategory("Farmers");
    setTitle("");
    setDesc("");
    setEligibility("");
    setDocsInput("");
    setLink("");
  };

  const startEdit = (scheme: any, catName: string) => {
    setEditingId(scheme.id);
    setOldCategory(catName);
    setCategory(catName);
    setTitle(scheme.title);
    setDesc(scheme.desc);
    setEligibility(scheme.eligibility);
    setDocsInput(Array.isArray(scheme.docs) ? scheme.docs.join(", ") : "");
    setLink(scheme.link || "");
    setIsCreating(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = editingId !== null;
    const url = "/api/schemes";
    const method = isEdit ? "PUT" : "POST";

    const parsedDocs = docsInput
      .split(",")
      .map(doc => doc.trim())
      .filter(doc => doc.length > 0);

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          oldCategory,
          newCategory: category,
          title,
          desc,
          eligibility,
          docs: parsedDocs,
          link
        })
      });

      if (res.ok) {
        cancelForm();
        fetchSchemes();
      }
    } catch (error) {
      console.error(`Failed to ${isEdit ? 'update' : 'create'} scheme`, error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this welfare scheme?")) return;
    try {
      const res = await fetch("/api/schemes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) fetchSchemes();
    } catch (error) {
      console.error("Failed to delete scheme", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welfare Schemes Directory</h1>
          <p className="text-slate-500 mt-1">Manage state and central welfare programs for citizens</p>
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
          {isCreating ? "Cancel" : "Add New Scheme"}
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
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                {editingId !== null ? "Edit Welfare Scheme" : "Register New Welfare Scheme"}
              </h2>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Scheme Title</label>
                    <input required value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" placeholder="E.g., PM-KISAN Scheme" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Category Group</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none bg-white">
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Official Portal Link</label>
                    <input required value={link} onChange={(e) => setLink(e.target.value)} type="url" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none" placeholder="https://..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Eligibility Criteria</label>
                    <input required value={eligibility} onChange={(e) => setEligibility(e.target.value)} type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none" placeholder="Who is eligible..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Scheme Description</label>
                  <textarea required value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none resize-none" placeholder="Provide a summary of the scheme benefit..."></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Documents Needed (Comma-separated)</label>
                  <input required value={docsInput} onChange={(e) => setDocsInput(e.target.value)} type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none" placeholder="E.g., Aadhaar Card, Ration Card, Land records" />
                  <p className="text-xs text-slate-400">Separate multiple documents with a comma (e.g. Card A, Card B)</p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={cancelForm} className="px-6 py-2.5 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2">
                    <Save className="h-4 w-4" /> {editingId !== null ? "Update Scheme" : "Publish Scheme"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-px">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryTab(cat)}
            className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 -mb-px ${
              activeCategoryTab === cat
                ? "border-red-600 text-red-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table List of Schemes */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4 pl-6">Scheme Details</th>
                <th className="p-4">Eligibility</th>
                <th className="p-4">Required Documents</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">Loading database...</td></tr>
              )}
              
              {!loading && (!schemes[activeCategoryTab] || schemes[activeCategoryTab].length === 0) && (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">No schemes registered in this category.</td></tr>
              )}
              
              {!loading && schemes[activeCategoryTab] && schemes[activeCategoryTab].map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 pl-6 max-w-sm">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.desc}</p>
                    <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 mt-2 hover:underline">
                      <LinkIcon className="h-3 w-3" /> External Link
                    </a>
                  </td>
                  <td className="p-4 text-slate-600 text-sm">
                    <div className="flex items-start gap-1.5 max-w-xs">
                      <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>{item.eligibility}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {item.docs && item.docs.map((doc: string, idx: number) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
                          <Check className="h-3 w-3 text-emerald-600" />
                          {doc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(item, activeCategoryTab)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
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
