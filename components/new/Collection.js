import React, { useEffect, useState }from 'react'
import Fuse from 'fuse.js'
import Loader from '../Loader'

import styles from '../../styles/collection.module.css'

const Collection = ({ userCollections, loading }) => {

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')

    // Book input field focus
    const [focus, setFocus] = useState(false)

    let titleSuggestions 
    let authorSuggestions

    useEffect(() => {
        if (!loading) {
            console.log(userCollections)
            // Fuse instance for fuzzy search
            /*
            const fuseTitle = new Fuse(userCollections, {
                keys: ["name", "author"]
            })

            const fuseAuthors = new Fuse(userCollections, {
                keys: ["author"]
            })

            titleSuggestions = fuseTitle.search(title)
            authorSuggestions = fuseAuthors.search(author)
        */
        }
    }, [loading])

    return (
        <div className={styles.container}>
            <input
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
                        <CollectionSuggestions />
                    )}
                </div>
            )}

            <input
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Add author"
                className={styles.input} />
        </div>
    )
}

export default Collection
