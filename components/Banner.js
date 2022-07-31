import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react"
import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link";

import styles from "../styles/banner.module.css";

const Banner = () => {
  const { user } = useUser();
  const [isCustomer, setIsCustomer] = useState(true);
  const [days, setDays] = useState(null);
  const [free, setFree] = useState(false);

  const getCustomerInfo = async () => {
    // Get customer_id and date of joining
    const { data, error } = await supabaseClient
      .from("users")
      .select("created_at, customer_id");

    if (error) {
      console.error(error)
      return;
    }

    if (data[0].customer_id) return;    // If customer_id is present, don't do anything

    setIsCustomer(false);
    // Get number of days since joining
    const start = new Date(data[0].created_at);
    const today = new Date();
    const days = Math.round((today - start) / 86400000);

    setDays(7 - days)

    if (days <= 7) {
      setFree(true);
    }
  };

  useEffect(() => {
    if (!user) return;
    getCustomerInfo();
  }, [user]);

  if (!isCustomer) {
    return (
      <div className={styles.banner}>
        {free && <p>Your free trial is about to end in {days} days</p>}
        {!free && <p>Your free trial has ended 🙁</p>}
        <Link href="/pay">
          <button
            style={
              !free
                ? {
                    background: "white",
                    color: "black",
                  }
                : null
            }
            className={styles.btn}
          >
            Pay →
          </button>
        </Link>
      </div>
    );
  } else {
    return null;
  }
};

export default Banner;
