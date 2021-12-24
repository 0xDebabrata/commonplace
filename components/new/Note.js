import React from 'react'
import { marked } from 'marked'

import styles from '../../styles/note.module.css'

const Note = ({ note }) => {

    const parseMd = () => {
        const raw = marked(note)
        return raw
    }

    return (
        <div 
            id="card-container"
            dangerouslySetInnerHTML={{__html: parseMd()}}
            className={styles.container}>
        </div>
    )
}

export default Note
