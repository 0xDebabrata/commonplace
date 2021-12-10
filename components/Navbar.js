import React, { useContext } from 'react'
import supabase from '../utils/supabaseClient'
import Link from 'next/link'
import Search from "./Search"

import styles from '../styles/navbar.module.css'
import { UserContext } from '../utils/context'

const Navbar = () => {

    const { user } = useContext(UserContext)

    const signIn = async () => {
        const { error } = await supabase.auth.signIn({ provider: "google" }, { redirectTo: `${process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL}` })
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
            <Link href="/">
                <h1 className={styles.navLogo}>
                    commonplace
                </h1>
            </Link>

            {!user && (
                <ul>
                    <Link href="/pricing">
                        <li>Pricing</li>
                    </Link>
                    <li><button onClick={signIn} className={styles.signInBtn}>
                    Sign In 
                    </button></li>
                </ul>
            )}

            {user && (
                <div className={styles.wrapper}>
                    <Search />
                    <button onClick={signOut} className={styles.signOutBtn}>
                        Sign out
                    </button>
                </div>
            )}

        </nav>
    )
}

export default Navbar
