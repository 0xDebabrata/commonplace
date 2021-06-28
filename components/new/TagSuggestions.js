import React from 'react'
import Fuse from 'fuse.js'

import Tag from '../Tag'

import styles from '../../styles/tagSuggestions.module.css'

const TagSuggestions = ({ userTags, input, closeModal, setTags }) => {

    const fuse = new Fuse(userTags, {
        keys: ["name"]
    })

    const results = fuse.search(input)
    const searchedTags = input ? results.map(result => result.item) : userTags

    const handleClick = ({ currentTarget = {} }) => {
        setTags(tagArray => [...tagArray, currentTarget.textContent])
        closeModal()
    }

    return (
        <div className={styles.container}>

            {searchedTags.map( tag => {
                return (
                    <div 
                        onClick={handleClick}
                        key={tag.id}>
                        <Tag 
                            name={tag.name}
                            colour={tag.colour} />
                    </div>
                )
            })}
        </div>
    )
}

export default TagSuggestions
