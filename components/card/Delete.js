import React from 'react'

import styles from '../../styles/card.module.css'

const DeleteCard = () => {
    return(
        <div className={styles.deleteContainer} >
            <img src="/edit-icon.svg" alt="edit card icon" />
            <img src="/delete-icon.svg" alt="delete card icon" />
        </div>
    )
}

export default DeleteCard
