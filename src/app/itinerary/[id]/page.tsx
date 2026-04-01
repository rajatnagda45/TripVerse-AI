"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import ItineraryView from "./ItineraryView";

export default function SavedItineraryPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [trip, setTrip] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchTrip() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("itineraries")
        .select("*")
        .eq("id", params.id)
        .single();

      if (!error && data) {
        // Simple client-side authorization check
        if (data.user_id !== user.uid) {
           setError("Unauthorized access.");
        } else {
           setTrip(data);
        }
      }
      setFetching(false);
    }

    if (user) {
      fetchTrip();
    }
  }, [user, params.id, supabase]);

  const [error, setError] = useState("");

  if (loading || (fetching && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#00BFA6]" />
      </div>
    );
  }

  if (error || (!fetching && !trip)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#F8FAFC]">
        <h2 className="text-2xl font-bold text-[#1A1A1A]">{error || "Itinerary Not Found"}</h2>
        <p className="text-slate-500 mt-2 mb-6">The itinerary you are looking for does not exist or you don't have access.</p>
        <Link href="/dashboard" className="px-6 py-3 bg-[#00BFA6] text-white font-bold rounded-full">Back to Dashboard</Link>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 md:py-16">
      <ItineraryView trip={trip} />
    </main>
  );
}
