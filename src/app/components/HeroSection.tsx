"use client";

import { motion } from "framer-motion";
import { Search, FileText, PieChart } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-transparent py-16 md:py-24">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-teal/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-brand-blue/5 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Typography and CTAs (60%) */}
          <div className="w-full lg:w-3/5 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Empowering <span className="text-red-600">Citizens.</span><br />
                Building <span className="text-yellow-600">Communities.</span>
              </h1>
              <p className="mt-6 text-lg text-gray-700 max-w-2xl font-medium">
                Welcome to your official Poonamallee Zone portal. Stay updated with local developments, track community funds, and easily submit requests for your ward.
              </p>
            </motion.div>

            {/* Global Search */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 w-full max-w-lg relative"
            >
              <div className="relative flex items-center w-full h-14 rounded-full focus-within:shadow-lg bg-white/80 backdrop-blur-sm border border-gray-200 overflow-hidden transition-all shadow-sm">
                <div className="grid place-items-center h-full w-12 text-gray-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  className="peer h-full w-full outline-none text-sm text-gray-700 pr-2 bg-transparent placeholder-gray-500 font-medium"
                  type="text"
                  id="search"
                  placeholder="Search schemes, events, or updates..."
                />
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <a 
                href="#manu"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 hover:bg-red-700 transition-all duration-300"
              >
                <FileText className="h-5 w-5" />
                Submit a Request (Manu)
              </a>
              <a 
                href="#nidhi"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/90 backdrop-blur-sm text-red-700 border-2 border-red-600/20 font-bold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-red-600 transition-all duration-300"
              >
                <PieChart className="h-5 w-5" />
                View Fund Distributions
              </a>
            </motion.div>
          </div>

          {/* Right Side: Image of Party Leader (40%) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full lg:w-2/5 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-500 bg-white group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
              
              <img 
                src="/thalapathy.jpg" 
                alt="C. Joseph Vijay (Thalapathy)" 
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-white font-extrabold text-2xl drop-shadow-md">C. Joseph Vijay</h3>
                <p className="text-yellow-400 font-bold text-sm uppercase tracking-wider drop-shadow-md">Party President, TVK</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
