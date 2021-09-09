import React from 'react'
import Tag from '../Tag'

import styles from '../../styles/tagList.module.css'

const DisplayTags = ({ tags }) => {

    return (
        <div className={styles.container}>
            {tags.map((tag, index) => {
                return (
                    <Tag 
                        id={tag.id}
                        key={tag.id}
                        name={tag.name} 
                        colour={tag.colour} 
                        preview={false}
                        index={index} />
                )
            })}

        </div>
    )
}

export default DisplayTags 
