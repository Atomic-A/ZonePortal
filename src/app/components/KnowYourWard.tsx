"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, UserCircle, Briefcase, IndianRupee, Search, MapPin, Phone, Mail } from "lucide-react";

const realCouncilors = [
  "Prakash A", "Govindaraj S", "Arumugam P", "Aasim Raja S.N.", "Shenpagavalli R",
  "Bairavi J", "Jeyapriya P", "Sakthivelan T", "Udhayakumar G (Mayor)", "John A",
  "Parimala S", "Sundari C", "Abhishek P", "Rajesh Kumar K", "Ammu V",
  "Meenakshi A", "Sheela T", "Suhanya S", "Sundari K", "Divya Tamizhvanan",
  "Veerapandian A", "Jothilakshmi N", "Surya Kumar S (Deputy Mayor)", "Perumal P P", "Madurai Arumugam M",
  "Mala P", "Venkatesan U", "Amudha S", "Vimal M", "Selvam S",
  "Venkatesan", "Sudhakaran R", "Hari V", "Revathi S", "Geetha U",
  "Yasmin Beham H", "Ramesh P", "Mekala Srinivasan", "Sarala S", "Ravi K",
  "Santhi P", "Rajendran K", "Selvi R", "Sumathi D", "Sasikala A",
  "Meenakshi K", "Azhagu Vijaya", "Karthik Kamesh R"
];

// Data for Poonamallee Municipality Wards (1-21)
const poonamalleeWards = Array.from({ length: 21 }, (_, i) => {
  const wardId = i + 1;
  const repName = realCouncilors[i];

  return {
    id: wardId,
    name: `Ward ${wardId} - Poonamallee Zone`,
    representative: repName,
    phone: `+91 98765 ${10000 + wardId}`,
    email: `ward${wardId}@poonamallee.gov.in`,
    projects: [
      { name: "Local Infrastructure Maintenance", amount: "₹5,00,000", status: "Ongoing" },
      { name: "Public Health Drive", amount: "₹2,00,000", status: "Planning" }
    ]
  };
});

export default function KnowYourWard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWard, setSelectedWard] = useState<typeof poonamalleeWards[0] | null>(null);

  const filteredWards = poonamalleeWards.filter(ward => 
    ward.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="ward" className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold text-gray-900"
          >
            Know Your <span className="text-red-600">Poonamallee Ward</span>
          </motion.h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Find your local ward councilor and contact details to raise immediate civic issues in Poonamallee Zone.
          </p>
        </div>

        {/* Dropdown Selector */}
        <div className="relative w-full max-w-md mx-auto z-20">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-white border border-gray-300 shadow-sm px-4 py-3 rounded-xl flex items-center justify-between hover:border-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20"
          >
            <span className={selectedWard ? "text-gray-900 font-bold" : "text-gray-500 font-medium"}>
              {selectedWard ? selectedWard.name : "Select your Poonamallee Ward"}
            </span>
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute w-full mt-2 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden z-30 flex flex-col max-h-[300px]"
              >
                <div className="p-2 border-b border-gray-100 bg-gray-50">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search wards..." 
                      className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-red-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="overflow-y-auto">
                  {filteredWards.map((ward) => (
                    <button
                      key={ward.id}
                      onClick={() => {
                        setSelectedWard(ward);
                        setIsOpen(false);
                        setSearchQuery("");
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 text-gray-700 hover:text-red-700 transition-colors border-b border-gray-50 last:border-0"
                    >
                      {ward.name}
                    </button>
                  ))}
                  {filteredWards.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">No wards found</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Details */}
        <AnimatePresence mode="wait">
          {selectedWard && (
            <motion.div
              key={selectedWard.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Representative Info */}
              <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100 md:col-span-1 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600 shadow-inner">
                    <UserCircle className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedWard.representative}</h3>
                  <p className="text-red-600 text-sm font-bold mb-6 tracking-wide uppercase">Ward Councilor</p>
                  
                  <div className="w-full space-y-3 text-sm text-gray-700 text-left bg-white p-4 rounded-xl border border-red-50">
                    <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /> <strong>{selectedWard.phone}</strong></p>
                    <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /> <strong>{selectedWard.email}</strong></p>
                  </div>
                </div>
              </div>

              {/* Projects List */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm md:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-red-600" />
                  Local Projects & Funding
                </h3>
                
                <div className="space-y-4">
                  {selectedWard.projects.map((project, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                      <div>
                        <h4 className="font-bold text-gray-900">{project.name}</h4>
                        <span className={`inline-block mt-2 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                          project.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                          project.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' : 
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="mt-3 sm:mt-0 flex items-center gap-1 text-gray-900 font-bold bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                        <IndianRupee className="h-4 w-4 text-gray-500" />
                        {project.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
