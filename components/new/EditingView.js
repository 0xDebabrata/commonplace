import React from 'react'
import TagList from '../TagList'

import styles from '../../styles/new.module.css'

const EditingView = ({ note, excerpt, handleNoteChange, handleExcerptChange }) => {

    return (
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
    )
}

export default EditingView
