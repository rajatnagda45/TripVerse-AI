"use client";

import { useState, useEffect } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
      return "No account found with this email. Please sign up first.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-credential":
      return "Invalid email or password. Please check and try again.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled. Please try again.";
    case "auth/cancelled-popup-request":
      return "Sign-in was cancelled. Please try again.";
    case "auth/popup-blocked":
      return "Pop-up was blocked by your browser. Trying redirect method...";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized. Add localhost to Firebase Console > Authentication > Settings > Authorized Domains.";
    default:
      return `Authentication error: ${code}`;
  }
}

export default function Login() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  // Handle redirect result (fallback for popup-blocked scenarios)
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          router.push("/dashboard");
        }
      })
      .catch((err) => {
        if (err.code) {
          setError(getFirebaseErrorMessage(err.code));
        }
      });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setError("Please login with a real Gmail account.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (authError: any) {
      setError(getFirebaseErrorMessage(authError.code || authError.message));
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (authError: any) {
      if (
        authError.code === "auth/popup-blocked" ||
        authError.code === "auth/popup-closed-by-user"
      ) {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectError: any) {
          setError(getFirebaseErrorMessage(redirectError.code || redirectError.message));
        }
      } else {
        setError(getFirebaseErrorMessage(authError.code || authError.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first, then click Forgot Password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError("");
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code || err.message));
    }
  };

  // Don't render form if auth is still loading or user is already logged in
  if (authLoading || user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Loader2 className="w-12 h-12 animate-spin text-[#00BFA6]" />
      </main>
    );
  }

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
          <div className="mb-8">
            <h1 className="text-4xl font-black text-[var(--foreground)] mb-4 tracking-tight">Welcome Back</h1>
            <p className="text-[var(--muted)] font-medium text-lg opacity-80">
              Please enter your details to access your dashboard.
            </p>
          </div>

          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full py-4 border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] rounded-2xl font-black text-lg mb-8 flex items-center justify-center gap-4 hover:bg-[var(--surface)] hover:scale-[1.01] transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)] opacity-50"></div>
            </div>
            <span className="relative px-4 bg-[var(--surface)] text-[var(--muted)] font-black text-sm uppercase">
              or use email
            </span>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 font-bold">
              {error}
            </div>
          )}

          {resetSent && (
            <div className="bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 text-green-600 dark:text-green-400 p-4 rounded-xl text-sm mb-6 font-bold">
              Password reset email sent! Check your inbox.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-black text-[var(--foreground)] ml-1 opacity-70 uppercase tracking-wider">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)] group-focus-within:text-[#00BFA6] transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl py-5 pl-14 pr-4 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-4 focus:ring-[#00BFA6]/5 focus:bg-[var(--surface)] transition-all font-medium text-lg shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-black text-[var(--foreground)] opacity-70 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-bold text-[#00BFA6] hover:underline"
                >
                  Forgot password?
                </button>
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
