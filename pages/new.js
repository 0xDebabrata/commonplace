import React, { useRef, useState } from 'react'

import styles from '../styles/new.module.css'

export default function New() {

    const excerptRef = useRef(null)
    const noteRef = useRef(null)

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
    
    const autogrow = (element) => {
        element.current.style.height = "5px"
        element.current.style.height = `${element.current.scrollHeight + 20}px`
    }

    return (
        <div className={styles.container}>
            <div className={styles.editingContainer}>
                <div className={styles.box}>
                    <p className={styles.heading}>Excerpt</p>
                    <textarea
                        ref={excerptRef}
                        onKeyDown={() => autogrow(excerptRef)}
                        className={styles.input}
                        type="textarea"
                        placeholder="Add excerpt" 
                        value={excerpt}
                        onChange={handleExcerptChange} />
                    <p className={styles.heading}>Note</p>
                    <textarea
                        ref={noteRef}
                        onKeyDown={() => autogrow(noteRef)}
                        className={styles.input}
                        type="textarea"
                        placeholder="Add note" 
                        value={note}
                        onChange={handleNoteChange} />
                    <p className={styles.heading}>Tags</p>
                </div>
            </div>

            <div className={styles.previewContainer}>
                <h2>Preview</h2>
                <div>
                    <p>{note}</p>
                </div>
            </div> 
        </div>
    )
}
