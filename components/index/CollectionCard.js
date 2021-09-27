import React from 'react'
import { useRouter } from 'next/router'

import styles from '../../styles/Home.module.css'

const CollectionCard = ({ collection }) => {

    const router = useRouter()

    // Redirect to collection page
    const handleClick = id => {
        router.push(`/collection/${id}`)
    }

    return (
        <div 
            onClick={() => handleClick(collection.id)}
            className={styles.card}>
            <img
                src="/book-icon.svg"
                alt="collection type icon"
            />
            <div className={styles.wrapper}>
                <p className={styles.name}>{collection.name}</p>
                <p className={styles.author}>{collection.author}</p>
            </div>
        </div>
    )
}

export default CollectionCard
