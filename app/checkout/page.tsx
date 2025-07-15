"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "basic" }), // Send whatever info you want
    });

    const data = await res.json();

    const stripe = await stripePromise;
    if (stripe) {
      stripe.redirectToCheckout({ sessionId: data.sessionId });
    }

    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">Buy Premium Access</h1>
        <p>$9.99/month</p>
        <button
          onClick={handleCheckout}
          className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Redirecting..." : "Checkout with Stripe"}
        </button>
      </div>
    </main>
  );
}