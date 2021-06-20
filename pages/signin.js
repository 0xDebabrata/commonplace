import { useEffect, useContext } from 'react'
import { UserContext } from '../utils/context'
import { useRouter } from 'next/router'
import supabase from '../utils/supabaseClient'

import styles from '../styles/signin.module.css'

export default function SignIn() {

    const { user } = useContext(UserContext)
    const router = useRouter()

    const handleSignin = async () => {
        const { error } = await supabase.auth.signIn({ provider: "google" })
        if (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (user) {
            router.push("/")
        }
    })

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
