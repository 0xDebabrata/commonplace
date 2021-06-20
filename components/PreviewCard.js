import React from 'react'
import Excerpt from './Excerpt'

import styles from '../styles/previewCard.module.css'

const PreviewCard = ({ excerpt, note }) => {

    return (
        <div className={styles.cardContainer}>
            <Excerpt excerpt={excerpt} /> 
            {note}
        </div>
    )
}

export default PreviewCard
