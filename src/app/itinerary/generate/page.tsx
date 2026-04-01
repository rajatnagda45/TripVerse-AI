"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, MapPin, CloudSun, IndianRupee, Clock, Download, RefreshCw, Share2, Heart, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/auth/AuthGuard";

export default function GenerateItinerary() {
  return (
    <AuthGuard>
      <Suspense fallback={<LoadingScreen />}>
        <ItineraryContent />
      </Suspense>
    </AuthGuard>
  )
}

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#F8FAFC]">
      <Loader2 className="w-12 h-12 text-[#00BFA6] animate-spin mb-4" />
      <h2 className="text-2xl font-bold text-[#1A1A1A]">Synthesizing Your Journey...</h2>
      <p className="text-slate-500 mt-2">Filtering hidden gems & real-time weather data</p>
    </div>
  )
}

function ItineraryContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const city = searchParams.get("city");
  const budget = searchParams.get("budget");
  const mood = searchParams.get("mood");
  const duration = searchParams.get("duration");
  const group_type = searchParams.get("group_type");
  const places = searchParams.get("places");

  useEffect(() => {
    async function generate() {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            city, budget, mood, duration, group_type, places,
            userId: user?.uid 
          })
        });
        
        const json = await res.json();
        
        if (!res.ok) {
           setError(json.error || "Failed to generate itinerary");
        } else {
           setData(json);
           if (user) setSaved(true);
        }
      } catch (e: any) {
        setError("Network error occurred.");
      } finally {
        setLoading(false);
      }
    }

    if (city && loading && !authLoading) {
      generate();
    }
  }, [city, budget, mood, duration, group_type, places, user, authLoading, loading]);

  const handleSave = async () => {
    if (saving || saved) return;
    
    if (!user) {
      alert("Please log in to save itineraries.");
      router.push("/login");
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      
      const { error: insertError } = await supabase.from("itineraries").insert({
        user_id: user.uid,
        city,
        budget,
        mood,
        duration: duration || "1 week",
        data: data.itinerary
      });
      
      if (insertError) throw insertError;
      setSaved(true);
    } catch (err: any) {
      console.error(err);
      alert(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h2 className="text-3xl font-bold text-red-500 mb-4">Generation Failed</h2>
      <p className="text-slate-600 mb-6">{error}</p>
      <button onClick={() => window.location.href = "/"} className="px-6 py-3 bg-[#6C63FF]/10 text-[#6C63FF] font-bold rounded-full hover:bg-[#6C63FF]/20 transition-colors">Try Again</button>
    </div>
  );

  if (!data) return null;

  const { itinerary, weather } = data;

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 md:py-16">
      
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
            <CloudSun className="w-6 h-6 text-[#FF8A65]" />
          </div>
          <div>
            <p className="font-bold text-[#1A1A1A]">{Math.round(weather.main.temp)}°C, Adjusted</p>
            <p className="text-sm text-slate-500 capitalize">{weather.weather[0].description}</p>
          </div>
        </div>
      </motion.div>

      {/* Grid Layout for Timeline & Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Timeline Column */}
        <div className="lg:col-span-2 space-y-12">
          
          <div className="space-y-16">
            {(itinerary.days || [{ day: "Day 1", timeline: itinerary.timeline }]).map((dayBlock: any, dIdx: number) => (
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
              {Object.entries(itinerary.budget_breakdown).filter(([k]) => k !== 'total').map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                  <span className="text-slate-500 capitalize font-medium">{key}</span>
                  <span className="font-bold text-[#1A1A1A]">{value as string}</span>
                </div>
              ))}
              <div className="pt-4 mt-2 bg-slate-50 p-4 rounded-xl flex justify-between items-center">
                <span className="font-bold text-slate-500">Total</span>
                <span className="font-black text-2xl text-[#00BFA6]">{itinerary.budget_breakdown.total}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button 
                onClick={handleSave}
                disabled={saving || saved}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${saved ? 'bg-green-100 text-green-600' : 'bg-[#1A1A1A] text-white hover:bg-black shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:-translate-y-0.5'}`}
              >
                {saved ? <><CheckCircle2 className="w-5 h-5" /> Saved to Dashboard</> : (saving ? <Loader2 className="animate-spin w-5 h-5" /> : <><Heart className="w-5 h-5" /> Save Itinerary</>)}
              </button>
              
              <div className="grid grid-cols-2 gap-3 pt-3">
                 <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }} 
                  className="w-full py-3 bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                 >
                   <Share2 className="w-4 h-4" /> Share
                 </button>
                 <button 
                   onClick={() => window.location.reload()} 
                   className="w-full py-3 bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-600 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                 >
                   <RefreshCw className="w-4 h-4" /> Redo
                 </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
