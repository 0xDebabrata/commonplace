import React from 'react'
import Fuse from 'fuse.js'

import styles from '../../styles/collection.module.css'

const CollectionSuggestions = ({ userCollections, title, author, setTitle, setAuthor }) => {

    // Fuse instance for fuzzy search
    const fuseTitle = new Fuse(userCollections, {
        keys: ["name", "author"]
    })

    const fuseAuthors = new Fuse(userCollections, {
        keys: ["author"]
    })

    const titleSuggestions = fuseTitle.search(title).map(result => result.item)
    const authorSuggestions = fuseAuthors.search(author)

    const handleClick = (collection) => {
        setTitle(collection.name)
        setAuthor(collection.author)
    }

    return (
        <>
            { 
                titleSuggestions.map( suggestion => {
                return (
                    <div className={styles.suggestion} 
                        key={suggestion.id}
                        onMouseDown={() => handleClick(suggestion)}>
                        <p>{suggestion.name}</p>
                        <p className={styles.author}>{suggestion.author}</p>
                    </div>
                )
                })
            }

        </>
    )
}

export default CollectionSuggestions
