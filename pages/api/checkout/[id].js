import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27'
})

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

  const { id } = req.query

  // Retrieve stripe checkout session
  const session = await stripe.checkout.sessions.retrieve(id, { expand: ["payment_intent"]})

  // Send session info to frontend
  res.status(200).json({ session })
}
