"use client";

import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";

interface PaymentPlan {
  name: string;
  amount: number; // in INR (will be multiplied by 100 for paise on server)
}

interface PaymentResult {
  success: boolean;
  message: string;
  paymentId?: string;
  orderId?: string;
}

export function useRazorpay() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const initiatePayment = useCallback(
    async (plan: PaymentPlan): Promise<PaymentResult> => {
      setLoading(true);
      setError(null);

      try {
        // 1. Load Razorpay script
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error("Failed to load Razorpay SDK. Check your network connection.");
        }

        // 2. Create order on the server
        const orderResponse = await fetch("/api/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: plan.amount,
            planName: plan.name,
          }),
        });

        if (!orderResponse.ok) {
          const errData = await orderResponse.json();
          throw new Error(errData.error || "Failed to create order");
        }

        const { orderId, amount, currency } = await orderResponse.json();

        // 3. Open Razorpay checkout
        return new Promise<PaymentResult>((resolve, reject) => {
          const options: RazorpayOptions = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            amount,
            currency,
            name: "TripVerseAI",
            description: `${plan.name} Plan Subscription`,
            order_id: orderId,
            image: "/logo.png",
            prefill: {
              name: user?.displayName || "",
              email: user?.email || "",
            },
            notes: {
              plan: plan.name,
            },
            theme: {
              color: "#6C63FF",
              backdrop_color: "rgba(0, 0, 0, 0.7)",
            },
            handler: async (response: RazorpayResponse) => {
              try {
                // 4. Verify payment on the server
                const verifyResponse = await fetch("/api/razorpay/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    planName: plan.name,
                  }),
                });

                const result = await verifyResponse.json();

                if (verifyResponse.ok && result.success) {
                  setLoading(false);
                  resolve({
                    success: true,
                    message: result.message,
                    paymentId: result.paymentId,
                    orderId: result.orderId,
                  });
                } else {
                  setLoading(false);
                  reject(new Error(result.error || "Payment verification failed"));
                }
              } catch (err) {
                setLoading(false);
                reject(err);
              }
            },
            modal: {
              ondismiss: () => {
                setLoading(false);
                resolve({
                  success: false,
                  message: "Payment cancelled by user",
                });
              },
              confirm_close: true,
              animation: true,
            },
          };

          const razorpay = new window.Razorpay(options);

          razorpay.on("payment.failed", (response: Record<string, unknown>) => {
            setLoading(false);
            const errorData = response as { error?: { description?: string } };
            reject(
              new Error(
                errorData?.error?.description || "Payment failed. Please try again."
              )
            );
          });

          razorpay.open();
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Payment failed";
        setError(errorMessage);
        setLoading(false);
        return { success: false, message: errorMessage };
      }
    },
    [loadRazorpayScript, user]
  );

  return { initiatePayment, loading, error };
}
