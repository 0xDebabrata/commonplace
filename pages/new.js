import React, { useState } from 'react'
import ProtectedRoute from '../components/ProtectedRoute'

import EditingView from '../components/new/EditingView'
import PreviewCard from '../components/new/PreviewCard'
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
                <EditingView 
                    note={note}
                    excerpt={excerpt}
                    handleNoteChange={handleNoteChange}
                    handleExcerptChange={handleExcerptChange} />
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
