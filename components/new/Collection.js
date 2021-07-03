import React, { useEffect, useState }from 'react'
import Fuse from 'fuse.js'
import Loader from '../Loader'
import CollectionSuggestions from './CollectionSuggestions'

import styles from '../../styles/collection.module.css'

const Collection = ({ userCollections, loading, title, setTitle, author, setAuthor }) => {

    // Book input field focus
    const [focus, setFocus] = useState(false)

    return (
        <div className={styles.container}>
            <input
                value={title}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add book title"
                className={styles.input} />

            {focus && (
                <div className={styles.dropdownContainer}>
                    {loading && (
                        <Loader />
                    )}

                    {!loading && (
                        <CollectionSuggestions 
                            userCollections={userCollections}
                            title={title}
                            author={author} 
                            setTitle={setTitle}
                            setAuthor={setAuthor} /> 
                    )}
                </div>
            )}

            <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Add author"
                className={styles.input} />
        </div>
    )
}

export default Collection
