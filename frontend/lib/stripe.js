import { loadStripe } from "@stripe/stripe-js";
// FRONTEND me publishable key ka use
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);