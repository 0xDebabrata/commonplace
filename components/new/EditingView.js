import React from 'react'
import TagList from './TagList'
import Collection from './Collection'
import MarkdownHelp from './MarkdownHelp'

import styles from '../../styles/new.module.css'

const EditingView = ({ 
    newCard, userTags, userCollections,
    note, excerpt, handleNoteChange, handleExcerptChange, 
    tags, setTags, title, setTitle, author, setAuthor,
    tagsLoading, collectionsLoading , deleteRows, setDeleteRows }) => {

    return (
        <div className={styles.editingContainer}>
            <div className={styles.box}>

                <p className={styles.heading}>Excerpt</p>
                <textarea
                    className={styles.inputExcerpt}
                    type="textarea"
                    placeholder={`Add excerpt ${!note ? '(required)' : ''}`} 
                    maxLength="500"
                    value={excerpt}
                    onChange={handleExcerptChange} /> 
                <div className={styles.wrapper}>
                    <MarkdownHelp />
                    <p className={styles.charLimit}>
                        {`${500-excerpt.length}/500`}
                    </p>
                </div>

                <p className={styles.heading}>Note</p>
                <textarea
                    className={styles.inputNote}
                    type="textarea"
                    maxLength="800"
                    placeholder={`Add note ${!excerpt ? '(required)' : ''}`} 
                    value={note}
                    onChange={handleNoteChange} />
                <div className={styles.wrapper}>
                    <MarkdownHelp />
                    <p className={styles.charLimit}>
                        {`${800-note.length}/800`}
                    </p>
                </div>

                <p className={styles.heading}>Collection</p>
                <Collection 
                    userCollections={userCollections} 
                    loading={collectionsLoading} 
                    title={title} 
                    setTitle={setTitle} 
                    author={author} 
                    setAuthor={setAuthor} />
                <p className={styles.heading}>Tags</p>
                <TagList
                    newCard={newCard}
                    deleteRows={deleteRows}
                    setDeleteRows={setDeleteRows}
                    userTags={userTags}
                    tags={tags}
                    setTags={setTags}
                    tagsLoading={tagsLoading} />
            </div>
        </div>
    )
}

export default EditingView
