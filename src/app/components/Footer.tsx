"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

// Inline SVGs for social brands
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      {/* TVK Themed Animated Banner */}
      <div className="h-2 w-full flex">
        <motion.div 
          animate={{ backgroundPosition: ["0% 0%", "100% 0%"] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="w-full h-full"
          style={{
            background: "linear-gradient(90deg, #b91c1c 0%, #eab308 50%, #b91c1c 100%)",
            backgroundSize: "200% 100%"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Column 1: About */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-2 text-white">
              <span className="text-yellow-500">MLA</span> Portal
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Dedicated to serving the people of our constituency with transparency, dedication, and progress. Together we build a better tomorrow.
            </p>
          </div>

          {/* Column 2: Contact Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-yellow-500 mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-sm">MLA Office, No. 12, Main Road, Constituency HQ, Tamil Nadu 600001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-red-500 shrink-0" />
                <span className="text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-red-500 shrink-0" />
                <span className="text-sm">contact@mlaportal.gov.in</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-yellow-500 mb-4">Connect With Us</h4>
            <div className="flex gap-4">
              <motion.a 
                whileHover={{ y: -5, scale: 1.1 }}
                href="mailto:contact@mlaportal.gov.in" 
                className="p-3 rounded-full bg-gray-800 hover:bg-red-600 transition-colors"
                aria-label="Gmail"
              >
                <Mail className="h-5 w-5" />
              </motion.a>
              <motion.a 
                whileHover={{ y: -5, scale: 1.1 }}
                href="#" 
                className="p-3 rounded-full bg-gray-800 hover:bg-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </motion.a>
              <motion.a 
                whileHover={{ y: -5, scale: 1.1 }}
                href="#" 
                className="p-3 rounded-full bg-gray-800 hover:bg-sky-500 transition-colors"
                aria-label="Twitter"
              >
                <TwitterIcon />
              </motion.a>
              <motion.a 
                whileHover={{ y: -5, scale: 1.1 }}
                href="#" 
                className="p-3 rounded-full bg-gray-800 hover:bg-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </motion.a>
            </div>
            
            {/* TVK Themed Animated Badge */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 overflow-hidden relative group"
            >
              <div className="absolute inset-0 w-full h-full opacity-20 group-hover:opacity-40 transition-opacity">
                <motion.div 
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-full h-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent skew-x-12"
                />
              </div>
              <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse delay-75"></span>
              <span className="text-sm font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                TVK SUPPORT
              </span>
            </motion.div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} MLA Constituency Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
