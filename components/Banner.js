import {useContext, useEffect, useState} from 'react'
import { UserContext } from '../utils/context'
import supabase from "../utils/supabaseClient"
import Link from "next/link"

import styles from "../styles/banner.module.css"

const Banner = () => {
    const { user } = useContext(UserContext) 
    const [isCustomer, setIsCustomer] = useState(true)
    const [days, setDays] = useState(0)
    const [free, setFree] = useState(false)

    const getCustomerInfo = async () => {
        const { data, error } = await supabase
            .from("users")
            .select("customer_id")

        if (!data[0].customer_id) {
            setIsCustomer(false)
            if (days > 0) {
                setFree(true)
            }
        }
    }

    useEffect(() => {
        if (!user) return;
        const start = new Date(user.created_at)
        const today = new Date()

        const days = (today-start)/86400000
        setDays(Math.round(7-days))
        getCustomerInfo()

    }, [user])

    if (!isCustomer) {
        return (
            <div className={styles.banner}>
                {free && (
                    <p>Your free trial is about to end in {days} days</p>
                )}
                {!free && (
                    <p>Your free trial has ended 🙁</p>
                )}
                <Link href="/pay">
                    <button 
                        style={!free ? {
                            background: "white",
                            color: "black"
                        } : null}
                        className={styles.btn}>
                        Pay →
                    </button>
                </Link>
            </div>
        )
    } else {
        return null
    }
}

export default Banner
