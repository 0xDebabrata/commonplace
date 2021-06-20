import React from 'react'

import styles from '../styles/excerpt.module.css'

const Excerpt = ({ excerpt }) => {

    return (
        <div className={styles.container}>
            <div className={styles.block} />
            <div className={styles.wrapper}>
                <p className={styles.text}>{excerpt}</p>
            </div>
        </div>
    )
}

export default Excerpt
