import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";
import Link from "next/link";
import useSWR from "swr";

import Loader from "../components/Loader";

import styles from "../styles/result.module.css";

export default function Result() {
  const router = useRouter();

  const [sessionId, setSessionId] = useState(null);

  // Payment status
  const [successful, setSuccessful] = useState(false);

  // Sign up status
  const [loading, setLoading] = useState(true);

  const { data } = useSWR(
    sessionId ? `api/checkout/${sessionId}` : null,
    (url) => fetch(url).then((res) => res.json())
  );

  const createCustomer = async (cust_id) => {
    const { data, error } = await supabase
      .from("users")
      .update({ customer_id: cust_id })
      .eq("id", supabase.auth.user().id)

    if (error) {
      console.log(error);
    } else {
      setLoading(false);
      console.log(data);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;

    const { session_id } = router.query;
    setSessionId(session_id);
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!data) return;
    if (!sessionId) return;

    if (data.session.payment_intent.status === "succeeded") {
      setSuccessful(true);

      createCustomer(data.session.customer);
    }
  }, [data, sessionId]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <p>Payment status</p>
        {successful ? <pre>Complete ✅</pre> : <Loader />}
      </div>

      {successful && (
        <div className={styles.wrapper}>
          <p>Finishing sign up</p>
          {loading ? (
            <Loader />
          ) : (
            <Link href="/">
              <button>Launch app</button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
