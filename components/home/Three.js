import React from 'react'

import styles from '../../styles/Homepage.module.css'

const Three = () => {
    return (
        <div className={styles.containerThree} >
            <h2 className={styles.title}>How to use <span>commonplace</span></h2>
            <div className={styles.tutorial}>
                <div className={styles.step}>
                    <div className={styles.icon}>
                        <img src="/plus-icon.png" alt="plus icon" width="50px" height="50px" />
                    </div>
                    <p>When you come across something that resonates with you or something you want to look back on later, create a new card on commonplace</p>
                </div>
                <div className={styles.step}>
                    <div className={styles.icon}>
                        <p>✍️</p>
                    </div>
                    <p>Add the excerpt and write a note</p>
                </div>
                <div className={styles.step}>
                    <div className={styles.icon}>
                        <p>📘</p>
                    </div>
                    <p>Enter the book’s name and author to help better organise your cards and make searching through your cards more intuitive</p>
                </div>
                <div className={styles.step}>
                    <div className={styles.icon}>
                        <p>🏷</p>
                    </div>
                    <p>Add tags to classify your cards. This helps organise cards that do not belong under the same book but fall under some common theme </p>
                </div>
            </div>
            <div className={styles.center}>
                <button>Get started</button>
            </div>
        </div>
    )
}

export default Three 
