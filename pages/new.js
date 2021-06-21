import React, { useState } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'

import PreviewCard from '../components/PreviewCard'
import TagList from '../components/TagList'
import styles from '../styles/new.module.css'

export default function New() {

    const [excerpt, setExcerpt] = useState('')
    const [note, setNote] = useState('')

    const handleExcerptChange = () => {
        const excerptVal = document.getElementsByTagName("textarea")[0].value
        setExcerpt(excerptVal)
    }

    const handleNoteChange = () => {
        const noteVal = document.getElementsByTagName("textarea")[1].value
        setNote(noteVal)
    }

    return (
        <ProtectedRoute>
            <div className={styles.container}>
                <div className={styles.editingContainer}>
                    <div className={styles.box}>
                        <p className={styles.heading}>Excerpt</p>
                        <textarea
                            className={styles.inputExcerpt}
                            type="textarea"
                            placeholder="Add excerpt" 
                            maxLength="500"
                            value={excerpt}
                            onChange={handleExcerptChange} />
                        <p className={styles.charLimit}>
                            {`${500-excerpt.length}/500`}
                        </p>

                        <p className={styles.heading}>Note</p>
                        <textarea
                            className={styles.inputNote}
                            type="textarea"
                            maxLength="800"
                            placeholder="Add note" 
                            value={note}
                            onChange={handleNoteChange} />
                        <p className={styles.charLimit}>
                            {`${800-note.length}/800`}
                        </p>

                        <p className={styles.heading}>Tags</p>
                        <TagList />
                    </div>
                </div>

                <div className={styles.previewContainer}>
                    <div className={styles.previewBox}>
                        <h2 className={styles.header}>Preview</h2>
                        <PreviewCard excerpt={excerpt} note={note} />
                    </div>
                </div> 
            </div>
        </ProtectedRoute>
    )
}
