import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "₹0",
      description: "Perfect for weekend getaways and planning your next short trip.",
      buttonText: "Start for free",
      buttonVariant: "outline",
      features: [
        "Up to 3 itineraries per month",
        "Basic AI trip generation",
        "City guides & map view",
        "Export to PDF"
      ]
    },
    {
      name: "Pro",
      price: "₹499",
      period: "/month",
      description: "For frequent travelers who need deep personalization.",
      buttonText: "Get Pro",
      buttonVariant: "solid",
      popular: true,
      features: [
        "Unlimited itineraries",
        "Advanced hidden gem discovery",
        "Real-time weather routing",
        "Collaborate with friends",
        "Priority AI processing"
      ]
    },
    {
      name: "Premium",
      price: "₹1,299",
      period: "/month",
      description: "The ultimate tool for digital nomads and power travelers.",
      buttonText: "Go Premium",
      buttonVariant: "outline",
      features: [
        "Everything in Pro",
        "Direct hotel & flight booking links",
        "1-on-1 human travel advisor chat",
        "Offline itinerary access",
        "Custom mood profiles"
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] dark:bg-slate-950 pt-24 pb-20 relative overflow-hidden transition-all duration-300">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-[50vh] bg-gradient-to-b from-[#6C63FF]/5 to-transparent pointer-events-none" />
      <div className="absolute -left-48 top-48 w-96 h-96 bg-[#00BFA6]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -right-48 bottom-48 w-96 h-96 bg-[#FF8A65]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-12 w-fit px-4 py-2 bg-black rounded-xl shadow-lg flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="TripVerseAI Logo" 
                className="h-full w-auto object-contain dark:invert dark:brightness-150 transition-all duration-300" 
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--foreground)] mb-6 tracking-tight">
            Simple, transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#00BFA6]">pricing</span>
          </h1>
          <p className="text-xl text-[var(--muted)] font-medium">
            Choose the perfect plan for your travel style. Build smarter journeys faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
          {tiers.map((tier, i) => (
            <div 
              key={i} 
              className={`bg-[var(--surface)] dark:bg-slate-900 rounded-[2.5rem] p-8 flex flex-col relative transition-all duration-300 ${tier.popular ? 'border-2 border-[#00BFA6] shadow-[0_20px_40px_-15px_rgba(0,191,166,0.3)] scale-105 z-10' : 'border border-[var(--border)] dark:border-slate-800 shadow-sm hover:shadow-xl'}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00BFA6] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-[var(--foreground)] dark:text-white mb-2">{tier.name}</h3>
              <p className="text-[var(--muted)] dark:text-slate-400 text-sm mb-6 h-10">{tier.description}</p>
              
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-black text-[var(--foreground)] dark:text-white">{tier.price}</span>
                {tier.period && <span className="text-[var(--muted)] opacity-60 dark:text-slate-500 font-medium">{tier.period}</span>}
              </div>

              <Link 
                href="/signup" 
                className={`w-full py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 mb-8 ${tier.buttonVariant === 'solid' ? 'bg-[var(--foreground)] dark:bg-white text-[var(--background)] dark:text-slate-900 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)]' : 'bg-[var(--background)] dark:bg-slate-800 hover:bg-[var(--surface)] text-[var(--foreground)] dark:text-white border border-[var(--border)] dark:border-slate-700'}`}
              >
                {tier.buttonText} <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="space-y-4 flex-1">
                <p className="text-xs font-bold text-[var(--muted)] opacity-60 uppercase tracking-widest mb-4">What's included</p>
                {tier.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-[#00BFA6]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-[#00BFA6]" />
                    </div>
                    <span className="text-[var(--muted)] font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
