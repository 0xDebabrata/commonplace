import React from 'react'
import Tag from './Tag'
import Link from 'next/link'

import styles from '../styles/tagBlock.module.css'

const TagBlock = ({ tag }) => {
    return (
        <Link href={`/tag/${tag.id}`}>
            <div 
                style={{
                    boxShadow: 'inset 0 0 70px #'+tag.colour+'73'
                }}
                className={styles.container}>
                <Tag colour={tag.colour} name={tag.name} preview={false} />
            </div>
        </Link>
    )
}

export default TagBlock 
