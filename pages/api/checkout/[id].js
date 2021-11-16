import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
})

export default async function handler(req, res) {

    const { id } = req.query

    // Retrieve stripe checkout session
    const session = await stripe.checkout.sessions.retrieve(id, { expand: ["payment_intent"]})

    // Send session info to frontend
    res.status(200).json({ session })
}
