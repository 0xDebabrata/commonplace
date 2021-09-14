import React, { useState } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Popup from 'reactjs-popup';

import styles from '../../styles/card.module.css'
import 'reactjs-popup/dist/index.css';

const DeleteCard = ({ id, deleteFunc }) => {

    const router = useRouter()

    // Modal state
    const [open, setOpen] = useState(false)

    const handleDelete = (id, router) => {
        const promise = deleteFunc(id, router)
        toast.promise(promise, {
            loading: "Deleting card",
            success: "Card deleted", 
            error: err => {
                return `${err}`
            } 
        },
        {
            style: {
                background: "rgba(105,105,105,0.7)",
                minWidth: "300px",
                color: "white",
                backdropFilter: "blur(10px)"
            },
            success: {
                icon: "🗑"
            }
        })
    }

    // Popup styling
    const contentStyle = { 
        width: "350px",
        background: 'rgba(255, 255,255, 1)', 
        border: 'none',
        borderRadius: '15px',
        padding: '20px 30px 20px 30px'
    };
    const overlayStyle = { 
        background: 'rgba(100,58,8,0.3)', 
        backdropFilter: 'blur(5px)'
    };

    return(
        <div className={styles.deleteContainer} >
            <img src="/edit-icon.svg" alt="edit card icon" />
            <img 
                onClick={() => setOpen(true)}
                src="/delete-icon.svg" 
                alt="delete card icon" />

            <Popup 
                className="modal" 
                open={open} 
                closeOnDocumentClick closeOnEscape 
                onClose={() => setOpen(false)}
                overlayStyle={overlayStyle}
                contentStyle={contentStyle}
            >
                <img 
                    onClick={() => setOpen(false)}
                    src="/newtag-icon.svg"
                    alt="Close popup icon"
                    className={styles.closeButton} />
                <p className={styles.question}>
                    Are you sure you want to delete this card?
                </p>
                <button
                    className={styles.deleteBtn}
                    onClick={() => {
                        setOpen(false)
                        handleDelete(id, router)
                    }}
                >
                    Delete 
                </button>
                <button
                    className={styles.cancelBtn}
                    onClick={() => setOpen(false)}
                >
                    Cancel
                </button>
            </Popup>
        </div>
    )
}

export default DeleteCard
