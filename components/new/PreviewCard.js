import React from 'react'
import Excerpt from './Excerpt'
import Note from './Note'

import styles from '../../styles/previewCard.module.css'

const PreviewCard = ({ excerpt, note }) => {

    return (
        <div className={styles.cardContainer}>
            <Excerpt excerpt={excerpt} /> 
            <Note note={note} />
        </div>
    )
}

export default PreviewCard
