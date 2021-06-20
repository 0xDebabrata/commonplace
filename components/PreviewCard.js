import React from 'react'

import styles from '../styles/previewCard.module.css'

const PreviewCard = ({ excerpt, note }) => {

    return (
        <div className={styles.cardContainer}>
            {excerpt}
            {note}
        </div>
    )
}

export default PreviewCard
