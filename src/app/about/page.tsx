"use client";

import { motion } from "framer-motion";
import { Globe, Sparkles, Brain, Zap, Users, Rocket, Lightbulb, MessageSquare, CheckCircle2, ChevronRight, MapPin, Wind, Gem, Map as MapIcon, Share2 } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const features = [
    { icon: Globe, title: "AI Itinerary Generator", desc: "Personalized travel plans in seconds" },
    { icon: Wind, title: "Smart Weather Adaptation", desc: "Plans adjust based on real-time conditions" },
    { icon: Gem, title: "Hidden Gem Discovery", desc: "Explore less crowded, highly rated places" },
    { icon: MapIcon, title: "Interactive Map Integration", desc: "Visualize your journey with routes" },
    { icon: Share2, title: "Community Travel Feed", desc: "Discover and remix trips by others" },
    { icon: MessageSquare, title: "Intelligent Chatbot", desc: "Your 24/7 AI travel companion" },
  ];

  const personas = [
    { icon: "🌄", title: "Adventure Seeker" },
    { icon: "🧘", title: "Solo Explorer" },
    { icon: "💕", title: "Romantic Traveler" },
    { icon: "🎉", title: "Social Wanderer" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] dark:bg-slate-950 pt-24 pb-20 font-outfit transition-all duration-300">
      
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-full h-[60vh] bg-gradient-to-b from-[#6C63FF]/5 to-transparent pointer-events-none" />
      <div className="absolute -left-48 top-48 w-96 h-96 bg-[#00BFA6]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6C63FF]/10 text-[#6C63FF] text-sm font-black mb-8 border border-[#6C63FF]/20">
            <Globe className="w-4 h-4" /> 🌍 ABOUT TRIPVERSEAI
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[var(--foreground)] dark:text-white mb-8 tracking-tight leading-[1.1]">
            Your Journey, <span className="text-gradient">Intelligently</span> Crafted.
          </h1>
          <p className="text-xl md:text-2xl text-[var(--muted)] dark:text-slate-400 font-medium leading-[1.6] max-w-3xl mx-auto">
            We are transforming how people explore the world by replacing generic guides with 
            <span className="text-[var(--foreground)] dark:text-white font-bold"> deeply personalized itineraries</span> tailored to your mood, budget, and soul.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32 items-center"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-black text-[var(--foreground)] dark:text-white mb-6 flex items-center gap-3">
              <Sparkles className="text-[#00BFA6] w-8 h-8" /> ✨ Our Mission
            </h2>
            <p className="text-lg text-[var(--muted)] dark:text-slate-400 font-medium leading-relaxed mb-6">
              Our goal is simple: <span className="text-[#00BFA6] font-black">Make travel planning effortless, intelligent, and inspiring.</span>
            </p>
            <p className="text-lg text-[var(--muted)] dark:text-slate-400 font-medium leading-relaxed">
              We combine real-time data, location intelligence, and advanced AI to generate complete travel experiences — not just lists of places.
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-[var(--surface)] dark:bg-slate-900 p-8 rounded-[2.5rem] border border-[var(--border)] dark:border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Zap className="w-24 h-24 text-[#6C63FF]" />
            </div>
            <ul className="space-y-4">
              {["Day-wise structured itineraries", "Interactive maps & optimized routes", "Weather-aware suggestions", "Hidden gem discovery", "Smart budget breakdown"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[var(--foreground)] dark:text-white font-bold">
                  <CheckCircle2 className="w-5 h-5 text-[#00BFA6] shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* 🎬 How It Works Section */}
        <div className="mb-32">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-[var(--foreground)] dark:text-white mb-6 flex items-center justify-center gap-3">
              <Sparkles className="text-[#6C63FF] w-10 h-10" /> 🎬 How It Works
            </h2>
            <p className="text-lg text-[var(--muted)] dark:text-slate-400 font-medium max-w-2xl mx-auto">
              Smarter travel planning in three effortless steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Visual connector line for desktop */}
            <div className="hidden md:block absolute top-[40%] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent pointer-events-none" />
            
            {[
              { 
                step: "01",
                icon: "✍️",
                title: "Enter Preferences",
                desc: "Tell us your mood, city, budget, and travel style with a single input."
              },
              { 
                step: "02",
                icon: "🧠",
                title: "AI Generates Itinerary",
                desc: "Our engine processes real-time data to architect a hyper-personalized journey just for you."
              },
              { 
                step: "03",
                icon: "🚀",
                title: "Explore & Customize",
                desc: "Visualize your trip on interactive maps, remix places, and share your perfect plan."
              }
            ].map((s, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="relative bg-[var(--surface)] dark:bg-slate-900 p-10 rounded-[2.5rem] border border-[var(--border)] dark:border-slate-800 text-center shadow-xl group transition-all"
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#6C63FF] text-white rounded-full flex items-center justify-center font-black text-sm shadow-lg shadow-[#6C63FF]/30">
                  {s.step}
                </div>
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{s.icon}</div>
                <h3 className="text-xl font-black text-[var(--foreground)] dark:text-white mb-3">{s.title}</h3>
                <p className="text-[var(--muted)] dark:text-slate-400 font-medium leading-relaxed text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Engine Section */}
        <div className="mb-32">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-[var(--foreground)] dark:text-white mb-6 flex items-center justify-center gap-3">
              <Brain className="text-[#6C63FF] w-10 h-10" /> 🧠 Powered by AI
            </h2>
            <p className="text-lg text-[var(--muted)] dark:text-slate-400 font-medium max-w-2xl mx-auto">
              Our AI engine understands <span className="text-[var(--foreground)] dark:text-white font-bold">how you want to travel</span>, not just where.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {personas.map((p, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-[var(--surface)] dark:bg-slate-900/50 p-6 rounded-3xl border border-[var(--border)] dark:border-slate-800 text-center"
              >
                <div className="text-4xl mb-3">{p.icon}</div>
                <h3 className="font-black text-[var(--foreground)] dark:text-white text-sm uppercase tracking-wider">{p.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-32">
          <h2 className="text-3xl font-black text-[var(--foreground)] dark:text-white mb-12 text-center flex items-center justify-center gap-3">
            <Zap className="text-[#FF8A65] w-8 h-8" /> 🔥 Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.02 }}
                className="p-8 bg-[var(--background)] dark:bg-slate-900 border border-[var(--border)] dark:border-slate-800 rounded-3xl group transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#6C63FF]/10 flex items-center justify-center mb-6 group-hover:bg-[#6C63FF] transition-colors">
                  <f.icon className="w-6 h-6 text-[#6C63FF] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-black text-[var(--foreground)] dark:text-white mb-2">{f.title}</h3>
                <p className="text-[var(--muted)] dark:text-slate-400 font-medium text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vision & Why TripVerseAI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F172A] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 opacity-10">
              <Rocket className="w-48 h-48" />
            </div>
            <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
              <Rocket className="text-[#00BFA6] w-8 h-8" /> 🚀 Our Vision
            </h2>
            <p className="text-lg opacity-80 font-medium leading-relaxed mb-6">
              We’re building a <span className="text-[#00BFA6] font-black">new way to travel</span> where planning takes seconds, and AI is your personal global companion.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 font-bold">
                <div className="w-2 h-2 rounded-full bg-[#00BFA6]" /> Effortless Planning
              </div>
              <div className="flex items-center gap-3 font-bold">
                <div className="w-2 h-2 rounded-full bg-[#00BFA6]" /> Personalized Experiences
              </div>
            </div>
          </div>

          <div className="bg-[var(--surface)] dark:bg-slate-900 p-10 rounded-[3rem] border border-[var(--border)] dark:border-slate-800 shadow-xl">
            <h2 className="text-3xl font-black text-[var(--foreground)] dark:text-white mb-6 flex items-center gap-3">
              <Lightbulb className="text-[#FF8A65] w-8 h-8" /> 💡 Why TripVerseAI?
            </h2>
            <p className="text-lg text-[var(--muted)] dark:text-slate-400 font-medium leading-relaxed mb-8">
              Because travel should feel meaningful, not exhausting.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {["✨ Effortless", "🎯 Personalized", "🌍 Meaningful"].map((item, i) => (
                <div key={i} className="px-6 py-4 bg-[var(--background)] dark:bg-slate-950 rounded-2xl border border-[var(--border)] dark:border-slate-800 font-black text-[var(--foreground)] dark:text-white text-lg">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="text-center pt-20 border-t border-[var(--border)] dark:border-slate-800">
          <div className="inline-block bg-black px-8 py-3 rounded-2xl mb-6 shadow-2xl group cursor-pointer hover:scale-105 transition-transform">
             <img src="/logo.png" alt="Logo" className="h-8 w-auto dark:invert dark:brightness-150 transition-all" />
          </div>
          <p className="text-lg text-[var(--muted)] dark:text-slate-400 font-black">
            Your journey, <span className="text-[#00BFA6]">intelligently crafted.</span>
          </p>
          <div className="mt-10">
            <Link 
              href="/signup" 
              className="px-10 py-5 bg-[#6C63FF] text-white rounded-full font-black text-xl shadow-[0_20px_50px_rgba(108,99,255,0.4)] hover:bg-[#5b52e0] hover:-translate-y-1 transition-all inline-flex items-center gap-3"
            >
              Start Your Adventure <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
