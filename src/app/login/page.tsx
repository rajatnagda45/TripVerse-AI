"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)] font-outfit transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl bg-[var(--surface)] rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col md:flex-row border border-[var(--border)] transition-all duration-300"
      >
        
        {/* Left Side: Illustrative Visual */}
        <div className="hidden md:block w-[40%] relative bg-[var(--background)]">
          <img 
            src="/auth-bg.png" 
            alt="Travel Adventure" 
            className="absolute inset-0 w-full h-full object-cover object-center dark:brightness-75 transition-all duration-300"
          />
          {/* Subtle logo overlay top left */}
          <div className="absolute top-8 left-8 p-3 bg-[var(--surface)]/20 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="bg-black px-4 py-2 rounded-lg">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-5 w-auto dark:invert dark:brightness-150 transition-all duration-300" 
              />
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-[60%] p-10 md:p-14 lg:p-20 flex flex-col justify-center bg-[var(--surface)]">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-[var(--foreground)] mb-4 tracking-tight">Welcome Back</h1>
            <p className="text-[var(--muted)] font-medium text-lg opacity-80">Please enter your details to access your dashboard.</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-600 p-4 rounded-xl text-sm mb-8 font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-sm font-black text-[var(--foreground)] ml-1 opacity-70 uppercase tracking-wider">Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)] group-focus-within:text-[#00BFA6] transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl py-5 pl-14 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-4 focus:ring-[#00BFA6]/5 focus:bg-[var(--surface)] transition-all font-medium text-lg shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-black text-[var(--foreground)] opacity-70 uppercase tracking-wider">Password</label>
                <Link href="#" className="text-sm font-bold text-[#00BFA6] hover:underline">Forgot password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)] group-focus-within:text-[#00BFA6] transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl py-5 pl-14 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-4 focus:ring-[#00BFA6]/5 focus:bg-[var(--surface)] transition-all font-medium text-lg shadow-sm"
                />
              </div>
            </div>

          <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[var(--foreground)] text-[var(--background)] rounded-3xl font-black text-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-[1.01] transition-all flex items-center justify-center gap-3 mt-10 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : "Sign In to Dashboard"}
              {!loading && <ArrowRight className="w-6 h-6" />}
            </button>
          </form>

          <p className="text-center mt-12 text-[var(--muted)] font-bold text-base">
            New to TripVerseAI?{" "}
            <Link href="/signup" className="text-[#00BFA6] hover:underline font-black">
              Create a free account
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
