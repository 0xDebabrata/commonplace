import React from 'react'

import styles from '../styles/note.module.css'

const Note = ({ note }) => {

    return (
        <div className={styles.container}>
            <p className={styles.text}>{note}</p>
        </div>
    )
}

export default Note
