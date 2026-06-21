"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, AlertTriangle, ArrowRight, Newspaper } from "lucide-react";
import { useRef, useEffect, useState } from "react";

export default function LiveFeedSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        // Only show published news on public portal
        const published = data.filter((post: any) => post.status === "Published");
        // Put pinned posts first
        const sorted = published.sort((a: any, b: any) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return 0;
        });
        setUpdates(sorted);
        
        // Recalculate slider width after data load
        setTimeout(() => {
          if (containerRef.current) {
            setWidth(containerRef.current.scrollWidth - containerRef.current.offsetWidth);
          }
        }, 100);
      }
    } catch (error) {
      console.error("Failed to fetch news", error);
    }
  };

  const getIcon = (category: string) => {
    if (category === "Emergency Announcements") return AlertTriangle;
    if (category === "Ward Updates") return CheckCircle2;
    if (category === "Welfare Schemes") return ArrowRight;
    return Newspaper;
  };

  const getColor = (category: string) => {
    if (category === "Emergency Announcements") return 'bg-red-100 text-red-600';
    if (category === "Ward Updates") return 'bg-green-100 text-green-600';
    if (category === "Welfare Schemes") return 'bg-yellow-100 text-yellow-600';
    return 'bg-blue-100 text-blue-600';
  };

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden bg-white/60 backdrop-blur-md border border-white/60 shadow-xl p-6 flex flex-col">
      
      {/* Live Updates Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-red-900/10 shrink-0">
        <h3 className="font-extrabold text-2xl text-gray-900 leading-tight">Live Updates</h3>
        
        <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase">
          Live
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden" ref={containerRef}>
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          whileTap={{ cursor: "grabbing" }}
          className="flex gap-6 h-full items-center px-2 cursor-grab"
        >
          {updates.length === 0 && (
            <div className="text-gray-500 font-medium p-4">Loading updates...</div>
          )}
          {updates.map((update) => {
            const Icon = getIcon(update.category);
            return (
              <motion.div
                key={update.id}
                className="min-w-[300px] sm:min-w-[350px] h-48 flex-shrink-0 bg-white/80 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden"
              >
                {update.pinned && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">
                    Pinned
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-full ${getColor(update.category)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm text-gray-500 font-medium">{update.date}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 pr-8">{update.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{update.content || update.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-500 font-medium shrink-0">
        Drag to scroll <ArrowRight className="inline h-3 w-3 ml-1" />
      </div>
    </div>
  );
}
