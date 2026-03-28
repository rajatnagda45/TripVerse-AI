import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Compass, Calendar, MapPin, Search, Trash2, ExternalLink, LogOut, Heart } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const handleSignOut = async () => {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  // Fetch saved itineraries
  const { data: itineraries } = await supabase
    .from("itineraries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-16 relative z-10 w-full min-h-screen font-outfit">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00BFA6]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00BFA6]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Dashboard Profile Header */}
      <div className="bg-white rounded-[2.5rem] p-8 flex flex-col md:flex-row justify-between items-center mb-12 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.1)] border border-slate-100 gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-[#00BFA6]/10 rounded-[2rem] p-1 border-2 border-[#00BFA6]/20 shadow-inner">
            <div className="w-full h-full bg-white rounded-[1.8rem] flex items-center justify-center overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight">Traveler Dashboard</h1>
            <p className="text-slate-500 font-bold">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-50 p-4 rounded-2xl gap-8 border border-slate-100 hidden sm:flex">
             <div>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Saved Trips</p>
               <p className="text-2xl font-black text-[#1A1A1A]">{itineraries?.length || 0}</p>
             </div>
             <div className="w-px bg-slate-200"></div>
             <div>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Status</p>
               <p className="text-2xl font-black text-[#00BFA6]">Elite</p>
             </div>
          </div>
          <form action={handleSignOut}>
            <button className="p-4 rounded-2xl border border-slate-100 hover:bg-red-50 hover:border-red-100 group transition-all" title="Sign Out">
              <LogOut className="w-6 h-6 text-slate-400 group-hover:text-red-500 transition-colors" />
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <h2 className="text-2xl font-black text-[#1A1A1A] tracking-tight">Your Planned Adventures</h2>
        <Link 
          href="/" 
          className="px-8 py-4 bg-[#1A1A1A] hover:bg-black rounded-2xl font-black text-white transition-all shadow-[0_8px_25px_-5px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 inline-flex items-center gap-3"
        >
          <Compass className="w-5 h-5" />
          Plan New Destination
        </Link>
      </div>

      {!itineraries || itineraries.length === 0 ? (
        <div className="bg-white flex flex-col items-center justify-center p-16 rounded-[2rem] border border-slate-200 border-dashed text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-[#1A1A1A]">No trips found</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
            You haven't generated any itineraries yet. Return to the home page to start your first intelligent journey.
          </p>
          <Link href="/" className="px-8 py-4 bg-[#00BFA6] hover:bg-[#00a892] text-white rounded-full font-bold transition-all shadow-[0_4px_14px_0_rgba(0,191,166,0.39)]">
            Explore Destinations
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((trip) => (
            <div key={trip.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
              {/* Card Image Header */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80`} 
                  alt="Destination" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-[#6C63FF] shadow-sm">
                  {trip.mood}
                </div>
                <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-[#1A1A1A] line-clamp-1">
                    {trip.data.title || `${trip.duration} in ${trip.city}`}
                  </h3>
                </div>
                
                <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {trip.data.summary || "AI-generated itinerary prioritizing your specific vibe and budget."}
                </p>
                
                <div className="mt-auto space-y-4">
                  <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg w-full">
                      <MapPin className="w-4 h-4 text-[#FF8A65]" />
                      <span className="truncate">{trip.city}</span>
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg w-full">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(trip.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="font-black text-[#00BFA6] text-lg">
                      {trip.data.budget_breakdown?.total || trip.budget}
                    </span>
                    <Link href={`/itinerary/${trip.id}`} className="flex items-center gap-1 text-sm font-bold text-[#6C63FF] hover:text-[#554dcc] transition-colors">
                      Open Trip <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
