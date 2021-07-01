import React from 'react'
import NewTag from './NewTag'
import Tag from '../Tag'

import styles from '../../styles/tagList.module.css'

const TagList = ({ userTags, tags, setTags, tagsLoading }) => {

    const formattedTags = tags.map(tag => {
        if (tag.name) {
            return tag
        } else {
           for (let i=0; i<userTags.length; i++) {
               if (userTags[i].name === tag) {
                   return userTags[i]
               }
           }
        }
    })

    return (
        <div className={styles.container}>
            {formattedTags.map((tag, index) => {
                return (
                    <Tag 
                        name={tag.name} 
                        colour={tag.colour} 
                        preview={true}
                        setTags={setTags}
                        index={index} />
                )
            })}

            <NewTag userTags={userTags} loading={tagsLoading} setTags={setTags} />
        </div>
    )
}

export default TagList
