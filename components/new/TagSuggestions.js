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

    const handleClick = (id, name, colour) => {
        setTags(tagArray => [...tagArray, { id, name, colour }])
        closeModal()
    }

    return (
        <div className={styles.container}>

            {searchedTags.map( tag => {
                return (
                    <div 
                        onClick={() => handleClick(tag.id, tag.name, tag.colour)}
                        key={tag.id}>
                        <Tag 
                            click={false}
                            name={tag.name}
                            colour={tag.colour} />
                    </div>
                )
            })}
        </div>
    )
}

export default TagSuggestions
