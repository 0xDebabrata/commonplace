import React from 'react'
import Tag from './Tag'

import styles from '../styles/tagBlock.module.css'

const TagBlock = ({ tag }) => {
    return (
        <div 
            style={{
                boxShadow: 'inset 0 0 70px #'+tag.colour+'73'
            }}
            className={styles.container}>
            <Tag colour={tag.colour} name={tag.name} preview={false} />
        </div>
    )
}

export default TagBlock 
