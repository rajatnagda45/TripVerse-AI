import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b-0 border-white/5 py-4">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
          <span>TripVerse</span>
          <span className="text-secondary font-black">AI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <Link href="/destinations" className="hover:text-white transition-colors duration-200">Destinations</Link>
          <Link href="/itineraries" className="hover:text-white transition-colors duration-200">Itineraries</Link>
          <Link href="/pricing" className="hover:text-white transition-colors duration-200">Pricing</Link>
          <Link href="/community" className="hover:text-white transition-colors duration-200">Community</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/auth" className="text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 hidden md:block">
            Log In
          </Link>
          <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-[0_0_15px_rgba(124,92,255,0.4)]">
            Generate My Trip
          </button>
        </div>
      </div>
    </header>
  );
}
