"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsDesk() {
  const [isCreating, setIsCreating] = useState(false);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Welfare Schemes");
  const [ward, setWard] = useState("All Wards");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        setNews(data);
      }
    } catch (error) {
      console.error("Failed to fetch news", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setTitle("");
    setCategory("Welfare Schemes");
    setWard("All Wards");
    setImage("");
    setContent("");
    setPinned(false);
  };

  const startEdit = (post: any) => {
    setEditingId(post.id);
    setTitle(post.title);
    setCategory(post.category);
    setWard(post.ward === "All" ? "All Wards" : post.ward.toString());
    setImage(post.image || "");
    setContent(post.content);
    setPinned(post.pinned || false);
    setIsCreating(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = editingId !== null;
    const url = "/api/news";
    const method = isEdit ? "PUT" : "POST";
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          title,
          category,
          ward: ward === "All Wards" ? "All" : parseInt(ward),
          image,
          content,
          status: "Published",
          pinned
        })
      });

      if (res.ok) {
        cancelForm();
        fetchNews(); // Refresh list
      }
    } catch (error) {
      console.error(`Failed to ${isEdit ? 'update' : 'publish'}`, error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch("/api/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) fetchNews();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const toggleVisibility = async (post: any) => {
    try {
      const res = await fetch("/api/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: post.id, 
          status: post.status === "Published" ? "Draft" : "Published" 
        })
      });
      if (res.ok) fetchNews();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">News & Announcements</h1>
          <p className="text-slate-500 mt-1">Manage public portal broadcasts and updates</p>
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
          {isCreating ? "Cancel" : "Create New Post"}
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
                {editingId !== null ? "Edit Announcement" : "Draft New Announcement"}
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Post Title</label>
                    <input required value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" placeholder="Enter headline..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none bg-white">
                      <option>Welfare Schemes</option>
                      <option>Ward Updates</option>
                      <option>General News</option>
                      <option>Emergency Announcements</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Target Ward (Optional)</label>
                    <select value={ward} onChange={(e) => setWard(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none bg-white">
                      <option>All Wards</option>
                      {Array.from({length: 48}, (_, i) => (
                        <option key={i+1} value={i+1}>Ward {i+1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Cover Image URL</label>
                    <input value={image} onChange={(e) => setImage(e.target.value)} type="url" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none" placeholder="https://..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Rich Text Content</label>
                  <textarea required value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none resize-none" placeholder="Write the announcement body here..."></textarea>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <input type="checkbox" id="pin" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="w-5 h-5 accent-red-600 rounded cursor-pointer" />
                  <label htmlFor="pin" className="text-sm font-medium text-slate-700 cursor-pointer">Pin to top of Live Feed</label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={cancelForm} className="px-6 py-2.5 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2">
                    <Save className="h-4 w-4" /> {editingId !== null ? "Update Post" : "Publish Post"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4 pl-6">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Ward</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading database...</td></tr>
              )}
              {!loading && news.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No news posts found.</td></tr>
              )}
              {!loading && news.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 pl-6">
                    <p className="font-semibold text-slate-900 flex items-center gap-2">
                      {item.title}
                      {item.pinned && <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Pinned</span>}
                    </p>
                  </td>
                  <td className="p-4 text-slate-600 text-sm">{item.category}</td>
                  <td className="p-4 text-slate-600 text-sm">{item.ward}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">{item.date}</td>
                  <td className="p-4 pr-6 text-right flex justify-end gap-2">
                    <button onClick={() => toggleVisibility(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Toggle Visibility">
                      {item.status === 'Published' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button onClick={() => startEdit(item)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
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
