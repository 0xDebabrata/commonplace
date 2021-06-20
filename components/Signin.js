import React from 'react'
import supabase from '../utils/supabaseClient'

import styles from '../styles/signin.module.css'

export default function SignIn() {

    const handleSignin = async () => {
        const { error } = await supabase.auth.signIn({ provider: "google" })
        if (error) {
            console.log(error)
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.logo}>commonplace</h1>
            <button
                className={styles.button}
                onClick={handleSignin}>
                Sign in with Google
                <img src="/google-icon.svg" alt="Google icon" />
            </button>
        </div>
    )
}
