import React from 'react'
import { marked } from 'marked'

import styles from '../../styles/excerpt.module.css'

const Excerpt = ({ excerpt }) => {

    const parseMd = () => {
        const raw = marked(excerpt)
        return raw

    }
    return (
        <div id="excerpt-container" className={styles.container}>
            <div 
                dangerouslySetInnerHTML={{__html: parseMd()}}
                className={styles.wrapper}>
            </div>
        </div>
    )
}

export default Excerpt
