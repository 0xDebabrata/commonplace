import React, { useContext, useState, useEffect } from 'react'
import supabase from '../utils/supabaseClient'
import Link from 'next/link'
import Image from "next/image"
import Search from "./Search"
import { motion } from "framer-motion"

import styles from '../styles/navbar.module.css'
import { UserContext } from '../utils/context'
import {useViewportWidth} from '../utils/hooks'

const Navbar = () => {

    const { user } = useContext(UserContext)
    const [width, setWidth] = useState(1920)
    const [isOpen, setIsOpen] = useState(false)

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

    const variants = {
        open: { opacity: 1, y: 50, height: 130 },
        closed: { opacity: 0, y: 50, height: 0 }
    }

    useEffect(() => {
        setWidth(window.innerWidth)
        const handleResize = () => setWidth(window.innerWidth)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    if (width <= 500) {
        return (
            <nav className={styles.nav}>
                <Link href="/">
                    <h1 className={styles.navLogo}>
                        commonplace
                    </h1>
                </Link>

                {!user && (
                    <>
                    <ul>
                        <li 
                            onClick={() => setIsOpen(!isOpen)}
                            className={styles.menu}>
                            <Image src={"/menu-icon.svg"} width={30} height={30} />
                        </li>
                        <li><button onClick={signIn} className={styles.signInBtn}>
                        Sign In 
                        </button></li>
                    </ul>
                    <motion.ul
                        animate={isOpen ? "open" : "closed"}
                        variants={variants}
                        className={styles.mobileNav}>
                        {isOpen && (
                        <li
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <Link href="/blog">Blog</Link>
                        </li>
                        )}
                        {isOpen && (
                        <li
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <Link href="/pricing">Pricing</Link>
                        </li>
                        )}
                    </motion.ul>
                    </>
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

    return (
        <nav className={styles.nav}>
            <Link href="/">
                <h1 className={styles.navLogo}>
                    commonplace
                </h1>
            </Link>

            {!user && (
                <ul>
                    <Link href="/blog">
                        <li>Blog</li>
                    </Link>
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
