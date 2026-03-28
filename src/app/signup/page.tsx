"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignUp() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (authError) {
      setError(authError.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
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
            alt="Start Your Adventure" 
            className="absolute inset-0 w-full h-full object-cover object-center dark:brightness-75 transition-all duration-300"
          />
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
        <div className="w-full md:w-[60%] p-10 md:p-14 lg:p-16 flex flex-col justify-center bg-[var(--surface)]">
          {success ? (
            <div className="bg-[#00BFA6]/10 border border-[#00BFA6]/20 p-8 rounded-[2.5rem] text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-[#00BFA6] rounded-full flex items-center justify-center mb-6 shadow-xl shadow-[#00BFA6]/20 text-white">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-black text-[var(--foreground)] mb-3">Welcome Aboard!</h3>
              <p className="text-[var(--muted)] font-bold mb-8">Your travel dashboard is being prepared...</p>
              <Loader2 className="w-10 h-10 text-[#00BFA6] animate-spin" />
            </div>
          ) : (
            <>
              <div className="mb-10">
                <h1 className="text-4xl font-black text-[var(--foreground)] mb-4 tracking-tight">Create Account</h1>
                <p className="text-[var(--muted)] font-medium text-lg opacity-80">Join the TripVerseAI community today.</p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-600 p-4 rounded-xl text-sm mb-6 font-bold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-[var(--foreground)] ml-1 opacity-70 uppercase tracking-wider">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)] group-focus-within:text-[#00BFA6] transition-colors" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl py-4 pl-14 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-4 focus:ring-[#00BFA6]/5 focus:bg-[var(--surface)] transition-all font-medium text-lg shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-[var(--foreground)] ml-1 opacity-70 uppercase tracking-wider">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)] group-focus-within:text-[#00BFA6] transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl py-4 pl-14 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-4 focus:ring-[#00BFA6]/5 focus:bg-[var(--surface)] transition-all font-medium text-lg shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-[var(--foreground)] ml-1 opacity-70 uppercase tracking-wider">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)] group-focus-within:text-[#00BFA6] transition-colors" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl py-4 pl-14 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-4 focus:ring-[#00BFA6]/5 focus:bg-[var(--surface)] transition-all font-medium text-lg shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-[var(--foreground)] text-[var(--background)] rounded-3xl font-black text-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-[1.01] transition-all flex items-center justify-center gap-3 mt-6 active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : "Create Free Account"}
                  {!loading && <ArrowRight className="w-6 h-6" />}
                </button>
              </form>
            </>
          )}

          {!success && (
            <p className="text-center mt-10 text-[var(--muted)] font-bold text-base">
              Already have an account?{" "}
              <Link href="/login" className="text-[#00BFA6] hover:underline font-black">
                Log in
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </main>
  );
}
