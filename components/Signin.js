import { useState } from "react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs"
import toast from "react-hot-toast";

import styles from "../styles/signin.module.css";

export default function SignIn() {
  const [email, setEmail] = useState("");

  const handleSignin = async () => {
    await supabaseClient.auth.signIn(
      { provider: "google" },
      { redirectTo: `${process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL}` }
    );
  };

  const handleEmailSignin = async () => {
    await supabaseClient.auth.signIn(
      {
        email: email,
      },
      { redirectTo: `${process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL}` }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const promise = handleEmailSignin();
    toast.promise(
      promise,
      {
        loading: "Sending email",
        success: "Please check your email for login link",
        error: (err) => {
          console.log(err);
          return "There was an error";
        },
      },
      {
        style: {
          minWidth: "400px",
        },
        success: { duration: 5000 },
      }
    );
  };

  return (
    <div className={styles.window}>
      <div className={styles.container}>
        <h1 className={styles.logo}>commonplace</h1>
        <button className={styles.button} onClick={handleSignin}>
          Sign in with Google
          <img src="/google-icon.svg" alt="Google icon" />
        </button>
        <form onSubmit={handleSubmit} className={styles.wrapper}>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            placeholder="Use email instead"
          />
          <button className={styles.submit} type="submit">
            →
          </button>
        </form>
      </div>
    </div>
  );
}
