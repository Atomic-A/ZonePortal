"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

// Simple SVG for a Vaagai flower / Star burst
const VaagaiFlower = () => (
  <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 0L57 35L90 20L65 50L90 80L57 65L50 100L43 65L10 80L35 50L10 20L43 35L50 0Z" />
  </svg>
);

export default function TvkBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Floating elements to represent the victory (Vaagai) and celebration
  const elements = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 20 + 10,
      startX: Math.random() * 100,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
      isRed: Math.random() > 0.5,
    }));
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-white">
      {/* Dynamic TVK Flag Gradient Wave (Deep Red - Yellow - Deep Red) */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 opacity-10"
        style={{
          background: "linear-gradient(120deg, #b91c1c 0%, #eab308 50%, #b91c1c 100%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Abstract Animated Elephants (silhouettes/shapes coming from sides) */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 0.05, x: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute bottom-0 left-0 w-64 h-64 bg-red-900 rounded-tr-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 0.05, x: 0 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
        className="absolute bottom-0 right-0 w-64 h-64 bg-red-900 rounded-tl-full blur-3xl"
      />

      {/* Center glowing sun/flower (symbolizing the center of the flag) */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"
      />

      {/* Floating Vaagai Flowers / Stars */}
      {elements.map((el) => {
        return (
          <motion.div
            key={el.id}
            initial={{
              y: "110vh",
              x: `${el.startX}vw`,
              rotate: 0,
              opacity: 0,
            }}
            animate={{
              y: "-10vh",
              rotate: 360,
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{
              duration: el.duration,
              repeat: Infinity,
              delay: el.delay,
              ease: "linear",
            }}
            className={`absolute ${el.isRed ? "text-red-500" : "text-yellow-500"}`}
            style={{ width: el.size, height: el.size }}
          >
            <VaagaiFlower />
          </motion.div>
        );
      })}
    </div>
  );
}
