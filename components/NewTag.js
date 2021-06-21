import React, { useState } from 'react'
import Popup from 'reactjs-popup';

import 'reactjs-popup/dist/index.css';
import styles from '../styles/tagList.module.css'

const NewTag = () => {

    // Modal state
    const [open, setOpen] = useState(false)
    
    // Function to close modal
    const closeModal = () => setOpen(false)

    return (
        <>
            <img 
                onClick={() => setOpen(true)}
                src="/newtag-icon.svg" 
                alt="New tag (plus) icon" 
                className={styles.icon} />
            <Popup open={open} closeOnDocumentClick closeOnEscape onClose={closeModal}>
                <p>Hello</p>
            </Popup>
        </>
    )
}

export default NewTag 
