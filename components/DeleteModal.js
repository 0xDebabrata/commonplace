import React from 'react'
import Popup from 'reactjs-popup';

import styles from '../styles/card.module.css'
import 'reactjs-popup/dist/index.css';

const DeleteModal = ({ type, open, setOpen, handleDelete, id, router }) => {

    // Popup styling
    const contentStyle = { 
        width: "330px",
        background: 'rgba(255, 255,255, 1)', 
        border: 'none',
        borderRadius: '15px',
        padding: '20px 30px 20px 30px'
    };
    const overlayStyle = { 
        background: 'rgba(100,58,8,0.3)', 
        backdropFilter: 'blur(5px)'
    };

    return (
        <Popup 
            className="modal" 
            open={open} 
            closeOnDocumentClick closeOnEscape 
            onClose={() => setOpen(false)}
            overlayStyle={overlayStyle}
            contentStyle={contentStyle}
        >
            <p className={styles.question}>
                Are you sure you want to delete this {type}?
            </p>
            <button
                className={styles.cancelBtn}
                onClick={() => setOpen(false)}
            >
                Cancel
            </button>
            <button
                className={styles.deleteBtn}
                onClick={() => {
                    setOpen(false)
                    handleDelete(id, router)
                }}
            >
                Delete 
            </button>
        </Popup>
    )
}

export default DeleteModal
