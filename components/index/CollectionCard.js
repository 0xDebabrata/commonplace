import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import styles from '../../styles/Home.module.css'

const CollectionCard = ({ collection }) => {

    const router = useRouter()

    return (
        <Link href={`/collection/${collection.id}`}>
            <div 
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
        </Link>
    )
}

export default CollectionCard
