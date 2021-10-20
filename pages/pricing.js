import { loadStripe } from '@stripe/stripe-js'

import styles from '../styles/pricing.module.css'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const Pricing = () => {

    const handleClick = async () => {
        // Create checkout session in backend
        const { sessionId } = await fetch("/api/checkout/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: null 
        })
            .then(res => res.json())

        // Redirect to stripe checkout page
        const stripe = await stripePromise
        const { error } = await stripe.redirectToCheckout({ sessionId })
    }

    return(
        <div className={styles.container}>
            <h2 className={styles.title}>Pricing</h2>
            <div className={styles.block}>
                <h1><span>$</span>5</h1>
                <p className={styles.sub}>One time fee</p>
                <div>
                    <div className={styles.icon} />
                    <p className={styles.feature}>Full access to commonplace</p>
                </div>
                <button
                    role="link"
                    onClick={handleClick}
                >
                    Get access
                </button>
            </div>
        </div>
    )
}

export default Pricing 
