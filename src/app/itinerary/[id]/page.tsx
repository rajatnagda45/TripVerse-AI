import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Compass, Calendar, MapPin, Search, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import ItineraryView from "./ItineraryView";

export default async function SavedItineraryPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = params;

  // Fetch the saved itinerary
  const { data: trip } = await supabase
    .from("itineraries")
    .select("*")
    .eq("id", id)
    .single();

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#F8FAFC]">
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Itinerary Not Found</h2>
        <p className="text-slate-500 mt-2 mb-6">The itinerary you are looking for does not exist or you don't have access.</p>
        <Link href="/dashboard" className="px-6 py-3 bg-[#00BFA6] text-white font-bold rounded-full">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 md:py-16">
      <ItineraryView trip={trip} />
    </main>
  );
}
