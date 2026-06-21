"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, CheckCircle } from "lucide-react";

export default function TownHallPoll() {
  const [question, setQuestion] = useState("Loading active poll question...");
  const [options, setOptions] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPoll();
  }, []);

  const fetchPoll = async () => {
    try {
      const res = await fetch("/api/polls");
      if (res.ok) {
        const data = await res.json();
        setQuestion(data.question || "No active poll at the moment");
        setOptions(data.options || []);
        
        // Check local storage if the user voted on this specific question
        const savedVoted = localStorage.getItem(`voted_poll_${data.question}`);
        if (savedVoted) {
          setVoted(true);
          setSelected(savedVoted);
        }
      }
    } catch (error) {
      console.error("Failed to fetch poll", error);
    } finally {
      setLoading(false);
    }
  };

  const totalVotes = options.reduce((acc, curr) => acc + curr.votes, 0);

  const handleVote = async () => {
    if (!selected) return;
    try {
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: selected })
      });

      if (res.ok) {
        // Record vote locally
        localStorage.setItem(`voted_poll_${question}`, selected);
        setVoted(true);
        // Refresh options to show latest percentages
        fetchPoll();
      }
    } catch (error) {
      console.error("Failed to record vote", error);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          Loading active poll...
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-brand-blue/5 to-white rounded-3xl p-8 md:p-12 border border-brand-blue/10 shadow-lg relative overflow-hidden">
          
          {/* Decorative icons */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 text-brand-blue/5">
            <BarChart3 className="w-64 h-64" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <h4 className="text-sm font-bold text-red-500 uppercase tracking-wider">Live Town Hall Poll</h4>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {question}
            </h2>
            <p className="text-gray-600 mb-8">
              Your voice matters. Help us decide the most critical area of development for this quarter.
            </p>

            <div className="space-y-4 max-w-2xl">
              {options.length === 0 ? (
                <p className="text-gray-500 text-sm">No choices configured for this poll.</p>
              ) : (
                options.map((option) => {
                  const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

                  return (
                    <div key={option.id} className="relative">
                      {!voted ? (
                        <label 
                          className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                            selected === option.id 
                              ? "border-brand-blue bg-brand-blue/5 shadow-sm" 
                              : "border-gray-200 hover:border-brand-blue/50 hover:bg-gray-50"
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="poll" 
                            value={option.id}
                            checked={selected === option.id}
                            className="w-5 h-5 text-brand-blue border-gray-300 focus:ring-brand-blue"
                            onChange={() => setSelected(option.id)}
                          />
                          <span className="ml-3 font-medium text-gray-800">{option.text}</span>
                        </label>
                      ) : (
                        <div className="relative flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50 overflow-hidden">
                          {/* Progress Bar Background */}
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`absolute left-0 top-0 bottom-0 ${
                              selected === option.id ? "bg-brand-blue/20" : "bg-gray-200/50"
                            }`}
                          ></motion.div>
                          
                          <span className="relative z-10 font-medium text-gray-800 flex items-center gap-2">
                            {option.text}
                            {selected === option.id && <CheckCircle className="h-4 w-4 text-brand-blue" />}
                          </span>
                          <span className="relative z-10 font-bold text-gray-900">{percentage}%</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {!voted && options.length > 0 && (
              <div className="mt-8">
                <button
                  onClick={handleVote}
                  disabled={!selected}
                  className={`px-8 py-3 rounded-xl font-bold transition-all shadow-sm ${
                    selected 
                      ? "bg-brand-blue text-white hover:bg-brand-teal hover:shadow-md hover:-translate-y-0.5" 
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Cast Your Vote
                </button>
              </div>
            )}
            
            {voted && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 inline-flex items-center gap-2 text-brand-emerald font-medium bg-brand-emerald/10 px-4 py-2 rounded-lg"
              >
                <CheckCircle className="h-5 w-5" />
                Thank you! Your vote has been recorded securely.
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
