import React from 'react'
import { useRouter } from 'next/router'

import styles from '../../styles/card.module.css'

const DeleteCard = ({ id, deleteFunc }) => {

    const router = useRouter()

    return(
        <div className={styles.deleteContainer} >
            <img src="/edit-icon.svg" alt="edit card icon" />
            <img 
                onClick={() => deleteFunc(id, router)}
                src="/delete-icon.svg" 
                alt="delete card icon" />
        </div>
    )
}

export default DeleteCard
