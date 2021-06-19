import React, { useContext } from 'react'
import supabase from '../utils/supabaseClient'

import styles from '../styles/navbar.module.css'
import { UserContext } from '../utils/context'

const Navbar = () => {

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

    return (
        <nav className={styles.nav}>
            <h1 className={styles.navLogo}>
                commonplace
            </h1>

            {!user && (
                <button onClick={signIn} className={styles.button}>
                    Sign In 
                </button>
            )}

            {user && (
                <button onClick={signOut} className={styles.button}>
                    Sign out
                </button>
            )}

        </nav>
    )
}

export default Navbar
