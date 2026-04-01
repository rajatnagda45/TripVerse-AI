"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, IndianRupee, Heart, Clock, Users, ArrowRight, PlaneTakeoff, PlaneLanding, Plane } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function HeroForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    city: "Bali", 
    from: "London",
    date: "2024-05-10",
    budget: "Medium (₹)",
    mood: "Adventure",
    duration: "1 week",
    group_type: "Friends",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If user is not logged in, redirect to login first
    if (!user) {
      router.push("/login");
      return;
    }
    
    setLoading(true);
    
    const params = new URLSearchParams({
      city: formData.city,
      budget: formData.budget,
      mood: formData.mood,
      duration: formData.duration,
      group_type: formData.group_type,
    });
    
    router.push(`/itinerary/generate?${params.toString()}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-5xl p-2.5 md:p-3 bg-[var(--surface)]/20 backdrop-blur-2xl border-2 border-white/40 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] relative z-10"
    >
      <div className="bg-[var(--surface)] rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-black/5 border border-white/10 relative transition-all duration-300">
        
        {/* TOP ROW: FROM - TO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-14 mb-8 relative">
          
          {/* Subtle connecting airplane graphic for desktop */}
          <div className="hidden md:flex absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 items-center z-10 pointer-events-none w-32 justify-center">
             <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--border)] to-[var(--border)] opacity-60"></div>
             <ArrowRight className="w-3 h-3 text-[var(--muted)] -ml-1 opacity-60" />
             <Plane className="w-5 h-5 text-[var(--muted)] ml-2 transform rotate-45 fill-current opacity-20" />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[13px] font-bold text-[var(--muted)] uppercase tracking-[0.15em] ml-2">From</label>
            <div className="relative">
              <PlaneTakeoff className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
              <input 
                name="from"
                value={formData.from}
                onChange={handleChange}
                placeholder="Origin city" 
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-full py-4 pl-14 pr-6 text-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent transition-all shadow-sm shadow-black/5"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[13px] font-bold text-[var(--muted)] uppercase tracking-[0.15em] ml-2">To</label>
            <div className="relative">
              <PlaneLanding className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
              <input 
                required
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Destination" 
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-full py-4 pl-14 pr-6 text-lg text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent transition-all shadow-sm shadow-black/5"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: DURATION, BUDGET, MOOD, GROUP */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          
          <div className="flex flex-col gap-2 relative">
            <label className="text-[11px] md:text-xs font-bold text-[var(--muted)] uppercase tracking-[0.1em] md:tracking-[0.15em] ml-2">Duration</label>
            <div className="relative group">
              <Clock className="absolute left-4 top-1/2 -translate-y-[45%] w-[18px] h-[18px] text-[#A68F80] z-10 pointer-events-none" />
              <select 
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full bg-[#FFF5EE] dark:bg-orange-950/20 border border-[#FBE9D9] dark:border-orange-500/20 rounded-full py-3.5 pl-11 pr-4 text-[var(--foreground)] font-medium text-[15px] focus:outline-none focus:ring-2 focus:ring-[#A68F80] transition-all appearance-none cursor-pointer hover:brightness-[0.98] transition-all"
              >
                <option>1 day</option>
                <option>3 days</option>
                <option>5 days</option>
                <option>1 week</option>
                <option>2 weeks</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="text-[11px] md:text-xs font-bold text-[var(--muted)] uppercase tracking-[0.1em] md:tracking-[0.15em] ml-2">Budget</label>
            <div className="relative group">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-[45%] w-[18px] h-[18px] text-[#81A380] z-10 pointer-events-none" />
              <select 
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full bg-[#F1FAF0] dark:bg-green-950/20 border border-[#E3F4E2] dark:border-green-500/20 rounded-full py-3.5 pl-11 pr-4 text-[var(--foreground)] font-medium text-[15px] focus:outline-none focus:ring-2 focus:ring-[#81A380] transition-all appearance-none cursor-pointer hover:brightness-[0.98] transition-all"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="text-[11px] md:text-xs font-bold text-[var(--muted)] uppercase tracking-[0.1em] md:tracking-[0.15em] ml-2">Mood</label>
            <div className="relative group">
              <Heart className="absolute left-4 top-1/2 -translate-y-[45%] w-[18px] h-[18px] text-[#A87983] z-10 pointer-events-none" />
              <select 
                name="mood"
                value={formData.mood}
                onChange={handleChange}
                className="w-full bg-[#FFF0F2] dark:bg-rose-950/20 border border-[#FDE1E5] dark:border-rose-500/20 rounded-full py-3.5 pl-11 pr-4 text-[var(--foreground)] font-medium text-[15px] focus:outline-none focus:ring-2 focus:ring-[#A87983] transition-all appearance-none cursor-pointer hover:brightness-[0.98] transition-all"
              >
                <option>Chill</option>
                <option>Adventure</option>
                <option>Romantic</option>
                <option>Party</option>
                <option>Explore</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="text-[11px] md:text-xs font-bold text-[var(--muted)] uppercase tracking-[0.1em] md:tracking-[0.15em] ml-2">Group</label>
            <div className="relative group">
              <Users className="absolute left-4 top-1/2 -translate-y-[45%] w-[18px] h-[18px] text-[#7A9BB8] z-10 pointer-events-none" />
              <select 
                name="group_type"
                value={formData.group_type}
                onChange={handleChange}
                className="w-full bg-[#F0F6FA] dark:bg-blue-950/20 border border-[#E1EAF4] dark:border-blue-500/20 rounded-full py-3.5 pl-11 pr-4 text-[var(--foreground)] font-medium text-[15px] focus:outline-none focus:ring-2 focus:ring-[#7A9BB8] transition-all appearance-none cursor-pointer hover:brightness-[0.98] transition-all"
              >
                <option>Solo</option>
                <option>Couple</option>
                <option>Friends</option>
                <option>Family</option>
              </select>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="w-full h-px bg-[var(--border)] my-6 opacity-30"></div>

        {/* CTA BUTTON */}
        <div className="flex justify-center -mb-2 mt-2">
          <button 
            type="submit"
            disabled={loading}
            className="w-full lg:w-[360px] h-[64px] bg-gradient-to-r from-[#20B2AA] via-[#00BFA6] to-[#40E0D0] rounded-full flex items-center justify-center gap-3 font-bold text-white text-[19px] transition-all relative overflow-hidden group shadow-[0_8px_30px_rgb(0,191,166,0.25)] hover:shadow-[0_12px_40px_rgb(0,191,166,0.35)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20 rounded-t-full"></div>
            <span className="relative z-10 drop-shadow-sm">{loading ? "Preparing your trip..." : "Get your deal now"}</span>
            {!loading && <ArrowRight className="w-6 h-6 relative z-10 drop-shadow-sm group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>
        
      </div>
    </motion.form>
  );
}
