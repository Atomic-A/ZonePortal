"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export default function EmergencyBanner() {
  const [isVisible, setIsVisible] = useState(true);

  // In a real application, this state would be fetched from a CMS or API
  const isEmergencyActive = true; 
  const emergencyMessage = "Heavy rainfall warning: Schools in Ward 4 & 5 remain closed today. Contact emergency helpline 1077 for assistance.";

  if (!isEmergencyActive) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-brand-gold text-foreground w-full overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <AlertTriangle className="h-5 w-5 text-red-700" />
              </motion.div>
              <p className="text-sm font-medium">{emergencyMessage}</p>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-foreground/80 hover:text-foreground transition-colors p-1"
              aria-label="Dismiss alert"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
