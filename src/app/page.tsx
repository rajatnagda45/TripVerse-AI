import HeroForm from "@/components/home/HeroForm";
import { Search, Heart, Star, Sparkles, Zap, Brain, Globe, Check, ArrowRight, Lightbulb, ChevronRight, Rocket, MessageSquare, Wind, Gem, Map as MapIcon, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const deals = [
    {
      title: "Best in Kyoto, Japan",
      img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800",
      days: "5 days and 4 nights",
      perks: "Return international flights",
      date: "6 Mar - Nov 2024",
      rating: 4.8,
      discount: "20% off",
      id: 1
    },
    {
      title: "Best of Santorini, Greece",
      img: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800",
      days: "7 days and 6 nights",
      perks: "Receive free accommodation",
      date: "Mar - Apr 2024",
      rating: 4.5,
      discount: "30% off",
      id: 2
    },
    {
      title: "Switzerland Alps Explorer",
      img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800",
      days: "10 days and 9 nights",
      perks: "043 Last minute sale - save ₹12000",
      date: "Aug - Dec 2024",
      rating: 4.9,
      discount: "40% off",
      id: 3
    }
  ];

  return (
      <main className="min-h-screen relative w-full overflow-hidden bg-[var(--background)] transition-colors duration-300">
      
      {/* Hero Header Area */}
      <div className="relative w-full h-[700px] flex flex-col justify-center px-4 md:px-12 lg:px-24">
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000" 
            alt="Travel Beach Scene"
            className="w-full h-full object-cover object-center dark:brightness-75 transition-all duration-500"
          />
          {/* Subtle gradient overlay to ensure text contrast while keeping it vibrant */}
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col pt-16 md:pt-24 lg:pt-28">
          <h1 className="text-[2.75rem] md:text-7xl lg:text-[5.5rem] font-[900] text-[var(--foreground)] mb-6 md:mb-10 leading-[1.05] tracking-tight drop-shadow-sm transition-all duration-300">
            What Is Your <br />
            <span className="text-[#00BFA6]">Destination?</span>
          </h1>
          <div className="w-full max-w-2xl bg-[var(--surface)]/40 backdrop-blur-xl p-4 rounded-[2rem] shadow-2xl border border-white/20 transition-all duration-300">
            <HeroForm />
          </div>
        </div>
      </div>

      {/* Recommended Section below the fold */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-20">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] italic transition-colors">Best holiday deals</h2>
          
          <form action="/explore" method="GET" className="relative max-w-md w-full md:w-auto shadow-sm shadow-black/5 rounded-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
            <input 
              name="city"
              required
              placeholder="SEARCH YOUR NEXT CITY" 
              className="w-full bg-white dark:bg-slate-800 border-none rounded-full py-4 pl-14 pr-32 text-xs font-bold text-slate-700 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00BFA6] transition-all"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1A1A1A] hover:bg-black text-white px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all active:scale-95">
              Search
            </button>
          </form>
        </div>

        {/* Filter tags (Now Functional Links) */}
        <div className="flex overflow-x-auto gap-3 pb-4 mb-8 hidden-scrollbar">
          {["All", "London", "Birmingham", "Nottingham", "Leicester", "Plymouth", "Derby", "Southampton", "Manchester"].map((tag, i) => {
            const href = tag === "All" ? "/explore?city=London" : `/explore?city=${tag}`;

            return (
              <Link
                key={i} 
                href={href}
                className={`whitespace-nowrap px-6 py-2 rounded-full border text-sm font-semibold transition-all ${i === 0 ? 'bg-[#00BFA6] border-[#00BFA6] text-white shadow-lg shadow-[#00BFA6]/20' : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:border-[#00BFA6] hover:text-[#00BFA6]'}`}
              >
                {tag}
              </Link>
            );
          })}
        </div>

        {/* Deals Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {deals.map(deal => (
            <Link 
              href={`/explore?city=${deal.title.includes("Kyoto") ? "Kyoto" : deal.title.includes("Santorini") ? "Santorini" : "Switzerland"}`} 
              key={deal.id} 
              className="bg-[var(--surface)] rounded-[2.5rem] overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <img src={deal.img} alt={deal.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-5 left-5 bg-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full z-10 shadow-lg">
                  {deal.discount}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between space-y-5">
                <h3 className="text-2xl font-black text-[var(--foreground)] tracking-tight">{deal.title}</h3>
                <div className="flex justify-between items-center pt-5 border-t border-[var(--border)]">
                  <span className="text-[10px] text-[var(--muted)] font-black uppercase tracking-[0.2em]">Oct 2024</span>
                  <div className="flex items-center gap-1 bg-[#FFF5F2] dark:bg-orange-500/10 px-3 py-1.5 rounded-full text-[#FF8A65] text-xs font-black shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {deal.rating}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 🎬 Section: How It Works */}
        <div className="py-24 border-t border-[var(--border)]">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[var(--foreground)] mb-6 flex items-center justify-center gap-3">
              <Sparkles className="text-[#6C63FF] w-10 h-10" /> How It Works
            </h2>
            <p className="text-lg text-[var(--muted)] font-medium max-w-2xl mx-auto">Smarter travel planning in three effortless steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "✍️", step: "01", title: "Enter Preferences", desc: "Define your mood, budget, and destination." },
              { icon: "🧠", step: "02", title: "AI Generates Itinerary", desc: "Our engine architects a hyper-personalized plan just for you." },
              { icon: "🚀", step: "03", title: "Explore & Customize", desc: "Visualize on maps, remix places, and share your perfect trip." }
            ].map((s, i) => (
              <div key={i} className="bg-[var(--surface)] p-10 rounded-[2.5rem] border border-[var(--border)] text-center shadow-xl hover:-translate-y-2 transition-all">
                <div className="w-10 h-10 bg-[#6C63FF] text-white rounded-full flex items-center justify-center font-black mx-auto mb-6 shadow-lg shadow-[#6C63FF]/20">{s.step}</div>
                <div className="text-5xl mb-6">{s.icon}</div>
                <h3 className="text-xl font-black text-[var(--foreground)] mb-3">{s.title}</h3>
                <p className="text-[var(--muted)] font-medium text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 🌍 Section: About TripVerseAI Highlights */}
        <div className="py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-black text-[var(--foreground)] mb-6">Your Personal AI <span className="text-[#00BFA6]">Travel Architect</span></h2>
            <p className="text-lg text-[var(--muted)] font-medium leading-relaxed mb-8">
              TripVerseAI combines real-time data and location intelligence to generate itineraries tailored to your unique travel style. Whether you are an adventure seeker or a solo explorer, we help you discover the world differently.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Wind, title: "Smart Weather" },
                { icon: Gem, title: "Hidden Gems" },
                { icon: MessageSquare, title: "AI Chatbot" },
                { icon: MapIcon, title: "Interactive Maps" }
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/10 flex items-center justify-center"><f.icon className="w-5 h-5 text-[#6C63FF]" /></div>
                  <span className="font-bold text-[var(--foreground)] text-sm">{f.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F172A] p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
            <Rocket className="absolute -bottom-20 -right-20 w-80 h-80 opacity-5" />
            <h3 className="text-2xl font-black mb-6">Our Mission</h3>
            <p className="text-lg opacity-80 font-medium leading-relaxed mb-6">
              "Make travel planning effortless, intelligent, and inspiring."
            </p>
            <Link href="/about" className="inline-flex items-center gap-2 text-[#00BFA6] font-black hover:gap-4 transition-all">
              Learn More About Us <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* 💰 Section: Pricing Preview */}
        <div className="py-24 border-t border-[var(--border)]">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[var(--foreground)] mb-6">Simple <span className="text-[#6C63FF]">Pricing</span></h2>
            <p className="text-lg text-[var(--muted)] font-medium">Choose a plan that fits your journey.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Free", price: "₹0", desc: "For weekend wanderers" },
              { name: "Pro", price: "₹499", desc: "For frequent travelers", popular: true },
              { name: "Premium", price: "₹1,299", desc: "For digital nomads" }
            ].map((p, i) => (
              <div key={i} className={`bg-[var(--surface)] p-10 rounded-[2.5rem] border ${p.popular ? 'border-[#00BFA6] scale-105 shadow-2xl' : 'border-[var(--border)]'} flex flex-col items-center transition-all`}>
                <h3 className="text-xl font-black text-[var(--foreground)] mb-2 uppercase tracking-widest">{p.name}</h3>
                <div className="text-5xl font-black text-[var(--foreground)] mb-4">{p.price}</div>
                <p className="text-[var(--muted)] text-sm mb-8 font-medium">{p.desc}</p>
                <Link href="/pricing" className="w-full py-4 text-center rounded-full bg-[#1A1A1A] hover:bg-black dark:bg-[var(--foreground)] dark:text-[var(--background)] text-white font-black transition-all">Get Started</Link>
              </div>
            ))}
          </div>
        </div>

        {/* 💡 Section: FAQ Highlights */}
        <div className="py-24 border-t border-[var(--border)] mb-20 text-center">
            <h2 className="text-4xl font-black text-[var(--foreground)] mb-12">FAQ Highlights</h2>
            <div className="max-w-3xl mx-auto space-y-4 text-left">
                {[
                    { q: "Is it free?", a: "Yes, we have a generous free tier for beginners." },
                    { q: "How accurate is AI?", a: "We use real-time maps and weather to ensure precision." },
                    { q: "Can I save trips?", a: "Absolutely! Save, edit, and remix any trip on your dashboard." }
                ].map((faq, i) => (
                    <div key={i} className="bg-[var(--surface)] p-8 rounded-3xl border border-[var(--border)] shadow-sm">
                        <h4 className="text-lg font-black text-[var(--foreground)] mb-2">Q: {faq.q}</h4>
                        <p className="text-[var(--muted)] font-medium leading-relaxed">{faq.a}</p>
                    </div>
                ))}
            </div>
            <div className="mt-12">
                 <Link href="/about" className="text-[#6C63FF] font-black hover:underline">View all FAQs ⚡</Link>
            </div>
        </div>

        {/* Global Footer */}
        <footer className="pt-20 pb-12 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="bg-black px-6 py-2 rounded-xl shadow-lg">
                <img src="/logo.png" alt="Logo" className="h-6 w-auto dark:invert dark:brightness-150 transition-all" />
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-[var(--muted)] font-bold text-sm">
                <Link href="/about" className="hover:text-[#6C63FF] transition-colors">About</Link>
                <Link href="/explore" className="hover:text-[#6C63FF] transition-colors">Explore</Link>
                <Link href="/pricing" className="hover:text-[#6C63FF] transition-colors">Pricing</Link>
                <Link href="/faq" className="hover:text-[#6C63FF] transition-colors">FAQ</Link>
                <Link href="/login" className="hover:text-[#6C63FF] transition-colors">Login</Link>
                <Link href="/signup" className="hover:text-[#6C63FF] transition-colors">Join Now</Link>
            </div>
            <p className="text-[10px] text-[var(--muted)] font-black uppercase tracking-[0.2em]">© 2026 TripVerseAI. All rights reserved. Built with ❤️ by Rajat Nagda.</p>
        </footer>
      </div>
    </main>
  );
}

