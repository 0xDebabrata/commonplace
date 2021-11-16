import React from 'react'
import Image from 'next/image'
import supabase from '../../utils/supabaseClient'

import styles from '../../styles/Homepage.module.css'

const One = () => {

    const handleLearnMoreClick = () => {
        window.location.replace("/#learn-more")
    }

    const signIn = async () => {
        const { error } = await supabase.auth.signIn({ provider: "google" }, { redirectTo: `${process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL}` })
        if (error) {
            console.log(error)
        }
    }

    return (
        <div className={styles.containerOne}>
            <div className={styles.pitch}>
                <h1 className={styles.header}>An Autobiography of the Mind</h1>
                <h3 className={styles.sub}>Capture, remember and reflect on what matters</h3>
                <div className={styles.wrapper}>
                    <p className={styles.desc}>
                        Commonplace gives you a place to collect your thoughts while reading and a tool to look back on them in the future.
                    </p>
                    <div>
                        <button className={styles.topBtn} onClick={handleLearnMoreClick}>Learn more</button>
                        <button className={styles.bottomBtn} onClick={signIn}>Get started</button>
                    </div>
                </div>
            </div>
            <Image
                src="/card-skeleton.png"
                alt="commonplace card"
                width={392}
                height={561}
            />
        </div>
    )
}

export default One 
