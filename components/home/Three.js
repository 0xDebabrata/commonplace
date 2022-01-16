import React from 'react'
import supabase from '../../utils/supabaseClient'

import styles from '../../styles/Homepage.module.css'

const Three = () => {

    const signIn = async () => {
        const { error } = await supabase.auth.signIn({ provider: "google" }, { redirectTo: `${process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL}` })
        if (error) {
            console.log(error)
        }
    }

    return (
        <div className={styles.containerThree} >
            <h2 className={styles.title}>How to use <span>commonplace</span></h2>
            <div className={styles.tutorial}>
                <div className={styles.step}>
                    <div className={styles.icon}>
                        <img src="/plus-icon.png" alt="plus icon" width="35px" height="35px" />
                    </div>
                    <p>When you come across something that resonates with you or something you want to look back on later, create a new card on commonplace.</p>
                </div>
                <div className={styles.step}>
                    <div className={styles.icon}>
                        <p>✍️</p>
                    </div>
                    <p>Add the excerpt and write a note.</p>
                </div>
                <div className={styles.step}>
                    <div className={styles.icon}>
                        <p>📘</p>
                    </div>
                    <p>Enter the book’s name and author to help better organise your cards with collections and make searching through your cards more intuitive.</p>
                </div>
                <div className={styles.step}>
                    <div className={styles.icon}>
                        <p>🏷</p>
                    </div>
                    <p>Add tags to classify your cards. Collections are for more general organising, whilst tags let you group notes that fall under some common theme.</p>
                </div>
            </div>
            <div className={styles.center}>
                <button onClick={signIn}>Get started</button>
            </div>
        </div>
    )
}

export default Three 
