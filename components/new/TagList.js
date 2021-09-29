import React from 'react'
import NewTag from './NewTag'
import Tag from '../Tag'

import styles from '../../styles/tagList.module.css'

const TagList = ({ userTags, tags, setTags, tagsLoading, deleteRows, setDeleteRows }) => {

    return (
        <div className={styles.container}>
            {tags.map((tag, index) => {
                return (
                    <Tag 
                        key={index}
                        name={tag.name} 
                        colour={tag.colour} 
                        preview={true}
                        deleteRows={deleteRows}
                        setDeleteRows={setDeleteRows}
                        id={tag.id}
                        setTags={setTags}
                        index={index} />
                )
            })}

            <NewTag userTags={userTags} loading={tagsLoading} setTags={setTags} />
        </div>
    )
}

export default TagList
