"use client";

import { motion } from "framer-motion";
import { MapPin, CloudSun, IndianRupee, Clock, RefreshCw, Share2, Printer, Map as MapIcon, Calendar } from "lucide-react";

export default function ItineraryView({ trip }: { trip: any }) {
  const { city, budget, duration, group_type, data: itinerary } = trip;
  
  // mock weather if not saved
  const weather = { main: { temp: 28 }, weather: [{ description: "sunny" }] };

  return (
    <>
      {/* Header Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] p-6 md:p-10 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm border border-slate-100 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00BFA6]/5 rounded-bl-full pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#1A1A1A]">{itinerary.title || `Getaway to ${city}`}</h1>
          <div className="flex flex-wrap items-center gap-3 text-slate-600 font-medium">
            <span className="flex items-center gap-1.5 bg-[#F8FAFC] border border-slate-200 px-3 py-1.5 rounded-full"><MapPin className="w-4 h-4 text-[#FF8A65]" /> {city}</span>
            <span className="flex items-center gap-1.5 bg-[#F8FAFC] border border-slate-200 px-3 py-1.5 rounded-full"><Clock className="w-4 h-4 text-[#6C63FF]" /> {duration}</span>
            <span className="bg-[#F8FAFC] border border-slate-200 px-3 py-1.5 rounded-full">{group_type}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 min-w-[220px] relative z-10">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Calendar className="w-5 h-5 text-[#FF8A65]" />
          </div>
          <div>
            <p className="font-bold text-[#1A1A1A]">Created on</p>
            <p className="text-sm text-slate-500 capitalize">{new Date(trip.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Grid Layout for Timeline & Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Timeline Column */}
        <div className="lg:col-span-2 space-y-12">
          
          <div className="space-y-16">
            {(itinerary.days || [{ day: "Day 1", timeline: itinerary.timeline || [] }]).map((dayBlock: any, dIdx: number) => (
              <div key={dIdx}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-[#6C63FF] text-white px-4 py-2 rounded-xl font-bold">{dayBlock.day}</div>
                  {dayBlock.theme && <h3 className="text-xl font-bold text-slate-800">{dayBlock.theme}</h3>}
                </div>
                
                <div className="relative border-l-2 border-slate-200 pl-6 ml-6 space-y-10">
                  <div className="absolute top-0 bottom-0 -left-[1px] w-0.5 bg-gradient-to-b from-[#00BFA6] to-transparent max-h-[50%]" />
                  
                  {(dayBlock.timeline || []).map((item: any, idx: number) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={idx} 
                      className="relative bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="absolute -left-[35px] top-6 w-5 h-5 rounded-full bg-white border-4 border-[#00BFA6] z-10" />
                      
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div className="inline-flex bg-[#00BFA6]/10 text-[#00BFA6] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                          {item.time_of_day} • {item.time}
                        </div>
                        <span className="text-slate-500 font-semibold flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full text-sm">
                           {item.cost}
                        </span>
                      </div>
                      
                      <h4 className="text-xl font-bold mb-3 text-[#1A1A1A]">{item.title}</h4>
                      <p className="text-slate-600 mb-5 leading-relaxed">{item.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {(item.tags || []).map((tag: string, i: number) => (
                          <span key={i} className={`text-xs font-semibold px-3 py-1 rounded-full border ${tag.toLowerCase().includes('hidden gem') ? 'border-[#FF8A65]/30 bg-[#FF8A65]/10 text-[#FF8A65]' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar / Options */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-[#1A1A1A]">
              <IndianRupee className="w-5 h-5 text-[#6C63FF]" /> Budget Est.
            </h2>
            
            <div className="space-y-4">
              {Object.entries(itinerary.budget_breakdown || {}).filter(([k]) => k !== 'total').map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                  <span className="text-slate-500 capitalize font-medium">{key}</span>
                  <span className="font-bold text-[#1A1A1A]">{value as string}</span>
                </div>
              ))}
              <div className="pt-4 mt-2 bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100 shadow-sm">
                <span className="font-bold text-slate-500">Total</span>
                <span className="font-black text-2xl text-[#00BFA6]">{itinerary.budget_breakdown?.total || budget}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button 
                onClick={() => {
                  window.print();
                }} 
                className="w-full py-4 bg-[#1A1A1A] hover:bg-black text-white rounded-xl font-bold transition-all shadow-[0_4px_10px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <Printer className="w-4 h-4" /> Print Itinerary
              </button>
              
              <div className="grid grid-cols-2 gap-3 pt-3">
                 <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }} 
                  className="w-full py-3 bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                 >
                   <Share2 className="w-4 h-4" /> Share link
                 </button>
                 <button 
                   onClick={() => window.location.href = `/itinerary/generate?city=${city}&budget=${budget}&mood=${trip.mood}&duration=${duration}`} 
                   className="w-full py-3 bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                 >
                   <RefreshCw className="w-4 h-4" /> Remake
                 </button>
              </div>
              
              <a href="/explore" className="w-full flex items-center justify-center gap-2 mt-4 text-[#00BFA6] font-bold text-sm hover:underline">
                <MapIcon className="w-4 h-4" /> See City Map
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
