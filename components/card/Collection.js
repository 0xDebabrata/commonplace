import React from 'react'
import { useRouter } from 'next/router'

import styles from '../../styles/card.module.css'

const Collection = ({ collection }) => {

    const router = useRouter()

    // Redirect to collection page
    const handleClick = id => {
        router.push(`/collection/${id}`)
    }

    return (
        <div 
            onClick={() => handleClick(collection.id)}
            className={styles.collectionContainer}>
            <p className={styles.name}>{collection.name}</p>
            <p className={styles.author}>{collection.author}</p>
        </div>
    )
}

export default Collection
