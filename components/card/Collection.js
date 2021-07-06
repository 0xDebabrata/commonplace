import React from 'react'

import styles from '../../styles/card.module.css'

const Collection = ({ collection }) => {

    return (
        <div className={styles.collectionContainer}>
            <p className={styles.name}>{collection.name}</p>
            <p className={styles.author}>{collection.author}</p>
        </div>
    )
}

export default Collection
