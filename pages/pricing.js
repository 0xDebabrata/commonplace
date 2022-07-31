import { useState } from "react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs"

import CurrencyDropdown from "../components/payments/CurrencyDropdown"
import styles from "../styles/pricing.module.css";

const Pricing = () => {
  const [currency, setCurrency] = useState({
    value: "USD",
    label: "USD",
    key: 1
  });

  const signIn = async () => {
    const { error } = await supabaseClient.auth.signIn(
      { provider: "google" },
      { redirectTo: `${process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL}` }
    );
    if (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Pricing</h2>
      <div className={styles.block}>

        {currency.value === "USD" && (
          <h1>
            <span>$</span>10
          </h1>
        )}
        {currency.value === "INR" && (
          <h1>
            <span>₹</span>690
          </h1>
        )}

        <div className={styles.sub}>
          <p>One time fee</p>

          <CurrencyDropdown
            currency={currency}
            setCurrency={setCurrency}
          />
        </div>

        <div className={styles.wrapper}>
          <ul>
            <li>Unlimited cards</li>
            <li>Unlimited tags</li>
            <li>Unlimited collections</li>
            <li>Markdown support</li>
            <li>Full text search</li>
          </ul>
        </div>

        <button className={styles.button} onClick={signIn}>Start free trial</button>
        <p className={styles.trial}>7 day free trial</p>
      </div>
    </div>
  );
};

export default Pricing;
