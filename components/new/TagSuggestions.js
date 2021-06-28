import React from 'react'
import Fuse from 'fuse.js'

import Tag from '../Tag'

import styles from '../../styles/tagSuggestions.module.css'

const TagSuggestions = ({ userTags, input }) => {

    const fuse = new Fuse(userTags, {
        keys: ["name"]
    })

    const results = fuse.search(input)
    const searchedTags = input ? results.map(result => result.item) : userTags

    return (
        <div className={styles.container}>

            {searchedTags.map( tag => {
                return (
                    <Tag 
                        name={tag.name}
                        colour={tag.colour}
                        key={tag.id} />
                )
            })}
        </div>
    )
}

export default TagSuggestions
