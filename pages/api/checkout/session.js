import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

const prices = [
  process.env.STRIPE_PRICE_ID_USD,
  process.env.STRIPE_PRICE_ID_INR
];

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res })
  const {
    data: { session: authSession }
  } = await supabase.auth.getSession()

  if (!authSession) {
    return res.status(401).json({
      error: "not authenticated"
    })
  }

  // Get currency key from frontend
  const { key } = req.body;

  // Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: prices[key-1],
        quantity: 1,
      },
    ],
    mode: "payment",
    allow_promotion_codes: true,
    success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.origin}/pay`,
  });

  // Send sessionId to front-end
  res.status(200).json({ sessionId: session.id });
}
