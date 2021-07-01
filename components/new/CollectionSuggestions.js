import React from 'react'
import Fuse from 'fuse.js'

import styles from '../../styles/collection.module.css'

const CollectionSuggestions = ({ userCollections, title, author }) => {

    // Fuse instance for fuzzy search
    const fuseTitle = new Fuse(userCollections, {
        keys: ["name", "author"]
    })

    const fuseAuthors = new Fuse(userCollections, {
        keys: ["author"]
    })

    const titleSuggestions = fuseTitle.search(title).map(result => result.item)
    const authorSuggestions = fuseAuthors.search(author)

    return (
        <>
            {titleSuggestions.map( suggestion => {
                return (
                    <div key={suggestion.id}>
                        <p>{suggestion.name}</p>
                        <p>{suggestion.author}</p>
                    </div>
                )
            })}
        </>
    )
}

export default CollectionSuggestions
