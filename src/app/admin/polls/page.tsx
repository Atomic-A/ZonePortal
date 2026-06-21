"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, X, BarChart3, RotateCcw, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function TownhallPollAdmin() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [editQuestion, setEditQuestion] = useState("");
  const [editOptions, setEditOptions] = useState<any[]>([]);

  useEffect(() => {
    fetchPoll();
  }, []);

  const fetchPoll = async () => {
    try {
      const res = await fetch("/api/polls");
      if (res.ok) {
        const data = await res.json();
        setQuestion(data.question || "No active poll question");
        setOptions(data.options || []);
        
        setEditQuestion(data.question || "");
        setEditOptions(data.options || []);
      }
    } catch (error) {
      console.error("Failed to fetch active poll", error);
    } finally {
      setLoading(false);
    }
  };

  const totalVotes = options.reduce((sum, opt) => sum + (opt.votes || 0), 0);

  const startEdit = () => {
    setEditQuestion(question);
    setEditOptions(options.map(opt => ({ ...opt }))); // Deep copy
    setIsEditing(true);
  };

  const handleAddOption = () => {
    setEditOptions(prev => [
      ...prev,
      { id: `opt-${Date.now()}`, text: "", votes: 0 }
    ]);
  };

  const handleRemoveOption = (id: string) => {
    setEditOptions(prev => prev.filter(opt => opt.id !== id));
  };

  const handleOptionTextChange = (id: string, text: string) => {
    setEditOptions(prev =>
      prev.map(opt => opt.id === id ? { ...opt, text } : opt)
    );
  };

  const handleResetVotes = () => {
    if (!confirm("Are you sure you want to reset all vote counts to 0? This action cannot be undone.")) return;
    setEditOptions(prev => prev.map(opt => ({ ...opt, votes: 0 })));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editOptions.length < 2) {
      alert("A poll must have at least 2 choices!");
      return;
    }
    
    // Check for empty choices
    if (editOptions.some(opt => opt.text.trim() === "")) {
      alert("All poll choices must have text!");
      return;
    }

    try {
      const res = await fetch("/api/polls", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: editQuestion,
          options: editOptions
        })
      });

      if (res.ok) {
        setIsEditing(false);
        fetchPoll();
      }
    } catch (error) {
      console.error("Failed to update poll", error);
    }
  };

  const handleClearPoll = async () => {
    if (!confirm("Are you sure you want to deactivate and delete this poll entirely?")) return;
    try {
      const res = await fetch("/api/polls", {
        method: "DELETE"
      });
      if (res.ok) {
        fetchPoll();
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to delete poll", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Live Townhall Polls</h1>
          <p className="text-slate-500 mt-1">Manage public opinion surveys and live voting metrics</p>
        </div>
        {!isEditing && (
          <button 
            onClick={startEdit}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            Edit Active Poll
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle Column: Live Results Display */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="flex h-3.5 w-3.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                </span>
                <h3 className="font-bold text-slate-900 text-lg">Current Live Poll</h3>
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
                {totalVotes} total votes cast
              </span>
            </div>

            {loading ? (
              <p className="text-slate-500 text-center py-12">Loading active poll...</p>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                    {question}
                  </h2>
                </div>

                <div className="space-y-4">
                  {options.length === 0 ? (
                    <p className="text-slate-500 text-sm py-4">No poll choices configured.</p>
                  ) : (
                    options.map((opt) => {
                      const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                      return (
                        <div key={opt.id} className="space-y-2">
                          <div className="flex justify-between text-sm font-semibold text-slate-700">
                            <span>{opt.text}</span>
                            <span>{opt.votes} votes ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/50">
                            <div 
                              className="bg-gradient-to-r from-red-500 to-yellow-500 h-full rounded-full transition-all duration-1000"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Edit Controls Panel */}
        <div className="lg:col-span-1">
          {isEditing ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-lg">Edit Configuration</h3>
                <button onClick={() => setIsEditing(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Poll Question</label>
                  <textarea 
                    required 
                    value={editQuestion} 
                    onChange={(e) => setEditQuestion(e.target.value)}
                    rows={2} 
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none resize-none font-medium"
                    placeholder="Enter the main question..."
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700">Choices / Options</label>
                    <button 
                      type="button"
                      onClick={handleAddOption}
                      className="text-xs font-bold text-red-600 flex items-center gap-1 hover:underline"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Choice
                    </button>
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {editOptions.map((opt, idx) => (
                      <div key={opt.id} className="flex gap-2 items-center">
                        <span className="text-xs text-slate-400 font-bold w-6">{idx + 1}.</span>
                        <input 
                          type="text" 
                          required
                          value={opt.text}
                          onChange={(e) => handleOptionTextChange(opt.id, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none text-sm font-medium"
                          placeholder={`Choice ${idx + 1}`}
                        />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveOption(opt.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove option"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-2.5 items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    Saving modifications will preserve existing option vote counts. If you are creating a completely new poll, click <strong>Reset Votes</strong> first.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                  <button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm flex justify-center items-center gap-2"
                  >
                    <Save className="h-4.5 w-4.5" /> Save Changes
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      type="button" 
                      onClick={handleResetVotes}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Reset Votes
                    </button>
                    <button 
                      type="button" 
                      onClick={handleClearPoll}
                      className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Deactivate
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          ) : (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 text-center space-y-3">
              <BarChart3 className="h-12 w-12 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-800">Poll Settings</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Click <strong>Edit Active Poll</strong> at the top right to rewrite the questions, configure voting choices, reset vote counts, or shut down the poll.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
