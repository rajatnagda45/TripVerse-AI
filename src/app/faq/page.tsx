"use client";

import { motion } from "framer-motion";
import { HelpCircle, ChevronDown, Sparkles, ShieldCheck, Zap, Globe, MessageSquare, Map as MapIcon, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    category: "General",
    questions: [
      {
        q: "What is TripVerseAI?",
        a: "TripVerseAI is an intelligent travel architect that uses advanced AI to build hyper-personalized, day-by-day itineraries based on your mood, budget, and real-time location data."
      },
      {
        q: "Is it really free?",
        a: "Yes! Our Free plan allows you to generate and explore up to 3 high-fidelity itineraries per month. For unlimited access and advanced features, you can upgrade to our Pro or Premium tiers."
      }
    ]
  },
  {
    category: "AI & Intelligence",
    questions: [
      {
        q: "How accurate is the AI-generated plan?",
        a: "We cross-reference real-time map data, weather intelligence, and local transit information to ensure your plan is practical and optimized for the current conditions."
      },
      {
        q: "Does it consider weather conditions?",
        a: "Absolutely. Our engine analyzes real-time weather forecasts to suggest indoor or outdoor activities accordingly, so your trip is never ruined by a surprise rain shower."
      }
    ]
  },
  {
    category: "Features & Usage",
    questions: [
      {
        q: "Can I save and edit my trips?",
        a: "Yes. Once logged in, all your generated trips are saved to your dashboard. You can remix, edit, or regenerate specific days at any time."
      },
      {
        q: "Is there a mobile app?",
        a: "TripVerseAI is a progressive web app optimized for mobile browsers. You can access all your saved trips on the go with our interactive map view."
      },
      {
        q: "Can I share my itineraries with friends?",
        a: "Yes, every saved trip comes with a unique sharing link, making it easy to coordinate with your travel group."
      }
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0");

  return (
    <main className="min-h-screen bg-[var(--background)] dark:bg-slate-950 pt-24 pb-20 font-outfit transition-all duration-300">
      
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#6C63FF]/5 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-48 w-96 h-96 bg-[#00BFA6]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] text-sm font-black mb-6 border border-[#6C63FF]/20 uppercase tracking-widest">
            <HelpCircle className="w-4 h-4" /> Support Center
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-[var(--foreground)] dark:text-white mb-6">
            Frequent questions, <br />
            <span className="text-gradient">simple</span> answers.
          </h1>
          <p className="text-lg text-[var(--muted)] dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about TripVerseAI. Can't find what you're looking for? 
            <Link href="/about" className="text-[#6C63FF] font-bold ml-1 hover:underline">Ask our AI Chatbot.</Link>
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-16">
          {faqs.map((group, groupIdx) => (
            <motion.div 
              key={groupIdx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-black text-[var(--foreground)] dark:text-white mb-8 border-l-4 border-[#00BFA6] pl-4 uppercase tracking-[0.2em]">
                {group.category}
              </h2>
              <div className="space-y-4">
                {group.questions.map((faq, qIdx) => {
                  const id = `${groupIdx}-${qIdx}`;
                  const isOpen = openIndex === id;
                  
                  return (
                    <div 
                      key={id} 
                      className={`group border transition-all duration-300 ${isOpen ? 'bg-[var(--surface)] dark:bg-slate-900 border-[#6C63FF]/30 shadow-xl' : 'bg-[var(--background)] dark:bg-slate-900/50 border-[var(--border)] dark:border-slate-800 hover:border-[#6C63FF]/20'} rounded-[2rem] overflow-hidden`}
                    >
                      <button 
                        onClick={() => setOpenIndex(isOpen ? null : id)}
                        className="w-full flex items-center justify-between p-7 text-left outline-none"
                      >
                        <span className="text-lg font-black text-[var(--foreground)] dark:text-white leading-tight">
                          {faq.q}
                        </span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-[#6C63FF] rotate-180 shadow-lg shadow-[#6C63FF]/30' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-[#6C63FF]/10'}`}>
                          <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-white' : 'text-slate-400 group-hover:text-[#6C63FF]'}`} />
                        </div>
                      </button>
                      
                      <motion.div 
                        initial={false}
                        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-7 pb-8 text-[var(--muted)] dark:text-slate-400 font-medium leading-relaxed text-lg pt-2 border-t border-[#6C63FF]/5">
                          {faq.a}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 p-12 bg-gradient-to-br from-[#1A1A1A] to-[#0F172A] rounded-[3rem] text-center shadow-2xl relative overflow-hidden"
        >
          <Sparkles className="absolute -top-10 -left-10 w-40 h-40 opacity-5" />
          <h2 className="text-3xl font-black text-white mb-6">Ready to start your first trip?</h2>
          <p className="text-white/70 text-lg mb-10 font-medium max-w-xl mx-auto">
            Join thousands of travelers who are discovering the world with AI intelligence.
          </p>
          <Link 
            href="/signup" 
            className="px-10 py-5 bg-[#00BFA6] text-white rounded-full font-black text-xl shadow-[0_20px_40px_rgba(0,191,166,0.3)] hover:bg-[#00a892] inline-block transition-all hover:scale-105"
          >
            Start For Free
          </Link>
        </motion.div>

        {/* Footer Branding */}
        <div className="text-center pt-32">
             <div className="bg-black px-8 py-3 rounded-2xl mb-6 shadow-2xl inline-block">
                <img src="/logo.png" alt="Logo" className="h-8 w-auto dark:invert dark:brightness-150 transition-all" />
             </div>
             <p className="text-[var(--muted)] font-black uppercase tracking-[0.3em] text-xs">Intelligent Travel • Seamless Planning</p>
        </div>

      </div>
    </main>
  );
}
