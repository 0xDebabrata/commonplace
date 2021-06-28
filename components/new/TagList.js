import React from 'react'
import NewTag from './NewTag'

import styles from '../../styles/tagList.module.css'

const TagList = ({ userTags, userCollections, tags, setTags, tagsLoading }) => {

    return (
        <div className={styles.container}>
            <NewTag userTags={userTags} loading={tagsLoading} setTags={setTags} />
        </div>
    )
}

export default TagList
