import { useState } from "react";
import { useRouter } from "next/router";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

import styles from "../styles/discount.module.css";

const Discount = ({ user }) => {
  const router = useRouter();

  const [code, setCode] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const handleClick = async (code) => {
    if (
      code.toUpperCase() === "DUNEEE" ||
      code.toUpperCase() === "JU-IT" ||
      (code.substring(0, 3).toUpperCase() === "APP" &&
        parseInt(code.substring(3)) >= 101 &&
        parseInt(code.substring(3)) <= 350)
    ) {
      setDisabled(true);
      const { error } = await supabaseClient
        .from("users")
        .update({ customer_id: code }, { returning: "minimal" })
        .eq("id", user.id)

      if (error) {
        alert("There was a problem. Please get in touch with support.")
      } else {
        // Refresh page
        router.push("/");
      }
    } else {
      alert("Sorry, that code is invalid");
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.separator}>or</p>
      <input
        placeholder="Enter AppSumo code"
        onChange={(e) => setCode(e.target.value)}
      />
      {code && (
        <button
          onClick={() => handleClick(code)}
          className={styles.btn}
          disabled={disabled}
        >
          Use Code →
        </button>
      )}
    </div>
  );
};

export default Discount;
