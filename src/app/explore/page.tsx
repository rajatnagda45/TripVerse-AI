"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, MapPin, Star, Heart, Plus, ChevronDown, X, ArrowLeft, ChevronLeft, ChevronRight, Share, Share2, Headphones, Map as MapIcon, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";

export default function ExplorePage() {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center bg-[var(--background)] pt-16">
          <Loader2 className="w-12 h-12 text-[#00BFA6] animate-spin" />
        </div>
      }>
        <ExploreContent />
      </Suspense>
    </AuthGuard>
  );
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const city = searchParams.get("city") || "London";

  const [activeTab, setActiveTab] = useState("Things to do");
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [data, setData] = useState<Record<string, any[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(city);
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "default">("default");
  const [selectedTripPlaces, setSelectedTripPlaces] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch("/api/explore", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city })
        });
        const result = await res.json();
        
        // Prepare fallbacks
        result["For you"] = [...(result["Things to do"] || []).slice(0, 2), ...(result["Restaurants"] || []).slice(0, 1)];
        result["Locations"] = result["Things to do"] || [];
        result["Guides"] = result["Things to do"] || [];
        
        setData(result);
      } catch (e) {
        console.error("Failed to load generic places", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [city]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/explore?city=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleAddToTrip = (e: React.MouseEvent, place: any) => {
    e.stopPropagation();
    if (!selectedTripPlaces.find(p => p.id === place.id)) {
      setSelectedTripPlaces([...selectedTripPlaces, place]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const getSortedData = () => {
    if (!data || !data[activeTab]) return [];
    let items = [...data[activeTab]];
    
    if (sortBy === "rating") {
      return items.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === "reviews") {
      return items.sort((a, b) => {
        const valA = parseFloat(a.reviews.replace('k', '')) * (a.reviews.includes('k') ? 1000 : 1);
        const valB = parseFloat(b.reviews.replace('k', '')) * (b.reviews.includes('k') ? 1000 : 1);
        return valB - valA;
      });
    }
    return items;
  };

  const sortedItems = getSortedData();

  if (loading || !data) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-[var(--background)] pt-16 font-outfit">
        <Loader2 className="w-12 h-12 text-[#00BFA6] animate-spin mb-4" />
        <h2 className="text-xl font-bold text-[var(--foreground)] opacity-70 animate-pulse">Designing your {city} adventure...</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen pt-16 bg-[var(--background)] overflow-hidden font-outfit relative transition-colors duration-300">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-[#1A1A1A] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
           <CheckCircle2 className="w-5 h-5 text-[#00BFA6]" />
           <span className="font-bold">Added to your {city} trip!</span>
        </div>
      )}

      {/* Floating Itinerary Action Button */}
      {selectedTripPlaces.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] w-full max-w-sm px-4 md:left-[27.5%]">
          <button 
            onClick={() => {
              const placeNames = selectedTripPlaces.map(p => p.name).join(', ');
              router.push(`/itinerary/generate?city=${city}&places=${encodeURIComponent(placeNames)}`);
            }}
            className="w-full bg-[#00BFA6] text-white py-4 rounded-2xl font-black text-lg shadow-[0_20px_50px_rgba(0,191,166,0.3)] hover:bg-[#009e8b] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            Generate Trip ({selectedTripPlaces.length} places)
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Left Panel: Content */}
      <div className={`w-full ${selectedPlace ? 'md:w-1/2 lg:w-[50%]' : 'md:w-1/2 lg:w-[55%]'} h-full flex flex-col overflow-y-auto px-4 md:px-6 py-6 md:py-8 custom-scrollbar transition-all duration-300`}>
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 
            onClick={() => document.getElementById('city-search-input')?.focus()}
            className="text-3xl font-bold flex items-center gap-2 text-[var(--foreground)] cursor-pointer hover:text-[#00BFA6] transition-colors capitalize group"
          >
            {city} <ChevronDown className="w-6 h-6 mt-1 group-hover:translate-y-0.5 transition-transform text-[var(--muted)]" />
          </h1>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3 mb-8">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
            <input 
              id="city-search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search city..." 
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full py-3.5 pl-12 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[#00BFA6] transition-all shadow-sm"
            />
          </form>
          <div className="relative group">
            <button 
              className="flex items-center gap-2 border border-[var(--border)] hover:border-[#00BFA6] hover:text-[#00BFA6] rounded-full px-5 py-3.5 text-sm font-semibold text-[var(--foreground)] transition-colors bg-[var(--surface)] shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" /> 
              {sortBy === "default" ? "Filters" : `Sorted by ${sortBy}`}
            </button>
            
            {/* Simple Dropdown for Filtering */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button onClick={() => setSortBy("default")} className="w-full px-4 py-3 text-left text-sm hover:bg-[var(--background)] font-medium text-[var(--muted)]">Default</button>
              <button onClick={() => setSortBy("rating")} className="w-full px-4 py-3 text-left border-t border-[var(--border)] text-sm hover:bg-[var(--background)] font-medium text-[var(--muted)]">Top Rated</button>
              <button onClick={() => setSortBy("reviews")} className="w-full px-4 py-3 text-left border-t border-[var(--border)] text-sm hover:bg-[var(--background)] font-medium text-[var(--muted)]">Most Reviews</button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto py-2 mb-4 hidden-scrollbar shrink-0">
          {["For you", "Things to do", "Restaurants", "Stays", "Locations"].map(tab => (
            <button 
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedPlace(null);
              }}
              className={`whitespace-nowrap text-[15px] font-semibold transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-[var(--foreground)] text-[var(--background)] px-6 py-2.5 rounded-full shadow-lg scale-105' 
                  : 'text-[var(--foreground)] hover:text-[var(--muted)] px-2'
              }`}
            >
              {tab}
            </button>
          ))}
          
          <div className="w-px h-5 bg-[var(--border)] shrink-0 mx-2"></div>
          
          <button
            onClick={() => {
              setActiveTab("Guides");
              setSelectedPlace(null);
            }}
            className={`whitespace-nowrap text-[15px] font-semibold transition-all duration-300 ${
              activeTab === "Guides" 
                ? 'bg-[var(--foreground)] text-[var(--background)] px-6 py-2.5 rounded-full shadow-lg scale-105' 
                : 'text-[var(--foreground)] hover:text-[var(--muted)] px-2'
            }`}
          >
            Guides
          </button>
        </div>

        {/* Section Title */}
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">{activeTab}</h2>

        {/* Grid of Places */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
          {sortedItems?.map((place: any) => (
            <div 
              key={place.id} 
              className="group cursor-pointer flex flex-col h-full"
              onClick={() => setSelectedPlace(place)}
            >
              <div className="relative h-[220px] w-full rounded-2xl overflow-hidden mb-3 border border-[var(--border)]">
                <img src={place.img} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                
                {/* Overlay Icons */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button className="w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                    <Heart className={`w-4 h-4 ${selectedTripPlaces.find(p => p.id === place.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                  <button 
                    onClick={(e) => handleAddToTrip(e, place)}
                    className={`w-8 h-8 ${selectedTripPlaces.find(p => p.id === place.id) ? 'bg-[#00BFA6]' : 'bg-black/40'} backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-start mb-1 flex-1">
                <h3 className="font-extrabold text-[var(--foreground)] line-clamp-2 pr-2 leading-tight">{place.name}</h3>
                <div className="flex items-center gap-1 text-sm font-bold text-[var(--foreground)] shrink-0">
                  <Star className="w-3.5 h-3.5 fill-[var(--foreground)]" /> {place.rating} <span className="text-[var(--muted)] font-medium">({place.reviews})</span>
                </div>
              </div>
              
              <p className="text-[var(--muted)] text-[13px] font-medium flex items-center gap-1 mt-1">
                <MapIcon className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{place.type} • {place.location}</span>
              </p>
              
              {place.mentionedCount > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex -space-x-1.5 shrink-0">
                    <div className="w-5 h-5 rounded-full bg-slate-200 border border-white overflow-hidden shadow-sm"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1" alt="User" className="w-full h-full bg-[#00BFA6]/10" /></div>
                    <div className="w-5 h-5 rounded-full bg-slate-200 border border-white overflow-hidden shadow-sm"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user2" alt="User" className="w-full h-full bg-[#6C63FF]/10" /></div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Mentioned by {place.mentionedCount} people</span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Right Panel: Map or Selected Place Overview */}
      <div className={`hidden md:flex flex-col flex-1 bg-[var(--background)] relative h-full border-l border-[var(--border)] ${selectedPlace ? 'overflow-y-auto custom-scrollbar' : 'overflow-hidden'}`}>
        
        {selectedPlace ? (
          <>
            {/* Detailed Overview Header */}
            <div className="sticky top-0 bg-[var(--surface)] z-20 px-6 py-4 flex justify-between items-center border-b border-[var(--border)] shadow-sm">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedPlace(null)}
                  className="w-10 h-10 rounded-full hover:bg-[var(--background)] flex items-center justify-center transition-colors text-[var(--foreground)]"
                >
                  <X className="w-5 h-5"/>
                </button>
                <div className="w-px h-6 bg-[var(--border)] mx-1"></div>
                <button className="w-10 h-10 rounded-full hover:bg-[var(--background)] flex items-center justify-center transition-colors text-[var(--foreground)]">
                  <ArrowLeft className="w-5 h-5"/>
                </button>
                <button className="w-10 h-10 rounded-full hover:bg-[var(--background)] flex items-center justify-center transition-colors text-[var(--foreground)]">
                  <ChevronLeft className="w-5 h-5"/>
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-[var(--foreground)]">
                <button className="border border-[var(--border)] rounded-full px-4 py-2 flex items-center gap-2 text-sm font-bold hover:bg-[var(--background)] transition-colors">
                  <Heart className="w-4 h-4" /> Save
                </button>
                <button 
                  onClick={(e) => handleAddToTrip(e, selectedPlace)}
                  className={`border border-[var(--border)] rounded-full px-4 py-2 flex items-center gap-2 text-sm font-bold hover:bg-[var(--background)] transition-colors ${selectedTripPlaces.find(p => p.id === selectedPlace.id) ? 'bg-[#00BFA6] text-white border-[#00BFA6]' : ''}`}
                >
                  <Plus className="w-4 h-4" /> {selectedTripPlaces.find(p => p.id === selectedPlace.id) ? 'Added' : 'Add to trip'}
                </button>
                <button className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--background)] transition-colors">
                  <MapIcon className="w-4 h-4 text-[var(--muted)]" />
                </button>
                <button className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--background)] transition-colors">
                  <Headphones className="w-4 h-4 text-[var(--muted)]" />
                </button>
                <button className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--background)] transition-colors">
                  <Share className="w-4 h-4 text-[var(--muted)]" />
                </button>
              </div>
            </div>
            
            <div className="p-6 md:p-8 max-w-4xl mx-auto w-full">
              <h1 className="text-4xl font-black text-[var(--foreground)] mb-3 leading-tight tracking-tight">{selectedPlace.name}</h1>
              <p className="text-sm font-semibold text-[var(--muted)] mb-8 flex items-center gap-1.5 flex-wrap">
                <Star className="w-4 h-4 fill-[var(--foreground)] text-[var(--foreground)]" /> {selectedPlace.rating} • {selectedPlace.reviews} reviews • {selectedPlace.location} • <MapIcon className="w-3.5 h-3.5 ml-1"/> {selectedPlace.type}
              </p>
              
              {/* Photo Gallery Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8 h-[360px] rounded-[1.5rem] overflow-hidden">
                <div className="col-span-1 h-full cursor-pointer relative group">
                  <img src={selectedPlace.gallery[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="grid grid-cols-2 grid-rows-2 gap-3 col-span-1 h-full">
                   <div className="cursor-pointer relative overflow-hidden group rounded-xl">
                     <img src={selectedPlace.gallery[1]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                   </div>
                   <div className="cursor-pointer relative overflow-hidden group rounded-xl">
                     <img src={selectedPlace.gallery[2]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                   </div>
                   <div className="cursor-pointer relative overflow-hidden group rounded-xl">
                     <img src={selectedPlace.gallery[3]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                   </div>
                   <div className="bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center cursor-pointer hover:bg-[var(--background)] transition-colors font-bold text-[var(--muted)] text-sm rounded-xl">
                      + 24 photos
                   </div>
                </div>
              </div>

              {/* Mentions */}
              {selectedPlace.mentionedCount > 0 && (
                <div className="flex items-center gap-3 bg-[var(--muted)]/5 p-3 rounded-2xl mb-8 border border-[var(--border)] w-max">
                  <div className="flex items-center gap-1 bg-[var(--surface)] px-3 py-1.5 rounded-full shadow-sm">
                    <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                    <span className="text-xs font-bold text-[var(--foreground)]">{selectedPlace.mentionedCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=kiran" alt="User" className="w-6 h-6 rounded-full bg-[var(--surface)] shadow-sm border border-[var(--border)]" />
                    <span className="text-sm font-semibold text-[var(--muted)]"><span className="text-[var(--foreground)] font-bold">Kiran Roy</span> mentioned this place</span>
                  </div>
                </div>
              )}
              
              {/* Internal Tabs */}
              <div className="flex gap-8 border-b border-[var(--border)] mb-8 mt-4">
                {["Overview", "Guides", "Reviews", "Location"].map((tab) => (
                  <button 
                    key={tab}
                    className={`pb-4 text-[15px] font-bold transition-colors relative ${tab === "Overview" ? "text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
                  >
                    {tab}
                    {tab === "Overview" && <span className="absolute bottom-0 left-0 right-0 border-b-[3px] border-[#00BFA6] rounded-t-sm" />}
                  </button>
                ))}
              </div>

              {/* Description */}
              <p className="text-[15px] text-[var(--muted)] leading-[1.8] mb-6">
                {selectedPlace.description}
              </p>
              
              <button className="border border-[var(--border)] hover:bg-[var(--surface)] transition-colors px-6 py-2.5 rounded-full text-sm font-bold text-[var(--foreground)]">
                Read more
              </button>
            </div>
          </>
        ) : (
          <iframe 
            src={`https://maps.google.com/maps?q=${encodeURIComponent(city)}&t=&z=12&ie=UTF8&iwloc=&output=embed`} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          ></iframe>
        )}
      </div>

    </div>
  );
}
