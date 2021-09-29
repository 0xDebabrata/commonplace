import React from 'react'

import CollectionCard from './CollectionCard'

import styles from '../../styles/Home.module.css'

const Collections = ({ collections }) => {

    return(
        <>
            <h2 className={styles.header}>Collections</h2>
            <div className={styles.collectionsContainer}>
                {collections.map(collection => {
                    return (
                        <CollectionCard
                            key={collection.id}
                            collection={collection}
                        />
                    )
                })}
            </div>
        </>
    )
}

export default Collections
