import React from 'react'

import styles from '../styles/tagList.module.css'

const TagList = () => {

    return (
        <div className={styles.container}>
            <img src="/newtag-icon.svg" alt="New tag (plus) icon" className={styles.icon} />
        </div>
    )
}

export default TagList
