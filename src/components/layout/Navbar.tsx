"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "../ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { LogOut, Loader2 } from "lucide-react";

export default function Navbar() {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center group">
            <div className="relative h-10 w-32 bg-[#000000] rounded-xl shadow-lg group-hover:scale-105 transition-all duration-300 flex items-center justify-center overflow-hidden">
               <Image 
                src="/logo.png" 
                alt="TripVerseAI Logo" 
                fill
                className="object-contain px-4 py-1.5 pointer-events-none dark:invert dark:brightness-150 transition-all duration-300"
              />
            </div>
          </Link>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/about" className="text-sm font-semibold text-[var(--muted)] hover:text-[#00BFA6] transition-colors uppercase tracking-wider">
              About
            </Link>
            <Link href="/explore" className="text-sm font-semibold text-[var(--muted)] hover:text-[#00BFA6] transition-colors uppercase tracking-wider">
              Explore
            </Link>
            <Link href="/pricing" className="text-sm font-semibold text-[var(--muted)] hover:text-[#00BFA6] transition-colors uppercase tracking-wider">
              Pricing
            </Link>
            <Link href="/faq" className="text-sm font-semibold text-[var(--muted)] hover:text-[#00BFA6] transition-colors uppercase tracking-wider">
              FAQ
            </Link>
            
            <div className="h-6 w-px bg-[var(--border)] mx-2" />
            
            <ThemeToggle />

            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[var(--muted)]" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-sm font-bold text-[var(--foreground)] hover:text-[#00BFA6] transition-colors">
                  My Trips
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-black text-red-500 hover:text-red-600 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-bold text-[var(--foreground)] hover:text-[#00BFA6] transition-colors">
                  Log in
                </Link>
                <Link 
                  href="/signup" 
                  className="hidden md:block text-sm font-bold px-6 py-2.5 rounded-full bg-[#00BFA6] text-white hover:bg-[#00a892] shadow-lg shadow-[#00BFA6]/20 transition-all active:scale-95"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
