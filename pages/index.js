import supabase from '../utils/supabaseClient'
import { useContext } from 'react'

import styles from '../styles/Home.module.css'
import {UserContext} from '../utils/context'

export default function Home() {
    
    const { user } = useContext(UserContext)

    const signIn = async () => {
        const { error } = await supabase.auth.signIn({ provider: "google" })
        if (error) {
            console.log(error)
        }
    }
    
    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.log(error)
        }
    }

    if (user) {

        return (
            <div className={styles.container}>
                <button onClick={signOut}>
                    Sign out
                </button>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <button onClick={signIn}>
                Sign in with Google
            </button> 
        </div>
  )
}
