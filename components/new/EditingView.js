import React from 'react'
import TagList from './TagList'
import Collection from './Collection'

import styles from '../../styles/new.module.css'

const EditingView = ({ 
    userTags, userCollections,
    note, excerpt, handleNoteChange, handleExcerptChange, 
    tags, setTags, collection, setCollection,
    tagsLoading, collectionsLoading }) => {

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

                <p className={styles.heading}>Collection</p>
                <Collection 
                    userCollections={userCollections} 
                    loading={collectionsLoading} />
                <p className={styles.heading}>Tags</p>
                <TagList
                    userTags={userTags}
                    tags={tags}
                    setTags={setTags}
                    tagsLoading={tagsLoading} />
            </div>
        </div>
    )
}

export default EditingView
