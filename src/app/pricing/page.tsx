"use client";

import { useState } from "react";
import { Check, ArrowRight, Loader2, ShieldCheck, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useRouter } from "next/navigation";

interface PricingTier {
  name: string;
  price: string;
  rawAmount: number; // actual INR amount for Razorpay
  period?: string;
  description: string;
  buttonText: string;
  buttonVariant: "outline" | "solid";
  popular?: boolean;
  features: string[];
}

export default function Pricing() {
  const { user, loading: authLoading } = useAuth();
  const { initiatePayment, loading: paymentLoading } = useRazorpay();
  const router = useRouter();

  const [paymentStatus, setPaymentStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
    planName?: string;
    paymentId?: string;
  }>({ type: null, message: "" });

  const [activePlan, setActivePlan] = useState<string | null>(null);

  const tiers: PricingTier[] = [
    {
      name: "Free",
      price: "₹0",
      rawAmount: 0,
      description: "Perfect for weekend getaways and planning your next short trip.",
      buttonText: "Start for free",
      buttonVariant: "outline",
      features: [
        "Up to 3 itineraries per month",
        "Basic AI trip generation",
        "City guides & map view",
        "Export to PDF",
      ],
    },
    {
      name: "Pro",
      price: "₹499",
      rawAmount: 499,
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
        "Priority AI processing",
      ],
    },
    {
      name: "Premium",
      price: "₹1,299",
      rawAmount: 1299,
      period: "/month",
      description: "The ultimate tool for digital nomads and power travelers.",
      buttonText: "Go Premium",
      buttonVariant: "outline",
      features: [
        "Everything in Pro",
        "Direct hotel & flight booking links",
        "1-on-1 human travel advisor chat",
        "Offline itinerary access",
        "Custom mood profiles",
      ],
    },
  ];

  const handlePayment = async (tier: PricingTier) => {
    // Free plan — just redirect to signup
    if (tier.rawAmount === 0) {
      router.push(user ? "/dashboard" : "/signup");
      return;
    }

    // Require login before payment
    if (!user) {
      router.push("/login?redirect=/pricing");
      return;
    }

    setActivePlan(tier.name);
    setPaymentStatus({ type: null, message: "" });

    try {
      const result = await initiatePayment({
        name: tier.name,
        amount: tier.rawAmount,
      });

      if (result.success) {
        setPaymentStatus({
          type: "success",
          message: result.message,
          planName: tier.name,
          paymentId: result.paymentId,
        });
      } else if (result.message === "Payment cancelled by user") {
        // User dismissed — do nothing
        setPaymentStatus({ type: null, message: "" });
      } else {
        setPaymentStatus({
          type: "error",
          message: result.message,
        });
      }
    } catch (err) {
      setPaymentStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Payment failed",
      });
    } finally {
      setActivePlan(null);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] dark:bg-slate-950 pt-24 pb-20 relative overflow-hidden transition-all duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-[50vh] bg-gradient-to-b from-[#6C63FF]/5 to-transparent pointer-events-none" />
      <div className="absolute -left-48 top-48 w-96 h-96 bg-[#00BFA6]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -right-48 bottom-48 w-96 h-96 bg-[#FF8A65]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
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
            Simple, transparent{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#00BFA6]">
              pricing
            </span>
          </h1>
          <p className="text-xl text-[var(--muted)] font-medium">
            Choose the perfect plan for your travel style. Build smarter journeys faster.
          </p>
        </div>

        {/* Payment Status Banner */}
        {paymentStatus.type && (
          <div
            className={`max-w-2xl mx-auto mb-10 rounded-2xl p-6 flex items-start gap-4 animate-in slide-in-from-top-4 duration-500 ${
              paymentStatus.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/30"
                : "bg-red-500/10 border border-red-500/30"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                paymentStatus.type === "success"
                  ? "bg-emerald-500/20"
                  : "bg-red-500/20"
              }`}
            >
              {paymentStatus.type === "success" ? (
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              ) : (
                <X className="w-6 h-6 text-red-500" />
              )}
            </div>
            <div className="flex-1">
              <h3
                className={`text-lg font-bold mb-1 ${
                  paymentStatus.type === "success"
                    ? "text-emerald-500"
                    : "text-red-500"
                }`}
              >
                {paymentStatus.type === "success"
                  ? "Payment Successful! 🎉"
                  : "Payment Failed"}
              </h3>
              <p className="text-[var(--muted)] text-sm">
                {paymentStatus.message}
              </p>
              {paymentStatus.paymentId && (
                <p className="text-[var(--muted)] text-xs mt-2 font-mono opacity-60">
                  Payment ID: {paymentStatus.paymentId}
                </p>
              )}
              {paymentStatus.type === "success" && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            <button
              onClick={() => setPaymentStatus({ type: null, message: "" })}
              className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
          {tiers.map((tier, i) => {
            const isProcessing = paymentLoading && activePlan === tier.name;

            return (
              <div
                key={i}
                className={`bg-[var(--surface)] dark:bg-slate-900 rounded-[2.5rem] p-8 flex flex-col relative transition-all duration-300 ${
                  tier.popular
                    ? "border-2 border-[#00BFA6] shadow-[0_20px_40px_-15px_rgba(0,191,166,0.3)] scale-105 z-10"
                    : "border border-[var(--border)] dark:border-slate-800 shadow-sm hover:shadow-xl"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00BFA6] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                    Most Popular
                  </div>
                )}

                <h3 className="text-2xl font-bold text-[var(--foreground)] dark:text-white mb-2">
                  {tier.name}
                </h3>
                <p className="text-[var(--muted)] dark:text-slate-400 text-sm mb-6 h-10">
                  {tier.description}
                </p>

                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-[var(--foreground)] dark:text-white">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-[var(--muted)] opacity-60 dark:text-slate-500 font-medium">
                      {tier.period}
                    </span>
                  )}
                </div>

                <button
                  id={`pricing-btn-${tier.name.toLowerCase()}`}
                  onClick={() => handlePayment(tier)}
                  disabled={isProcessing || authLoading}
                  className={`w-full py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 mb-8 disabled:opacity-60 disabled:cursor-not-allowed ${
                    tier.buttonVariant === "solid"
                      ? "bg-[var(--foreground)] dark:bg-white text-[var(--background)] dark:text-slate-900 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.6)] hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-[var(--background)] dark:bg-slate-800 hover:bg-[var(--surface)] text-[var(--foreground)] dark:text-white border border-[var(--border)] dark:border-slate-700 hover:border-[#6C63FF] hover:shadow-lg active:scale-[0.98]"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : tier.rawAmount === 0 ? (
                    <>
                      {tier.buttonText} <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      {tier.buttonText} <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="space-y-4 flex-1">
                  <p className="text-xs font-bold text-[var(--muted)] opacity-60 uppercase tracking-widest mb-4">
                    What&apos;s included
                  </p>
                  {tier.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-[#00BFA6]/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-[#00BFA6]" />
                      </div>
                      <span className="text-[var(--muted)] font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-6 flex-wrap text-sm text-[var(--muted)] opacity-60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00BFA6]" />
              <span>Secured by Razorpay</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[var(--muted)] opacity-40" />
            <span>UPI, Cards, Net Banking accepted</span>
            <div className="w-1 h-1 rounded-full bg-[var(--muted)] opacity-40" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </main>
  );
}
