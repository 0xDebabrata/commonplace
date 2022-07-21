import { useState } from 'react';
import { loadStripe } from "@stripe/stripe-js";

import CurrencyDropdown from "../components/payments/CurrencyDropdown"

import styles from "../styles/payment.module.css";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Payment() {
  const [currency, setCurrency] = useState({
    value: "USD",
    label: "USD",
    key: 1,
  });

  const handleClick = async () => {
    // Create checkout session in backend
    const { sessionId } = await fetch("/api/checkout/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
    })
      .then((res) => res.json());

    // Redirect to stripe checkout page
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId });
  };

  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <div>
          <h1>commonplace</h1>
          <CurrencyDropdown currency={currency} setCurrency={setCurrency} />
        </div>

        <div className={styles.wrapper}>
          <h2>
            <span>$</span>10
          </h2>
          <button role="link" onClick={handleClick}>
            Pay →
          </button>
        </div>
      </div>
    </div>
  );
}
