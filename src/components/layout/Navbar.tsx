import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "../ThemeToggle";
import { SignOutButton } from "./SignOutButton";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center group">
            <div className="relative h-10 w-fit px-4 py-1.5 bg-[#000000] rounded-xl shadow-lg group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="TripVerseAI Logo" 
                className="h-full w-auto object-contain pointer-events-none dark:invert dark:brightness-150 transition-all duration-300"
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

            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-sm font-bold text-[var(--foreground)] hover:text-[#00BFA6] transition-colors">
                  My Trips
                </Link>
                <SignOutButton />
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
