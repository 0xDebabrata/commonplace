import React from 'react'
import NewTag from './NewTag'

import styles from '../styles/tagList.module.css'

const TagList = () => {

    return (
        <div className={styles.container}>
            <NewTag />
        </div>
    )
}

export default TagList
