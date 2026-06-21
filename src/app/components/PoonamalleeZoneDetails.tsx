"use client";

import { motion } from "framer-motion";
import { Users, Map, Building2, Landmark } from "lucide-react";

export default function PoonamalleeZoneDetails() {
  return (
    <section className="py-20 relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-gray-900"
          >
            About <span className="text-red-600">Poonamallee Zone</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Discover the facts, leadership, and vision for our constituency.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* MLA Details Profile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row"
          >
            <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-red-50 flex items-center justify-center">
              <img 
                src="https://myneta.info/images_candidate/TamilNadu2026/eae376331c993cd59409b1b70f5460e6c006188b.jpg" 
                alt="Mr. R. Prakasam" 
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
              <h3 className="text-sm font-bold text-yellow-600 uppercase tracking-wider mb-2">Member of Legislative Assembly</h3>
              <h4 className="text-2xl font-extrabold text-gray-900 mb-4">Mr. R. Prakasam</h4>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                As the elected representative of Poonamallee Constituency, Mr. R. Prakasam is committed to the rapid development, infrastructure improvement, and social welfare of the region. His vision focuses on equality, education, and empowering every citizen.
              </p>
              <div className="flex gap-4">
                <a href="#manu" className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                  Contact MLA
                </a>
              </div>
            </div>
          </motion.div>

          {/* Zone Details Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-red-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
                <Map className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">21 Wards</h4>
              <p className="text-gray-600 text-sm">
                The Poonamallee Municipality is organized into 21 active administrative wards ensuring local representation and development.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-yellow-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">60,607+ Population</h4>
              <p className="text-gray-600 text-sm">
                Serving a diverse and growing population of over 60,000 residents in the municipal area.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Transit & Heritage Hub</h4>
              <p className="text-gray-600 text-sm">
                A major gateway to Chennai from the west, historically renowned for flower cultivation and experiencing rapid urban transit growth.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <Landmark className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Civic Body</h4>
              <p className="text-gray-600 text-sm">
                Poonamallee is a Selection Grade Municipality with a rich local heritage, featuring streamlined administrative infrastructure for citizens.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
