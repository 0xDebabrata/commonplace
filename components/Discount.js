import { useState } from "react"
import { useRouter } from "next/router"
import supabase from "../utils/supabaseClient"

import styles from "../styles/discount.module.css"
import {unstable_serialize} from "swr"

const Discount = () => {
    
    const router = useRouter()

    const [code, setCode] = useState(null)
    const [disabled, setDisabled] = useState(false)

    const handleClick = async (code) => {
        if (code.substring(0,3).toUpperCase() === "APP" && (parseInt(code.substring(3)) >= 101 && parseInt(code.substring(3)) <= 200)) {
            setDisabled(true)
            const { data, error } = await supabase
                .from("users")
                .update({ customer_id: "appsumo"})

            // Refresh page
            router.reload()
        } else {
            alert("Sorry, that code is invalid")
        }
    }

    return(
        <div className={styles.container}>
            <p className={styles.separator}>or</p>
            <input
                placeholder="Enter code"
                onChange={e => setCode(e.target.value)}
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
    )
}

export default Discount
